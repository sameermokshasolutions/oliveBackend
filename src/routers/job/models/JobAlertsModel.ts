import mongoose from "mongoose";
import { emailService } from "../../../services/emailService";
import { jobAlertTemplate } from "../../../views/emailTemplates";
import { config } from "../../../config/config";

const JobAlertSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    CandidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    email: { type: String, required: true },
    sent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

JobAlertSchema.post("save", async function (doc, next) {
  if (!doc.sent) {
    try {
      // Populate the job and candidate data to include in the email
      const populatedAlert: any = await doc.populate([
        {
          path: "jobId",
          select: "jobRole company location",
          populate: { path: "company", select: "companyName logoUrl" },
        },
      ]);

      if (!populatedAlert) {
        console.error(`Could not find populated alert for id: ${doc._id}`);
        return next();
      }

      const job: any = populatedAlert.jobId;
      const company: any = populatedAlert.jobId.company;

      // Send the email
      emailService.sendEmail(
        this.email,
        `Job Alert for ${job.jobRole}`,
        jobAlertTemplate({
          jobRole: job.jobRole,
          companyName: company.companyName,
          location: job.location,
          jobLink: `${config.frontEndUrl}/candidate/job/${job._id}`,
        })
      );

      await JobAlert.findByIdAndUpdate(doc._id, { sent: true }, { new: true });

      console.log(`Job alert email sent to ${doc.email}`);
    } catch (error) {
      console.error("Error sending job alert email:", error);
    }
  }
});

const JobAlert = mongoose.model("JobAlert", JobAlertSchema);
export default JobAlert;
