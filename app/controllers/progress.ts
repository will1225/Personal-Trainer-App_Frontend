import * as user from "./user";
import { endpoint } from "../config";

/**
 * Method to get all progress entries associated with the user
 */
export const getProgress = async () => {
  try {
    const response = await fetch (
        `${endpoint}/progress`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getToken()}`,
          },
        }
      );

    const data = await response.json();
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(
        data.error || "Error fetching progress by profile ID"
      );
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "Something went wrong while fetching progress"
    );
  }
};


/**
 * Method to get a progress entry by id
 */
export const getProgressById = async (progressId: number) => {
  try {
    const response = await fetch(`${endpoint}/progress/${progressId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getToken()}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error fetching progress by ID");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "Something went wrong while fetching progress by ID"
    );
  }
};
