import mongoose from "mongoose";

// const jobCategorySchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     type:[{
//       type:mongoose.Schema.ObjectId,
//       ref:"CompanyType"
//     }]
//   },
//   { timestamps: true }
// );

// job category schema

const jobCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    // Company type reference
    companyType: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyType",
        required: true,
      },
    ],

    // Soft delete field
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const JobCategory = mongoose.model("JobCategory", jobCategorySchema);

export default JobCategory;
