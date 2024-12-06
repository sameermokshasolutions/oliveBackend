const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { validateJobCategory, validateJobTag, validateJobRole, validateEducation, validateExperience } = require('../validators/jobValidators');
const { authenticateToken } = require('../middleware/auth');

// Job Categories
router.get('/job-categories', jobController.getJobCategories);
router.post('/job-categories', authenticateToken, validateJobCategory, jobController.createJobCategory);
router.put('/job-categories/:id', authenticateToken, validateJobCategory, jobController.updateJobCategory);
router.delete('/job-categories/:id', authenticateToken, jobController.deleteJobCategory);

// Job Tags
router.get('/job-tags', jobController.getJobTags);
router.post('/job-tags', authenticateToken, validateJobTag, jobController.createJobTag);
router.put('/job-tags/:id', authenticateToken, validateJobTag, jobController.updateJobTag);
router.delete('/job-tags/:id', authenticateToken, jobController.deleteJobTag);

// Job Roles
router.get('/job-roles', jobController.getJobRoles);
router.post('/job-roles', authenticateToken, validateJobRole, jobController.createJobRole);
router.put('/job-roles/:id', authenticateToken, validateJobRole, jobController.updateJobRole);
router.delete('/job-roles/:id', authenticateToken, jobController.deleteJobRole);

// Education
router.get('/education', jobController.getEducation);
router.post('/education', authenticateToken, validateEducation, jobController.createEducation);
router.put('/education/:id', authenticateToken, validateEducation, jobController.updateEducation);
router.delete('/education/:id', authenticateToken, jobController.deleteEducation);

// Experience
router.get('/experience', jobController.getExperience);
router.post('/experience', authenticateToken, validateExperience, jobController.createExperience);
router.put('/experience/:id', authenticateToken, validateExperience, jobController.updateExperience);
router.delete('/experience/:id', authenticateToken, jobController.deleteExperience);
// Salary Types
router.get('/salary-types', jobController.getSalaryTypes);
// Job Types
router.get('/job-types', jobController.getJobTypes);

module.exports = router;

