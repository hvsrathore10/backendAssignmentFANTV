const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const Course = require('../models/course.model');
const User = require('../models/user.model');

// Attempt a quiz
router.post('/:courseId/quizzes/:quizId/attempt', auth, async (req, res) => {
  try {
    const { courseId, quizId } = req.params;
    const { answers } = req.body;
    const course = await Course.findById(courseId);
    const quiz = course.quizzes.id(quizId);

    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (q.correctIndex === answers[idx]) score++;
    });

    const user = await User.findById(req.user.id);
    let progress = user.progress.find(p => p.courseId.toString() === courseId);
    if (!progress) {
      progress = { courseId, completedLessons: [], quizScores: [] };
    }
    progress.quizScores.push({ quizId, score });
    user.progress = user.progress.filter(p => p.courseId.toString() !== courseId);
    user.progress.push(progress);

    await user.save();
    res.json({ score });
  } catch (error) {
    res.status(500).json({ message: 'Quiz attempt failed', error: error.message });
  }
});

module.exports = router;

