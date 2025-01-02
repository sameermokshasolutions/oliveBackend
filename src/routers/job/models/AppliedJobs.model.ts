import { timeStamp } from "console";
import mongoose, { Document, Schema } from "mongoose";

// EmployerAction schema interface
interface EmployerAction {
  jobId: mongoose.Schema.Types.ObjectId;
  action: string;
  date?: Date;
}

// AppliedJob schema interface
export interface iAppliedJob extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  jobId: mongoose.Schema.Types.ObjectId[];
  employerActions: EmployerAction[];
}

// EmployerAction schema definition
const employerActionSchema = new Schema<EmployerAction>({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  action: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
  },
});

// AppliedJob schema definition
const appliedJobSchema = new Schema<iAppliedJob>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    jobId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
      },
    ],
    employerActions: [employerActionSchema],
  },
  { timestamps: true }
);

// Model definition
const AppliedJobs = mongoose.model<iAppliedJob>(
  "AppliedJobs",
  appliedJobSchema
);

export default AppliedJobs;
