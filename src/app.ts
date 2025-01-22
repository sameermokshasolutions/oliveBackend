import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./routers/user/userRouter";
import emailRouter from "./routers/email/emailVerification";
import cookieParser from "cookie-parser";
import employerRouter from "./routers/employer/employerRoutes";
import adminRouter from "./routers/admin/adminRoutes";
import jobRouter from "./routers/job/jobRouter";

const app: Application = express();

// CORS Configuration
const corsOptions = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Body Parser Configuration
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api", emailRouter);
app.use("/api/employer/", employerRouter);
app.use("/api/job", jobRouter);

// Root route
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    path: req.path,
  });
});

// Helper function to find changes between objects
const getChangedFields = (oldObj: any, newObj: any) => {
  const changes: Record<string, { old: any; new: any }> = {};

  // Helper for nested object comparison
  const compareValues = (oldVal: any, newVal: any, path: string) => {
    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        changes[path] = { old: oldVal, new: newVal };
      }
    } else if (
      oldVal &&
      newVal &&
      typeof oldVal === "object" &&
      typeof newVal === "object"
    ) {
      Object.keys({ ...oldVal, ...newVal }).forEach((key) => {
        compareValues(oldVal[key], newVal[key], path ? `${path}.${key}` : key);
      });
    } else if (oldVal !== newVal) {
      changes[path] = { old: oldVal, new: newVal };
    }
  };

  compareValues(oldObj, newObj, "");
  return changes;
};
// Error handler must be last
app.use(globalErrorHandler);

export default app;
