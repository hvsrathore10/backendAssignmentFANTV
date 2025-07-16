const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/role.middleware');
const { addLessonToCourse, markLessonComplete } = require('../controllers/lesson.controller');

// Admin adds lesson to a course
router.post('/course/:courseId/lessons', auth, isAdmin, addLessonToCourse);

// User marks lesson complete
router.post('/:id/complete', auth, markLessonComplete);

module.exports = router;