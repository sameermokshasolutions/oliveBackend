import mongoose from "mongoose";

const jobSkillsSchema = new mongoose.Schema(
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

const JobSkills = mongoose.model("JobSkills", jobSkillsSchema);
export default JobSkills;
