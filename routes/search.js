const express = require('express');
const router = express.Router();
const { getDatabase } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) return res.status(500).json({ error: 'Database not connected' });

    const searchTerm = req.query.q;
    if (!searchTerm || searchTerm.trim() === '') {
      return res.status(400).json({ error: 'Missing search term', message: 'Search term (q) parameter is required' });
    }

    console.log(`🔍 Searching for: "${searchTerm}"`);
    const allLessons = await db.collection('lessons').find().toArray();
    const lower = searchTerm.toLowerCase();

    const filtered = allLessons.filter(lesson => {
      return (
        (lesson.subject && lesson.subject.toLowerCase().includes(lower)) ||
        (lesson.location && lesson.location.toLowerCase().includes(lower)) ||
        (lesson.description && lesson.description.toLowerCase().includes(lower)) ||
        (lesson.price && lesson.price.toString().includes(searchTerm)) ||
        (lesson.space && lesson.space.toString().includes(searchTerm))
      );
    }).map(l => ({ ...l, _id: l._id ? l._id.toString() : undefined }));

    console.log(`✅ Search found ${filtered.length} results for "${searchTerm}"`);
    res.json({ searchTerm: searchTerm, results: filtered, count: filtered.length, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ error: 'Internal server error', message: 'Failed to perform search in database' });
  }
});

module.exports = router;
