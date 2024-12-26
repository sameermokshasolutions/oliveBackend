

import { RequestHandler } from "express";
import Job, { IJob } from "../../job/models/Job";


export const createJobController: RequestHandler = async (req: any, res, next) => {
    const userId = req.user?.id; // Assuming the authenticateToken middleware adds user to req
    try {

        try {
            const jobData: IJob = req.body;

            jobData.company = userId;
            const newJob = new Job((jobData));
            await newJob.save();
            res.status(201).json({ success: true, message: 'Job created successfully' });
        } catch (error) {
            console.log(error);

            res.status(500).json({ message: 'Error creating job', error });
        }
    } catch (error) {
        console.log(error);

        next(error);
    }
};

