import mongoose, { Document } from "mongoose";

interface ISaveCandidatesMethods {
  updateStatus(
    newStatus: IJobApplication["status"],
    note: string
  ): Promise<IJobApplication>;
}

interface IJobApplication extends Document {
  userId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
  applicationDate: Date;
  lastStatusUpdate: Date;
  employerNote?: string;
}

export interface IJobApplicationSchema
  extends IJobApplication,
    ISaveCandidatesMethods {}
