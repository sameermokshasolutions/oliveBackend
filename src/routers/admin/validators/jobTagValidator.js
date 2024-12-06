const { body, param } = require('express-validator');

exports.validateCreateJobTag = [
  body('name')
    .trim()
    .notEmpty().withMessage('Job tag name is required')
    .isLength({ min: 2, max: 30 }).withMessage('Job tag name must be between 2 and 30 characters')
];

exports.validateUpdateJobTag = [
  param('id').isMongoId().withMessage('Invalid job tag ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Job tag name is required')
    .isLength({ min: 2, max: 30 }).withMessage('Job tag name must be between 2 and 30 characters')
];

