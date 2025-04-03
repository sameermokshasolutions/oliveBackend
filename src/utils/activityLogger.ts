import mongoose from "mongoose";
import { ActivityModel } from "./Activity";
import { checkUpdate } from "./checkUpdate";

// Define the interface for the activity data
interface ActivityData {
  userId: string;
  remarks: string;
  timestamp: Date;
  mutateTable: string;
  content: string[];
  status: boolean;
}

export const logProfileActivity = async (
  userId: string,
  previousData: Record<string, any>,
  action: string,
  profileData: Record<string, any>,
  activityTable: string
): Promise<void> => {
  try {
    // Fetch the changes between previous data and updated data
    const changes = await checkUpdate(previousData, profileData);

    // Prepare the activity data
    const activityData: ActivityData = {
      userId,
      remarks: `${action}`,
      timestamp: new Date(),
      mutateTable: activityTable,
      content: changes, // Ensure `changes` can be converted to JSON
      status: true, // Assume all activities are valid for now
    };

    // Create a new ActivityModel instance with activity data
    const activityInstance = new ActivityModel(activityData);
    await activityInstance.save();
  } catch (error) {
    console.error(`Error logging profile ${action} activity:`, error);
  }
};
