import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import SavedJob from "../models/savedJobsModel";
import Job from "../models/Job";

export const saveJobs = async (req: any, res: Response, next: NextFunction) => {
  const userId = req?.user?.id;
  const jobId = req.params.id;

  if (!userId) {
    return next(createHttpError(404, "User not found"));
  }

  try {
    const existingJob = await SavedJob.findOne({
      userId,
      savedJobs: { $in: [jobId] },
    });

    if (existingJob) {
      const updatedSavedJob = await SavedJob.findOneAndUpdate(
        { userId },
        { $pull: { savedJobs: jobId } },
        { new: true, upsert: true }
      );

      res.status(200).json({
        success: true,
        message: "Job unsaved successfully",
        data: updatedSavedJob,
      });
    } else {
      const updatedSavedJob = await SavedJob.findOneAndUpdate(
        { userId },
        { $addToSet: { savedJobs: jobId } },
        { new: true, upsert: true }
      );

      res.status(200).json({
        success: true,
        message: "Job saved successfully",
        data: updatedSavedJob,
      });
    }
  } catch (error) {
    return next(createHttpError(400, "Error while saving jobs"));
  }
};

export const getSavedJobs = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;

  if (!userId) {
    return next(createHttpError(400, "User not found"));
  }

  try {
    const savedJobsByUser = await SavedJob.findOne({ userId });

    if (!savedJobsByUser) {
      return next(createHttpError(400, "No saved jobs found"));
    }

    const savedJobsList = savedJobsByUser?.savedJobs;

    const jobs = await Job.find({
      _id: { $in: savedJobsList },
    }).populate({
      path: "company",
      select: "companyName aboutUs",
    });

    res.status(200).json({
      success: true,
      message: "data fetched successfully",
      data: jobs,
    });
  } catch (error) {
    return next(createHttpError(400, `Something went ${error}`));
  }
};
