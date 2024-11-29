import * as user from "./user";
import { endpoint } from "../config";
import { WeeklyProgressProps } from "@/types";

/**
 * Method to get all progress entries associated with the user
 */
export const getProgress = async (): Promise<WeeklyProgressProps[]> => {
  try {
    const response = await fetch(`${endpoint}/progress`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getToken()}`,
      },
    });

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.error || "Error fetching progress by profile ID");
    }

    return res.data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong while fetching progress");
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

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.error || "Error fetching progress by ID");
    }

    return res.data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong while fetching progress by ID");
  }
};

/**
 * Method to get progress summarized progress results for completed routine
 */
export const getProgressResults = async () => {
  try {
    const response = await fetch(`${endpoint}/progress/results`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getToken()}`,
      },
    });

    const res = await response.json();

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error fetching progress results");
    }

    return res.data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong while fetching progress results");
  }
};
