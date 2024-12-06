const JobCategory = require('../models/JobCategory');
const JobTag = require('../models/JobTag');
const JobRole = require('../models/JobRole');
const Education = require('../models/Education');
const Experience = require('../models/Experience');
const { SalaryType, JobType } = require('../models/enums');
const createHttpError = require('http-errors');

const handleCrudOperation = async (Model, operation, req, res, next) => {
  console.log('p--------------------------------;;;;');
  try {
    let result;
    switch (operation) {
      case 'getAll':
        
        result = await Model.find();
        return res.status(200).json({ success: true, data: result });
      case 'create':
        result = await Model.create(req.body);
        return res.status(201).json({ success: true, message: 'Item created successfully', data: result });
      case 'update':
        result = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) throw createHttpError(404, 'Item not found');
        return res.status(200).json({ success: true, message: 'Item updated successfully', data: result });
      case 'delete':
        result = await Model.findByIdAndDelete(req.params.id);
        if (!result) throw createHttpError(404, 'Item not found');
        return res.status(200).json({ success: true, message: 'Item deleted successfully' });
      default:
        throw createHttpError(400, 'Invalid operation');
    }
  } catch (error) {
    next(error);
  }
};

// Job Categories
exports.getJobCategories = (req, res, next) => handleCrudOperation(JobCategory, 'getAll', req, res, next);
exports.createJobCategory = (req, res, next) => handleCrudOperation(JobCategory, 'create', req, res, next);
exports.updateJobCategory = (req, res, next) => handleCrudOperation(JobCategory, 'update', req, res, next);
exports.deleteJobCategory = (req, res, next) => handleCrudOperation(JobCategory, 'delete', req, res, next);

// Job Tags
exports.getJobTags = (req, res, next) => handleCrudOperation(JobTag, 'getAll', req, res, next);
exports.createJobTag = (req, res, next) => handleCrudOperation(JobTag, 'create', req, res, next);
exports.updateJobTag = (req, res, next) => handleCrudOperation(JobTag, 'update', req, res, next);
exports.deleteJobTag = (req, res, next) => handleCrudOperation(JobTag, 'delete', req, res, next);

// Job Roles
exports.getJobRoles = (req, res, next) => handleCrudOperation(JobRole, 'getAll', req, res, next);
exports.createJobRole = (req, res, next) => handleCrudOperation(JobRole, 'create', req, res, next);
exports.updateJobRole = (req, res, next) => handleCrudOperation(JobRole, 'update', req, res, next);
exports.deleteJobRole = (req, res, next) => handleCrudOperation(JobRole, 'delete', req, res, next);

// Education
exports.getEducation = (req, res, next) => handleCrudOperation(Education, 'getAll', req, res, next);
exports.createEducation = (req, res, next) => handleCrudOperation(Education, 'create', req, res, next);
exports.updateEducation = (req, res, next) => handleCrudOperation(Education, 'update', req, res, next);
exports.deleteEducation = (req, res, next) => handleCrudOperation(Education, 'delete', req, res, next);

// Experience
exports.getExperience = (req, res, next) => handleCrudOperation(Experience, 'getAll', req, res, next);
exports.createExperience = (req, res, next) => handleCrudOperation(Experience, 'create', req, res, next);
exports.updateExperience = (req, res, next) => handleCrudOperation(Experience, 'update', req, res, next);
exports.deleteExperience = (req, res, next) => handleCrudOperation(Experience, 'delete', req, res, next);

// Salary Types
exports.getSalaryTypes = (req, res, next) => {
  try {
    const salaryTypes = Object.values(SalaryType);
    res.status(200).json({ success: true, data: salaryTypes });
  } catch (error) {
    next(error);
  }
};

// Job Types
exports.getJobTypes = (req, res, next) => {
  try {
    const jobTypes = Object.values(JobType);
    res.status(200).json({ success: true, data: jobTypes });
  } catch (error) {
    next(error);
  }
};

