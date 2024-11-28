import { truncate } from "fs";
import mongoose from "mongoose";

const socialSchema = new mongoose.Schema({
  social: { type: String, required: true },
  link: { type: String, required: true },
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String, required: true },
  currentlyWorking: { type: Boolean, required: true },
  employmentType: {
    type: String,
    enum: ["fulltime", "partTime", "contract"],
    required: true,
  },
  jobLocation: { type: String, required: true },
});

const educationSchema = new mongoose.Schema({
  institute: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  startYear: { type: Number, required: true },
  passingYear: { type: Number },
  status: { type: String, enum: ["pass", "failed"] },
  cgpa: { type: String },
  percentage: { type: String },
});

// huiiiyyaa
const candidateSchema = new mongoose.Schema(
  {
    userId: {},
    resumeUrl: {
      type: String,
      required: false,
    },
    profileUrl: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: false,
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      required: false,
    },
    jobPreferences: [
      {
        label: { type: String, required: false },
        value: { type: String, required: false },
      },
    ],
    jobRolePreferences: [
      {
        label: { type: String, required: false },
        value: { type: String, required: false },
      },
    ],
    availability: {
      type: String,
      enum: ["Available", "Not Available", "Limited Availability"],
      required: false,
    },
    expectedSalary: { type: Number, required: false },
    preferredJobLocation: [
      {
        label: { type: String, required: false },
        value: { type: String, required: false },
      },
    ],
    relocationPreference: { type: Boolean, required: false },
    awardsAndHonors: [
      {
        label: { type: String, required: false },
        value: { type: String, required: false },
      },
    ],
    skills: [
      {
        label: { type: String, required: false },
        value: { type: String, required: false },
      },
    ],
    languages: [
      {
        label: { type: String, required: false },
        value: { type: String, required: false },
      },
    ],
    biography: { type: String, required: false },
    experienceList: [experienceSchema],
    educationList: [educationSchema],
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    experienceYears: { type: Number, required: false },
    educationLevel: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    email: { type: String, required: false },
    dateOfBirth: { type: Date },
    socialList: [socialSchema],
    address: { type: String, required: false },
    profilePrivacy: {
      type: String,
      enum: ["public", "private"],
      required: false,
    },
    resumePrivacy: { type: Boolean, required: false },
    twoFactorEnabled: { type: Boolean, required: false },
    otpEnabled: { type: Boolean, required: false },
    notificationPreference: {
      type: String,
      enum: ["Email", "SMS", "Push"],
      required: false,
    },
  },
  { timestamps: true }
);

const CandidateModel = mongoose.model("Candidate", candidateSchema);

export default CandidateModel;

// TypeScript type definitions
export type CandidateDocument = mongoose.Document & {
  userId: { type: mongoose.Schema.Types.ObjectId; ref: "User"; required: true };
  resumeUrl: string;
  profileUrl: string;
  gender: "Male" | "Female" | "Other";
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
  jobPreferences: Array<{ label: string; value: string }>;
  jobRolePreferences: Array<{ label: string; value: string }>;
  availability: "Available" | "Not Available" | "Limited Availability";
  expectedSalary: number;
  preferredJobLocation: Array<{ label: string; value: string }>;
  relocationPreference: boolean;
  awardsAndHonors: Array<{ label: string; value: string }>;
  skills: Array<{ label: string; value: string }>;
  languages: Array<{ label: string; value: string }>;
  biography: string;
  experienceList: Array<{
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    description: string;
  }>;
  educationList: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
  }>;
  firstname: string;
  lastname: string;
  experienceYears: number;
  educationLevel: string;
  phoneNumber: string;
  email: string;
  dateOfBirth?: Date;
  socialList: Array<{ social: string; link: string }>;
  address: string;
  profilePrivacy: "public" | "private";
  resumePrivacy: boolean;
  twoFactorEnabled: boolean;
  otpEnabled: boolean;
  notificationPreference: "Email" | "SMS" | "Push";
};

export type CandidateModel = mongoose.Model<CandidateDocument>;

// Example usage
