// import { NextFunction, Request, Response } from "express";
// import createHttpError from "http-errors";

// export const getJobApplicantsById = async (
//   req: any,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = req.user?.id;
//   } catch (error) {
//     return next(createHttpError(500, "Can't get applicants"));
//   }
// };


import mongoose from 'mongoose';

const appliedJobSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Applicant is required']
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job is required']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'interviewed', 'offered', 'rejected'],
    default: 'pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  resumeUrl: {
    type: String,
    required: [true, 'Resume URL is required']
  },
  coverLetterUrl: String,
  notes: String,
  interviewDate: Date,
  offerDetails: {
    salary: Number,
    startDate: Date,
    offerLetterUrl: String
  }
}, {
  timestamps: true
});

// Index for faster queries
appliedJobSchema.index({ applicant: 1, job: 1 }, { unique: true });

// Virtual for full application details
appliedJobSchema.virtual('fullDetails').get(function() {
  return `${this.applicant} applied for ${this.job} on ${this.appliedDate.toLocaleDateString()}`;
});

// Instance method
appliedJobSchema.methods.updateStatus = function(newStatus:any) {
  this.status = newStatus;
  return this.save();
};

// Static method
appliedJobSchema.statics.findByApplicant = function(applicantId) {
  return this.find({ applicant: applicantId }).populate('job');
};

const AppliedJob = mongoose.model('AppliedJob', appliedJobSchema);

export default AppliedJob;

