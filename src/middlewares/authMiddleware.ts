import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { config } from "../config/config";

declare module "express" {
  interface Request {
    user?: { id: string };
  }
}

export const authenticateToken = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // Extract token from cookies or Authorization header
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(createHttpError(401, "Unauthorized access: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };

    req.user = { id: decoded.id };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(createHttpError(401, "Unauthorized access: Token expired"));
    } else if (err instanceof jwt.JsonWebTokenError) {
      return next(createHttpError(401, "Unauthorized access: Invalid token"));
    } else {
      return next(
        createHttpError(401, "Unauthorized access: Token verification failed")
      );
    }
  }
};
