import mongoose, { Document, Model } from "mongoose";

// Interface for instance methods
interface ISaveCandidatesMethods {
  isCandidateSaved(candidateId: mongoose.Types.ObjectId): boolean;
}

// Interface for static methods
interface ISaveCandidatesModel extends Model<ISaveCandidatesDoc> {
  checkCandidateSaved(
    userId: mongoose.Types.ObjectId,
    candidateId: mongoose.Types.ObjectId
  ): Promise<boolean>;
}

// Interface for the document
interface ISaveCandidatesDoc extends Document {
  userId: mongoose.Types.ObjectId;
  savedCandidates: mongoose.Types.ObjectId[];
  totalSaved: number;
}

// Combine document and methods interface
interface ISaveCandidates extends ISaveCandidatesDoc, ISaveCandidatesMethods {}

const saveCandidatesSchema = new mongoose.Schema<ISaveCandidates>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    savedCandidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
      },
    ],
    totalSaved: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

saveCandidatesSchema.pre("save", function (next) {
  this.totalSaved = this.savedCandidates.length;
  next();
});

// Instance method to check if a candidate is saved (for when you already have the document)
saveCandidatesSchema.methods.isCandidateSaved = function (
  candidateId: mongoose.Types.ObjectId
): boolean {
  return this.savedCandidates.some(
    (saved: any) => saved.toString() === candidateId.toString()
  );
};

// Static method to check if a candidate is saved (when you don't have the document)
saveCandidatesSchema.statics.checkCandidateSaved = async function (
  userId: mongoose.Types.ObjectId,
  candidateId: mongoose.Types.ObjectId
): Promise<boolean> {
  const result = await this.findOne({
    userId,
    savedCandidates: candidateId,
  }).lean();

  return !!result;
};

const SaveCandidates = mongoose.model<ISaveCandidates, ISaveCandidatesModel>(
  "SaveCandidates",
  saveCandidatesSchema
);
export default SaveCandidates;
