import fetch from 'node-fetch';

const BACKEND_URL = 'https://sproj-backend.onrender.com';

export const handler = async (event, context) => {
  console.log('Simple proxy function invocation:', {
    functionId: context.functionID,
    requestId: event.requestContext?.requestId,
    timestamp: new Date().toISOString(),
    path: event.path,
    method: event.httpMethod,
    headers: event.headers
  });

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400'
      },
      body: ''
    };
  }

  try {
    // Extract the path after /api/
    let path = event.path;
    if (path.startsWith('/.netlify/functions/simple-proxy/api/')) {
      path = path.replace('/.netlify/functions/simple-proxy/api/', '');
    } else if (path.startsWith('/api/')) {
      path = path.replace('/api/', '');
    }

    // Ensure path doesn't start with a slash
    path = path.replace(/^\/+/, '');

    // Only allow products and categories endpoints
    if (!['products', 'categories'].includes(path)) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Not Found',
          message: 'Only products and categories endpoints are supported'
        })
      };
    }

    const backendUrl = `${BACKEND_URL}/api/${path}`;
    console.log('Making request to backend:', {
      url: backendUrl,
      method: event.httpMethod,
      headers: event.headers
    });

    // Make request to backend with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(backendUrl, {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('Backend response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Simple proxy error:', {
      message: error.message,
      stack: error.stack,
      type: error.name,
      code: error.code,
      cause: error.cause,
      timestamp: new Date().toISOString()
    });

    return {
      statusCode: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify({
        error: 'Bad Gateway',
        message: error.message,
        details: {
          type: error.name,
          code: error.code,
          cause: error.cause,
          timestamp: new Date().toISOString()
        }
      })
    };
  }
}; 