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

/**
 
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
    const jobData = await Job.findById(jobId).select("jobRole -_id");

    const applicants: any = await CandidateModel.aggregate([
      {
        $match: {
          userId: { $in: userIds },
        },
      },
      {
        $lookup: {
          localField: "userId",
          foreignField: "_id",
          from: "users",
          as: "candidateData",
        },
      },
      {
        $addFields: {
          firstName: "$candidateData.firstName",
          lastName: "$candidateData.lastName",
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          availability: 1,
          awardsAndHonors: 1,
          biography: 1,
          gender: 1,
          educationList: 1,
          expectedSalary: 1,
          experienceList: 1,
          jobPreferences: 1,
          jobRolePreferences: 1,
          languages: 1,
          maritalStatus: 1,
          preferredJobLocation: 1,
          relocationPreference: 1,
          skills: 1,
          socialList: 1,
          profileUrl: 1,
        },
      },
    ]);

    const result = {
      ...applicants[0],
      ...jobData?.toObject(),
    };

    res.status(200).json({
      success: true,
      message: "Applications",
      data: result,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while getting applicants"));
  }
 */
