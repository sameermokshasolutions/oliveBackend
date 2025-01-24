import { NextFunction, RequestHandler, Response, Request } from "express";
import Job, { IJob } from "../../job/models/Job";
import EmployerProfile from "../models/EmployerProfile";
import mongoose from "mongoose";
import { validateJobInput } from "../../../utils/validateJobInputs";
import createHttpError from "http-errors";
import CandidateModel, { CandidateSearchFilters } from "../../user/userModals/Candidate";
// import AppliedJobsByCandidateModel from "../../job/models/AppliedJobsByCandidateModel";

export const createJob: RequestHandler = async (req: any, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  try {
    const jobData: Partial<IJob> = req.body;

    const validationError = validateJobInput(jobData);
    if (validationError) {
      return next(createHttpError(400, `${validationError}`));
    }

    const employerProfile = await EmployerProfile.findOne({ userId });

    if (employerProfile) {
      jobData.company = employerProfile._id as mongoose.Schema.Types.ObjectId;
    } else {
      return next(createHttpError(404, "complete employer profile"));
    }

    const newJob = new Job(jobData);
    await newJob.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while creating job"));
  }
};

export const getAllJobs = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(createHttpError(401, "Unauthorized: Missing user ID"));
  }

  try {
    // Find the employer's profile based on the userId
    const employerProfile = await EmployerProfile.findOne({ userId });
    if (!employerProfile) {
      return next(createHttpError(404, "Employer profile not found"));
    }

    // Fetch all jobs associated with the employer
    const jobs = await Job.find({ company: employerProfile._id });

    if (jobs.length === 0) {
      res.status(200).json({
        success: true,
        message: "No jobs found for this employer",
        data: [],
      });
    }

    const appliedUsersByJobId = await Job.aggregate([
      {
        $match: {
          company: employerProfile._id,
        },
      },
      {
        $lookup: {
          from: "appliedjobsbycandidatemodels",
          localField: "_id",
          foreignField: "appliedJobs.jobId",
          as: "appliedCandidates",
        },
      },
      {
        $addFields: {
          appliedCandidates: {
            $map: {
              input: "$appliedCandidates",
              as: "candidate",
              in: "$$candidate.userId",
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: appliedUsersByJobId,
    });
  } catch (error) {
    return next(createHttpError(500, "An error occurred while fetching jobs"));
  }
};

export const getJobById = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { jobId } = req.params;

    if (!userId) {
      return next(createHttpError(401, "Unauthorized"));
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return next(createHttpError(400, "Invalid job ID"));
    }

    const employerProfile = await EmployerProfile.findOne({ userId });
    if (!employerProfile) {
      return next(createHttpError(404, "Employer profile not found"));
    }

    const job = await Job.findOne({
      _id: jobId,
      company: employerProfile._id,
    });

    if (!job) {
      return next(createHttpError(404, "Job not found"));
    }

    res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      data: job,
    });
  } catch (error) {
    return next(createHttpError(500, "Error fetching job"));
  }
};

export const UpdateJob = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { jobId } = req.params;
    const jobData: IJob = req.body;

    if (!userId) {
      return next(createHttpError(401, "Unauthorized"));
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return next(createHttpError(400, "Invalid job ID"));
    }

    const employerProfile = await EmployerProfile.findOne({ userId });
    if (!employerProfile) {
      return next(createHttpError(404, "Employer profile not found"));
    }

    const job = await Job.findOne({
      _id: jobId,
      company: employerProfile._id,
    });

    if (!job) {
      return next(createHttpError(404, "Job not found"));
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, jobData, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) {
      return next(createHttpError(404, "Job not found"));
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    return next(createHttpError(500, "Error updating job"));
  }
};

export const deleteJob = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { jobId } = req.params;

    if (!userId) {
      return next(createHttpError(401, "Unauthorized"));
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return next(createHttpError(400, "Invalid job ID"));
    }

    const employerProfile = await EmployerProfile.findOne({ userId });
    if (!employerProfile) {
      return next(createHttpError(404, "Employer profile not found"));
    }

    const job = await Job.findOne({
      _id: jobId,
      company: employerProfile._id,
    });

    if (!job) {
      return next(createHttpError(404, "Job not found"));
    }

    await Job.findByIdAndDelete(jobId);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      data: [],
    });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error deleting job"));
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
          foreignField: "userId",
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
