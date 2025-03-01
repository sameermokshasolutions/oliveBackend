import mongoose, { Schema } from "mongoose";
import { IJobApplicationSchema } from "../types/applyJobsTypes";

const appliedJobSchema = new Schema<IJobApplicationSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "EmployerProfile",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "reviewed",
        "shortlisted",
        "rejected",
        "hired",
        "scheduled",
      ],
      default: "pending",
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    lastStatusUpdate: {
      type: Date,
      default: Date.now,
    },
    employerNote: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

appliedJobSchema.index({ status: 1 });

appliedJobSchema.methods.updateStatus = function (
  newStatus: IJobApplicationSchema["status"],
  note: string
) {
  this.status = newStatus;
  this.lastStatusUpdate = new Date();
  this.employerNote = note;
  return this.save();
};

const AppliedJobsByCandidateModel = mongoose.model<IJobApplicationSchema>(
  "AppliedJobsByCandidateModel",
  appliedJobSchema
);

export default AppliedJobsByCandidateModel;
