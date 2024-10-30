import { parse } from 'fast-xml-parser';

/**
 * @param {Request} request - The incoming request object
 * @returns {Promise<Response>} - The response from the modified request
 */
export default async function handler(request, context) {
  const oktaDomain = context.env.OKTA_DOMAIN;
  const redirectUri = context.env.REDIRECT_URI;
  const samlEndpoint = context.env.OKTA_SAML_ENDPOINT;
  const spEntityId = context.env.OKTA_SP_ENTITY_ID;
  const samlRequest = generateSAMLRequest(redirectUri, oktaDomain, spEntityId);

  const url = new URL(request.url);
  const cookies = request.headers.get('Cookie') || '';
  const isAuthenticated = cookies.includes('saml-token');

  if (url.pathname === '/callback') {
    const params = new URLSearchParams(url.search);
    const samlResponse = params.get('SAMLResponse');

    if (samlResponse) {
      const assertion = await validateSAMLResponse(samlResponse);
      if (assertion) {
        return new Response('Authenticated', {
          status: 200,
          headers: {
            'Set-Cookie': `saml-token=${assertion}; HttpOnly; Secure; Path=/`
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
  return new Response('Authenticated', { status: 200 });
}

function generateSAMLRequest(redirectUri, oktaDomain, spEntityId) {
    const issueInstant = new Date().toISOString();
    const notOnOrAfter = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes validity
  
    const samlRequestXml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <saml2:Assertion ID="_${generateUniqueId()}" IssueInstant="${issueInstant}" Version="2.0"
          xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">
          
          <saml2:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">${oktaDomain}</saml2:Issuer>
          
          <saml2:Subject>
              <saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
                  <saml2:SubjectConfirmationData NotOnOrAfter="${notOnOrAfter}" Recipient="${redirectUri}"/>
              </saml2:SubjectConfirmation>
          </saml2:Subject>
  
          <saml2:Conditions NotBefore="${issueInstant}" NotOnOrAfter="${notOnOrAfter}">
              <saml2:AudienceRestriction>
                  <saml2:Audience>${spEntityId}</saml2:Audience>
              </saml2:AudienceRestriction>
          </saml2:Conditions>
  
          <saml2:AuthnStatement AuthnInstant="${issueInstant}" SessionIndex="id${Date.now()}">
              <saml2:AuthnContext>
                  <saml2:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml2:AuthnContextClassRef>
              </saml2:AuthnContext>
          </saml2:AuthnStatement>
      </saml2:Assertion>
    `;
  
    return base64Encode(samlRequestXml);
  }
  

/**
 * Validates a SAML response.
 * @param {string} samlResponse - The base64-encoded SAML response.
 * @returns {Promise<string|null>} - The SAML assertion if valid, otherwise null.
 */
async function validateSAMLResponse(samlResponse) {
  const decodedResponse = base64Decode(samlResponse);
  const jsonObj = parse(decodedResponse);
  const assertion = jsonObj['saml:Assertion'];

  if (assertion) {
    // Add additional validation logic as needed
    return assertion;
  }

  return null;
}

/**
 * Generates a unique ID for the SAML request.
 * @returns {string} - A unique ID.
 */
function generateUniqueId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Base64 encodes a string.
 * @param {string} str - The string to encode.
 * @returns {string} - The base64-encoded string.
 */
function base64Encode(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  return btoa(String.fromCharCode(...data));
}

/**
 * Base64 decodes a string.
 * @param {string} str - The base64-encoded string.
 * @returns {string} - The decoded string.
 */
function base64Decode(str) {
  const binary = atob(str);
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}
