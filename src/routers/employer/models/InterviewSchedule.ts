import mongoose, { Schema } from "mongoose";
import { IInterview } from "../types/interviewTypes";

const interviewSchema = new Schema<IInterview>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "AppliedJobsByCandidateModel",
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "EmployerProfile",
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 60,
    },
    location: {
      type: String,
      required: function () {
        return this.interviewType === "in-person";
      },
    },
    meetingLink: {
      type: String,
      required: function () {
        return this.interviewType === "online";
      },
    },
    interviewType: {
      type: String,
      enum: ["in-person", "online", "phone"],
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "rescheduled"],
      default: "scheduled",
    },
    notes: {
      type: String,
      trim: true,
    },
    cancelReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const InterviewModel = mongoose.model<IInterview>("Interview", interviewSchema);
export default InterviewModel;
