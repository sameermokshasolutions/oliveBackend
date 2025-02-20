import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import usermodal from "../../user/userModals/usermodal";

export const getAllCandidates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { keyword, profileStatus, page = "1", limit = "10" }: any = req.query;

    const matchConditions: Record<string, any> = { role: "candidate" };

    if (keyword) {
      matchConditions.$or = [
        { firstName: { $regex: keyword, $options: "i" } },
        { lastName: { $regex: keyword, $options: "i" } },
      ];
    }

    if (profileStatus) {
      matchConditions.profileStatus = profileStatus;
    }

    // Pagination
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const limitNumber = Number(limit) > 0 ? Number(limit) : 10;

    const skip = (pageNumber - 1) * limitNumber;

    const pipeline = [
      { $match: matchConditions },
      {
        $lookup: {
          from: "candidates",
          localField: "_id",
          foreignField: "userId",
          as: "candidateData",
        },
      },
      {
        $unwind: {
          path: "$candidateData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          profileUrl: "$candidateData.profileUrl",
          resumeUrl: "$candidateData.resumeUrl",
          experienceYears: "$candidateData.experienceYears",
          joinedDate: "$createdAt",
        },
      },
      { $skip: skip },
      { $limit: limitNumber },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          profileStatus: 1,
          accountStatus: 1,
          joinedDate: 1,
          profileUrl: 1,
          resumeUrl: 1,
          experienceYears: 1,
        },
      },
    ];

    const candidates = await usermodal.aggregate(pipeline);

    const totalDocuments = await usermodal.countDocuments(matchConditions);

    res.status(200).json({
      success: true,
      message: candidates.length
        ? "Candidates fetched successfully"
        : "No candidates found",
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
    console.log(error);
    return next(createHttpError(500, "Something went wrong"));
  }
};
