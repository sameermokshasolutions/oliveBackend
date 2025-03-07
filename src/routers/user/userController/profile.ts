import { RequestHandler, Response } from "express";
import { getUserId } from "../../../utils/getUserIdFromJwt";
import createHttpError from "http-errors";
import fs from "fs";
import path from "path";
import CandidateInfo from "../userModals/Candidate";
import { logProfileActivity } from "../../../utils/activityLogger";
import { checkUpdate } from "../../../utils/checkUpdate";
import { EmployerInfo } from "../userModals/EmployerInfo";
import usermodal from "../userModals/usermodal";
import { NextFunction } from "express";

// Handler to update or create candidate profile with profile picture
export const profileUpdate: RequestHandler = async (
  req: any,
  res,
  next: NextFunction
) => {
  try {
    // Extract user ID from JWT
    const userId = req.user.id;
    if (!userId) {
      return next(createHttpError(409, "Something Went Wrong"));
    }
    // Access uploaded file if present and create profile URL
    const profileUrl = req.file
      ? `/uploads/${userId}/${req.file.filename}`
      : "";
    // Check if candidate profile exists
    const candidate = await CandidateInfo.findOne({ userId });
    if (candidate) {
      // Update existing profile with new profile picture URL
      if (profileUrl) {
        console.log("profileUrl", profileUrl);
        // Delete previous profile picture if exists
        const previousProfileUrl = candidate.profileUrl;
        if (previousProfileUrl) {
          const previousFilePath = path.join(
            __dirname,
            "..",
            "..",
            "..",
            "..",
            "public",
            previousProfileUrl
          );
          fs.unlink(previousFilePath, (err) => {
            if (err) {
              console.error("Error deleting previous profile picture:", err);
            }
          });
        }
        // Update profile URL in database
        candidate.profileUrl = profileUrl;
        await candidate.save();
      }
      res
        .status(200)
        .json({ message: "Profile updated successfully", profileUrl });
    } else {
      // Create a new profile if it doesn't exist
      const newCandidate = new CandidateInfo({ userId, profileUrl });
      await newCandidate.save();
      res
        .status(201)
        .json({ message: "Profile created successfully", profileUrl });
    }
  } catch (error) {
    next(error);
  }
};

// Handler to update or create candidate resume
export const resumeUpdate: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  try {
    // Extract user ID from JWT
    const userId = getUserId(req);
    console.log("userId", userId);

    if (!userId) {
      return next(createHttpError(409, "Something Went Wrong"));
    }

    // Access uploaded resume file if present
    const resumeUrl = req.file ? `/uploads/${userId}/${req.file.filename}` : "";
    console.log("--------->> resume URL", resumeUrl);

    // Check if candidate resume already exists
    const candidate = await CandidateInfo.findOne({ userId });

    if (candidate) {
      // Update resume URL if a new resume was uploaded
      if (resumeUrl) {
        console.log("resumeUrl", resumeUrl);

        // Delete previous resume file if it exists
        const previousresumeUrl = candidate.resumeUrl;
        if (previousresumeUrl) {
          const previousFilePath = path.join(
            __dirname,
            "..",
            "..",
            "..",
            "..",
            "public",
            previousresumeUrl
          );
          fs.unlink(previousFilePath, (err) => {
            if (err) {
              console.error("Error deleting previous resume picture:", err);
            }
          });
        }

        // Update resume URL in database
        candidate.resumeUrl = resumeUrl;
        await candidate.save();
      }
      res
        .status(200)
        .json({ message: "resume updated successfully", resumeUrl });
    } else {
      // Create a new resume if candidate does not exist
      const newCandidate = new CandidateInfo({ userId, resumeUrl });
      await newCandidate.save();
      res
        .status(201)
        .json({ message: "resume created successfully", resumeUrl });
    }
  } catch (error) {
    next(error);
  }
};

// Type definition for the request body
interface CandidateInfoBody {
  profileUrl?: string;
  resumeUrl?: string;
  skills?: string[];
  experience_years?: number;
  certifications?: string[];
  job_preferences?: string[];
  job_role_preferences?: string;
  languages_spoken?: string[];
  video_portfolio_url?: string;
  expected_salary?: number;
  profile_status?: "complete" | "incomplete";
  awards_and_honors?: string[];
  candidateInfo_visibility?: "public" | "private";
  preferred_job_location?: string[];
  relocation_preference?: boolean;
  premium_service_active?: boolean;
  education?: Array<{
    name: string;
    university?: string;
    institute: string;
    startYear: string;
    passingYear: string;
    status: "pass" | "fail" | "ongoing";
    cgpa?: string;
    percentage?: string;
  }>;
  experience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    jobDescription: string;
    employmentType: "fulltime" | "parttime" | "contract" | "internship";
    currentlyWorking: boolean;
    jobLocation: string;
  }>;
}

// Route handler to get the consolidated data
export const updateUserFile = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  console.log(req.body);

  try {
    // console.log('------------------------------------------>>', );

    // Extract user ID from JWT
    const userId = req.user.id;
    if (!userId) {
      throw createHttpError(401, "Unauthorized: User ID not found");
    }

    const { fileurl, type } = req.body;
    if (!fileurl) {
      throw createHttpError(400, "Profile URL is required");
    }

    console.log("Received userId:", userId, "Profile URL:", fileurl);

    // Check if candidate information exists
    const candidate = await CandidateInfo.findOne({ userId });

    if (candidate) {
      // Update the profile URL
      if (type == "pdf") {
        candidate.resumeUrl = fileurl;
      } else if (type == "img") {
        candidate.profileUrl = fileurl;
      } else {
        throw createHttpError(400, "Invalid File type ");
      }
      await candidate.save();
      console.log("Candidate profile updated:", candidate);
    } else {
      // Create a new record with default values and the provided profile URL
      let newCandidate;
      if (type == "pdf") {
        newCandidate = new CandidateInfo({
          userId,
          resumeUrl: fileurl,
        });
      } else {
        newCandidate = new CandidateInfo({
          userId,
          profileUrl: fileurl,
        });
      }

      await newCandidate.save();
      console.log("New candidate profile created:", newCandidate);
    }

    // Return a success response
    return res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    next(error instanceof Error ? createHttpError(500, error.message) : error);
  }
};
export const removeProfileUrl = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  try {
    // Extract user ID from JWT
    const userId = getUserId(req);
    if (!userId) {
      throw createHttpError(401, "Unauthorized: User ID not found");
    }

    // Check if candidate information exists
    const candidate = await CandidateInfo.findOne({ userId });
    if (candidate) {
      // Update the profile URL
      candidate.profileUrl = "";
      await candidate.save();
    }
    // Return a success response
    return res
      .status(200)
      .json({ success: true, message: "Profile removed successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    next(error instanceof Error ? createHttpError(500, error.message) : error);
  }
};
export const getUserProfile = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  try {
    // Extract user ID from JWT
    const userId = req.user.id;
    if (!userId) {
      throw createHttpError(401, "Unauthorized: User ID not found");
    }

    // Check if candidate information exists
    const candidate = await CandidateInfo.findOne({ userId });
    const userData = await usermodal
      .findOne({ _id: userId })
      .select("-password -otp -otpExpires ");

    // Consolidate data into a single object
    const consolidatedData = {
      ...(candidate?.toObject() || {}), // Convert Mongoose document to a plain object
      ...(userData?.toObject() || {}), // Convert Mongoose document to a plain object
    };

    // Return the consolidated data
    return res.status(200).json({
      success: true,
      message: "profile data fetched successfully",
      data: consolidatedData,
    });
  } catch (error) {
    next(error instanceof Error ? createHttpError(500, error.message) : error);
  }
};

// Route handler to update or create candidate detailed information
export const updateUserProfile: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createHttpError(401, "Unauthorized: User ID not found");
    }

    const requestBody = req.body;

    // Fields belonging to the User model
    const userFields = ["firstName", "lastName"]; // Update with actual User fields

    // Separate fields for User and CandidateInfo models
    const userUpdates = Object.fromEntries(
      Object.entries(requestBody).filter(([key]) => userFields.includes(key))
    );
    const candidateUpdates = Object.fromEntries(
      Object.entries(requestBody).filter(([key]) => !userFields.includes(key))
    );

    // Update User model
    const userPromise = await usermodal.findByIdAndUpdate(userId, userUpdates, {
      new: true,
      runValidators: true,
    });

    // Update or create CandidateInfo model
    const candidatePromise = await CandidateInfo.findOneAndUpdate(
      { userId },
      candidateUpdates,
      { new: true, upsert: true, runValidators: true }
    );

    // Wait for both operations to complete
    const [updatedUser, updatedCandidate] = await Promise.all([
      userPromise,
      candidatePromise,
    ]);

    // Log activity (example: only for updates)
    if (updatedCandidate) {
      await logProfileActivity(
        userId,
        updatedCandidate,
        updatedCandidate.isNew ? "created" : "updated",
        candidateUpdates,
        "candidateInfo"
      );
    }

    res.status(200).json({
      message: "Profile updated successfully",
      data: {
        user: updatedUser,
        candidateInfo: updatedCandidate,
      },
    });
  } catch (error) {
    next(error instanceof Error ? createHttpError(500, error.message) : error);
  }
};

// Handler to update or create employer profile
export const employerProfile: RequestHandler = async (
  req,
  res,
  next: NextFunction
): Promise<void> => {
  const { ...profileData } = req.body;
  const userId = getUserId(req);
  if (!userId) {
    return next(createHttpError(401, "Something Went Wrong !"));
  }
  try {
    // Check if employer profile exists
    const existingProfile = await EmployerInfo.findOne({ userId });
    if (existingProfile) {
      // Update existing employer profile
      const updatedProfile = await EmployerInfo.findByIdAndUpdate(
        existingProfile._id,
        profileData,
        {
          new: true,
        }
      );
      await logProfileActivity(
        userId,
        existingProfile,
        "updated",
        profileData,
        "employerInfo"
      );
      res.status(200).json({
        message: "Profile updated successfully",
        profile: updatedProfile,
      });
    } else {
      // Log and create a new employer profile if not found
      await logProfileActivity(
        userId,
        {},
        "updated",
        profileData,
        "employerInfo"
      );
      const newProfile = new EmployerInfo({ userId, ...profileData });
      await newProfile.save();
      res
        .status(200)
        .json({ message: "Profile created successfully", profile: newProfile });
    }
  } catch (error) {
    next(error instanceof Error ? createHttpError(500, error.message) : error);
  }
};
