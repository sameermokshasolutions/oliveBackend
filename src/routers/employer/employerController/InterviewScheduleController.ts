import { Response, NextFunction } from "express";
import createHttpError from "http-errors";
import AppliedJobsByCandidateModel from "../../job/models/AppliedJobsByCandidateModel";
import EmployerProfile from "../models/EmployerProfile";
import InterviewModel from "../models/InterviewSchedule";
import mongoose, { ObjectId } from "mongoose";

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
      status: "scheduled",
    });

    const appiledJob = await AppliedJobsByCandidateModel.findById(
      data.applicationId
    );

    await appiledJob?.updateStatus("scheduled", data.notes || "");

    res.status(200).json({
      success: true,
      message: "Interview scheduled successfully",
      data: scheduledInterview,
    });
  } catch (error) {
    console.log(error);
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

interface IUpdateInterview {
  interviewId: string;
  scheduledAt: Date;
  duration: number;
  interviewType: "in-person" | "online" | "phone";
  status: "completed" | "cancelled" | "rescheduled";
  location: string;
  meetingLink: string;
  notes: string;
  cancelReason: string;
}

export const updateScheduledInterview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: Partial<IUpdateInterview> = req.body;
    const newObj = Object.fromEntries(
      Object.entries(data).filter(([key]) => key !== "interviewId")
    );
    const updateScheduledInterview = await InterviewModel.findByIdAndUpdate(
      data.interviewId,
      newObj,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message:
        data.status === "rescheduled"
          ? "Interview updated"
          : data.status === "completed"
          ? "Interview Completed"
          : "Interview cancelled",
      data: updateScheduledInterview,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Internal server error"));
  }
};

export const getScheduledInterview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(createHttpError(403, "Unauthorized"));
    }

    const employer = await EmployerProfile.findOne({ userId }).select("_id");
    if (!employer)
      return next(createHttpError(403, "Create Employer Profile First"));

    const scheduledInterviews = await InterviewModel.aggregate([
      {
        $match: {
          employerId: employer._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateDetails",
        },
      },
      {
        $unwind: "$candidateDetails",
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
          applicationId: 1,
          jobId: 1,
          candidateId: 1,
          employerId: 1,
          scheduledAt: 1,
          duration: 1,
          interviewType: 1,
          status: 1,
          location: 1,
          meetingLink: 1,
          cancelReason: 1,
          firstName: "$candidateDetails.firstName",
          lastName: "$candidateDetails.lastName",
          jobRole: "$jobDetails.jobRole",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "List of scheduled interviews",
      data: scheduledInterviews,
    });
  } catch (error) {
    console.log(error);
  }
};
