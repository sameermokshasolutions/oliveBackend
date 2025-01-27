import mongoose from "mongoose";

const jobRoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const JobRole = mongoose.model("JobRole", jobRoleSchema);
export default JobRole;
