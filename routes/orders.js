const express = require('express');
const router = express.Router();
const { getDatabase } = require('../config/database');
const { ObjectId } = require('mongodb');

// POST new order - stores customer purchase in database
router.post('/', async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) return res.status(500).json({ error: 'Database not connected' });

    // Extract fields from client request body
    const { name, phone, lessonIDs, spaces } = req.body;
    if (!name || !phone || !lessonIDs || !spaces) {
      return res.status(400).json({ error: 'Missing required fields', message: 'Name, phone, lessonIDs, and spaces are required' });
    }
    if (!Array.isArray(lessonIDs) || !Array.isArray(spaces)) {
      return res.status(400).json({ error: 'Invalid data types', message: 'lessonIDs and spaces must be arrays' });
    }
    if (lessonIDs.length !== spaces.length) {
      return res.status(400).json({ error: 'Data mismatch', message: 'lessonIDs and spaces arrays must have the same length' });
    }

    let total = 0;
    for (let i = 0; i < lessonIDs.length; i++) {
      const id = lessonIDs[i];
      const qty = Number(spaces[i]);
      try {
        let query = {};
        if (ObjectId.isValid(id)) query = { _id: new ObjectId(id) };
        else query = { _id: id };
        const lessonDoc = await db.collection('lessons').findOne(query);
        if (lessonDoc && lessonDoc.price) total += (lessonDoc.price * qty);
      } catch (err) {

      }
    }

    const order = {
      name: name.trim(),
      phone: phone.trim(),
      lessonIDs: lessonIDs.map(id => id.toString()),
      spaces: spaces.map(s => Number(s)),
      orderDate: new Date(),
      status: 'confirmed',
      totalAmount: total
    };

    const result = await db.collection('orders').insertOne(order);

    console.log(`✅ New order created: ${result.insertedId} for ${name}`);
    console.log(`   - Phone: ${phone}`);
    console.log(`   - Lessons: ${lessonIDs.length} lessons`);
    console.log(`   - Total spaces: ${spaces.reduce((sum, space) => sum + Number(space), 0)}`);
    console.log(`   - Total amount: £${total.toFixed(2)}`);

    res.status(201).json({ message: 'Order created successfully', orderId: result.insertedId.toString(), order: order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error', message: 'Failed to create order in database' });
  }
});

router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) return res.status(500).json({ error: 'Database not connected' });

    const orders = await db.collection('orders').find().toArray();
    const serializable = orders.map(o => ({ ...o, _id: o._id ? o._id.toString() : undefined }));
    console.log(`📦 Returning ${serializable.length} orders`);
    res.json(serializable);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error', message: 'Failed to fetch orders from database' });
  }
});

module.exports = router;
