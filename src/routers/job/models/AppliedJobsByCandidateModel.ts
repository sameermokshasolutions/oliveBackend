import mongoose, { Document, Schema } from "mongoose";

interface EmployerAction {
  jobId: mongoose.Schema.Types.ObjectId;
  action: string;
  date?: Date;
}

interface JobsApplied {
  jobId: mongoose.Schema.Types.ObjectId;
  createdAt?:any;
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

const AppliedJobsSchema = new Schema<JobsApplied>({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
}, {timestamps:true});

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
