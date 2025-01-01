import express from "express";
import {
  candidateInfoValidation,
  employerInfoValidation,
  loginValidation,
  registerValidation,
} from "./validator/userValidators"; // Import validation middlewares for different routes
import { validateRequest } from "../../middlewares/validateRequest"; // Middleware to validate incoming requests
import { registerUser } from "./userController/registerController"; // Controller for user registration
import {
  forgetPassword,
  loginUser,
  logoutUser,
  resetPassword,
  verifyOtp,
} from "./userController/authController"; // Controller for user login
import {
  employerProfile,
  getUserProfile,
  profileUpdate,
  removeProfileUrl,
  resumeUpdate,
  updateUserFile,
  updateUserProfile,
} from "./userController/profile"; // Controllers for various user profile operations
import { upload } from "../../middlewares/uploadMiddleware"; // Middleware for handling file uploads
import { authenticateToken } from "../../middlewares/authMiddleware"; // Middleware for token authentication
import {
  getJobById,
  getJobs,
  getPublicJobById,
  getPublicJobs,
} from "../job/controllers/jobs";

const userRouter = express.Router(); // Initialize the Express router for user-related routes

// Route for user registration with validation middleware
// Validates the registration data before passing it to the controller
userRouter.post(
  "/register",
  ...registerValidation,
  validateRequest,
  registerUser
);

// Route for user login with validation middleware
// Validates login credentials before passing them to the login controller
userRouter.post("/verify-otp", validateRequest, verifyOtp);
userRouter.post("/reset-password", validateRequest, resetPassword);
userRouter.post("/forgot-password", validateRequest, forgetPassword);
userRouter.post("/login", ...loginValidation, validateRequest, loginUser);
userRouter.post("/logout", validateRequest, logoutUser);

// Route to upload a user's profile picture (currently not in use)
// Requires the user to be authenticated and handles single file upload
userRouter.post(
  "/upload-profile",
  authenticateToken,
  upload.single("profilePicture"),
  profileUpdate
);

// Route to upload a user's resume (currently not in use)
// Requires authentication and handles single file upload for the user's resume
userRouter.post(
  "/upload-resume",
  authenticateToken,
  upload.single("resume"),
  resumeUpdate
);

// Route to upload additional user-related files
// Requires the user to be authenticated
userRouter.post("/uploadUserFile", authenticateToken, updateUserFile);

// Route to remove a user's profile picture
// Requires the user to be authenticated
userRouter.post("/removeProfilePicture", authenticateToken, removeProfileUrl);

// Route to retrieve the profile data of a user
// Requires authentication to access the user's profile
userRouter.get("/userProfile", authenticateToken, getUserProfile);



// Route to update the user's profile information
// Validates candidate-specific fields and requires the user to be authenticated
userRouter.post(
  "/userProfileUpdate",
  authenticateToken,
  candidateInfoValidation,
  updateUserProfile
);

// Route to update the employer's profile information
// Validates employer-specific fields and requires the user to be authenticated
userRouter.post(
  "/employer-profile",
  authenticateToken,
  employerInfoValidation,
  employerProfile
);

export default userRouter; // Export the userRouter for use in the main application
