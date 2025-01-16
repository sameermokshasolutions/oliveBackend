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
exports.createExperienceInBulk = async (req, res, next) => {
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
