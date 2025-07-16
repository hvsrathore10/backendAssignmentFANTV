const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const User = require('../models/user.model');

// Mark lesson as completed
router.post('/:courseId/lessons/:lessonTitle/complete', auth, async (req, res) => {
  try {
    const { courseId, lessonTitle } = req.params;
    const user = await User.findById(req.user.id);

    let progress = user.progress.find(p => p.courseId.toString() === courseId);
    if (!progress) {
      progress = { courseId, completedLessons: [], quizScores: [] };
    }
    if (!progress.completedLessons.includes(lessonTitle)) {
      progress.completedLessons.push(lessonTitle);
    }
    user.progress = user.progress.filter(p => p.courseId.toString() !== courseId);
    user.progress.push(progress);

    await user.save();
    res.json({ message: 'Lesson marked as completed' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking lesson', error: error.message });
  }
});

module.exports = router;