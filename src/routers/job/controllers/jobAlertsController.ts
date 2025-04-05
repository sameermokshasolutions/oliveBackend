import { NextFunction, Response } from "express";
import CandidateModel from "../../user/userModals/Candidate";
import JobAlert from "../models/JobAlertsModel";
import createHttpError from "http-errors";

export const getJobAlrtsOfCandidates = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(createHttpError(403, "Unauthorized"));
    }

    const candidate = await CandidateModel.findOne({ userId }).select("_id");
    if (!candidate) {
      return next(createHttpError(404, "candidate not found"));
    }

    const alerts = await JobAlert.aggregate([
      {
        $match: {
          CandidateId: candidate._id,
          sent: true,
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      {
        $unwind: "$jobDetails",
      },
      {
        $lookup: {
          from: "employerprofiles",
          localField: "jobDetails.company",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      {
        $unwind: "$companyDetails",
      },
      {
        $project: {
          jobId: 1,
          jobRole: "$jobDetails.jobRole",
          companyName: "$companyDetails.companyName",
          postedAt: "$companyDetails.createdAt",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "alerts fetched",
      data: alerts,
    });
  } catch (error) {
    console.log(error);
  }
};

export const createJobAlertsForMatchingCandidates = async (job: any) => {
  try {
    const matchingCandidates = await CandidateModel.aggregate([
      {
        $match: {
          jobRolePreferences: {
            $elemMatch: {
              value: job.jobRole,
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
    ]);

    const jobAlerts = [];
    for (const candidate of matchingCandidates) {
      try {
        const existingAlert = await JobAlert.findOne({
          jobId: job._id,
          email: candidate.userDetails.email,
        });

        if (!existingAlert) {
          const jobAlert = new JobAlert({
            jobId: job._id,
            CandidateId: candidate._id,
            email: candidate.userDetails.email,
            sent: false,
          });

          await jobAlert.save();
          jobAlerts.push(candidate);

          console.log(`Job alert created for candidate: ${candidate._id}`);
        } else {
          console.log(
            `Job alert already exists for candidate: ${candidate._id} and job: ${job._id}`
          );
        }
      } catch (alertError) {
        console.error(
          `Error creating job alert for candidate ${candidate._id}:`,
          alertError
        );
      }
    }

    return jobAlerts;
  } catch (error) {
    console.error("Error in finding matching candidates:", error);
    throw error;
  }
};
