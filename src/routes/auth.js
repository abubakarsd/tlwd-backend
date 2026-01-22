const express = require('express');
const router = express.Router();
const { login, getMe, logout, refreshToken, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.post('/refresh', protect, refreshToken);
router.put('/password', protect, updatePassword);

module.exports = router;
