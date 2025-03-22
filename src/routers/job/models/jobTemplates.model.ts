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

const JobSchema: Schema = new Schema<IJobTemplates>(
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

export default mongoose.model<IJobTemplates>("Job", JobSchema);

//   employmentType: "Permanent" | "Temporary" | "Self-Employed";
//   workMode: "on-site" | "remote" | "hybrid" | "flexible";
