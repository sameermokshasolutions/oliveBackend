import AppliedJobs from "../models/AppliedJobs.model";
import Job from "../models/Job";

export const getJobs = async (req: any, res: any) => {
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

    const appliedJob = await AppliedJobs.findOne({
      userId,
      jobId: jobId,
    });

    const hasApplied = !!appliedJob;

    res.status(200).json({
      success: true,
      message: "Job Fetched Successfully",
      data: {
        ...jobs?.toObject(),
        hasApplied,
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
