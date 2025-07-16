const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const Course = require('../models/course.model');

// Create new course (admin only - add admin check in future if needed)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, instructor, price, lessons, quizzes } = req.body;
    const course = new Course({ title, description, instructor, price, lessons, quizzes });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create course', error: error.message });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
});

// Get single course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch course', error: error.message });
  }
});

module.exports = router;