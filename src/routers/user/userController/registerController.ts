import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import crypto from "crypto";

import User from "../userModals/usermodal"; // Import the User model
import { emailService } from "../../../services/emailService"; // Service for sending emails
import { verificationEmailTemplate } from "../../../views/emailTemplates"; // Email template for verification
import { config } from "../../../config/config"; // Configuration file

// Ensure that the JWT_SECRET environment variable is set
if (!config.jwtSecret) {
  throw new Error("JWT_SECRET not set in environment variables");
}

// Controller function to handle user registration
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Destructure the user details from the request body
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      role,
      notificationPreference,
    } = req.body;

    // Check if the email is already registered in the database
    const existingUser = await User.findOne({ email });

    // Check if the phone number is already registered in the database
    const existingPhone = await User.findOne({ phoneNumber });
    if (existingUser) {
      return next(createHttpError(409, "Email already registered")); // Conflict error for duplicate email
    }
    if (existingPhone) {
      return next(createHttpError(409, "Phone Number already in Use")); // Conflict error for duplicate phone number
    }

    // Generate a unique user ID by finding the last user and incrementing their ID
    const lastUser = await User.findOne().sort({ userId: -1 });
    const userId = lastUser ? lastUser.userId + 1 : 1000;

    // Hash the user's password using bcrypt for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a random verification token for email verification
    const verificationToken = await crypto.randomBytes(32).toString("hex");

    // Create a new user object with the provided details and set status as inactive
    const user = new User({
      userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      notificationPreference,
      status: "Inactive", // User is inactive until email is verified
      accountStatus: "Inactive", // Account is inactive until verified
      verificationToken, // Store the verification token
    });

    // Save the new user to the database
    await user.save();

    // Generate a verification link using the frontend URL and the verification token
    const verificationLink = `${config.frontEndUrl}/verify-email/${verificationToken}`;

    // Attempt to send a verification email
    try {
      await emailService.sendEmail(
        email,
        "Verify Your Email",
        verificationEmailTemplate(verificationLink)
      );
      console.log("Verification email sent successfully");
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      await User.findByIdAndDelete(user._id);
      return next(createHttpError(500, "Failed to send verification email"));
    }

    // Prepare the user response by excluding sensitive fields like password
    const userResponse = user.toObject();
    userResponse.password = "";

    // Send a success response to the client
    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email to verify your account.",
      data: userResponse,
    });
  } catch (error) {
    return next(createHttpError(500, "Internal server error")); // Pass any error to the global error handling middleware
  }
};

// Controller function to handle email verification
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract the verification token from the request body
    const { token } = req.body;
    console.log(token);

    // Find the user associated with the verification token
    const user = await User.findOne({ verificationToken: token });

    // If no user is found or the token is invalid, throw an error
    if (!user) {
      return next(
        createHttpError(401, "Invalid or expired verification token")
      );
    }

    user.emailVerification = true;
    user.verificationToken = undefined;
    user.status = "Active";
    await user.save();

    // Send a success response to the client
    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    return next(createHttpError(500, "Internal server error"));
  }
};
