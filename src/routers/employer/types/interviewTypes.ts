import mongoose from "mongoose";

export interface IInterview {
  applicationId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  employerId: mongoose.Types.ObjectId;
  scheduledAt: Date;
  duration: number;
  location?: string;
  meetingLink?: string;
  interviewType: "in-person" | "online" | "phone";
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  notes?: string;
  cancelReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}