const fs = require('fs');
const path = require('path');

function staticFiles(req, res, next) {
  if (req.url.startsWith('/images/')) {
    const relativePath = req.url.replace(/^\/+/, '');
    const imagePath = path.join(__dirname, '..', 'public', relativePath);

    const publicDir = path.join(__dirname, '..', 'public');
    if (!imagePath.startsWith(publicDir)) {
      return res.status(400).json({ error: 'Invalid image path' });
    }

    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(`❌ Image not found: ${imagePath}`);
        return res.status(404).json({
          error: 'Image not found',
          message: `The requested image ${req.url} does not exist`,
          timestamp: new Date().toISOString()
        });
      }

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
    });
  } else {
    next();
  }
}

module.exports = staticFiles;
