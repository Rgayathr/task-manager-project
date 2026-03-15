// Authentication routes - handles register, login, logout, profile
const router = require('express').Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const { registerValidation, loginValidation } = require('../utils/validation');

// Public routes - no authentication required
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes - require valid JWT cookie
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
