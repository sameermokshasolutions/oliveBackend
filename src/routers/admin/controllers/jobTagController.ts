import JobTag from "../models/JobTag";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import JobSkills from "../models/jobSkills";

export const getAllJobTags = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tags = await JobTag.find().populate({
      path: "role",
      select: "name",
    });
    res.status(200).json({
      success: true,
      message: "Job tags fethced successfully",
      data: tags,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobTagByRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      next(createHttpError(400, "Role ID is required"));
    }

    const tags = await JobTag.find({ role: id });

    if (!tags.length) {
      next(createHttpError(404, "No job tags found for this role"));
    }

    res.status(200).json({
      success: true,
      message: "Job tags by role fethced successfully",
      data: tags,
    });
  } catch (error) {
    next(error);
  }
};

export const createJobTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newTag = await JobTag.create(req.body);
    res.status(201).json({
      success: true,
      message: "Job tag created successfully",
      data: newTag,
    });
  } catch (error) {
    next(error);
  }
};

export const updateJobTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedTag = await JobTag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTag) next(createHttpError(404, "Job tag not found"));
    res.status(200).json({
      success: true,
      message: "Job tag updated successfully",
      data: updatedTag,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJobTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedTag = await JobTag.findByIdAndDelete(req.params.id);
    if (!deletedTag) next(createHttpError(404, "Job tag not found"));
    res
      .status(200)
      .json({ success: true, message: "Job tag deleted successfully" });
  } catch (error) {
    next(error);
  }
};
