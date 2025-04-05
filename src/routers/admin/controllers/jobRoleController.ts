import JobRole from "../models/JobRole";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { getPagination } from "../../../utils/getPagination";

// Get all job roles (excluding soft-deleted ones)
export const getAllJobRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { keyword, category, page = "1", limit = "10" }: any = req.query;

    const matchConditions: any = { isDeleted: false };

    if (keyword) {
      matchConditions.name = { $regex: keyword, $options: "i" };
    }

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      matchConditions.category = new mongoose.Types.ObjectId(category);
    }

    const { limitNumber, pageNumber, skip } = getPagination(page, limit);

    const roles = await JobRole.find(matchConditions)
      .populate({
        path: "category",
        select: "name",
      })
      .skip(skip)
      .limit(limitNumber);

    const total = await JobRole.countDocuments(matchConditions);

    res.status(200).json({
      success: true,
      message: "Job roles fetched successfully",
      data: {
        roles,
        pagination: {
          total: total,
          page: pageNumber,
          limit: limitNumber,
          pages: Math.ceil(total / limitNumber),
        },
      },
    });
  } catch (error) {
    next(createHttpError(500, "Error while fetching Job Roles"));
  }
};
// export const getAllJobRoles = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const roles = await JobRole.find({ isDeleted: false }).populate({
//       path: "category",
//       select: "name",
//     });

//     res.status(200).json({
//       success: true,
//       message: "Job roles fetched successfully",
//       data: roles,
//     });
//   } catch (error) {
//     next(createHttpError(500, "Error while fetching Job Roles"));
//   }
// };

// Get job roles by category (excluding soft-deleted ones)
export const getJobRolesByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) next(createHttpError(400, "Category ID is required"));

    const roles = await JobRole.find({ category: id, isDeleted: false });

    res.status(200).json({
      success: true,
      message: roles.length
        ? "Job roles by category fetched successfully"
        : "no job roles found for this category",
      data: roles,
    });
  } catch (error) {
    next(createHttpError(500, "Error while fetching Job Role by Category"));
  }
};

// Create a new job role
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

// Update a job role
export const updateJobRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedRole = await JobRole.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false }, // Ensure it's not soft-deleted
      req.body,
      { new: true }
    );

    if (!updatedRole) next(createHttpError(404, "Job role not found"));

    res.status(200).json({
      success: true,
      message: "Job role updated successfully",
      data: updatedRole,
    });
  } catch (error) {
    next(createHttpError(500, "Error while updating Job Role"));
  }
};

// Soft delete a job role
export const deleteJobRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedRole = await JobRole.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true }, // Soft delete
      { new: true }
    );

    if (!deletedRole) next(createHttpError(404, "Job role not found"));

    res.status(200).json({
      success: true,
      message: "Job role soft deleted successfully",
    });
  } catch (error) {
    next(createHttpError(500, "Error while deleting Job Role"));
  }
};

// Restore a soft-deleted job role
export const restoreJobRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const restoredRole = await JobRole.findOneAndUpdate(
      { _id: req.params.id, isDeleted: true },
      { isDeleted: false }, // Restore soft-deleted record
      { new: true }
    );

    if (!restoredRole)
      next(createHttpError(404, "Job role not found or not deleted"));

    res.status(200).json({
      success: true,
      message: "Job role restored successfully",
      data: restoredRole,
    });
  } catch (error) {
    next(createHttpError(500, "Error while restoring Job Role"));
  }
};
