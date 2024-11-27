import express from 'express';

import {
    createJob,
    updateJob,
    getJobUsingUserId,
    getJobList,
    deleteJob
} from './controllers/jobController';
import {
    createJobValidator,
    updateJobValidator,
    getJobValidator,
    getJobListValidator,
    deleteJobValidator
} from './validators/jobValidator';
import { validateRequest } from '../../middlewares/validateRequest';

const jobRouter = express.Router();

jobRouter.post("/createJob", createJobValidator, validateRequest, createJob);
// jobRouter.put("/updateJob/:jobId", updateJobValidator, validateRequest, updateJob);
jobRouter.get("/getJobListUsingId/:userId", getJobValidator, validateRequest, getJobUsingUserId);
jobRouter.get("/getJobList", getJobListValidator, validateRequest, getJobList);
// jobRouter.delete("/deleteJob/:jobId", deleteJobValidator, validateRequest, deleteJob);

export default jobRouter;