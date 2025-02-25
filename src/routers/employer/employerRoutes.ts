import express from "express";
import {
  getEmployerProfile,
  updateProfileController,
} from "./employerController/employerProfileController";
import { authenticateToken } from "../../middlewares/authMiddleware";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  UpdateJob,
} from "./employerController/JobController";
import { employerAuthMiddleware } from "../../middlewares/emplyerAuthMiddleware";
import {
  getAppliedCandidatesByJobId,
  searchCandidates,
  updateApplicationStatus,
} from "./employerController/candidatesController";
import { scheduleInterview } from "./employerController/InterviewScheduleController";
const employerRouter = express.Router();

// Route for user registration with validation middleware
employerRouter.post(
  "/updateProfile",
  authenticateToken,
  updateProfileController
);
employerRouter.get(
  "/getEmployerProfile",
  authenticateToken,
  getEmployerProfile
);

// JOB CRUD OPERATIONS
employerRouter.post("/createJob", authenticateToken, createJob);
employerRouter.get("/job/:jobId", employerAuthMiddleware, getJobById);
employerRouter.put("/job/:jobId", employerAuthMiddleware, UpdateJob);
employerRouter.delete("/job/:jobId", employerAuthMiddleware, deleteJob);
employerRouter.get("/getAllJobs", employerAuthMiddleware, getAllJobs);

// CANDIDATES
employerRouter.get(
  "/AppliedCandidates/:jobId",
  employerAuthMiddleware,
  getAppliedCandidatesByJobId
);
employerRouter.post(
  "/updateApplicationStatus",
  employerAuthMiddleware,
  updateApplicationStatus
);

employerRouter.post(
  "/scheduleInterview",
  employerAuthMiddleware,
  scheduleInterview
);

// CANDIDATE SEARCH AND FILTERING
employerRouter.post(
  "/searchCandidate",
  employerAuthMiddleware,
  searchCandidates
);
export default employerRouter;
