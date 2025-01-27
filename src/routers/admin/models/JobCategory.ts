import mongoose from "mongoose";

const jobCategorySchema = new mongoose.Schema(
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

const JobCategory = mongoose.model("JobCategory", jobCategorySchema);

export default JobCategory;
