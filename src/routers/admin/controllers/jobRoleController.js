const JobRole = require('../models/JobRole');
const createHttpError = require('http-errors');

exports.getAllJobRoles = async (req, res, next) => {
  try {
    const roles = await JobRole.find().populate('categoryId');
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    next(error);
  }
};

exports.createJobRole = async (req, res, next) => {
  try {
    const newRole = await JobRole.create(req.body);
    res.status(201).json({ success: true, message: 'Job role created successfully', data: newRole });
  } catch (error) {
    next(error);
  }
};

exports.updateJobRole = async (req, res, next) => {
  try {
    const updatedRole = await JobRole.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRole) throw createHttpError(404, 'Job role not found');
    res.status(200).json({ success: true, message: 'Job role updated successfully', data: updatedRole });
  } catch (error) {
    next(error);
  }
};

exports.deleteJobRole = async (req, res, next) => {
  try {
    const deletedRole = await JobRole.findByIdAndDelete(req.params.id);
    if (!deletedRole) throw createHttpError(404, 'Job role not found');
    res.status(200).json({ success: true, message: 'Job role deleted successfully' });
  } catch (error) {
    next(error);
  }
};

