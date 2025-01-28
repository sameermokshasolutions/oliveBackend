import { body, param } from 'express-validator';

export const validateCreateExperience = [
  body('name')
    .trim()
    .notEmpty().withMessage('Experience level name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Experience level name must be between 2 and 50 characters')
];

export const validateUpdateExperience = [
  param('id').isMongoId().withMessage('Invalid experience level ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Experience level name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Experience level name must be between 2 and 50 characters')
];

