const fs = require('fs');
const path = require('path');

// Static file middleware for lesson images
function staticFiles(req, res, next) {
  // Check if this is an image request
  if (req.url.startsWith('/images/')) {
    const imagePath = path.join(__dirname, '..', 'public', req.url);
    
    // Check if file exists
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        // File doesn't exist - return error message
        console.log(`❌ Image not found: ${imagePath}`);
        res.status(404).json({
          error: 'Image not found',
          message: `The requested image ${req.url} does not exist`,
          timestamp: new Date().toISOString()
        });
      } else {
        // File exists - serve it
        const ext = path.extname(imagePath).toLowerCase();
        const mimeTypes = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.webp': 'image/webp'
        };
        
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);
        
        const stream = fs.createReadStream(imagePath);
        stream.pipe(res);
        
        stream.on('error', (error) => {
          console.error('Error streaming image:', error);
          res.status(500).json({
            error: 'Server error',
            message: 'Error serving image file'
          });
        });
      }
    });
  } else {
    next();
  }
}

module.exports = staticFiles;