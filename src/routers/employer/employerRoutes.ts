import express from "express";
import { updateProfileController } from "./employerController/updateUserProfile";
import { authenticateToken } from "../../middlewares/authMiddleware";
import { createJobController } from "./employerController/createJobController";
const employerRouter = express.Router();
// Route for user registration with validation middleware
employerRouter.post("/updateProfile", authenticateToken, updateProfileController);
employerRouter.post("/createJob", authenticateToken, createJobController);
export default employerRouter;
