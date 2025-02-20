import { Request } from "express";

declare global {
  interface AuthenticatedRequest extends Request {
    user?: {
      id: string;
    };
  }
}

export {};
