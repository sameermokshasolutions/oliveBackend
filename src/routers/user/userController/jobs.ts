import Job from "../../job/models/Job";

export const getJobs = async (req: any, res: any) => {
  try {
    const jobs = await Job.find().populate({
      path: "company",
      select: "companyName aboutUs",
    });
    res.status(200).json(jobs);
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
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

export const getJobById = async (req: any, res: any) => {
  try {
    const jobId = req.params.id;
    const jobs = await Job.findById(jobId).populate({
      path: "company",
      select: "companyName aboutUs",
    });
    res.status(200).json(jobs);
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
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};
