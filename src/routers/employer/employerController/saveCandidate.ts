import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import SaveCandidates from "../models/SaveCandidates";
import CandidateModel from "../../user/userModals/Candidate";
import mongoose from "mongoose";

export const saveCandidates = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const candidateId = req.params.id;

  if (!userId) {
    return next(createHttpError(404, "User not found"));
  }

  try {
    const existingCandidate = await SaveCandidates.findOne({
      userId,
      savedCandidates: { $in: [candidateId] },
    });

    if (existingCandidate) {
      const updatedSavedCandidate = await SaveCandidates.findOneAndUpdate(
        { userId },
        {
          $pull: { savedCandidates: candidateId },
          $inc: { totalSaved: -1 },
        },
        { new: true, upsert: true }
      );

      res.status(200).json({
        success: true,
        message: "Candidate unsaved successfully",
        data: updatedSavedCandidate,
      });
    } else {
      const updatedSavedCandidate = await SaveCandidates.findOneAndUpdate(
        { userId },
        {
          $addToSet: { savedCandidates: candidateId },
          $inc: { totalSaved: 1 },
        },
        { new: true, upsert: true }
      );

      res.status(200).json({
        success: true,
        message: "Candidate saved successfully",
        data: updatedSavedCandidate,
      });
    }
  } catch (error) {
    return next(createHttpError(400, "Error while saving candidates"));
  }
};

export const getSavedCandidates = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const { page = "1", limit = "10" } = req.query;

  if (!userId) {
    return next(createHttpError(400, "User not found"));
  }

  const pageNumber = Number(page) > 0 ? Number(page) : 1;
  const limitNumber = Number(limit) > 0 ? Number(limit) : 10;
  const skip = (pageNumber - 1) * limitNumber;

  try {
    const savedCandidatesByUser = await SaveCandidates.findOne({ userId });

    if (!savedCandidatesByUser) {
      res.status(200).json({
        success: true,
        message: "No saved candidates",
        data: [],
        totalSaved: 0,
      });
    }

    const savedCandidatesList = savedCandidatesByUser?.savedCandidates;

    const totalDocuments = await CandidateModel.countDocuments({
      _id: { $in: savedCandidatesList },
    });

    const pipeline: mongoose.PipelineStage[] = [
      {
        $match: {
          _id: { $in: savedCandidatesList },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      { $skip: skip },
      { $limit: limitNumber },
      {
        $project: {
          userId: 1,
          experienceYears: 1,
          educationList: 1,
          profileUrl: 1,
          resumeUrl: 1,
          availability: 1,
          firstName: "$userInfo.firstName",
          lastName: "$userInfo.lastName",
        },
      },
    ];

    const candidates = await CandidateModel.aggregate(pipeline);

    res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: {
        candidates: candidates,
        pagination: {
          total: totalDocuments,
          page: pageNumber,
          limit: limitNumber,
          pages: Math.ceil(totalDocuments / limitNumber),
        },
      },
    });
  } catch (error) {
    return next(createHttpError(500, `Internal server error`));
  }
};
