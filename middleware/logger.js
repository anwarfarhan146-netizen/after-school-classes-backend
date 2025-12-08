// Logger middleware
function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - UA: ${req.get('User-Agent') || 'unknown'}`);

  if (['POST', 'PUT'].includes(method) && req.body) {

    console.log('Request Body:', JSON.stringify(req.body));
  }

  next();
}

module.exports = logger;
