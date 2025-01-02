import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import createHttpError from "http-errors";
import { config } from "../config/config";

export const authenticateToken = (
  req: any,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token;
      if (!token) {
    // return res.status(401).json({ success: false, message: 'Unauthorized access' });
    return next(createHttpError(401, "Unauthorized access"));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };

    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return next(createHttpError(401, "Invalid or expired token"));
  }
};
