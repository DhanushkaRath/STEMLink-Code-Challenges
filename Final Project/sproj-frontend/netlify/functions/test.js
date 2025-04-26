export const handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Origin, Accept, Cookie',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    },
    body: JSON.stringify({
      message: 'Test function is working!',
      timestamp: new Date().toISOString(),
      event: {
        path: event.path,
        method: event.httpMethod,
        headers: event.headers
      }
    })
  };
}; 