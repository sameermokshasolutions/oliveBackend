import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createJob } from "./controllers/jobController";
import { createJobValidator } from "./validators/jobValidator";
import { authenticateToken } from "../../middlewares/authMiddleware";
import {
  getJobById,
  getJobs,
  getPublicJobById,
  getPublicJobs,
} from "./controllers/jobs";

const jobRouter = express.Router();
jobRouter.post("/jobs", createJobValidator, validateRequest, createJob);
// jobRouter.post("/jobsdata", createJobValidator, validateRequest, jobsdata);

jobRouter.get("/jobs", authenticateToken, getJobs);
jobRouter.get("/jobs/:id", authenticateToken, getJobById);
jobRouter.get("/public/jobs", getPublicJobs);
jobRouter.get("/public/jobs/:id", getPublicJobById);

export default jobRouter;
