import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import EmployerProfile from "../../employer/models/EmployerProfile";

export const getAllEmployers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      keyword,
      company_type,
      industryType,
      page = "1",
      limit = "10",
    }: any = req.query;

    const employerprofileMatchConditions: any = {};

    if (keyword) {
      employerprofileMatchConditions.companyName = {
        $regex: keyword,
        $options: "i",
      };
    }
    if (company_type) {
      employerprofileMatchConditions.company_type = company_type;
    }
    if (industryType) {
      employerprofileMatchConditions.industryType = industryType;
    }

    // Pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const employerData = await EmployerProfile.aggregate([
      { $match: employerprofileMatchConditions },
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
      {
        $lookup: {
          from: "jobs",
          let: { companyId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$company", "$$companyId"] },
                jobApprovalStatus: "approved",
              },
            },
          ],
          as: "approvedJobs",
        },
      },
      {
        $addFields: {
          approvedJobCount: { $size: "$approvedJobs" },
          email: "$userInfo.email",
          status: "$userInfo.status",
          accountStatus: "$userInfo.accountStatus",
          emailVerification: "$userInfo.emailVerification",
          profileStatus: "$userInfo.profileStatus",
        },
      },
      {
        $project: {
          _id: 1,
          companyName: 1,
          contactNumber: 1,
          logoUrl: 1,
          yearOfEstablishment: 1,
          approvedJobCount: 1,
          email: 1,
          status: 1,
          accountStatus: 1,
          emailVerification: 1,
          profileStatus: 1,
        },
      },
      { $skip: skip },
      { $limit: limitNumber },
    ]);

    const totalDocuments = await EmployerProfile.countDocuments(
      employerprofileMatchConditions
    );

    res.status(200).json({
      success: true,
      message: "employers fetched successfully",
      data: {
        employerData,
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
    return next(createHttpError(500, "something went wrong"));
  }
};
