// Logger middleware that outputs all requests to console
function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${req.get('User-Agent')}`);
  
  // Log request body for POST/PUT requests (except for sensitive data)
  if (['POST', 'PUT'].includes(method) && req.body) {
    console.log('Request Body:', JSON.stringify(req.body));
  }
  
  next();
}

module.exports = logger;