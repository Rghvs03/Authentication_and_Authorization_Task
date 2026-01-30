const express = require('express');
const router = express.Router();
const { registerController, verifyEmailController, loginController, profileController } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.post('/register', registerController);
router.get('/verify-email', verifyEmailController);
router.post('/login', loginController);
router.get('/profile', authMiddleware, profileController);

module.exports = router;