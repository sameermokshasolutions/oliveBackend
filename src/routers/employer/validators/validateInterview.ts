import { body } from "express-validator";

export const validateInterview = [
  body("applicationId").isMongoId().withMessage("Invalid applicationId"),
  body("jobId").isMongoId().withMessage("Invalid jobId"),
  body("candidateId").isMongoId().withMessage("Invalid candidateId"),
  body("employerId").isMongoId().withMessage("Invalid employerId"),
  body("scheduledAt")
    .isISO8601()
    .withMessage("Invalid scheduledAt date format"),
  body("duration")
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive number"),
  body("interviewType")
    .isIn(["in-person", "online", "phone"])
    .withMessage("Invalid interviewType"),
  body("location")
    .if(body("interviewType").equals("in-person"))
    .notEmpty()
    .withMessage("Location is required for in-person interviews"),
  body("meetingLink")
    .if(body("interviewType").equals("online"))
    .isURL()
    .withMessage("A valid meeting link is required for online interviews"),
  body("notes").optional().isString().withMessage("Notes must be a string"),
  body("cancelReason")
    .optional()
    .isString()
    .withMessage("Cancel reason must be a string"),
];
