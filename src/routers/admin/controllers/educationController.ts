import Education from "../models/Education";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";

export const getAllEducation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const education = await Education.find();
    res.status(200).json({ success: true, data: education });
  } catch (error) {
    next(error);
  }
};

export const createEducation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newEducation = await Education.create(req.body);
    res.status(201).json({
      success: true,
      message: "Education level created successfully",
      data: newEducation,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEducation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedEducation = await Education.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEducation)
      throw createHttpError(404, "Education level not found");
    res.status(200).json({
      success: true,
      message: "Education level updated successfully",
      data: updatedEducation,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEducation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedEducation = await Education.findByIdAndDelete(req.params.id);
    if (!deletedEducation)
      throw createHttpError(404, "Education level not found");
    res
      .status(200)
      .json({ success: true, message: "Education level deleted successfully" });
  } catch (error) {
    next(error);
  }
};
