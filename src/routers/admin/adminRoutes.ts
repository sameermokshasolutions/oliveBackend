const express = require('express');
const adminRouter = express.Router();
const jobCategoryController = require('./controllers/jobCategoryController');
const jobTagController = require('./controllers/jobTagController');
const jobSkillController = require('./controllers/jobSkillController');
const jobRoleController = require('./controllers/jobRoleController');
const educationController = require('./controllers/educationController');
const experienceController = require('./controllers/experienceController');
const { validateCreateJobCategory, validateUpdateJobCategory } = require('./validators/jobCategoryValidator');
const { validateCreateJobTag, validateUpdateJobTag } = require('./validators/jobTagValidator');
const { validateCreateJobRole, validateUpdateJobRole } = require('./validators/jobRoleValidator');
const { validateCreateEducation, validateUpdateEducation } = require('./validators/educationValidator');
const { validateCreateExperience, validateUpdateExperience } = require('./validators/experienceValidator');

// Job Category routes
adminRouter.get('/job-categories', jobCategoryController.getAllJobCategories);
adminRouter.post('/job-categories', validateCreateJobCategory, jobCategoryController.createJobCategory);
adminRouter.put('/job-categories/:id', validateUpdateJobCategory, jobCategoryController.updateJobCategory);
adminRouter.delete('/job-categories/:id', jobCategoryController.deleteJobCategory);

// Job Tag routes
adminRouter.get('/job-tags', jobTagController.getAllJobTags);
adminRouter.post('/job-tags', validateCreateJobTag, jobTagController.createJobTag);
adminRouter.put('/job-tags/:id', validateUpdateJobTag, jobTagController.updateJobTag);
adminRouter.delete('/job-tags/:id', jobTagController.deleteJobTag);

// Job skills routes
adminRouter.get('/job-skills', jobSkillController.getAllJobSkills);
adminRouter.post('/job-skills', validateCreateJobTag, jobSkillController.createJobSkills);
adminRouter.put('/job-skills/:id', validateUpdateJobTag, jobSkillController.updateJobSkills);
adminRouter.delete('/job-skills/:id', jobSkillController.deleteJobSkills);

// Job Role routes
adminRouter.get('/job-roles', jobRoleController.getAllJobRoles);
adminRouter.post('/job-roles', validateCreateJobRole, jobRoleController.createJobRole);
adminRouter.put('/job-roles/:id', validateUpdateJobRole, jobRoleController.updateJobRole);
adminRouter.delete('/job-roles/:id', jobRoleController.deleteJobRole);

// Education routes
adminRouter.get('/education', educationController.getAllEducation);
adminRouter.post('/education', validateCreateEducation, educationController.createEducation);
adminRouter.put('/education/:id', validateUpdateEducation, educationController.updateEducation);
adminRouter.delete('/education/:id', educationController.deleteEducation);

// Experience routes
adminRouter.get('/experience', experienceController.getAllExperience);
adminRouter.post('/experience', validateCreateExperience, experienceController.createExperience);
adminRouter.post(
  "/bulk-experience",
  validateCreateExperience,
  experienceController.createExperienceInBulk
);
adminRouter.put('/experience/:id', validateUpdateExperience, experienceController.updateExperience);
adminRouter.delete('/experience/:id', experienceController.deleteExperience);

export default adminRouter;