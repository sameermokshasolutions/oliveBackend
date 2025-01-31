import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import usermodal from "../../user/userModals/usermodal";

export const getLatestUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sort = "newest", page = "1", limit = "10" } = req.query;

    const sortOrder = sort === "oldest" ? 1 : -1;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skipNumber = (pageNumber - 1) * limitNumber;

    const matchConditions: any = {};
    const totalUsers = await usermodal.countDocuments(matchConditions);

    const users = await usermodal.aggregate([
      { $match: matchConditions },
      { $sort: { createdAt: sortOrder } },
      {
        $project: {
          createdAt: 1,
          role: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
        },
      },
      { $skip: skipNumber },
      { $limit: limitNumber },
    ]);

    res.status(200).json({
      succes: true,
      message: "users fetched successfully",
      data: {
        users,
        pagination: {
          total: totalUsers,
          page: pageNumber,
          limit: limitNumber,
          pages: Math.ceil(totalUsers / limitNumber),
        },
      },
    });
  } catch (error) {
    return next(createHttpError(500, "Internal server error"));
  }
};
