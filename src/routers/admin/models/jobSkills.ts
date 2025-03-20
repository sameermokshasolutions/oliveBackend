import mongoose, { Document, Schema, ObjectId } from "mongoose";

interface IJobSkill extends Document {
  name: string;
  role: ObjectId[];
}

const jobSkillsSchema = new Schema<IJobSkill>({
  name: {
    type: String,
    required: true,
  },
  role: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobRole",
      required: true,
    },
  ],
});

const JobSkills = mongoose.model<IJobSkill>("JobSkills", jobSkillsSchema);
export default JobSkills;
