const { body, param } = require('express-validator');

exports.validateCreateJobRole = [
  body('name')
    .trim()
    .notEmpty().withMessage('Job role name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Job role name must be between 2 and 50 characters'),

];

exports.validateUpdateJobRole = [
  param('id').isMongoId().withMessage('Invalid job role ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Job role name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Job role name must be between 2 and 50 characters'),

];

