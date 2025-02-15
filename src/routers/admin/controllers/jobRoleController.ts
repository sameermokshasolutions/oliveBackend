import JobRole from "../models/JobRole";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import JobCategory from "../models/JobCategory";

export const getAllJobRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await JobRole.find();
    res.status(200).json({ 
      success: true, 
      message: 'Job roles fethced successfully',
      data: roles });
  } catch (error) {
    next(createHttpError(500, "Error while fetching Job Role"));
  }
};

export const getJobRolesByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      next(createHttpError(400, "Category ID is required"));
    }

    const roles = await JobRole.find({ category: id });

    if (!roles.length) {
      next(createHttpError(404, "No job roles found for this category"));
    }

    res.status(200).json({ 
      success: true, 
      message: 'Job roles by category fethced successfully',
      data: roles });
  } catch (error) {
    next(createHttpError(500, "Error while fetching Job Role by Category"));
  }
};


export const createJobRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newRole = await JobRole.create(req.body);
    res.status(201).json({
      success: true,
      message: "Job role created successfully",
      data: newRole,
    });
  } catch (error) {
    next(createHttpError(500, "Error while creating Job Role"));
  }
};

export const updateJobRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedRole = await JobRole.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRole) throw createHttpError(404, "Job role not found");
    res.status(200).json({
      success: true,
      message: "Job role updated successfully",
      data: updatedRole,
    });
  } catch (error) {
    next(createHttpError(500, "Error while updating Job Role"));
  }
};

export const deleteJobRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedRole = await JobRole.findByIdAndDelete(req.params.id);
    if (!deletedRole) throw createHttpError(404, "Job role not found");
    res
      .status(200)
      .json({ success: true, message: "Job role deleted successfully" });
  } catch (error) {
    next(createHttpError(500, "Error while deleting Job Role"));
  }
};
