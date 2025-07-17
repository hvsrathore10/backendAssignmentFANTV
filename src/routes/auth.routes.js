const express = require('express');
const router = express.Router();
const { loginLimiter } = require('../middlewares/rateLimiter');
const { signup, login } = require('../controllers/auth.controller');

router.post('/signup', signup);
router.post('/login', loginLimiter, login); 

module.exports = router;