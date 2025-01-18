import { NextFunction, RequestHandler, Response } from "express";
import Job, { IJob } from "../../job/models/Job";
import EmployerProfile from "../models/EmployerProfile";
import mongoose from "mongoose";
import { validateJobInput } from "../../../utils/validateJobInputs";
import createHttpError from "http-errors";
import AppliedJobsByCandidateModel from "../../job/models/AppliedJobsByCandidateModel";

export const createJobController: RequestHandler = async (
  req: any,
  res,
  next
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
      jobData.company = employerProfile._id as mongoose.Schema.Types.ObjectId;
    } else {
      return next(createHttpError(404, "Employer profile not found"));
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

export const getMyJobsController: any = async (
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
      return next(createHttpError(401, "Employer profile not found"));
    }

    // Fetch all jobs associated with the employer
    const jobs = await Job.find({ company: employerProfile._id });

    if (jobs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No jobs found for this employer",
        data: [],
      });
    }

    const appliedUsersByJobId = await AppliedJobsByCandidateModel.aggregate([
      {
        $match: {
          jobId: { $in: jobs.map((job) => job._id) },
        },
      },
      {
        $unwind: "$jobId",
      },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      {
        $unwind: "$jobDetails",
      },
      {
        $group: {
          _id: "$jobId",
          appliedUsers: { $push: "$userId" },
          jobDetails: { $first: "$jobDetails" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: appliedUsersByJobId,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return next(createHttpError(500, "An error occurred while fetching jobs"));
  }
};

export const getAllJobs: any = async (
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
      return res.status(200).json({
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
    console.error("Error fetching jobs:", error);
    return next(createHttpError(500, "An error occurred while fetching jobs"));
  }
};
