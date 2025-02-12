import mongoose from "mongoose";

const jobCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  //company type
  companyType: {
    type: String,
    enum: ["Pharma", "Laboratory", "Hospital"],
    required: true
  }
});

const jobRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobCategory",
    required: true,
  },
});

// Create a compound unique index :: Ensures that the same job role name cannot be repeated within the same category.
jobRoleSchema.index({ name: 1, category: 1 }, { unique: true });

const jobSkillSchema = new mongoose.Schema({
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
jobSkillSchema.index({ name: 1, role: 1 }, { unique: true });

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

const JobCategory = mongoose.model("JobCategory", jobCategorySchema);
const JobRole = mongoose.model("JobRole", jobRoleSchema);
const JobSkill = mongoose.model("JobSkill", jobSkillSchema);
const JobTag = mongoose.model("JobTag", jobTagSchema);

export { JobCategory, JobRole, JobSkill, JobTag };
