import { xml2json } from 'xml-js';

export default async function handler(request, context) {
  const samlEndpoint = context.env.OKTA_SAML_ENDPOINT;
  const spEntityId = context.env.OKTA_SP_ENTITY_ID;
  const cert = context.env.OKTA_CERT;

  const url = new URL(request.url);
  const cookies = request.headers.get('Cookie') || '';
  const isAuthenticated = cookies.includes('saml-token');

  if (url.pathname === '/callback' && request.method === 'POST') {
    
    const formData = await request.formData();
    const samlResponse = formData.get('SAMLResponse');
  
    if (samlResponse) {
      const assertion = await verifySAMLResponseSignature(samlResponse, cert, spEntityId);
      if (assertion) {
        return new Response(null, {
            status: 302,
            headers: {
              'Set-Cookie': `saml-token=${assertion}; HttpOnly; Secure; Path=/`,
              'Location': '/'
            }
          });
      }
    }
  
    return new Response('Authentication failed', { status: 401 });
  }
  if (!isAuthenticated) {
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `${samlEndpoint}`//`${samlEndpoint}?SAMLRequest=${samlRequest}`
      }
    });
  }
  return fetch(request);
}
  

async function verifySAMLResponseSignature(samlResponse, x509Cert, spEntityId) {
    const decodedResponse = base64Decode(samlResponse);
  
    const jsonResponse = JSON.parse(xml2json(decodedResponse, { compact: true }));
    const signatureValue = jsonResponse['saml2p:Response']['ds:Signature']['ds:SignatureValue']._text;
    const signedInfo = jsonResponse['saml2p:Response']['ds:Signature']['ds:SignedInfo'];
    const assertion = jsonResponse['saml2p:Response']['saml2:Assertion'];
  
    const validEntityId = verifyEntityId(assertion, spEntityId)
    if(!validEntityId) {
      return false;
    }
    const canonicalSignedInfo = generateCanonicalXML(signedInfo);
    const publicKey = await importX509CertToCryptoKey(x509Cert);
    const signatureArray = Uint8Array.from(atob(signatureValue), c => c.charCodeAt(0));
    
    const encoder = new TextEncoder();
    const data = encoder.encode(canonicalSignedInfo);
    const isValid = await crypto.subtle.verify(
      { name: "RSASSA-PKCS1-v1_5" },
      publicKey,
      signatureArray,
      data
    );
  
    return isValid;
  }
  
  async function importX509CertToCryptoKey(x509Cert) {
    const pem = x509Cert
      .replace(/-----BEGIN CERTIFICATE-----/g, '')
      .replace(/-----END CERTIFICATE-----/g, '')
      .replace(/\s+/g, '');
    const binaryDer = Uint8Array.from(atob(pem), char => char.charCodeAt(0));
  
    return await crypto.subtle.importKey(
      "spki",
      binaryDer.buffer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      true,
      ["verify"]
    );
  }
  
  function base64Decode(str) {
    const binary = atob(str);
    return new TextDecoder().decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
  }
  
  function generateCanonicalXML(signedInfo) {
    const xmlString = new XMLSerializer().serializeToString(signedInfo);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
  
    return canonicalizeNode(xmlDoc.documentElement);
  }

  function canonicalizeNode(node) {
    let result = `<${node.nodeName}`;
    const attributes = Array.from(node.attributes).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    for (const attr of attributes) {
      result += ` ${attr.name}="${escapeXmlEntities(attr.value)}"`;
    }
  
    result += ">";
  
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        result += canonicalizeNode(child);
      } else if (child.nodeType === Node.TEXT_NODE) {
        result += escapeXmlEntities(child.nodeValue);
      }
    });
  
    result += `</${node.nodeName}>`;
    return result;
  }
  
  function escapeXmlEntities(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function verifyEntityId(assertion, expectedEntityId) {
    try {
      const audience = assertion?.['saml2:Conditions']?.['saml2:AudienceRestriction']?.['saml2:Audience']?.['_text'];
  
      if (audience === expectedEntityId) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }