import express from "express";
import {
  createEducation,
  updateEducation,
  getAllEducation,
  deleteEducation,
} from "./controllers/educationController";
import {
  createExperience,
  createExperienceInBulk,
  deleteExperience,
  getAllExperience,
  updateExperience,
} from "./controllers/experienceController";
import {
  createJobCategory,
  deleteJobCategory,
  getAllJobCategories,
  getJobCategoriesByCompanyType,
  getJobCategoriesByCompanyTypeId,
  updateJobCategory,
} from "./controllers/jobCategoryController";
import {
  createJobRole,
  deleteJobRole,
  getAllJobRoles,
  getJobRolesByCategory,
  updateJobRole,
} from "./controllers/jobRoleController";
import {
  getAllJobTags,
  createJobTag,
  deleteJobTag,
  updateJobTag,
  getJobTagByRole,
} from "./controllers/jobTagController";
import {
  createJobSkills,
  deleteJobSkills,
  getAllJobSkills,
  getJobSkillsByRole,
  updateJobSkills,
} from "./controllers/jobSkillController";
import {
  validateCreateJobCategory,
  validateUpdateJobCategory,
} from "./validators/jobCategoryValidator";
import {
  validateCreateJobTag,
  validateUpdateJobTag,
} from "./validators/jobTagValidator";
import {
  validateCreateJobRole,
  validateUpdateJobRole,
} from "./validators/jobRoleValidator";
import {
  validateCreateEducation,
  validateUpdateEducation,
} from "./validators/educationValidator";
import {
  validateCreateExperience,
  validateUpdateExperience,
} from "./validators/experienceValidator";
import { getAllEmployers } from "./controllers/employerController";
import { getAllCandidates } from "./controllers/candidateController";
import { adminAuthMiddleware } from "../../middlewares/adminAuthMiddleware";
import {
  approveJob,
  getAllJobs,
  rejectJob,
} from "./controllers/jobsController";
import { getLatestUsers } from "./controllers/usersController";
import { dashboardSummary } from "./controllers/dashboardController";
import { authenticateToken } from "../../middlewares/authMiddleware";
import {
  createCompanyType,
  deleteCompanyType,
  getAllCompanyTypes,
  getCompanyTypeById,
  updateCompanyType,
} from "./controllers/companyTypeController";
import { employerAuthMiddleware } from "../../middlewares/emplyerAuthMiddleware";

const adminRouter = express.Router();

// Job Category routes
adminRouter.get("/job-categories", authenticateToken, getAllJobCategories);
adminRouter.get(
  "/jobCategoriesByCompanyType",
  employerAuthMiddleware,
  getJobCategoriesByCompanyType
);
adminRouter.get(
  "/job-categories-company/:companyTypeId",
  getJobCategoriesByCompanyTypeId
);
adminRouter.post("/job-categories", createJobCategory);
adminRouter.put("/job-categories/:id", updateJobCategory);
adminRouter.delete("/job-categories/:id", deleteJobCategory);

// Company type routes
adminRouter.get("/company-type", authenticateToken, getAllCompanyTypes);
adminRouter.post("/company-type", createCompanyType);
adminRouter.put("/company-type/:id", updateCompanyType);
adminRouter.delete("/company-type/:id", deleteCompanyType);

// Job Tag routes
adminRouter.get("/job-tags", getAllJobTags);
adminRouter.get("/job-tags/:id", getJobTagByRole);
adminRouter.post("/job-tags", validateCreateJobTag, createJobTag);
adminRouter.put("/job-tags/:id", validateUpdateJobTag, updateJobTag);
adminRouter.delete("/job-tags/:id", deleteJobTag);

// Job skills routes
adminRouter.get("/job-skills", getAllJobSkills);
adminRouter.get("/job-skills/:id", getJobSkillsByRole);
adminRouter.post("/job-skills", validateCreateJobTag, createJobSkills);
adminRouter.put("/job-skills/:id", validateUpdateJobTag, updateJobSkills);
adminRouter.delete("/job-skills/:id", deleteJobSkills);

// Job Role routes
adminRouter.get("/job-roles", getAllJobRoles);
adminRouter.get("/job-roles/:id", getJobRolesByCategory);
adminRouter.post("/job-roles", validateCreateJobRole, createJobRole);
adminRouter.put("/job-roles/:id", validateUpdateJobRole, updateJobRole);
adminRouter.delete("/job-roles/:id", deleteJobRole);

// Education routes
adminRouter.get("/education", getAllEducation);
adminRouter.post("/education", validateCreateEducation, createEducation);
adminRouter.put("/education/:id", validateUpdateEducation, updateEducation);
adminRouter.delete("/education/:id", deleteEducation);

// Experience routes
adminRouter.get("/experience", getAllExperience);
adminRouter.post("/experience", validateCreateExperience, createExperience);
adminRouter.post(
  "/bulk-experience",
  validateCreateExperience,
  createExperienceInBulk
);
adminRouter.put("/experience/:id", validateUpdateExperience, updateExperience);
adminRouter.delete("/experience/:id", deleteExperience);

// EMPLOYERS
adminRouter.get("/employers", getAllEmployers);

// CANDIDATE
adminRouter.get("/candidates", adminAuthMiddleware, getAllCandidates);

// JOBS
adminRouter.get("/jobs", getAllJobs);
adminRouter.patch("/approveJob/:id", approveJob);
adminRouter.post("/rejectJob", rejectJob);

// LATEST USERS
adminRouter.get("/users", getLatestUsers);

// DASHBOARD SUMARY
adminRouter.get("/dashboardSummary", dashboardSummary);

export default adminRouter;
