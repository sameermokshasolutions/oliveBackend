import { body, param } from 'express-validator';

export const validateCreateEducation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Education level name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Education level name must be between 2 and 50 characters')
];

export const validateUpdateEducation = [
  param('id').isMongoId().withMessage('Invalid education level ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Education level name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Education level name must be between 2 and 50 characters')
];

