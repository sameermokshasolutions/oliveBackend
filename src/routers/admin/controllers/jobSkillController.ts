import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import JobSkills from "../models/jobSkills";

export const getAllJobSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { keyword, role, page = "1", limit = "10" }: any = req.query;

    const matchConditions: any = {};

    if (keyword) {
      matchConditions.name = { $regex: keyword, $options: "i" };
    }

    if (role && mongoose.Types.ObjectId.isValid(role)) {
      matchConditions.role = new mongoose.Types.ObjectId(role);
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const skills = await JobSkills.find(matchConditions)
      .populate({
        path: "role",
        select: "name",
      })
      .skip(skip)
      .limit(limit);
    const total = await JobSkills.countDocuments(matchConditions);

    res.status(200).json({
      success: true,
      message: "Job skills fethced successfully",
      data: {
        skills,
        pagination: {
          total: total,
          page: pageNumber,
          limit: limitNumber,
          pages: Math.ceil(total / limitNumber),
        },
      },
    });
  } catch (error) {
    next(createHttpError(400, "Error fetching job skills"));
  }
};

// export const getAllJobSkills = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const skills = await JobSkills.find().populate({
//       path: "role",
//       select: "name",
//     });
//     res.status(200).json({
//       success: true,
//       message: "Job skills fethced successfully",
//       data: skills,
//     });
//   } catch (error) {
//     next(createHttpError(400, "Error fetching job skills"));
//   }
// };

export const getJobSkillsByRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      next(createHttpError(400, "Role ID is required"));
    }

    const skills = await JobSkills.find({ role: id });

    if (!skills.length) {
      next(createHttpError(404, "No job skills found for this role"));
    }

    res.status(200).json({
      success: true,
      message: "Job skills by role fethced successfully",
      data: skills,
    });
  } catch (error) {
    next(createHttpError(500, "Error fetching job skills"));
  }
};

export const createJobSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newskills = await JobSkills.create(req.body);
    res.status(201).json({
      success: true,
      message: "Job skills created successfully",
      data: newskills,
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Error creating job skills"));
  }
};

export const updateJobSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedskills = await JobSkills.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedskills) next(createHttpError(404, "Job skills not found"));
    res.status(200).json({
      success: true,
      message: "Job skills updated successfully",
      data: updatedskills,
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Error updating job skills"));
  }
};

export const deleteJobSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedskills = await JobSkills.findByIdAndDelete(req.params.id);
    if (!deletedskills) next(createHttpError(404, "Job skills not found"));
    res
      .status(200)
      .json({ success: true, message: "Job skills deleted successfully" });
  } catch (error) {
    next(createHttpError(500, "Error deleting job skills"));
  }
};
