import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

/**
 *
 * Middleware to validate incoming request data.
 * If validation errors exist, it sends a 400 response with the errors.
 * If no errors exist, it calls the next middleware in the stack.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err: any) => ({
      path: err.param,
      message: err.msg,
      value: err.value,
      location: err.location,
    }));

    const error = createHttpError(400, "Validation Error", {
      errors: formattedErrors,
    });
    next(error);
  }

  next();
};
