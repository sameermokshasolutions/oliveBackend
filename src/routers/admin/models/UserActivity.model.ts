import mongoose, { Schema, Document } from "mongoose";

interface IUserActivity extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  role: "admin" | "employer" | "candidate";
  action: string;
  timestamp: Date;
  details?: string;
}

const UserActivitySchema = new Schema<IUserActivity>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: {
    type: String,
    enum: ["admin", "employer", "candidate"],
    required: true,
  },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: String },
});

const UserActivity = mongoose.model<IUserActivity>(
  "UserActivity",
  UserActivitySchema
);
export default UserActivity;
