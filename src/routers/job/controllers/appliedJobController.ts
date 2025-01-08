import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import Job from "../models/Job";
import AppliedJobsByCandidateModel from "../models/AppliedJobsByCandidateModel";

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

    const existingAppliedJobs = await AppliedJobsByCandidateModel.findOne({
      userId,
    });

    if (existingAppliedJobs) {
      if (
        existingAppliedJobs.appliedJobs.some(
          (job) => job.jobId.toString() === jobId.toString()
        )
      ) {
        return next(createHttpError(400, "Job has already been applied"));
      }

      existingAppliedJobs.appliedJobs.push({ jobId });
      await existingAppliedJobs.save();
    } else {
      const jobApplied = new AppliedJobsByCandidateModel({
        userId,
        appliedJobs: [{ jobId }],
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
    return next(
      createHttpError(500, "An error occurred while applying for the job")
    );
  }
};

export const getAppliedJobs = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  try {
    const AppliedjobsDocument = await AppliedJobsByCandidateModel.findOne({
      userId,
    });

    if (!AppliedjobsDocument) {
      return next(createHttpError("You have not applied for any job yet"));
    }

    const allAppliedJobByUser = await Job.find({
      _id: { $in: AppliedjobsDocument?.appliedJobs.map((job) => job.jobId) },
    }).populate({
      path: "company",
      select: "companyName aboutUs",
    });

    const jobsWithDateOfApplication = allAppliedJobByUser.map((job) => {
      const jobwithDate: any = {};
      const appliedJob = AppliedjobsDocument.appliedJobs.find(
        (appliedJob) => appliedJob.jobId.toString() === job._id?.toString()
      );

      if (appliedJob) {
        jobwithDate.dateOfApplication = appliedJob.createdAt;
        jobwithDate.hasApplied = true;
      }

      return {
        ...job.toObject(),
        ...(jobwithDate ?? {}),
      };
    });

    res.status(200).json({
      success: true,
      message: "Applied Jobs fetched successfully",
      data: jobsWithDateOfApplication,
    });
  } catch (error) {
    next(createHttpError(500, "An error occurred while fetching applied jobs"));
  }
};
