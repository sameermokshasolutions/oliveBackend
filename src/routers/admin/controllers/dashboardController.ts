import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import usermodal from "../../user/userModals/usermodal";
import Job from "../../job/models/Job";

export const dashboardSummary = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const candidates = await usermodal.countDocuments({ role: "candidate" });
    const employers = await usermodal.countDocuments({ role: "employer" });

    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    const activeJobs = await Job.countDocuments({
      deadline: { $gte: currentDate },
      jobApprovalStatus: "approved",
    });

    const expiredJobs = await Job.countDocuments({
      deadline: { $lt: currentDate },
      jobApprovalStatus: "approved",
    });

    const pendingJobs = await Job.countDocuments({
      deadline: { $gte: currentDate },
      jobApprovalStatus: "pending",
    });

    const allJobs = await Job.countDocuments();

    res.status(200).json({
      success: true,
      message: "Dashboard summary fetched",
      data: {
        candidates,
        employers,
        activeJobs,
        expiredJobs,
        pendingJobs,
        allJobs,
      },
    });
  } catch (error) {
    return next(
      createHttpError(
        500,
        "Something went wrong while fetching dashboard summary"
      )
    );
  }
};
