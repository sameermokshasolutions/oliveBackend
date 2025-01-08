import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  jobTitle: string;
  company: mongoose.Schema.Types.ObjectId;
  jobDescription: string;
  jobCategory: string;
  tags: string[]; //[ 'skill', 'jobtags' ],
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
