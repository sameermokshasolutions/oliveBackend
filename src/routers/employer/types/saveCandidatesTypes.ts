import mongoose, { Document, Model } from "mongoose";

// Interface for instance methods
interface ISaveCandidatesMethods {
  isCandidateSaved(candidateId: mongoose.Types.ObjectId): boolean;
}

// Interface for the document
interface ISaveCandidatesDoc extends Document {
  userId: mongoose.Types.ObjectId;
  savedCandidates: mongoose.Types.ObjectId[];
  totalSaved: number;
}

// Interface for static methods
export interface ISaveCandidatesModel extends Model<ISaveCandidatesDoc> {
  checkCandidateSaved(
    userId: mongoose.Types.ObjectId,
    candidateId: mongoose.Types.ObjectId
  ): Promise<boolean>;
}

// Combine document and methods interface
export interface ISaveCandidates extends ISaveCandidatesDoc, ISaveCandidatesMethods {}
