import { RequestHandler } from "express";
import Job, { IJob } from "../../job/models/Job";
import EmployerProfile from "../models/EmployerProfile";
import mongoose from "mongoose";
import { validateJobInput } from "../../../utils/validateJobInputs";

// export const createJobController: RequestHandler = async (
//   req: any,
//   res,
//   next
// ) => {
//   const userId = req.user?.id;
//   try {
//     try {
//       const jobData: IJob = req.body;
//       jobData.company = userId;
//       const newJob = new Job(jobData);
//       await newJob.save();
//       res
//         .status(201)
//         .json({ success: true, message: "Job created successfully" });
//     } catch (error) {
//       console.log(error);

//       res.status(500).json({ message: "Error creating job", error });
//     }
//   } catch (error) {
//     console.log(error);

//     next(error);
//   }
// };

export const createJobController: RequestHandler = async (
  req: any,
  res,
  next
) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return next();
  }

  try {
    const jobData: Partial<IJob> = req.body;

    const validationError = validateJobInput(jobData);
    if (validationError) {
      res.status(400).json({ success: false, message: validationError });
      return next();
    }

    const employerProfile = await EmployerProfile.findOne({ userId });

    if (employerProfile) {
      jobData.company = employerProfile._id as any;
    } else {
      res
        .status(404)
        .json({ success: false, message: "Employer profile not found" });
    }

    // Convert deadline string to Date object if it's not already
    if (typeof jobData.deadline === "string") {
      jobData.deadline = new Date(jobData.deadline);
    }

    const newJob = new Job(jobData);
    await newJob.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({
      success: false,
      message: "Error creating job",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
