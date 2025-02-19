import { NextFunction, RequestHandler, Response, Request } from "express";
import Job, { IJob } from "../../job/models/Job";
import User from "../../user/userModals/usermodal";
import CandidateModel from "../../user/userModals/Candidate";

import createHttpError from "http-errors";
import AppliedJobsByCandidateModel from "../../job/models/AppliedJobsByCandidateModel";

export const getAppliedCandidates: RequestHandler = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = req.params;

    const documents = await AppliedJobsByCandidateModel.find({
      "appliedJobs.jobId": jobId,
    }).select("userId");

    const userIds = documents.map((doc) => doc.userId);

    if (userIds.length === 0) {
      res.status(200).json({
        success: true,
        message: "No candidate applied to this job",
        data: null,
      });
    }

    const result = await CandidateModel.find({
      userId: { $in: userIds },
    }).populate({
      path: "userId",
      select: "firstName lastName -_id",
    });

    res.status(200).json({
      success: true,
      message: "Applications",
      data: result,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while getting applicants"));
  }
};