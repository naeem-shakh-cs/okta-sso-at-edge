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
        'Location': `${samlEndpoint}`
      }
    });
  }
  return fetch(request);
}
  

async function verifySAMLResponseSignature(samlResponse, x509Cert, spEntityId) {
    const decodedResponse = base64Decode(samlResponse);
  
    const jsonResponse = JSON.parse(xml2json(decodedResponse, { compact: true }));
    console.log(jsonResponse)
    const assertion = jsonResponse['saml2p:Response']['saml2:Assertion'];
    const signatureValue = assertion['ds:Signature']['ds:SignatureValue']._text;
    const signedInfo = assertion['ds:Signature']['ds:SignedInfo'];
    
  
    const validEntityId = verifyEntityId(assertion, spEntityId)
    if(!validEntityId) {
      return false;
    }
    console.log('valid entity id')
    const publicKey = await importX509CertToCryptoKey(x509Cert);
    console.log('valid import')
    const signatureArray = Uint8Array.from(atob(signatureValue), c => c.charCodeAt(0));
    
    console.log('signature array')
    const encoder = new TextEncoder();
    const data = encoder.encode(signedInfo);
    console.log('encoded data')
    const isValid = await crypto.subtle.verify(
      { name: "RSASSA-PKCS1-v1_5" },
      publicKey,
      signatureArray,
      data
    );
  
    console.log('verification done', isValid)
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