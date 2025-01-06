import express from "express";
import { updateProfileController } from "./employerController/updateUserProfile";
import { authenticateToken } from "../../middlewares/authMiddleware";
import {
  createJobController,
  getMyJobsController,
} from "./employerController/createJobController";
const employerRouter = express.Router();
// Route for user registration with validation middleware
employerRouter.post(
  "/updateProfile",
  authenticateToken,
  updateProfileController
);

employerRouter.post("/createJob", authenticateToken, createJobController);
employerRouter.get("/allJobsPostedByEmployer",authenticateToken, getMyJobsController);
export default employerRouter;
