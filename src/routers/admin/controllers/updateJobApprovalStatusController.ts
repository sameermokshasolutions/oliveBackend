import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Job from "../../job/models/Job";

export const approveJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    // const { jobApprovalStatus } = req.body;

    const updatedJobs = await Job.findByIdAndUpdate(
      id,
      { jobApprovalStatus: "approved" },
      { new: true }
    );

    if (!updatedJobs) {
      return next(createHttpError(404, "Job not found"));
    }

    res.status(200).json({
      success: true,
      message: "Job Approved Successfully",
      data: updatedJobs,
    });
  } catch (error) {
    return next(createHttpError(500, "Error approving job"));
  }
};
export const rejectJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, reason } = req.body;

    const updatedJobs = await Job.findByIdAndUpdate(
      id,
      { jobApprovalStatus: "reject", jobRejectReason: reason },
      { new: true }
    );

    if (!updatedJobs) {
      return next(createHttpError(404, "Job not found"));
    }
    
    res.status(200).json({
      success: true,
      message: "Job Approved Successfully",
      data: updatedJobs,
    });
  } catch (error) {
    return next(createHttpError(500, "Error approving job"));
  }
};
