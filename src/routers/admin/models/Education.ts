import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

const Education = mongoose.model('Education', educationSchema);
export default Education

