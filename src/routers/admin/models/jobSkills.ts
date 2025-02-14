import mongoose from "mongoose";

// const jobSkillsSchema = new mongoose.Schema(
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

const jobSkillsSchema = new mongoose.Schema({
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
jobSkillsSchema.index({ name: 1, role: 1 }, { unique: true });

const JobSkills = mongoose.model("JobSkills", jobSkillsSchema);
export default JobSkills;
