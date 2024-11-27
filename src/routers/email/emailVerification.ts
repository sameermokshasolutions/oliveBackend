import express from 'express';
import { verifyEmail } from '../user/userController/registerController';


const emailRouter = express.Router();

emailRouter.post('/verify-email', verifyEmail);

export default emailRouter;

