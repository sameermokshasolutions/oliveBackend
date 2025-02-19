import mongoose from "mongoose";

// const experienceSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     sort: {
//       type: Number,
//       required: true,
//       trim: true,
//       // unique: true,
//     },
//   },
//   { timestamps: true }
// );
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

// Remove any existing indexes
experienceSchema.index({ sort: 1 }, { unique: false });

const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;
