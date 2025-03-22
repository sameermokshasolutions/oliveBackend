import mongoose, { Document, Schema, ObjectId } from "mongoose";

export interface IJobTemplates extends Document {
  companyType: ObjectId;
  jobTitle: string;
  jobDescription: string;
  jobCategory: string;
  tags: string[];
  jobRole: string;
  education: string[];
  skills: string[];
}

const JobTemplatechema: Schema = new Schema<IJobTemplates>(
  {
    companyType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyType",
      required: true,
    },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    jobCategory: { type: String, required: true },
    tags: { type: [String], required: true },
    jobRole: { type: String, required: true },
    skills: { type: [String], required: true },
    education: { type: [String], required: true },
  },
  { timestamps: true }
);

const JobTemplate = mongoose.model<IJobTemplates>(
  "JobTemplate",
  JobTemplatechema
);
export default JobTemplate;
//   employmentType: "Permanent" | "Temporary" | "Self-Employed";
//   workMode: "on-site" | "remote" | "hybrid" | "flexible";
