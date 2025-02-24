import { NextFunction, RequestHandler, Response, Request } from "express";
import CandidateModel from "../../user/userModals/Candidate";

import createHttpError from "http-errors";
import AppliedJobsByCandidateModel from "../../job/models/AppliedJobsByCandidateModel";
import mongoose from "mongoose";

export const getAppliedCandidates: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = req.params;

    const documents = await AppliedJobsByCandidateModel.find({
      jobId,
    }).select("userId");

    const userIds = documents.map((doc) => doc.userId);

    if (userIds.length === 0) {
      res.status(200).json({
        success: true,
        message: "No candidate applied to this job",
        data: null,
      });
    }

    const result = await CandidateModel.find({
      userId: { $in: userIds },
    })
      .select("userId email experienceYears resumeUrl profileUrl availability")
      .populate({
        path: "userId",
        select: "firstName lastName -_id",
      });

    res.status(200).json({
      success: true,
      message: "Applications",
      data: result,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while getting applicants"));
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

