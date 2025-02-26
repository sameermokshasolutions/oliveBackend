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
import {
  getShortListedCandidates,
  scheduleInterview,
  updateScheduledInterview,
} from "./employerController/InterviewScheduleController";
import { validateInterview } from "./validators/validateInterview";
import { validateRequest } from "../../middlewares/validateRequest";

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

// INTERVIEW SCHEDULEING
employerRouter.post(
  "/scheduleInterview",
  validateInterview,
  validateRequest,
  employerAuthMiddleware,
  scheduleInterview
);
employerRouter.get(
  "/shortListedCandidates",
  employerAuthMiddleware,
  getShortListedCandidates
);
employerRouter.post(
  "/updateScheduledInterview",
  employerAuthMiddleware,
  updateScheduledInterview
);

// CANDIDATE SEARCH AND FILTERING
employerRouter.post(
  "/searchCandidate",
  employerAuthMiddleware,
  searchCandidates
);

export default employerRouter;
