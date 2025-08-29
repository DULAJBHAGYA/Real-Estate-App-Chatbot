const express = require('express');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  logout,
  refreshToken,
  getMe
} = require('../controllers/authController');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('phone')
    .optional()
    .matches(/^[\+]?[0-9]{7,15}$/)
    .withMessage('Please enter a valid phone number (7-15 digits, optionally starting with +)')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
];

// Routes
router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);
router.post('/logout', protect, logout);
router.post('/logout-simple', (req, res) => {
  console.log('Simple logout endpoint called');
  res.json({
    success: true,
    message: 'Logout successful (simple endpoint)'
  });
});

// Alternative logout endpoint that doesn't require authentication
router.post('/logout-public', (req, res) => {
  console.log('Public logout endpoint called');
  res.json({
    success: true,
    message: 'Logout successful (public endpoint)'
  });
});
router.post('/refresh', refreshTokenValidation, handleValidationErrors, refreshToken);
router.get('/me', protect, getMe);

module.exports = router;
