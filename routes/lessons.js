const express = require('express');
const router = express.Router();
const { getDatabase } = require('../config/database');
const { ObjectId } = require('mongodb');

function convertLessonForJson(lesson) {
  if (!lesson) return lesson;
  return { ...lesson, _id: lesson._id ? lesson._id.toString() : undefined };
}

// GET all lessons from the database
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) return res.status(500).json({ error: 'Database not connected' });

    const lessons = await db.collection('lessons').find().toArray();
    const serializable = lessons.map(convertLessonForJson);
    console.log(`📚 Returning ${serializable.length} lessons`);
    res.json(serializable);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Internal server error', message: 'Failed to fetch lessons from database' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) return res.status(500).json({ error: 'Database not connected' });

    const lessonId = req.params.id;
    const updateData = req.body;
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Bad request', message: 'No update data provided' });
    }

    if (!ObjectId.isValid(lessonId)) {
      return res.status(400).json({ error: 'Invalid lesson ID', message: 'The provided lesson ID is not valid' });
    }
    const objectId = new ObjectId(lessonId);

    if (updateData._id) delete updateData._id;

    const result = await db.collection('lessons').updateOne({ _id: objectId }, { $set: updateData });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Lesson not found', message: `No lesson found with ID: ${lessonId}` });
    }

    const updated = await db.collection('lessons').findOne({ _id: objectId });
    res.json({ message: 'Lesson updated successfully', lesson: convertLessonForJson(updated), modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ error: 'Internal server error', message: 'Failed to update lesson in database' });
  }
});

module.exports = router;
