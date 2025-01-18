// import AppliedJobs from "../models/AppliedJobs.model";
import { PipelineStage } from "mongoose";
import logger from "../../../utils/logger";
import AppliedJobsByCandidateModel from "../models/AppliedJobsByCandidateModel";
import Job, { FacetResult, SearchQueryParams } from "../models/Job";
import SavedJob from "../models/savedJobsModel";

export const getJobs = async (req: any, res: any) => {
  const userId = req.user.id;

  try {
    const jobs = await Job.find({ jobApprovalStatus: "approved" })
      .sort({ createdAt: -1 })
      .populate({
        path: "company",
        select: "companyName aboutUs",
      });

    const savedJob = await SavedJob.findOne({ userId }).select("savedJobs");

    if (!savedJob) {
      return res.status(200).json({
        success: true,
        message: "Jobs Fetched successfully",
        data: jobs,
      });
    }

    const savedJobIds = savedJob.savedJobs.map((saved: any) =>
      saved.toString()
    );

    const jobsWithStatus = jobs.map((job) => {
      const hasSavedJob = savedJobIds.includes(job._id!.toString());
      return {
        ...job.toObject(),
        hasSavedJob,
      };
    });

    res.status(200).json({
      success: true,
      message: "Jobs Fetched successfully",
      data: jobsWithStatus,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

export const getPublicJobs = async (req: any, res: any) => {
  try {
    const jobs = await Job.find().populate({
      path: "company",
      select: "companyName aboutUs",
    });
    res.status(200).json({
      success: true,
      message: "Jobs Fetched successfully",
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

export const getJobById = async (req: any, res: any) => {
  try {
    const jobId = req.params.id;
    const userId = req.user?.id;

    const jobs = await Job.findById(jobId).populate({
      path: "company",
      select: "companyName aboutUs",
    });

    const appliedJob = await AppliedJobsByCandidateModel.findOne({
      userId,
      appliedJobs: {
        $elemMatch: { jobId },
      },
    });

    const savedJob = await SavedJob.findOne({
      userId,
      savedJobs: { $in: [jobId] },
    });

    const hasSavedJob = !!savedJob;
    const hasApplied = !!appliedJob;

    res.status(200).json({
      success: true,
      message: "Job Fetched Successfully",
      data: {
        ...jobs?.toObject(),
        hasApplied,
        hasSavedJob,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

export const getPublicJobById = async (req: any, res: any) => {
  try {
    const jobId = req.params.id;
    const jobs = await Job.findById(jobId).populate({
      path: "company",
      select: "companyName aboutUs",
    });
    res.status(200).json({
      success: true,
      message: "Job Fetched successfully",
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};
export const searchJob = async (req: any, res: any) => {
  try {
    const {
      keyword,
      location,
      minSalary,
      maxSalary,
      jobType,
      jobRole,
      experience,
      tags,
      skills,
      page = "1",
      limit = "10",
    }: SearchQueryParams = req.query;

    const userId = (req as any).user?.id;

    const matchConditions: any = {};

    //To get only admin approved jobs
    matchConditions.$and = [{ jobApprovalStatus: "approved" }];
    if (keyword) {
      matchConditions.$or = [
        { jobTitle: { $regex: keyword, $options: "i" } },
        { jobDescription: { $regex: keyword, $options: "i" } },
        { jobRole: { $regex: keyword, $options: "i" } },
       
      ];
    }
    if (location) {
      matchConditions.location = { $regex: location, $options: "i" };
    }

    if (minSalary && maxSalary) {
      matchConditions.$and = [
        { minSalary: { $gte: minSalary } },
        { maxSalary: { $lte: maxSalary } },
      ];
    }
    if (jobType) {
      matchConditions.jobType = jobType;
    }
    if (jobRole) {
      matchConditions.jobRole = jobRole;
    }

    if (experience) {
      matchConditions.experience = experience;
    }

    if (tags) {
      matchConditions.tags = {
        $in: tags.split(",").map((tag) => new RegExp(tag.trim(), "i")),
      };
    }

    if (skills) {
      matchConditions.skills = {
        $in: skills.split(",").map((skill) => new RegExp(skill.trim(), "i")),
      };
    }

    // Pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Aggregation pipeline
    const pipeline = [
      { $match: matchConditions },
      {
        $lookup: {
          from: "employerprofiles",
          localField: "company",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },
      {
        $project: {
          _id: 1,
          jobTitle: 1,
          jobDescription: 1,
          jobCategory: 1,
          tags: 1,
          jobRole: 1,
          salaryOption: 1,
          minSalary: 1,
          maxSalary: 1,
          customSalary: 1,
          salaryPeriod: 1,
          education: 1,
          experience: 1,
          jobType: 1,
          totalVacancies: 1,
          deadline: 1,
          location: 1,
          requirements: 1,
          skills: 1,
          createdAt: 1,
          updatedAt: 1,
          jobApprovalStatus:1,
          "company._id": 1,
          "company.companyName": 1,
          "company.aboutUs": 1,
        },

      },
      { $skip: skip },
      { $limit: limitNumber },
    ];

    // Execute aggregation
    const jobs = await Job.aggregate(pipeline);

    // If user is authenticated, get saved jobs status
    if (userId) {
      const savedJob = await SavedJob.findOne({ userId }).select("savedJobs");
      if (savedJob) {
        const savedJobIds = savedJob.savedJobs.map((saved: any) =>
          saved.toString()
        );
        jobs.forEach((job: any) => {
          job.hasSavedJob = savedJobIds.includes(job._id.toString());
        });
      }
    }

    // Get total count for pagination
    const totalJobs = await Job.countDocuments(matchConditions);

    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: {
        jobs,
        pagination: {
          total: totalJobs,
          page: pageNumber,
          limit: limitNumber,
          pages: Math.ceil(totalJobs / limitNumber),
        },
      },
    });
  } catch (error) {
    logger.error(`Error fetching jobs:${error}`);
    res.status(500).json({ success: false, error: "Failed to search jobs" });
  }
};
export const getJobsWithFacets = async (req: any, res: any) => {
  try {
    const { keyword } = req.query;
    const userId = (req as any).user?.id;
    const matchStage = {
      $match: keyword
        ? {
            $or: [
              { jobTitle: { $regex: String(keyword), $options: "i" } },
              { jobRole: { $regex: String(keyword), $options: "i" } },
              { jobDescription: { $regex: String(keyword), $options: "i" } },
              { skills: { $in: [new RegExp(String(keyword), "i")] } },
              { tags: { $in: [new RegExp(String(keyword), "i")] } },
            ],
          }
        : {},
    };
    const pipeline: PipelineStage[] = [
      {
        $facet: {
          jobs: [matchStage, { $limit: 10 }],
          jobTypes: [
            {
              $group: {
                _id: "$jobType",
                count: { $sum: 1 },
              },
            },
          ],
          jobRole: [
            {
              $group: {
                _id: "$jobRole",
                count: { $sum: 1 },
              },
            },
          ],
          locations: [
            {
              $group: {
                _id: "$location",
                count: { $sum: 1 },
              },
            },
          ],
          // salaryRanges: [
          //   {
          //     $group: {
          //       _id: {
          //         $switch: {
          //           branches: [
          //             { case: { $lte: ["$maxSalary", "50000"] }, then: "0-50K" },
          //             {
          //               case: { $lte: ["$maxSalary", "100000"] },
          //               then: "50K-100K",
          //             },
          //             {
          //               case: { $lte: ["$maxSalary", "150000"] },
          //               then: "100K-150K",
          //             },
          //           ],
          //           default: "150K+",
          //         },
          //       },
          //       count: { $sum: 1 },
          //     },
          //   },
          // ],
          experienceLevels: [
            {
              $group: {
                _id: "$experience",
                count: { $sum: 1 },
              },
            },
          ],
          skills: [
            { $unwind: "$skills" },
            {
              $group: {
                _id: "$skills",
                count: { $sum: 1 },
              },
            },
            {
              $sort: {
                count: -1,
              },
            },
            { $limit: 10 },
          ],
          tags: [
            { $unwind: "$tags" },
            {
              $group: {
                _id: "$tags",
                count: { $sum: 1 },
              },
            },
            {
              $sort: {
                count: -1,
              },
            },
            { $limit: 10 },
          ],
        },
      },
    ];

    const [results] = await Job.aggregate<FacetResult>(pipeline);

    if (userId && results.jobs.length > 0) {
      const savedJob = await SavedJob.findOne({ userId }).select("savedJobs");
      if (savedJob) {
        const savedJobIds = savedJob.savedJobs.map((saved: any) =>
          saved.toString()
        );
        results.jobs.forEach((job: any) => {
          job.hasSavedJob = savedJobIds.includes(job._id.toString());
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Jobs facets fetched successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error fetching job facets:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch job facets" });
  }
};
