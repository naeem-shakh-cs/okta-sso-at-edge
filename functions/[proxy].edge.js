import { parse } from 'fast-xml-parser';

/**
 * @param {Request} request - The incoming request object
 * @returns {Promise<Response>} - The response from the modified request
 */
export default async function handler(request, context) {
  const oktaDomain = context.env.OKTA_DOMAIN;
  const redirectUri = context.env.REDIRECT_URI;
  const samlEndpoint = context.env.OKTA_SAML_ENDPOINT;
  const samlRequest = generateSAMLRequest(redirectUri, samlEndpoint, oktaDomain);

  const url = new URL(request.url);
  const cookies = request.headers.get('Cookie') || '';
  const isAuthenticated = cookies.includes('saml-token');

  if (!isAuthenticated) {
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `${samlEndpoint}?SAMLRequest=${samlRequest}`
      }
    });
  }

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

  return new Response('Authenticated', { status: 200 });
}

/**
 * Generates a SAML request.
 * @param {string} redirectUri - The URI to redirect to after authentication.
 * @param {string} samlEndpoint - The SAML endpoint URL.
 * @param {string} oktaDomain - The Okta domain.
 * @returns {string} - The base64-encoded SAML request.
 */
function generateSAMLRequest(redirectUri, samlEndpoint, oktaDomain) {
  const samlRequestXml = `
    <samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" 
                        ID="_${generateUniqueId()}" 
                        Version="2.0" 
                        IssueInstant="${new Date().toISOString()}" 
                        Destination="${samlEndpoint}" 
                        AssertionConsumerServiceURL="${redirectUri}">
      <saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">${oktaDomain}</saml:Issuer>
    </samlp:AuthnRequest>
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
