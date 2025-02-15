import mongoose from "mongoose";

// const jobRoleSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//   },
//   { timestamps: true }
// );

const jobRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobCategory",
    required: [true, "Job category is required"],
  },
});

// Create a compound unique index :: Ensures that the same job role name cannot be repeated within the same category.
jobRoleSchema.index({ name: 1, category: 1 }, { unique: true });

const JobRole = mongoose.model("JobRole", jobRoleSchema);
export default JobRole;
