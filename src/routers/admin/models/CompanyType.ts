import mongoose from "mongoose";

//company type schema
const companyTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
const CompanyType = mongoose.model("CompanyType", companyTypeSchema)
export default CompanyType;
