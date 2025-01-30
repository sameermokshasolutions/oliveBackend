import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  userId: number;
  role: "candidate" | "employer" | "admin";
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  emailVerification?: boolean;
  status: "Active" | "Inactive";
  accountStatus?: "Active" | "Inactive" | "Suspended";
  profileStatus: boolean; // content moderation status
  createdAt?: Date;
  updatedAt?: Date;
  profilePictureUrl?: string;
  lastLogin?: Date;
  twoFactorEnabled?: boolean;
  otpEnabled?: boolean;
  notificationPreference?: "Email" | "SMS" | "Push Notifications";
  jobApplied?: ObjectId[]; // Array of job IDs (ObjectIds)
  subscriptionType?: string;
  verificationToken?: string;
  otp?: string;
  otpExpires?: Date;
}

const UserSchema: Schema = new Schema(
  {
    userId: { type: Number, required: true, unique: true },
    role: {
      type: String,
      enum: ["candidate", "employer", "admin"],
      default: "candidate",
    },
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
    password: { type: String, required: true },
    biography: { type: String, default: "" },
    phoneNumber: { type: String, match: /^[0-9]{10,20}$/ },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    profilePictureUrl: { type: String },
    lastLogin: { type: Date },
    accountStatus: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    twoFactorEnabled: { type: Boolean, default: false },
    otpEnabled: { type: Boolean, default: false },
    emailVerification: { type: Boolean, default: false },
    subscriptionType: { type: String, default: "" },
    notificationPreference: {
      type: String,
      enum: ["Email", "SMS", "Push Notifications"],
    },
    verificationToken: { type: String },
    otp: { type: String, default: "" },
    otpExpires: { type: Date, default: "" },
    profileStatus: { type: Boolean, default: false },
    jobApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }], // Array of ObjectIds referencing Job
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
