const express = require('express');
const router = express.Router();
const { getDatabase } = require('../config/database');

// GET /lessons - Returns all lessons
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const lessons = await db.collection('lessons').find().toArray();
    
    console.log(`📚 Returning ${lessons.length} lessons`);
    
    res.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch lessons from database'
    });
  }
});

// PUT /lessons/:id - Update a lesson (for updating spaces)
router.put('/:id', async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const lessonId = req.params.id;
    const updateData = req.body;

    // Validate that we have data to update
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        error: 'Bad request',
        message: 'No update data provided' 
      });
    }

    // Convert string ID to ObjectId if needed
    let objectId;
    try {
      const { ObjectId } = require('mongodb');
      objectId = new ObjectId(lessonId);
    } catch (err) {
      return res.status(400).json({ 
        error: 'Invalid lesson ID',
        message: 'The provided lesson ID is not valid' 
      });
    }

    const result = await db.collection('lessons').updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        error: 'Lesson not found',
        message: `No lesson found with ID: ${lessonId}` 
      });
    }

    console.log(`✅ Updated lesson ${lessonId}:`, updateData);
    
    res.json({
      message: 'Lesson updated successfully',
      lessonId: lessonId,
      updatedFields: updateData,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to update lesson in database'
    });
  }
});

module.exports = router;