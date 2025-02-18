import mongoose, { Document, Schema } from "mongoose";
import { IndustryType, IndustrySector } from "../types/employerTypes";

export interface IEmployerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
  companySize: string;
  industryType: IndustryType;
  headquartersAddress: string;
  contactNumber: string;
  aboutUs: string;
  companyType: mongoose.Types.ObjectId;
  industrySector: IndustrySector;
  location: string;
  websiteLink: string;
  logoUrl: string;
  videoUrl: string;
  socialLinks: Array<{ title: string; url: string }>;
  brandingMessage: string;
  companyBrochureUrl: string;
  employerVisibility: boolean;
  branding_opted: boolean;
  custom_job_post_templates_enabled: boolean;
  bannerImage: string;
  yearOfEstablishment: string;
  companyVision: string;
  publicEmail: string;

  //   virtual fields
  isProfileComplete?: boolean;
  profileCompletionPercentage?: number;
}

const EmployerProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    companySize: { type: Number, required: true },
    industryType: {
      type: String,
      enum: Object.values(IndustryType),
      required: true,
    },
    headquartersAddress: { type: String, required: true },
    contactNumber: { type: String, required: true },
    aboutUs: { type: String, required: true },
    companyType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyType",
      require: true,
    },
    industrySector: {
      type: String,
      enum: Object.values(IndustrySector),
    },
    location: { type: String, required: true },
    websiteLink: { type: String, required: true },
    logoUrl: { type: String },
    videoUrl: { type: String },
    socialLinks: [{ title: String, url: String }],
    brandingMessage: { type: String },
    companyBrochureUrl: { type: String },
    employerVisibility: { type: Boolean, default: false },
    branding_opted: { type: Boolean, default: false },
    custom_job_post_templates_enabled: { type: Boolean, default: false },
    bannerImage: { type: String },
    yearOfEstablishment: { type: Number },
    companyVision: { type: String },
    publicEmail: { type: String },
  },
  { timestamps: true }
);

EmployerProfileSchema.virtual("isProfileComplete").get(function () {
  const mandatoryFields = [
    "companyName",
    "companySize",
    "industryType",
    "company_type",
    "headquartersAddress",
    "contactNumber",
    "aboutUs",
    "publicEmail",
  ];

  return mandatoryFields.every((field) => !!this[field]);
});

EmployerProfileSchema.virtual("profileCompletionPercentage").get(function (
  this: IEmployerProfile
) {
  const mandatoryFields = [
    "companyName",
    "companySize",
    "headquartersAddress",
    "contactNumber",
    "aboutUs",
    "publicEmail",
  ];

  const completedFields = mandatoryFields.filter(
    (field) => !!this[field as keyof IEmployerProfile]
  );
  return Math.floor((completedFields.length / mandatoryFields.length) * 100);
});

export default mongoose.model<IEmployerProfile>(
  "EmployerProfile",
  EmployerProfileSchema
);

// company_type: {
//   type: String,
//   enum: Object.values(CompanyType),
// },
