import JobCategory from "../models/JobCategory";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import EmployerProfile from "../../employer/models/EmployerProfile";
import mongoose from "mongoose";

export const getAllJobCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await JobCategory.find({ isDeleted: false }).populate({
      path: "companyType",
      select: "name",
    });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(createHttpError(500, "Something went wrong"));
  }
};

export const getJobCategoriesByCompanyType = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(createHttpError(400, "Unauthorized user"));
    }

    // Fetch employer profile
    const employerProfile = await EmployerProfile.findOne({ userId });

    // Ensure employerProfile exists before accessing companyType
    const matchConditions: any = { isDeleted: false };

    if (employerProfile?.companyType) {
      matchConditions.companyType = employerProfile.companyType;
    }

    // Fetch job categories based on the company type
    const categories = await JobCategory.find(matchConditions);

    res.status(200).json({
      success: true,
      message: categories.length
        ? "Job categories fetched successfully"
        : "No job categories found for this company type",
      data: categories,
    });
  } catch (error) {
    next(createHttpError(500, "Error fetching job categories"));
  }
};

export const getJobCategoriesByCompanyTypeId = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyTypeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(companyTypeId)) {
      return next(createHttpError(400, "Invalid company id"));
    }

    const matchConditions: any = {
      isDeleted: false,
      companyType: companyTypeId,
    };

    const categories = await JobCategory.find(matchConditions);

    res.status(200).json({
      success: true,
      message: categories.length
        ? "Job categories fetched successfully"
        : "No job categories found for this company type",
      data: categories,
    });
  } catch (error) {
    next(createHttpError(500, "Error fetching job categories"));
  }
};

export const createJobCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, companyType } = req.body;
    if (!name || !companyType) {
      next(createHttpError(400, "Please provide name and company type"));
    }

    const newCategory = await JobCategory.create({ name, companyType });
    res.status(201).json({
      success: true,
      message: "Job category created successfully",
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const updateJobCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, companyType } = req.body;
    if (!name || !companyType) {
      next(createHttpError(400, "Please provide name and company type"));
    }

    const updatedCategory = await JobCategory.findByIdAndUpdate(
      req.params.id,
      { name, companyType },
      { new: true }
    );

    if (!updatedCategory) next(createHttpError(404, "Job category not found"));
    res.status(200).json({
      success: true,
      message: "Job category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJobCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedCategory = await JobCategory.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedCategory) next(createHttpError(404, "Job category not found"));
    res.status(200).json({
      success: true,
      message: "Job category soft deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
