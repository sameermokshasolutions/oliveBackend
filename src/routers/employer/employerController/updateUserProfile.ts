import { RequestHandler } from "express";
import { body, validationResult } from "express-validator";
import EmployerProfile, { IEmployerProfile } from "../models/EmployerProfile";
import { CompanyType, IndustryType, IndustrySector } from "../types/employerTypes";
import createHttpError from "http-errors";

export const updateProfileValidation = [
    body("companyName").notEmpty().withMessage("Company name is required"),
    body("companySize").notEmpty().withMessage("Company size is required"),
    body("industryType").isIn(Object.values(IndustryType)).withMessage("Invalid industry type"),
    body("headquartersAddress").notEmpty().withMessage("Headquarters address is required"),
    body("contactNumber").notEmpty().withMessage("Contact number is required"),
    body("aboutUs").notEmpty().withMessage("About us is required"),
    body("company_type").isIn(Object.values(CompanyType)).withMessage("Invalid company type"),
    body("industrySector").isIn(Object.values(IndustrySector)).withMessage("Invalid industry sector"),
    body("location").notEmpty().withMessage("Location is required"),
    body("websiteLink").isURL().withMessage("Invalid website link"),
    body("publicEmail").isEmail().withMessage("Invalid public email"),
    // Add more validations as needed
];

export const updateProfileController: RequestHandler = async (req: any, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw createHttpError(401, errors);
            return;
        }

        const userId = req.user?.id; // Assuming the authenticateToken middleware adds user to req
        if (!userId) {
            throw createHttpError(401, 'Unauthorized');
        }

        const profileData: Partial<IEmployerProfile> = req.body;

        const updatedProfile = await EmployerProfile.findOneAndUpdate(
            { userId },
            { $set: profileData },
            { new: true, upsert: true }
        );

        res.json({ success: true, message: "Profile updated successfully", data: updatedProfile });
    } catch (error) {
        next(error);
    }
};

