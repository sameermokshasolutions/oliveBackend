// import Education from '../../admin/models/Education.js';
import { NextFunction, Request, Response } from "express";
import Job, { IJob } from "../models/Job";
import createHttpError from "http-errors";

export const createJob = async (req: Request, res: Response) => {
  try {
    const jobData: IJob = req.body;
    const newJob = new Job(jobData);
    await newJob.save();
    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating job", error });
  }
};

export const UpdateJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = req.params;

    const jobData: IJob = req.body;
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

// export const jobsdata = async (req: Request, res: Response) => {
//   try {
//     const eductiaons = Education
//     res.status(201).json({ message: 'Job created successfully', job: newJob });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating job', error });
//   }
// };
