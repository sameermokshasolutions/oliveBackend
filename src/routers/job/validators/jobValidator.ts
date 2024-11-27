import { body, param, query } from 'express-validator';

export const createJobValidator = [
    body('title').notEmpty().withMessage('Job title is required'),
    body('description').notEmpty().withMessage('Job description is required'),
    body('company').notEmpty().withMessage('Company name is required'),
    body('location').notEmpty().withMessage('Job location is required'),
    body('salary').optional().isNumeric().withMessage('Salary must be a number'),
    body('requirements').isArray().withMessage('Requirements must be an array'),
    body('employerId').notEmpty().withMessage('Employer ID is required'),
];

export const updateJobValidator = [
    param('jobId').notEmpty().withMessage('Job ID is required'),
    ...createJobValidator,
];

export const getJobValidator = [
    param('jobId').notEmpty().withMessage('Job ID is required'),
];

export const getJobListValidator = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
];

export const deleteJobValidator = [
    param('jobId').notEmpty().withMessage('Job ID is required'),
];