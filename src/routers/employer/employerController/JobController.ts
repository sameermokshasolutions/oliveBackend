import { NextFunction, RequestHandler, Response, Request } from "express";
import Job, { IJob } from "../../job/models/Job";
import EmployerProfile from "../models/EmployerProfile";
import mongoose from "mongoose";
import { validateJobInput } from "../../../utils/validateJobInputs";
import createHttpError from "http-errors";
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
      job: job,
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
