import AppliedJobs from "../models/AppliedJobs.model";
import Job from "../models/Job";
import SavedJob from "../models/savedJobsModel";

export const getJobs = async (req: any, res: any) => {
  const userId = req.user.id;

  try {
    const jobs = await Job.find().populate({
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

    const appliedJob = await AppliedJobs.findOne({
      userId,
      jobId: jobId,
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
