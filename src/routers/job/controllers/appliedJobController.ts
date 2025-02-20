import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Job from "../models/Job";
import AppliedJobsByCandidateModel from "../models/AppliedJobsByCandidateModel";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const applyForJob = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { jobId } = req.body;

    if (!userId || !jobId) {
      return next(
        createHttpError(400, "Missing required fields: userId or jobId")
      );
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return next(createHttpError(404, "Job not found"));
    }

    // if (new Date(job.deadline) < new Date()) {
    //   return next(
    //     createHttpError(400, "This job is no longer accepting applications")
    //   );
    // }

    const existingAppliedJobs = await AppliedJobsByCandidateModel.find({
      userId,
      jobId,
    });

    if (existingAppliedJobs && existingAppliedJobs.length) {
      return next(
        createHttpError(400, "You have already applied for this job")
      );
    }

    // Create new application
    const newApplication = new AppliedJobsByCandidateModel({
      userId,
      jobId,
      status: "pending",
      applicationDate: new Date(),
      lastStatusUpdate: new Date(),
    });

    await newApplication.save();

    res.status(201).json({
      success: true,
      message: "Job application saved successfully",
      data: newApplication,
    });
  } catch (error) {
    console.log(error);
    return next(
      createHttpError(500, "Server error while processing your application")
    );
  }
};

export const getAppliedJobs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = "1", limit = "10" } = req.query;
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const limitNumber = Number(limit) > 0 ? Number(limit) : 10;
    const skip = (pageNumber - 1) * limitNumber;

    const userId = req.user?.id;

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const matchConditions: Record<string, any> = { userId: userObjectId };

    const dataPipeline: any = [
      {
        $match: matchConditions,
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
        $lookup: {
          from: "employerprofiles",
          localField: "jobDetails.company",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      {
        $unwind: "$companyDetails",
      },
      {
        $project: {
          _id: 1,
          status: 1,
          applicationDate: 1,
          lastStatusUpdate: 1,
          employerNote: 1,
          job: {
            jobId: "$jobDetails._id",
            jobTitle: "$jobDetails.jobTitle",
            location: "$jobDetails.location",
            salaryOption: "$jobDetails.salaryOption",
            minSalary: "$jobDetails.minSalary",
            maxSalary: "$jobDetails.maxSalary",
            customSalary: "$jobDetails.customSalary",
            salaryPeriod: "$jobDetails.salaryPeriod",
            jobType: "$jobDetails.jobType",
            deadline: "$jobDetails.deadline",
            jobRole: "$jobDetails.jobRole",
            companyId: "$companyDetails._id",
            companyName: "$companyDetails.companyName",
            logoUrl: "$companyDetails.logoUrl",
          },
        },
      },
      {
        $sort: {
          applicationDate: -1,
        },
      },
      { $skip: skip },
      { $limit: limitNumber },
    ];

    const countPipeline: any = [
      { $match: matchConditions },
      { $count: "total" },
    ];

    const [countResult, appliedJobs] = await Promise.all([
      AppliedJobsByCandidateModel.aggregate(countPipeline),
      AppliedJobsByCandidateModel.aggregate(dataPipeline),
    ]);

    console.log(countResult);

    res.status(200).json({
      success: true,
      message: "Applied jobs fetched",
      data: {
        appliedJobs,
        pagination: {
          total: countResult[0].total,
          page: pageNumber,
          limit: limitNumber,
          pages: Math.ceil(countResult[0].total / limitNumber),
        },
      },
    });
  } catch (error) {
    next(createHttpError(500, "An error occurred while fetching applied jobs"));
  }
};
