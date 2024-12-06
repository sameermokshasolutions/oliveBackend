const { body } = require('express-validator');

exports.validateJobCategory = [
  body('name').trim().notEmpty().withMessage('Job category name is required'),
];

exports.validateJobTag = [
  body('name').trim().notEmpty().withMessage('Job tag name is required'),
];

exports.validateJobRole = [
  body('name').trim().notEmpty().withMessage('Job role name is required'),
 
];

exports.validateEducation = [
  body('name').trim().notEmpty().withMessage('Education level name is required'),
];

exports.validateExperience = [
  body('name').trim().notEmpty().withMessage('Experience level name is required'),
];

