const Experience = require("../models/Experience");
const createHttpError = require("http-errors");

exports.getAllExperience = async (req, res, next) => {
  try {
    const sort = { sort: 1 };
    const experience = await Experience.find().sort(sort);
    res.status(200).json({ success: true, data: experience });
  } catch (error) {
    next(error);
  }
};

exports.createExperience = async (req, res, next) => {
  try {
    const existingSort = await Experience.findOne({ sort: req.body.sort });
    if (existingSort) {
      throw createHttpError(409, "Sort already added");
    }
    const newExperience = await Experience.create(req.body);
    res
      .status(201)
      .json({
        success: true,
        message: "Experience level created successfully",
        data: newExperience,
      });
  } catch (error) {
    next(error);
  }
};

exports.updateExperience = async (req, res, next) => {
  try {
    const updatedExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedExperience)
      throw createHttpError(404, "Experience level not found");
    res
      .status(200)
      .json({
        success: true,
        message: "Experience level updated successfully",
        data: updatedExperience,
      });
  } catch (error) {
    next(error);
  }
};

exports.deleteExperience = async (req, res, next) => {
  try {
    const deletedExperience = await Experience.findByIdAndDelete(req.params.id);
    if (!deletedExperience)
      throw createHttpError(404, "Experience level not found");
    res
      .status(200)
      .json({
        success: true,
        message: "Experience level deleted successfully",
      });
  } catch (error) {
    next(error);
  }
};
