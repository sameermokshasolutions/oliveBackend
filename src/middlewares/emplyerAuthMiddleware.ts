import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import createHttpError from "http-errors";
import { config } from "../config/config";

export const employerAuthMiddleware = (
  req: any,
  _res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token;
  const userRole = req.cookies.userRole;
  if (!token) {
    return next(createHttpError(401, "Unauthorized access"));
  }

  if (userRole !== "employer") {
    return next(createHttpError(401, "Unauthorized role access"));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };

    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return next(createHttpError(401, "Invalid or expired token"));
  }
};
