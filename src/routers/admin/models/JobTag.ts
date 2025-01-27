import mongoose from "mongoose";

const jobTagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const JobTag = mongoose.model("JobTag", jobTagSchema);
export default JobTag;
