const mongoose = require('mongoose');

const jobRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
 
}, { timestamps: true });

module.exports = mongoose.model('JobRole', jobRoleSchema);

