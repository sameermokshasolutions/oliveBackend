import express from "express";
import { authenticateToken } from "../../middlewares/authMiddleware";
import {
  getJobById,
  getJobs,
  getJobsWithFacets,
  getPublicJobById,
  getPublicJobs,
  searchJob,
} from "./controllers/jobs";
import {
  applyForJob,
  getAppliedJobs,
} from "./controllers/appliedJobController";
import { getSavedJobs, saveJobs } from "./controllers/savedJobController";
import {
  CreateJobTemplate,
  DeletJobTemplate,
  ReadJobTemplateById,
  ReadJobTemplates,
  ReadJobTemplatesByCompanyType,
  UpdateJobTemplate,
} from "./controllers/jobTemplate.controller";
import { employerAuthMiddleware } from "../../middlewares/emplyerAuthMiddleware";
import { getJobAlrtsOfCandidates } from "./controllers/jobAlertsController";

const jobRouter = express.Router();

// get jobs
jobRouter.get("/jobs", authenticateToken, getJobs);
jobRouter.get("/search-jobs", authenticateToken, searchJob);
jobRouter.get("/search-facets", authenticateToken, getJobsWithFacets);
jobRouter.get("/jobs/:id", authenticateToken, getJobById);
jobRouter.get("/public/jobs", getPublicJobs);
jobRouter.get("/public/jobs/:id", getPublicJobById);

// apply jobs
jobRouter.post("/apply-job", authenticateToken, applyForJob);
jobRouter.get("/getAppliedJobs", authenticateToken, getAppliedJobs);

// save jobs
jobRouter.put("/saveJobs/:id", authenticateToken, saveJobs);
jobRouter.get("/saveJobs", authenticateToken, getSavedJobs);

// JOB TEMPLATES APIS
jobRouter.post("/job-template", CreateJobTemplate);
jobRouter.get("/job-template", ReadJobTemplates);
jobRouter.get("/job-template/:templateId", ReadJobTemplateById);
jobRouter.put("/job-template/:templateId", UpdateJobTemplate);
jobRouter.delete("/job-template/:templateId", DeletJobTemplate);
jobRouter.get(
  "/job-template-by-company",
  employerAuthMiddleware,
  ReadJobTemplatesByCompanyType
);

jobRouter.get("/alerts", authenticateToken, getJobAlrtsOfCandidates);
export default jobRouter;
