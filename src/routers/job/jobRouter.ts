import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { createJob, jobsdata } from './controllers/jobController';
import { createJobValidator } from './validators/jobValidator';
const jobRouter = express.Router();
jobRouter.post("/jobs", createJobValidator, validateRequest, createJob);
jobRouter.post("/jobsdata", createJobValidator, validateRequest, jobsdata);
export default jobRouter;