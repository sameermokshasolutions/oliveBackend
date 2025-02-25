import { NextFunction, RequestHandler, Response } from "express";
import Job, { IJob } from "../../job/models/Job";
import EmployerProfile from "../models/EmployerProfile";
import mongoose from "mongoose";
import { validateJobInput } from "../../../utils/validateJobInputs";
import createHttpError from "http-errors";
import CandidateModel from "../../user/userModals/Candidate";

export const createJob: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
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
      jobData.company = employerProfile._id as any;
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
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const { page = "1", limit = "5", status, jobAvailability } = req.query;

  const pageNumber = Number(page) > 0 ? Number(page) : 1;
  const limitNumber = Number(limit) > 0 ? Number(limit) : 10;
  const skip = (pageNumber - 1) * limitNumber;

  if (!userId) {
    return next(createHttpError(401, "Unauthorized: Missing user ID"));
  }

  try {
    const employerProfile = await EmployerProfile.findOne({ userId });
    if (!employerProfile) {
      return next(createHttpError(403, "Complete your profile"));
    }

    const matchConditions: any = {
      company: employerProfile._id,
    };

    if (status && ["pending", "approved", "reject"].includes(String(status))) {
      matchConditions.jobApprovalStatus = status;
    }
    if (jobAvailability) {
      const currentDate = new Date();
      if (jobAvailability === "active") {
        matchConditions.deadline = { $gt: currentDate };
      } else if (jobAvailability === "expired") {
        matchConditions.deadline = { $lt: currentDate };
      }
    }

    const totalJobs = await Job.countDocuments(matchConditions);

    const appliedUsersByJobId = await Job.aggregate([
      {
        $match: matchConditions,
      },
      {
        $lookup: {
          from: "appliedjobsbycandidatemodels",
          localField: "_id",
          foreignField: "jobId",
          as: "appliedCandidates",
        },
      },
      {
        $addFields: {
          appliedCandidates: { $size: "$appliedCandidates" },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limitNumber },
      {
        $project: {
          _id: 1,
          jobTitle: 1,
          jobRole: 1,
          jobApprovalStatus: 1,
          jobType: 1,
          totalVacancies: 1,
          deadline: 1,
          appliedCandidates: 1,
          numberOfCandidates: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: {
        appliedCandidates: appliedUsersByJobId,
        pagination: {
          total: totalJobs,
          page: pageNumber,
          limit: limitNumber,
          pages: Math.ceil(totalJobs / limitNumber),
        },
      },
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
