import JobRole from "../models/JobRole";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";

export const getAllJobRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await JobRole.find();
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    next(error);
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
    next(error);
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
    next(error);
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
    next(error);
  }
};
