import AppliedJobs, { iAppliedJob } from "../models/AppliedJobs.model";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export const applyForJob = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { jobId } = req.body;
    console.log("-------------------------------------", userId);

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
        message: "Job application saved successfully",
        appliedJob: jobApplied,
      });
    }

    res.status(201).json({
      message: "Job application saved successfully",
      appliedJob: existingAppliedJobs,
    });
  } catch (error) {
    next(createHttpError(500, "An error occurred while applying for the job"));
  }
};
