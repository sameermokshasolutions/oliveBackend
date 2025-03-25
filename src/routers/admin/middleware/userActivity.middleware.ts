import UserActivity from "../models/UserActivity.model";

export const logActivity = async (
  userId: string,
  role: "admin" | "employer" | "candidate",
  action: string,
  details?: string
) => {
  try {
    await UserActivity.create({ userId, role, action, details });
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
};
