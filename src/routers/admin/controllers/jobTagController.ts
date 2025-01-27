import JobTag from "../models/JobTag";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";

export const getAllJobTags = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tags = await JobTag.find();
    res.status(200).json({ success: true, data: tags });
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
    res
      .status(201)
      .json({
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
    if (!updatedTag) throw createHttpError(404, "Job tag not found");
    res
      .status(200)
      .json({
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
    if (!deletedTag) throw createHttpError(404, "Job tag not found");
    res
      .status(200)
      .json({ success: true, message: "Job tag deleted successfully" });
  } catch (error) {
    next(error);
  }
};
