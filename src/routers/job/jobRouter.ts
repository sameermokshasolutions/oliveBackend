import express from 'express';


import { validateRequest } from '../../middlewares/validateRequest';
import { createJob } from './controllers/jobController';
import { createJobValidator } from './validators/jobValidator';

const jobRouter = express.Router();

jobRouter.post("/jobs", createJobValidator, validateRequest, createJob);


export default jobRouter;