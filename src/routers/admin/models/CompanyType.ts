import mongoose from "mongoose";

//company type schema
const companyTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    requird: true,
    unique: true  
  },
  
})
const CompanyType = mongoose.model("CompanyType", companyTypeSchema)
export default CompanyType;
