import mongoose, { Document, Schema, ObjectId } from "mongoose";

interface IJobTags extends Document {
  name: string;
  role: ObjectId[];
}

const jobTagSchema = new Schema<IJobTags>({
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

const JobTag = mongoose.model<IJobTags>("JobTag", jobTagSchema);
export default JobTag;
