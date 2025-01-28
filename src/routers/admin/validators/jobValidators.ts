import { body } from "express-validator";

export const validateJobCategory = [
  body("name").trim().notEmpty().withMessage("Job category name is required"),
];

export const validateJobTag = [
  body("name").trim().notEmpty().withMessage("Job tag name is required"),
];

export const validateJobRole = [
  body("name").trim().notEmpty().withMessage("Job role name is required"),
];

export const validateEducation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Education level name is required"),
];

export const validateExperience = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Experience level name is required"),
];
