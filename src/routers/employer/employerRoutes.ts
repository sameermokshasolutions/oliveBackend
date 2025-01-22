import express from "express";
import {
  getEmployerProfile,
  updateProfileController,
} from "./employerController/employerProfile";
import { authenticateToken } from "../../middlewares/authMiddleware";
import {
  createJobController,
  getAllJobs,
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

// job CRUD operations
employerRouter.post("/createJob", authenticateToken, createJobController);
employerRouter.get("/getAllJobs", employerAuthMiddleware, getAllJobs);
export default employerRouter;
