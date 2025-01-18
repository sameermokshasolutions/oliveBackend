import mongoose, { Document, Schema } from "mongoose";
export interface SearchQueryParams {
  keyword?: string;
  location?: string;
  minSalary?: string;
  maxSalary?: string;
  jobType?: string;
  jobRole?: string;
  experience?: string;
  tags?: string;
  skills?: string;
  page?: string;
  limit?: string;
}

export interface FacetResult {
  jobs: any[];
  jobTypes: Array<{ _id: string; count: number }>;
  locations: Array<{ _id: string; count: number }>;
  salaryRanges: Array<{ _id: string; count: number }>;
  experienceLevels: Array<{ _id: string; count: number }>;
  skills: Array<{ _id: string; count: number }>;
}
export interface IJob extends Document {
  jobTitle: string;
  company: mongoose.Schema.Types.ObjectId;
  jobDescription: string;
  jobCategory: string;
  tags: string[];
  jobApprovalStatus: string;
  jobRole: string;
  salaryOption: string; // custom or range,
  minSalary: string;
  maxSalary: string;
  customSalary: string;
  salaryPeriod: string; // yearly or monthly or hourly,
  education: string[]; //['mbbs','bhms','chemist'] ,
  experience: string;
  jobType: string; // fulltime or parttime or contract or internship,
  totalVacancies: string;
  deadline: Date; // '2024-12-26T09:26:54.999Z',
  location: string;
  requirements: string[];
  skills: string[];
  dateOfApplication?: Date;
}

const JobSchema: Schema = new Schema(
  {
    jobTitle: { type: String, required: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployerProfile",
      required: true,
    },
    jobDescription: { type: String, required: true },
    jobCategory: { type: String, required: true },
    tags: { type: [String], required: true },
    jobRole: { type: String, required: true },
    jobApprovalStatus: {
      type: String,
      enum: ["pending", "approved"],
      required: true,
      default: "pending",
    },
    salaryOption: {
      type: String,
      required: true,
      enum: ["range", "custom", "not-disclosed"],
    },
    minSalary: { type: String },
    maxSalary: { type: String },
    customSalary: { type: String },
    salaryPeriod: {
      type: String,
      required: true,
      enum: ["monthly", "yearly", ""],
      default: "",
    },
    education: { type: [String], required: true },
    experience: { type: String, required: true },
    jobType: { type: String, required: true },
    totalVacancies: { type: String, required: true },
    deadline: { type: Date, required: true },
    location: { type: String, required: true },
    requirements: { type: [String], required: true },
    skills: { type: [String], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IJob>("Job", JobSchema);
