import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import User from '../routers/user/userModals/usermodal';

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            throw createHttpError(400, 'Invalid or expired verification token');
        }

        user.status = 'Active';
        user.accountStatus = 'Active';
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Email verified successfully. You can now log in.',
        });
    } catch (error) {
        next(error);
    }
};