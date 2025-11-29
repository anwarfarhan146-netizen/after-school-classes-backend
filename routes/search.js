const express = require('express');
const router = express.Router();
const { getDatabase } = require('../config/database');

// GET /search - Full-text search across lessons
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const searchTerm = req.query.q;
    
    if (!searchTerm || searchTerm.trim() === '') {
      return res.status(400).json({
        error: 'Missing search term',
        message: 'Search term (q) parameter is required'
      });
    }

    console.log(`🔍 Searching for: "${searchTerm}"`);

    // Create a case-insensitive regex for searching
    const searchRegex = new RegExp(searchTerm, 'i');

    // Search across multiple fields
    const searchResults = await db.collection('lessons').find({
      $or: [
        { subject: { $regex: searchRegex } },
        { location: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { price: { $regex: searchRegex } },
        { space: { $regex: searchRegex } }
      ]
    }).toArray();

    console.log(`✅ Search found ${searchResults.length} results for "${searchTerm}"`);

    res.json({
      searchTerm: searchTerm,
      results: searchResults,
      count: searchResults.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to perform search in database'
    });
  }
});

module.exports = router;