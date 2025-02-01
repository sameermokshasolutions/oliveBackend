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
  if (!token) {
    return next(createHttpError(401, "Unauthorized access"));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      userRole: string;
    };

    const userRole = decoded.userRole;

    if (userRole !== "employer") {
      return next(createHttpError(401, "Unauthorized role access"));
    }

    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return next(createHttpError(401, "Invalid or expired token"));
  }
};
