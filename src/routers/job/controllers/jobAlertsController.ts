import CandidateModel from "../../user/userModals/Candidate";
import JobAlert from "../models/JobAlertsModel";

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
