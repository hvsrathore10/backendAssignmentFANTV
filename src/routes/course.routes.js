const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/role.middleware');
const { generalLimiter } = require('../middlewares/rateLimiter');
const { createCourse, getAllCourses, getCourseById, enrollInCourse } = require('../controllers/course.controller');

router.post('/', auth, isAdmin, createCourse);
router.get('/', generalLimiter, getAllCourses);
router.get('/:id', generalLimiter, getCourseById);
router.post('/:id/enroll', auth, enrollInCourse);

module.exports = router;