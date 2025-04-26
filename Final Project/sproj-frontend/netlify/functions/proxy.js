import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Backend URL configuration with fallback
const BACKEND_URL = process.env.BACKEND_URL || "https://sproj-backend.onrender.com";
console.log('Using backend URL:', BACKEND_URL);

// Common headers for all responses
const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Origin, Accept, Cookie',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
  'Vary': 'Origin'
};

// Simple health check function
const checkBackendHealth = async () => {
  try {
    console.log('Checking backend health...');
    const response = await fetch(`${BACKEND_URL}/api/products`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Netlify-Health-Check'
      },
      timeout: 5000
    });
    
    console.log('Backend health check status:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error.message);
    return false;
  }
};

// Function to make a request to the backend with retries
const makeBackendRequest = async (url, options, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} of ${maxRetries} to ${url}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log(`Attempt ${attempt} response status:`, response.status);
      
      if (response.ok) {
        return response;
      }
      
      // If we get a 503, wait and retry
      if (response.status === 503) {
        const waitTime = Math.min(1000 * Math.pow(2, attempt), 10000);
        console.log(`Backend returned 503, waiting ${waitTime}ms before retry`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      return response;
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        const waitTime = Math.min(1000 * Math.pow(2, attempt), 10000);
        console.log(`Waiting ${waitTime}ms before retry`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError;
};

export const handler = async (event, context) => {
  console.log('Function invocation:', {
    functionId: context.functionID,
    requestId: event.requestContext?.requestId,
    timestamp: new Date().toISOString(),
    path: event.path,
    method: event.httpMethod,
    userAgent: event.headers['user-agent'],
    headers: event.headers
  });

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    // Extract the path after /api/
    let path = event.path;
    if (path.startsWith('/.netlify/functions/proxy/api/')) {
      path = path.replace('/.netlify/functions/proxy/api/', '');
    } else if (path.startsWith('/api/')) {
      path = path.replace('/api/', '');
    } else if (path.startsWith('/.netlify/functions/proxy/')) {
      path = path.replace('/.netlify/functions/proxy/', '');
    }

    // Ensure path doesn't start with a slash
    path = path.replace(/^\/+/, '');

    const backendUrl = `${BACKEND_URL}/api/${path}`;
    console.log('Making request to backend:', backendUrl);

    // Prepare headers for backend request
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': event.headers['user-agent'] || 'Netlify-Function'
    };

    // Add Authorization header if present
    if (event.headers.authorization) {
      headers['Authorization'] = event.headers.authorization;
    }

    // Add Cookie header if present
    if (event.headers.cookie) {
      headers['Cookie'] = event.headers.cookie;
    }

    // Add Origin header if present
    if (event.headers.origin) {
      headers['Origin'] = event.headers.origin;
    }

    // Add Referer header if present
    if (event.headers.referer) {
      headers['Referer'] = event.headers.referer;
    }

    // Make request to backend with retries
    const response = await makeBackendRequest(backendUrl, {
      method: event.httpMethod,
      headers: headers,
      body: event.body
    });
    
    console.log('Backend response status:', response.status);
    console.log('Backend response headers:', Object.fromEntries(response.headers.entries()));

    // Get response content
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Return response
    return {
      statusCode: response.status,
      headers: corsHeaders,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Proxy error:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error type:', error.name);
    console.error('Error code:', error.code);
    
    // Try to get more information about the error
    let errorDetails = error.message;
    if (error.cause) {
      errorDetails += `\nCause: ${error.cause}`;
    }
    if (error.code) {
      errorDetails += `\nCode: ${error.code}`;
    }
    
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Bad Gateway',
        message: 'Proxy error occurred',
        details: errorDetails,
        timestamp: new Date().toISOString(),
        path: event.path,
        backendUrl: `${BACKEND_URL}/api/${event.path.replace(/^\/+/, '')}`
      })
    };
  }
};