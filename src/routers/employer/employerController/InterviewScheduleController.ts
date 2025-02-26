import { Response, NextFunction } from "express";
import createHttpError from "http-errors";
import AppliedJobsByCandidateModel from "../../job/models/AppliedJobsByCandidateModel";
import EmployerProfile from "../models/EmployerProfile";
import InterviewModel from "../models/InterviewSchedule";
import { ObjectId } from "mongoose";

interface IInterview {
  applicationId: ObjectId;
  jobId: ObjectId;
  candidateId: ObjectId;
  employerId: ObjectId;
  scheduledAt: Date;
  duration: number;
  interviewType: "in-person" | "online" | "phone";
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  location?: string;
  meetingLink?: string;
  notes?: string;
  cancelReason?: string;
}

export const scheduleInterview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: Partial<IInterview> = req.body;

    const userId = req.user?.id;
    if (!userId) {
      return next(createHttpError(404, "Unauthorized access"));
    }

    const employerProfile = await EmployerProfile.findOne({ userId }).select(
      "_id"
    );

    if (!employerProfile) {
      return next(createHttpError(404, "Profile not found"));
    }

    const scheduledInterview = await InterviewModel.create({
      ...data,
      employerId: employerProfile._id,
      status: "scheduled",
    });

    res.status(200).json({
      success: true,
      message: "Interview scheduled successfully",
      data: scheduledInterview,
    });
  } catch (error) {
    console.log(error)
    return next(createHttpError(500, "Failed to schedule interview"));
  }
};

export const getShortListedCandidates = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(createHttpError(401, "unauthorized"));
    }

    const employerProfile = await EmployerProfile.findOne({ userId });

    if (!employerProfile)
      return next(createHttpError(404, "Employer profile not found"));

    const shortlistedCandidates = await AppliedJobsByCandidateModel.aggregate([
      {
        $match: {
          employerId: employerProfile._id,
          status: "shortlisted",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      {
        $unwind: "$jobDetails",
      },
      {
        $project: {
          userId: 1,
          jobId: 1,
          employerId: 1,
          status: 1,
          applicationDate: 1,
          lastStatusUpdate: 1,
          employerNote: 1,
          firstName: "$userDetails.firstName",
          lastName: "$userDetails.lastName",
          jobRoleApplied: "$jobDetails.jobRole",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Short listed candidates",
      data: shortlistedCandidates,
    });
  } catch (error) {
    return next(createHttpError(500, "Error listing short listed candidates"));
  }
};
