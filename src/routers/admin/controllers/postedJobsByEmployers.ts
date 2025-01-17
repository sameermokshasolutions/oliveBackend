import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Job from "../../job/models/Job";

export const getAllJobsPostedByEmployers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobs = await Job.find().populate({
        path: "company",
        select: "companyName aboutUs",
      });

    res.status(200).json({
      success: true,
      message: "Success",
      data: jobs,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while getting jobs"));
  }
};
