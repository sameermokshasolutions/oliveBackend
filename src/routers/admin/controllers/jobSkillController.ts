import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import JobSkills from "../models/jobSkills";

export const getAllJobSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const skills = await JobSkills.find();
    res.status(200).json({ success: true, data: skills });
  } catch (error) {
    next(error);
  }
};

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

    res.status(200).json({ success: true, data: skills });
  } catch (error) {
    next(error);
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
    next(error);
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
    if (!updatedskills) throw createHttpError(404, "Job skills not found");
    res.status(200).json({
      success: true,
      message: "Job skills updated successfully",
      data: updatedskills,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJobSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedskills = await JobSkills.findByIdAndDelete(req.params.id);
    if (!deletedskills) throw createHttpError(404, "Job skills not found");
    res
      .status(200)
      .json({ success: true, message: "Job skills deleted successfully" });
  } catch (error) {
    next(error);
  }
};
