import express from "express";
import {
  getEmployerProfile,
  updateProfileController,
} from "./employerController/employerProfile";
import { authenticateToken } from "../../middlewares/authMiddleware";
import {
  createJob,
  getAllJobs,
  getJobById,
  UpdateJob,
} from "./employerController/JobController";
import { employerAuthMiddleware } from "../../middlewares/emplyerAuthMiddleware";
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

// Job CRUD operations
employerRouter.post("/createJob", authenticateToken, createJob);
employerRouter.get("/getAllJobs", employerAuthMiddleware, getAllJobs);
employerRouter.get("/job/:jobId", employerAuthMiddleware, getJobById);
employerRouter.put("/job/:jobId", employerAuthMiddleware, UpdateJob);
export default employerRouter;
