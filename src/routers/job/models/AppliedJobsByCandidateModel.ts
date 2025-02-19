import mongoose, { Document, Schema } from "mongoose";

interface EmployerAction {
  jobId: mongoose.Schema.Types.ObjectId;
  action: string;
  date?: Date;
}

interface JobsApplied {
  jobId: mongoose.Schema.Types.ObjectId;
  createdAt?: any;
}

export interface iAppliedJobByCandidate extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  appliedJobs: JobsApplied[];
  employerActions: EmployerAction[];
}

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

const AppliedJobsSchema = new Schema<JobsApplied>(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  { timestamps: true }
);

const appliedJobSchema = new Schema<iAppliedJobByCandidate>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    appliedJobs: [AppliedJobsSchema],
    employerActions: [employerActionSchema],
  },
  { timestamps: true }
);

const AppliedJobsByCandidateModel = mongoose.model<iAppliedJobByCandidate>(
  "AppliedJobsByCandidateModel",
  appliedJobSchema
);

export default AppliedJobsByCandidateModel;

// NEW SCHEMA FOR UPDATE

interface IJobApplication extends Document {
  userId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  resume: string;
  coverLetter?: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
  applicationDate: Date;
  lastStatusUpdate: Date;
  employerNote?: string;
}

const jobApplicationSchema = new Schema<IJobApplication>(
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
    resume: {
      type: String,
      required: true,
      trim: true,
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "shortlisted", "rejected", "hired"],
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

// Compound index to prevent duplicate applications
jobApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

// Index for efficient status-based queries
jobApplicationSchema.index({ status: 1 });

// Method to update status and track the change date
jobApplicationSchema.methods.updateStatus = function (
  newStatus: IJobApplication["status"]
) {
  this.status = newStatus;
  this.lastStatusUpdate = new Date();
  return this.save();
};

export const JobApplication = mongoose.model<IJobApplication>(
  "JobApplication",
  jobApplicationSchema
);
