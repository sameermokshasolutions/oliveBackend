import { IJob } from "../routers/job/models/Job";

export function validateJobInput(jobData: Partial<IJob>): string | null {
  if (!jobData.jobTitle) return "Job title is required";
  if (!jobData.jobDescription) return "Job description is required";
  if (!jobData.jobCategory) return "Job category is required";
  if (!jobData.tags || jobData.tags.length === 0)
    return "At least one tag is required";
  if (!jobData.jobRole) return "Job role is required";
  if (!jobData.salaryOption) return "Salary option is required";
  if (
    jobData.salaryOption === "range" &&
    (!jobData.minSalary || !jobData.maxSalary)
  ) {
    return "Min and max salary are required for salary range";
  }
  if (jobData.salaryOption === "custom" && !jobData.customSalary) {
    return "Custom salary is required when salary option is custom";
  }
  if (!jobData.education || jobData.education.length === 0)
    return "Education is required";
  if (!jobData.experience) return "Experience is required";
  if (!jobData.jobType) return "Job type is required";
  if (!jobData.totalVacancies) return "Total vacancies is required";
  if (!jobData.deadline) return "Application deadline is required";
  if (!jobData.location) return "Job location is required";
  // if (!jobData.requirements || jobData.requirements.length === 0)
  //   return "At least one requirement is required";
  if (!jobData.skills || jobData.skills.length === 0)
    return "At least one skill is required";

  return null;
}
