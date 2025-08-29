const express = require('express');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const {
  askQuestion,
  uploadDocument,
  getDocumentStats,
  deleteAllDocuments,
  initializeDatabase
} = require('../controllers/chatController');

const router = express.Router();

// Validation rules
const askQuestionValidation = [
  body('question')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Question must be between 1 and 1000 characters')
];

const uploadDocumentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Document content is required'),
  body('filename')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Filename must be between 1 and 255 characters')
];

// Chat routes
router.post('/ask', askQuestionValidation, handleValidationErrors, protect, askQuestion);
router.post('/upload', uploadDocumentValidation, handleValidationErrors, protect, uploadDocument);
router.get('/documents', protect, getDocumentStats);
router.delete('/documents', protect, deleteAllDocuments);
router.post('/init', protect, initializeDatabase);

module.exports = router;
