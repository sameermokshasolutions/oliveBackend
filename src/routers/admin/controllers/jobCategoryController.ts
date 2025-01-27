import JobCategory from "../models/JobCategory";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";

export const getAllJobCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await JobCategory.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const createJobCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newCategory = await JobCategory.create(req.body);
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
    const updatedCategory = await JobCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory) throw createHttpError(404, "Job category not found");
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
    const deletedCategory = await JobCategory.findByIdAndDelete(req.params.id);
    if (!deletedCategory) throw createHttpError(404, "Job category not found");
    res
      .status(200)
      .json({ success: true, message: "Job category deleted successfully" });
  } catch (error) {
    next(error);
  }
};
