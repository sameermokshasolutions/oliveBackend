import { Request, Response } from 'express';
import Job, { IJob } from '../models/Job';

export const createJob = async (req: Request, res: Response) => {
  try {
    const jobData: IJob = req.body;
    const newJob = new Job(jobData);
    await newJob.save();
    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    res.status(500).json({ message: 'Error creating job', error });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const jobData: Partial<IJob> = req.body;
    const updatedJob = await Job.findByIdAndUpdate(jobId, jobData, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job updated successfully', job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error });
  }
};

export const getJobUsingUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const jobs = await Job.find({ employerId: userId });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error });
  }
};

export const getJobList = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const jobs = await Job.find().skip(skip).limit(limit);
    const total = await Job.countDocuments();

    res.json({
      jobs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalJobs: total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job list', error });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const deletedJob = await Job.findByIdAndDelete(jobId);
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error });
  }
};