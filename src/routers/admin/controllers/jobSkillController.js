
const createHttpError = require('http-errors');
const jobSkills = require('../models/jobSkills');

exports.getAllJobSkills = async (req, res, next) => {
    try {
        const skills = await jobSkills.find();
        res.status(200).json({ success: true, data: skills });
    } catch (error) {
        next(error);
    }
};

exports.createJobSkills = async (req, res, next) => {
    try {
        const newskills = await jobSkills.create(req.body);
        res.status(201).json({ success: true, message: 'Job skills created successfully', data: newskills });
    } catch (error) {
        next(error);
    }
};

exports.updateJobSkills = async (req, res, next) => {
    try {
        const updatedskills = await Jobskills.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedskills) throw createHttpError(404, 'Job skills not found');
        res.status(200).json({ success: true, message: 'Job skills updated successfully', data: updatedskills });
    } catch (error) {
        next(error);
    }
};

exports.deleteJobSkills = async (req, res, next) => {
    try {
        const deletedskills = await Jobskills.findByIdAndDelete(req.params.id);
        if (!deletedskills) throw createHttpError(404, 'Job skills not found');
        res.status(200).json({ success: true, message: 'Job skills deleted successfully' });
    } catch (error) {
        next(error);
    }
};

