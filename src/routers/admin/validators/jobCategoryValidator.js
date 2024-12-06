const { body, param } = require('express-validator');

exports.validateCreateJobCategory = [
  body('name')
    .trim()
    .notEmpty().withMessage('Job category name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Job category name must be between 2 and 50 characters')
];

exports.validateUpdateJobCategory = [
  param('id').isMongoId().withMessage('Invalid job category ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Job category name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Job category name must be between 2 and 50 characters')
];

