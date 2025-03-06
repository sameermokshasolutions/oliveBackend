import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import Job from "../../job/models/Job";
import mongoose from "mongoose";

export const getAllJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      keyword,
      jobRole,
      jobType,
      approvalStatus,
      page = "1",
      limit = "10",
      sort = "newest",
    }: any = req.query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skipNumber = (pageNumber - 1) * limitNumber;
    const sortOrder = sort === "oldest" ? 1 : -1; // 1 for ascending (oldest), -1 for descending (newest)

    const matchConditions: any = {};
    const profileMatchConditions: any = {};

    if (keyword) {
      profileMatchConditions.companyName = { $regex: keyword, $options: "i" };
    }

    if (jobRole) {
      matchConditions.jobRole = jobRole;
    }
    if (jobType) {
      matchConditions.jobType = jobType;
    }
    if (approvalStatus) {
      matchConditions.jobApprovalStatus = approvalStatus;
    }

    const aggregationPipeline: mongoose.PipelineStage[] = [
      {
        $match: matchConditions,
      },
      {
        $lookup: {
          from: "employerprofiles",
          localField: "company",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      {
        $unwind: "$companyDetails",
      },
      {
        $addFields: {
          companyName: "$companyDetails.companyName",
          logoUrl: "$companyDetails.logoUrl",
        },
      },
      {
        $match: profileMatchConditions,
      },
      {
        $sort: { createdAt: sortOrder },
      },
      {
        $project: {
          companyName: 1,
          logoUrl: 1,
          jobTitle: 1,
          jobRole: 1,
          jobType: 1,
          jobApprovalStatus: 1,
          salaryOption: 1,
          deadline: 1,
          experience: 1,
        },
      },
      { $skip: skipNumber },
      { $limit: limitNumber },
    ];

    const totalCountPipeline: mongoose.PipelineStage[] = [
      ...aggregationPipeline.slice(0, -2),
      {
        $count: "total",
      },
    ];

    const [Jobs, totalCountResult] = await Promise.all([
      Job.aggregate(aggregationPipeline),
      Job.aggregate(totalCountPipeline),
    ]);

    const totalDocuments = totalCountResult[0]?.total || 0;

    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: {
        jobs: Jobs,
        pagination: {
          total: totalDocuments,
          page: pageNumber,
          limit: limitNumber,
          pages: Math.ceil(totalDocuments / limitNumber),
        },
      },
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Internal server error"));
  }
};

export const approveJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    // const { jobApprovalStatus } = req.body;

    const updatedJobs = await Job.findOneAndUpdate(
      { _id: id },
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
      message: "Job Rejected Successfully",
      data: updatedJobs,
    });
  } catch (error) {
    return next(createHttpError(500, "Error rejecting job"));
  }
};
