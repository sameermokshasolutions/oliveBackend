import AppliedJobs from "../models/AppliedJobs.model";
import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import Job from "../models/Job";

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

    const existingAppliedJobs = await AppliedJobs.findOne({ userId });

    if (existingAppliedJobs) {
      if (existingAppliedJobs.jobId.includes(jobId)) {
        return next(createHttpError(400, "Job has already been applied"));
      }

      existingAppliedJobs.jobId.push(jobId);
      await existingAppliedJobs.save();
    } else {
      const jobApplied = new AppliedJobs({
        userId,
        jobId: [jobId],
      });

      await jobApplied.save();

      res.status(201).json({
        success: true,
        message: "Job application saved successfully",
        data: jobApplied,
      });
    }

    res.status(201).json({
      success: true,
      message: "Job application saved successfully",
      data: existingAppliedJobs,
    });
  } catch (error) {
    next(createHttpError(500, "An error occurred while applying for the job"));
  }
};

export const getAppliedJobs = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  try {
    const AppliedjobsDocument = await AppliedJobs.findOne({ userId });

    if (!AppliedjobsDocument) {
      return next(createHttpError("You have not applied for any job yet"));
    }

    const allAppliedJobByUser = await Job.find({
      _id: { $in: AppliedjobsDocument?.jobId },
    }).populate({
      path: "company",
      select: "companyName aboutUs",
    });

    res.status(200).json({
      success: true,
      message: "Applied Jobs fetched successfully",
      data: allAppliedJobByUser,
    });
  } catch (error) {
    next(createHttpError(500, "An error occurred while fetching applied jobs"));
  }
};
