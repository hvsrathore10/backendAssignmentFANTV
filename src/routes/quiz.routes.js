const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/role.middleware');
const { generalLimiter } = require('../middlewares/rateLimiter');
const { addQuizToCourse, attemptQuiz, getQuizScores } = require('../controllers/quiz.controller');

// Admin adds quiz to a course
router.post('/course/:courseId/quizzes', auth, isAdmin, addQuizToCourse);

// User attempts a quiz
router.post('/:quizId/attempt', auth, attemptQuiz);

// User views scores for a quiz
router.get('/:quizId/scores', auth, generalLimiter, getQuizScores);

module.exports = router;