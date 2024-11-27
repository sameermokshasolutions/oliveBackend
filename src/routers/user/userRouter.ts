import express from "express";
import { candidateInfoValidation, employerInfoValidation, loginValidation, registerValidation } from "./validator/userValidators";
import { validateRequest } from "../../middlewares/validateRequest";
import { registerUser } from "./userController/registerController";
import { loginUser } from "./userController/loginController";
import { employerProfile, getUserProfile, profileUpdate, removeProfileUrl, resumeUpdate, updateUserFile, updateUserProfile } from "./userController/profile";

import { upload } from "../../middlewares/uploadMiddleware";
import { authenticateToken } from "../../middlewares/authMiddleware";
const userRouter = express.Router();
// Route for user registration with validation middleware
userRouter.post("/register", ...registerValidation, validateRequest, registerUser);
// Route for user login with validation middleware
userRouter.post("/login", ...loginValidation, validateRequest, loginUser);
// Route to upload a user's profile picture (currently not in use)
userRouter.post('/upload-profile', authenticateToken, upload.single('profilePicture'), profileUpdate);
// Route to upload a user's resume (currently not in use)
userRouter.post('/upload-resume', authenticateToken, upload.single('resume'), resumeUpdate);
// Route to get data about user 
userRouter.post('/uploadUserFile', authenticateToken, updateUserFile);
userRouter.post('/removeProfilePicture', authenticateToken, removeProfileUrl);
userRouter.get('/userProfile', authenticateToken, getUserProfile);
userRouter.post('/userProfileUpdate', authenticateToken, candidateInfoValidation, updateUserProfile);
// Route to update employer profile with validation and authentication
userRouter.post('/employer-profile', authenticateToken, employerInfoValidation, employerProfile);

export default userRouter;
