const { body, param } = require('express-validator');

exports.validateCreateExperience = [
  body('name')
    .trim()
    .notEmpty().withMessage('Experience level name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Experience level name must be between 2 and 50 characters')
];

exports.validateUpdateExperience = [
  param('id').isMongoId().withMessage('Invalid experience level ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Experience level name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Experience level name must be between 2 and 50 characters')
];

