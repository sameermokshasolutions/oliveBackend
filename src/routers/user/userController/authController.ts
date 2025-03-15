import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import User from "../userModals/usermodal";
import { config } from "../../../config/config";
import crypto, { randomInt } from "crypto";
import { emailService } from "../../../services/emailService";

import usermodal from "../userModals/usermodal";
import { forgetPaswordTemplate } from "../../../views/otpTemplate";
import { verificationEmailTemplate } from "../../../views/emailTemplates";

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(createHttpError(404, "User not found"));
    }

    if (!existingUser.emailVerification) {
      try {
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationLink = `${config.frontEndUrl}/verify-email/${verificationToken}`;
        await emailService.sendEmail(
          email,
          "Verify Your Email",
          verificationEmailTemplate(verificationLink)
        );
        existingUser.verificationToken = verificationToken;
        await existingUser.save();
      } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        await User.findByIdAndDelete(existingUser._id);
        return next(createHttpError(500, "Failed to send verification email"));
      }
      return next(
        createHttpError(403, "Please verify your account. Check your email!")
      );
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return next(createHttpError(403, "Wrong password"));
    }

    // Generate a JWT token for the authenticated user with a 10-hour expiration
    const token = jwt.sign(
      { id: existingUser._id, userRole: existingUser.role },
      config.jwtSecret,
      {
        expiresIn: "10h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "lax",
      maxAge: 10 * 60 * 60 * 1000,
      domain: config.env === "production" ? ".hijr.in" : "localhost",
    });
    res.cookie("userRole", existingUser.role, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "lax",
      maxAge: 10 * 60 * 60 * 1000,
      domain: config.env === "production" ? ".hijr.in" : "localhost",
    });

    res.status(200).json({
      success: true,
      userId: existingUser._id,
      userRole: existingUser.role,
      token,
      message: "Login successful",
    });
  } catch (error) {
    next(createHttpError(500, "Internal server error"));
  }
};

export const logoutUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    console.log("Clearing cookies...");

    // Clear cookies
    res.clearCookie("token", {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      domain: config.env === "production" ? ".hijr.in" : "localhost",
    });

    res.clearCookie("userRole", {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      domain: config.env === "production" ? ".hijr.in" : "localhost",
    });

    console.log("Cookies cleared. Sending response.");

    // Send the response
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error during logout:", error);

    // Pass error to next middleware if response hasn't been sent
    if (!res.headersSent) {
      return next(createHttpError(500, "Internal server error"));
    }
  }
};
// forgetPassword

export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log(req.body);

    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      next(createHttpError(404, "User not found with this email address"));
    }

    const otp = randomInt(100000, 999999).toString();

    // Update the user with the new OTP
    await User.findOneAndUpdate(
      { email },
      { $set: { otp, otpExpires: Date.now() + 10 * 60 * 1000 } }
    );

    try {
      await emailService.sendEmail(
        email,
        "Reset Your Password",
        forgetPaswordTemplate(otp)
      );
      console.log("Password reset email sent successfully");
    } catch (emailError) {
      console.error("Error sending password reset email:", emailError);
      next(createHttpError(500, "Failed to send password reset email"));
    }

    // Send a success response to the client
    res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please check your email.",
    });
  } catch (error) {
    next(createHttpError(500, "Internal server error"));
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp } = req.body;
    console.log(email, otp);

    if (!email || !otp) {
      return next(createHttpError(400, "Email and OTP are required"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    if (!user.otp) {
      return next(
        createHttpError(
          400,
          "OTP not found or expired. Please request a new one."
        )
      );
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      return next(
        createHttpError(400, "OTP has expired. Please request a new one.")
      );
    }

    if (user.otp !== otp) {
      return next(createHttpError(400, "Invalid OTP"));
    }

    user.otp = undefined;
    user.otpExpires = undefined;

    // // Set a flag to indicate that the user can reset their password
    // // user.canResetPassword = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    next(createHttpError(500, "Internal server error"));
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;
    console.log(req.body);

    // Validate input
    if (!email || !otp || !newPassword) {
      return next(
        createHttpError(400, "Email, OTP, and new password are required")
      );
    }

    // Find the user by email
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    // Check if OTP exists and is not expired
    if (!user.otp || !user.otpExpires || user.otpExpires < new Date()) {
      return next(
        createHttpError(400, "OTP has expired. Please request a new one.")
      );
    }

    // Verify OTP
    if (user.otp !== otp) {
      return next(createHttpError(400, "Invalid OTP"));
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear OTP-related fields
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    // Send success response
    res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    return next(createHttpError(500, `${error || "something went wrong"}`));
  }
};
