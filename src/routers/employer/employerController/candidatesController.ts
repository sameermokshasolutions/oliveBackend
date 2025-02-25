import { NextFunction, RequestHandler, Response, Request } from "express";
import CandidateModel from "../../user/userModals/Candidate";
import Job from "../../job/models/Job";
import createHttpError from "http-errors";
import AppliedJobsByCandidateModel from "../../job/models/AppliedJobsByCandidateModel";
import mongoose from "mongoose";

export const getAppliedCandidatesByJobId: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = req.params;
    const { status = "pending" } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return next(createHttpError(401, "Unauthorized Access"));
    }

    const isJobOwnedByEmployer = await Job.checkJobOwnership(
      new mongoose.Types.ObjectId(userId),
      new mongoose.Types.ObjectId(jobId)
    );

    if (!isJobOwnedByEmployer) {
      return next(createHttpError(403, "This job is owned by other employer"));
    }

    const jobObjectId = new mongoose.Types.ObjectId(jobId);

    const matchConditions: any = { jobId: jobObjectId };

    if (status) {
      matchConditions.status = status;
    }

    const data = await AppliedJobsByCandidateModel.aggregate([
      {
        $match: matchConditions,
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "userBasicInfo",
        },
      },
      {
        $unwind: "$userBasicInfo",
      },
      {
        $lookup: {
          from: "candidates",
          foreignField: "userId",
          localField: "userId",
          as: "otherInfo",
        },
      },
      {
        $unwind: "$otherInfo",
      },
      {
        $sort: { applicationDate: -1 },
      },
      {
        $project: {
          status: 1,
          applicationDate: 1,
          userId: 1,
          jobId: 1,
          firstName: "$userBasicInfo.firstName",
          lastName: "$userBasicInfo.lastName",
          email: "$userBasicInfo.email",
          resumeUrl: "$otherInfo.resumeUrl",
          experienceYears: "$otherInfo.experienceYears",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Applications",
      data: data,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while getting applicants"));
  }
};

// Define the valid status types for better type safety
type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "rejected"
  | "hired";

// Define the status transition map
const statusTransitionMap: Record<ApplicationStatus, ApplicationStatus[]> = {
  pending: ["reviewed", "shortlisted", "rejected"],
  reviewed: ["shortlisted", "rejected"],
  shortlisted: ["hired", "rejected"],
  rejected: [],
  hired: [],
};

export const updateApplicationStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, applicationId, note } = req.body;

    if (!status || !applicationId) {
      return next(
        createHttpError(400, "Status and application ID are required")
      );
    }

    if (!Object.keys(statusTransitionMap).includes(status)) {
      return next(createHttpError(400, "Invalid status value"));
    }

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return next(createHttpError(400, "Invalid application ID format"));
    }

    const application = await AppliedJobsByCandidateModel.findById(
      applicationId
    );

    if (!application) {
      return next(createHttpError(404, "Application not found"));
    }

    const job = await mongoose.model("Job").findById(application.jobId);

    if (!job) {
      return next(createHttpError(404, "Associated job not found"));
    }

    const currentStatus = application.status as ApplicationStatus;
    const newStatus = status as ApplicationStatus;

    if (!statusTransitionMap[currentStatus].includes(newStatus)) {
      return next(
        createHttpError(
          403,
          `Cannot update from '${currentStatus}' to '${newStatus}' status`
        )
      );
    }

    // Process note
    const sanitizedNote = note?.trim() || "";

    // Update status
    await application.updateStatus(newStatus, sanitizedNote);

    res.status(200).json({
      success: true,
      message: `Application status updated to '${newStatus}' successfully`,
      data: {
        applicationId,
        previousStatus: currentStatus,
        currentStatus: newStatus,
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return next(
      createHttpError(
        500,
        error instanceof Error
          ? error.message
          : "Failed to update application status"
      )
    );
  }
};

export const searchCandidates = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = req.body;
    const pipeline: mongoose.PipelineStage[] = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
    ];

    const matchStage: mongoose.PipelineStage.Match = { $match: {} };

    const filterMapping = {
      skills: "skills.value",
      jobPreferences: "jobPreferences.value",
      jobRolePreferences: "jobRolePreferences.value",
      preferredJobLocation: "preferredJobLocation.value",
      languages: "languages.value",
    };

    Object.entries(filterMapping).forEach(([key, path]) => {
      if (filters[key] && filters[key].length > 0) {
        matchStage.$match[path] = { $in: filters[key] };
      }
    });

    if (filters.experienceYears) {
      matchStage.$match.experienceYears = {
        ...(filters.experienceYears.min !== undefined
          ? { $gte: filters.experienceYears.min }
          : {}),
        ...(filters.experienceYears.max !== undefined
          ? { $lte: filters.experienceYears.max }
          : {}),
      };
    }

    ["educationLevel", "availability", "gender", "expectedSalary"].forEach(
      (field) => {
        if (filters[field]) {
          matchStage.$match[field] = filters[field];
        }
      }
    );

    if (Object.keys(matchStage.$match).length > 0) {
      pipeline.push(matchStage);
    }

    const page = Math.max(1, parseInt(req.body.page) || 1);
    const limit = Math.max(1, parseInt(req.body.limit) || 10);
    const skip = (page - 1) * limit;

    pipeline.push({
      $project: {
        firstname: {
          $ifNull: ["$firstname", "$userDetails.firstName", "N/A"],
        },
        lastname: {
          $ifNull: ["$lastname", "$userDetails.lastName", "N/A"],
        },
        email: {
          $ifNull: ["$email", "$userDetails.email", "N/A"],
        },
        phoneNumber: {
          $ifNull: ["$phoneNumber", "$userDetails.phoneNumber", "N/A"],
        },
        skills: { $ifNull: ["$skills", []] },
        experienceYears: { $ifNull: ["$experienceYears", 0] },
        experienceList: { $ifNull: ["$experienceList", []] },
        educationList: { $ifNull: ["$educationList", []] },
        preferredJobLocation: { $ifNull: ["$preferredJobLocation", []] },
        profileUrl: {
          $ifNull: ["$profileUrl", "$userDetails.profilePictureUrl", ""],
        },
      },
    });

    pipeline.push({ $skip: skip }, { $limit: limit });

    const [candidates, countResult] = await Promise.all([
      CandidateModel.aggregate(pipeline),
      CandidateModel.aggregate([
        ...pipeline.slice(0, -2),
        { $count: "totalCount" },
      ]),
    ]);

    const totalMatchingCandidates = countResult[0]?.totalCount || 0;

    res.json({
      candidates,
      totalCandidates: totalMatchingCandidates,
      page,
      limit,
      totalPages: Math.ceil(totalMatchingCandidates / limit),
    });
  } catch (error) {
    console.error("Candidate search error:", error);
    next(createHttpError(500, "Error searching candidates"));
  }
};
