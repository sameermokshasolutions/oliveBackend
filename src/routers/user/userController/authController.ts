import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../userModals/usermodal';
import { config } from '../../../config/config';
import crypto from 'crypto';
import { emailService } from '../../../services/emailService';
import { verificationEmailTemplate } from '../../../views/emailTemplates';

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check if a user with the provided email exists in the database
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return next(createHttpError(404, 'User not found'));
        }

        if (!existingUser.emailVerification) {
            try {
                const verificationToken = crypto.randomBytes(32).toString('hex');
                const verificationLink = `${config.frontEndUrl}/verify-email/${verificationToken}`;
                await emailService.sendEmail(
                    email,
                    'Verify Your Email',
                    verificationEmailTemplate(verificationLink)
                );
                existingUser.verificationToken = verificationToken;
                await existingUser.save();
            } catch (emailError) {
                console.error('Error sending verification email:', emailError);
                await User.findByIdAndDelete(existingUser._id);
                throw createHttpError(500, 'Failed to send verification email');
            }

            return next(createHttpError(403, 'Please verify your account. Check your email!'));
        }

        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return next(createHttpError(403, 'Wrong password'));
        }

        // Generate a JWT token for the authenticated user with a 10-hour expiration
        const token = jwt.sign({ id: existingUser._id }, config.jwtSecret, { expiresIn: '10h' });

        // Set the JWT token in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Mitigate CSRF attacks
            maxAge: 10 * 60 * 60 * 1000, // 10 hours in milliseconds
        });
        res.cookie('userRole', existingUser.role, {
            httpOnly: true, // Prevent JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Mitigate CSRF attacks
            maxAge: 10 * 60 * 60 * 1000, // 10 hours in milliseconds
        });

        // Send a success response with user details
        res.status(200).json({
            success: true,
            userId: existingUser._id,
            userRole: existingUser.role,
            message: 'Login successful',
        });
    } catch (error) {
        next(error);
    }
};


export const logoutUser = (req: Request, res: Response, next: NextFunction): void => {
    try {
        console.log('Clearing cookies...');

        // Clear cookies
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.clearCookie('userRole', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        console.log('Cookies cleared. Sending response.');

        // Send the response
        res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        console.error('Error during logout:', error);

        // Pass error to next middleware if response hasn't been sent
        if (!res.headersSent) {
            return next(error);
        }
    }
};
