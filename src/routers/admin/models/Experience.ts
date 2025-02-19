import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sort: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;
