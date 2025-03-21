import { body, param } from 'express-validator';

export const validateCreateJobRole = [
  body('name')
    .trim()
    .notEmpty().withMessage('Job role name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Job role name must be between 2 and 50 characters'),

];

export const validateUpdateJobRole = [
  param('id').isMongoId().withMessage('Invalid job role ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Job role name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Job role name must be between 2 and 50 characters'),

];

