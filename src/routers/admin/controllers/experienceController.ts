import Experience from "../models/Experience";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";

export const getAllExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortField = "name";
    const sortOrder = 1;

    const experience = await Experience.find().sort({ sort: sortOrder });
    res.status(200).json({ success: true, data: experience });
  } catch (error) {
    next(error);
  }
};

export const createExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const existingSort = await Experience.findOne({ sort: req.body.sort });
    if (existingSort) {
      throw createHttpError(409, "Sort already added");
    }
    const newExperience = await Experience.create(req.body);
    res.status(201).json({
      success: true,
      message: "Experience level created successfully",
      data: newExperience,
    });
  } catch (error) {
    next(error);
  }
};
export const createExperienceInBulk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { start, end } = req.body;

    if (start % 2 !== 0 || end % 2 !== 0) {
      throw createHttpError(400, "Start and end must be even numbers");
    }

    const lastExperience = await Experience.findOne().sort({ sort: -1 });
    let sort = lastExperience ? lastExperience.sort + 1 : 1;

    const experienceArray = [];

    for (let i = start; i < end; i += 2) {
      const name = `${i} to ${i + 2} years`;

      const existingExperience = await Experience.findOne({
        $or: [{ name }, { sort }],
      });
      if (existingExperience) {
        throw createHttpError(
          409,
          `Experience with name "${name}" or sort "${sort}" already exists please enter different range.`
        );
      }

      experienceArray.push({ name, sort });
      sort += 1;
    }
    const data = await Experience.insertMany(experienceArray);

    res.status(201).json({
      success: true,
      message: "Experience levels created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const updateExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedExperience)
      throw createHttpError(404, "Experience level not found");
    res.status(200).json({
      success: true,
      message: "Experience level updated successfully",
      data: updatedExperience,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedExperience = await Experience.findByIdAndDelete(req.params.id);
    if (!deletedExperience)
      throw createHttpError(404, "Experience level not found");
    res.status(200).json({
      success: true,
      message: "Experience level deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/*
const addExperienceLevel = async (name, sortOrder) => {
  // Shift existing sortOrders if necessary
  await ExperienceLevel.updateMany(
    { sortOrder: { $gte: sortOrder } },
    { $inc: { sortOrder: 1 } }
  );

  const newLevel = new ExperienceLevel({ name, sortOrder });
  await newLevel.save();
};


const deleteExperienceLevel = async (id) => {
  const level = await ExperienceLevel.findById(id);
  await ExperienceLevel.deleteOne({ _id: id });

  // Shift remaining sortOrders
  await ExperienceLevel.updateMany(
    { sortOrder: { $gt: level.sortOrder } },
    { $inc: { sortOrder: -1 } }
  );
};
*/
