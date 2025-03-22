import { NextFunction, Request, Response } from "express";
import JobTemplate, { IJobTemplates } from "../models/jobTemplates.model";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import EmployerProfile from "../../employer/models/EmployerProfile";

export const CreateJobTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: IJobTemplates = req.body;
    const JobTemp = new JobTemplate(data);
    await JobTemp.save();

    res.status(201).json({
      success: true,
      message: "Job template created successfuly",
      data: JobTemp,
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Internal server error"));
  }
};

export const UpdateJobTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { templateId } = req.params;
    const data: Partial<IJobTemplates> = req.body;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return next(createHttpError(400, "Invalid template ID"));
    }

    const updatedJobTemp = await JobTemplate.findByIdAndUpdate(
      templateId,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedJobTemp) {
      return next(createHttpError(404, "Template not found"));
    }

    res.status(200).json({
      success: true,
      message: "Job template updated successfully",
      data: updatedJobTemp,
    });
  } catch (error) {
    console.error("Error updating job template:", error);
    next(createHttpError(500, "Internal server error"));
  }
};

export const DeletJobTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { templateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return next(createHttpError(400, "Invalid template ID"));
    }

    const deletedTemplate = await JobTemplate.findByIdAndDelete(templateId);

    if (!deletedTemplate) {
      return next(createHttpError(404, "Template not found"));
    }

    res.status(200).json({
      success: true,
      message: "Job template deleted successfully",
      data: deletedTemplate,
    });
  } catch (error) {
    console.error("Error deleting job template:", error);
    next(createHttpError(500, "Internal server error"));
  }
};

export const ReadJobTemplates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allJobTemplates = await JobTemplate.find().select("jobTitle jobRole");
    res.status(200).json({
      success: true,
      message: "Job template fetched successfully",
      data: allJobTemplates,
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Internal server error"));
  }
};

export const ReadJobTemplateById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { templateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return next(createHttpError(400, "Invalid template ID"));
    }

    const jobTemplate = await JobTemplate.findById(templateId);

    if (!jobTemplate) {
      return next(createHttpError(404, "job template not found"));
    }

    res.status(200).json({
      success: true,
      message: "Job template fetched successfully",
      data: jobTemplate,
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Internal server error"));
  }
};

export const ReadJobTemplatesByCompanyType = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(createHttpError(401, "Unauthorized request"));
    }

    const employerProfile = await EmployerProfile.findOne({ userId }).select(
      "companyType"
    );

    if (!employerProfile) {
      return next(createHttpError(404, "employer profile not found"));
    }

    if (!employerProfile.companyType) {
      return next(createHttpError(404, "Incomplete employer profile"));
    }

    const jobTemplates = await JobTemplate.find({
      companyType: employerProfile.companyType,
    });

    res.status(200).json({
      success: true,
      message: "Job templates fetched successfully",
      data: jobTemplates,
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Internal server error"));
  }
};
