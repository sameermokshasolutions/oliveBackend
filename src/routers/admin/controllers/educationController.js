const Education = require('../models/Education');
const createHttpError = require('http-errors');

exports.getAllEducation = async (req, res, next) => {
  try {
    const education = await Education.find();
    res.status(200).json({ success: true, data: education });
  } catch (error) {
    next(error);
  }
};

exports.createEducation = async (req, res, next) => {
  try {
    const newEducation = await Education.create(req.body);
    res.status(201).json({ success: true, message: 'Education level created successfully', data: newEducation });
  } catch (error) {
    next(error);
  }
};

exports.updateEducation = async (req, res, next) => {


  try {
    const updatedEducation = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEducation) throw createHttpError(404, 'Education level not found');
    res.status(200).json({ success: true, message: 'Education level updated successfully', data: updatedEducation });
  } catch (error) {
    next(error);
  }
};

exports.deleteEducation = async (req, res, next) => {
  try {
    const deletedEducation = await Education.findByIdAndDelete(req.params.id);
    if (!deletedEducation) throw createHttpError(404, 'Education level not found');
    res.status(200).json({ success: true, message: 'Education level deleted successfully' });
  } catch (error) {
    next(error);
  }
};

