import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import SaveCandidates from "../models/SaveCandidates";
import Candidate from "../models/SaveCandidates";

export const saveCandidates = async (req: any, res: Response, next: NextFunction) => {
  const userId = req?.user?.id;
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
        { $pull: { savedCandidates: candidateId } },
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
        { $addToSet: { savedCandidates: candidateId } },
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
  req: any,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;

  if (!userId) {
    return next(createHttpError(400, "User not found"));
  }

  try {
    const savedCandidatesByUser = await SaveCandidates.findOne({ userId });

    if (!savedCandidatesByUser) {
      return next(createHttpError(400, "No saved candidates found"));
    }

    const savedCandidatesList = savedCandidatesByUser?.savedCandidates;

    const candidates = await Candidate.find({
      _id: { $in: savedCandidatesList },
    }).select("-password -refreshToken"); // Exclude sensitive information

    res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: candidates,
      totalSaved: savedCandidatesByUser.totalSaved
    });
  } catch (error) {
    return next(createHttpError(400, `Something went wrong: ${error}`));
  }
};

