import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import crypto from 'crypto';

import User from '../userModals/usermodal';
import { emailService } from '../../../services/emailService';
import { verificationEmailTemplate } from '../../../views/emailTemplates';
import { config } from '../../../config/config';


if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not set in environment variables');
}

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { firstName, lastName, email, password, phoneNumber, role, notificationPreference } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });


        // Check if the phone number is already registered
        const existingPhone = await User.findOne({ phoneNumber });
        if (existingUser) {
            throw createHttpError(409, 'Email already registered');
        }
        if (existingPhone) {
            throw createHttpError(409, 'Phone Number already in Use');
        }

        // Generate a unique user ID for the new user
        const lastUser = await User.findOne().sort({ userId: -1 });
        const userId = lastUser ? lastUser.userId + 1 : 1000;

        // Hash the user's password for secure storage
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a verification token for email verification
        const verificationToken = await crypto.randomBytes(32).toString('hex');

        // Create a new user with the provided data and default inactive status
        const user = new User({
            userId,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            role,
            notificationPreference,
            status: 'Inactive', // Set status to inactive until verified
            accountStatus: 'Inactive', // Set account status to inactive until verified
            verificationToken, // Store verification token
        });
        // Save the user in the database
        await user.save();
        // Generate verification link
        const verificationLink = `${config.frontEndUrl}/verify-email/${verificationToken}`;
        // Send verification email
        try {
            await emailService.sendEmail(
                email,
                'Verify Your Email',
                verificationEmailTemplate(verificationLink)
            );
            console.log('Verification email sent successfully');
        } catch (emailError) {
            console.error('Error sending verification email:', emailError);
            // You might want to delete the user if email sending fails
            await User.findByIdAndDelete(user._id);
            throw createHttpError(500, 'Failed to send verification email');
        }
        // Prepare the response data, excluding the password
        const userResponse = user.toObject();
        userResponse.password = '';

        // Send a response with the user details and prompt for email verification
        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email to verify your account.',
            data: userResponse,
        });
    } catch (error) {
        next(error); // Pass any error to the error handling middleware
    }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token } = req.body;
        console.log(token);


        const user = await User.findOne({ verificationToken: token });


        if (!user) {
            throw createHttpError(401, 'Invalid or expired verification token');
        }

        user.emailVerification = true;
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

