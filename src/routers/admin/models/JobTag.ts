import mongoose from "mongoose";

// const jobTagSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//   },
//   { timestamps: true }
// );

const jobTagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobRole",
    required: true,
  },
});
jobTagSchema.index({ name: 1, role: 1 }, { unique: true });

const JobTag = mongoose.model("JobTag", jobTagSchema);
export default JobTag;
