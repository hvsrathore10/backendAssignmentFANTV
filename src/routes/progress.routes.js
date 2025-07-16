const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const Course = require('../models/course.model');
const User = require('../models/user.model');

// View course progress
router.get('/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = await User.findById(req.user.id);
    const progress = user.progress.find(p => p.courseId.toString() === courseId);

    if (!progress) return res.json({ completedLessons: 0, percent: 0 });

    const course = await Course.findById(courseId);
    const totalLessons = course.lessons.length;
    const percent = (progress.completedLessons.length / totalLessons) * 100;

    res.json({
      completedLessons: progress.completedLessons.length,
      percent: Math.round(percent),
      quizScores: progress.quizScores
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load progress', error: error.message });
  }
});

module.exports = router;