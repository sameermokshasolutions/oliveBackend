// src/types/express.d.ts

import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

// Ensure the file is treated as a module
export {};
