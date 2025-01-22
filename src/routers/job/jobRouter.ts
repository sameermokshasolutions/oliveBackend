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

export default jobRouter;
