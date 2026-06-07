const express = require('express');

const authController = require('../controllers/authController');
const { authLimiter, rejectBadOrigin, requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authLimiter, rejectBadOrigin, authController.register);
router.post('/login', authLimiter, rejectBadOrigin, authController.login);
router.post('/refresh', authLimiter, rejectBadOrigin, authController.refresh);
router.get('/me', requireAuth, authController.me);
router.post('/logout', rejectBadOrigin, requireAuth, authController.logout);

module.exports = router;
