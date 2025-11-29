require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase, closeDatabase } = require('./config/database');

// Import middleware
const logger = require('./middleware/logger');
const staticFiles = require('./middleware/staticFiles');

// Import routes
const lessonsRoutes = require('./routes/lessons');
const ordersRoutes = require('./routes/orders');
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(logger); // Custom logger middleware
app.use(staticFiles); // Static file middleware

// Routes
app.use('/lessons', lessonsRoutes);
app.use('/orders', ordersRoutes);
app.use('/search', searchRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'After School Classes API',
    version: '1.0.0',
    endpoints: {
      lessons: 'GET /lessons',
      orders: 'POST /orders',
      search: 'GET /search?q=term',
      updateLesson: 'PUT /lessons/:id'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    database: 'Connected', // This would be dynamic in a real app
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /',
      'GET /lessons',
      'POST /orders', 
      'PUT /lessons/:id',
      'GET /search?q=term',
      'GET /health'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  });
});

// Start server
connectToDatabase((err) => {
  if (err) {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Endpoints:`);
    console.log(`   GET  /lessons - Get all lessons`);
    console.log(`   POST /orders - Create new order`);
    console.log(`   PUT  /lessons/:id - Update lesson`);
    console.log(`   GET  /search?q=term - Search lessons`);
    console.log(`   GET  /health - Health check`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  closeDatabase();
  process.exit(0);
});

module.exports = app;