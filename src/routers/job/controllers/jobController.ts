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
