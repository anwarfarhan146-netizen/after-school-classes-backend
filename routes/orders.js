const express = require('express');
const router = express.Router();
const { getDatabase } = require('../config/database');

// POST /orders - Save a new order
router.post('/', async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const { name, phone, lessonIDs, spaces } = req.body;

    // Validate required fields
    if (!name || !phone || !lessonIDs || !spaces) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, phone, lessonIDs, and spaces are required'
      });
    }

    // Validate data types
    if (!Array.isArray(lessonIDs) || !Array.isArray(spaces)) {
      return res.status(400).json({
        error: 'Invalid data types',
        message: 'lessonIDs and spaces must be arrays'
      });
    }

    if (lessonIDs.length !== spaces.length) {
      return res.status(400).json({
        error: 'Data mismatch',
        message: 'lessonIDs and spaces arrays must have the same length'
      });
    }

    // Create order object
    const order = {
      name: name.trim(),
      phone: phone.trim(),
      lessonIDs: lessonIDs,
      spaces: spaces,
      orderDate: new Date(),
      status: 'confirmed',
      totalAmount: 0 // You can calculate this if you have lesson prices
    };

    // Insert order into database
    const result = await db.collection('orders').insertOne(order);
    
    console.log(`✅ New order created: ${result.insertedId} for ${name}`);
    console.log(`   - Phone: ${phone}`);
    console.log(`   - Lessons: ${lessonIDs.length} lessons`);
    console.log(`   - Total spaces: ${spaces.reduce((sum, space) => sum + space, 0)}`);

    res.status(201).json({
      message: 'Order created successfully',
      orderId: result.insertedId,
      order: order
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create order in database'
    });
  }
});

// GET /orders - Get all orders (for testing)
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const orders = await db.collection('orders').find().toArray();
    
    console.log(`📦 Returning ${orders.length} orders`);
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch orders from database'
    });
  }
});

module.exports = router;