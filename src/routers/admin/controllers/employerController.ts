import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import EmployerProfile from "../../employer/models/EmployerProfile";

export const getAllEmployers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const employers = await EmployerProfile.find().populate({
      path: "userId",
      select: "email emailVerification status accountStatus",
    });

    const data = await EmployerProfile.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind:"$userInfo"
      },
     
    ]);

    res.status(200).json({
      success: true,
      message: "employers fetched successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "something went wrong"));
  }
};
