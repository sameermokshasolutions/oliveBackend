import { Response, NextFunction } from "express";
import createHttpError from "http-errors";
import AppliedJobsByCandidateModel from "../../job/models/AppliedJobsByCandidateModel";
import { IInterview } from "../types/interviewTypes";
import EmployerProfile from "../models/EmployerProfile";
import InterviewModel from "../models/InterviewSchedule";
import mongoose from "mongoose";

export const scheduleInterview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      applicationId,
      candidateId,
      duration,
      interviewType,
      jobId,
      scheduledAt,
      location,
      meetingLink,
      notes,
    }: Partial<IInterview> = req.body;

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
      applicationId: new mongoose.Types.ObjectId(applicationId),
      candidateId: new mongoose.Types.ObjectId(candidateId),
      jobId: new mongoose.Types.ObjectId(jobId),
      employerId: new mongoose.Types.ObjectId(userId),
      status: "scheduled",
      duration,
      interviewType,
      scheduledAt,
      location,
      meetingLink,
      notes,
    });

    res.status(200).json({
      success: true,
      message: "Interview scheduled successfully",
      data: scheduledInterview,
    });
  } catch (error) {
    return next(createHttpError(500, "Failed to schedule interview"));
  }
};
