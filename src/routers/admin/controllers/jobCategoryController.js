const JobCategory = require('../models/JobCategory');
const createHttpError = require('http-errors');

exports.getAllJobCategories = async (req, res, next) => {
  try {
    const categories = await JobCategory.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

exports.createJobCategory = async (req, res, next) => {
  try {
    const newCategory = await JobCategory.create(req.body);
    res.status(201).json({ success: true, message: 'Job category created successfully', data: newCategory });
  } catch (error) {
    next(error);
  }
};

exports.updateJobCategory = async (req, res, next) => {
  try {
    const updatedCategory = await JobCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCategory) throw createHttpError(404, 'Job category not found');
    res.status(200).json({ success: true, message: 'Job category updated successfully', data: updatedCategory });
  } catch (error) {
    next(error);
  }
};

exports.deleteJobCategory = async (req, res, next) => {
  try {
    const deletedCategory = await JobCategory.findByIdAndDelete(req.params.id);
    if (!deletedCategory) throw createHttpError(404, 'Job category not found');
    res.status(200).json({ success: true, message: 'Job category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

