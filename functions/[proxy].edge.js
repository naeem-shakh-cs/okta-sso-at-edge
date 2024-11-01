import { xml2json } from 'xml-js';

/**
 * @param {Request} request - The incoming request object
 * @returns {Promise<Response>} - The response from the modified request
 */
export default async function handler(request, context) {
//   const oktaDomain = context.env.OKTA_DOMAIN;
//   const redirectUri = context.env.REDIRECT_URI;
  const samlEndpoint = context.env.OKTA_SAML_ENDPOINT;
//   const spEntityId = context.env.OKTA_SP_ENTITY_ID;
//   const samlRequest = generateSAMLRequest(redirectUri, oktaDomain, spEntityId);

  const url = new URL(request.url);
  const cookies = request.headers.get('Cookie') || '';
  const isAuthenticated = cookies.includes('saml-token');

  console.log(url.pathname);
  if (url.pathname === '/callback' && request.method === 'POST') {
    console.log('In POST /callback');
    
    const formData = await request.formData();
    const samlResponse = formData.get('SAMLResponse');
  
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
  console.log('outside callback');
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
  

/**
 * Validates a SAML response.
 * @param {string} samlResponse - The base64-encoded SAML response.
 * @returns {Promise<string|null>} - The SAML assertion if valid, otherwise null.
 */
async function validateSAMLResponse(samlResponse) {
  const decodedResponse = base64Decode(samlResponse);
  console.log(decodedResponse);
  const jsonObj = JSON.parse(xml2json(decodedResponse, { compact: true }));
  console.log(jsonObj);
  const assertion = jsonObj['saml2p:Response']['saml2:Assertion'];

  if (assertion) {
    // Add additional validation logic as needed
    return assertion;
  }

  return null;
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
