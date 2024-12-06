const JobTag = require('../models/JobTag');
const createHttpError = require('http-errors');

exports.getAllJobTags = async (req, res, next) => {
  try {
    const tags = await JobTag.find();
    res.status(200).json({ success: true, data: tags });
  } catch (error) {
    next(error);
  }
};

exports.createJobTag = async (req, res, next) => {
  try {
    const newTag = await JobTag.create(req.body);
    res.status(201).json({ success: true, message: 'Job tag created successfully', data: newTag });
  } catch (error) {
    next(error);
  }
};

exports.updateJobTag = async (req, res, next) => {
  try {
    const updatedTag = await JobTag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTag) throw createHttpError(404, 'Job tag not found');
    res.status(200).json({ success: true, message: 'Job tag updated successfully', data: updatedTag });
  } catch (error) {
    next(error);
  }
};

exports.deleteJobTag = async (req, res, next) => {
  try {
    const deletedTag = await JobTag.findByIdAndDelete(req.params.id);
    if (!deletedTag) throw createHttpError(404, 'Job tag not found');
    res.status(200).json({ success: true, message: 'Job tag deleted successfully' });
  } catch (error) {
    next(error);
  }
};

