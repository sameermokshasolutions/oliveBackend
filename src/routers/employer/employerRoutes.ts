import express from "express";

import { updateProfileController } from "./employerController/updateUserProfile";
import { authenticateToken } from "../../middlewares/authMiddleware";

const employerRouter = express.Router();
// Route for user registration with validation middleware
employerRouter.post("/updateProfile", authenticateToken, updateProfileController);


export default employerRouter;
