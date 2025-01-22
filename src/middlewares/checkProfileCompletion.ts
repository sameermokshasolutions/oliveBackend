import { Response, NextFunction } from "express";
import EmployerProfile from "../routers/employer/models/EmployerProfile";
import createHttpError from "http-errors";

// check for employer profile completion
export const checkEmployerProfileCompletion = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const employerProfile = await EmployerProfile.findOne({
      userId: req.user?.id,
    });

    if (!employerProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    if (!employerProfile.isProfileComplete) {
      return next(
        createHttpError(400, "Please complete your profile to apply for jobs")
      );
    }

    next();
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};
