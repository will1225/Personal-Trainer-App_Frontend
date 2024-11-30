import { fetchWithTimeout } from "./generateRoutine";
import { endpoint } from "../config";
import * as user from "./user";

export const getSelectedReport = async (id: number, prevId: string | null) => {
  const progressId = id;
  try {
    console.log("called");
    const response = await fetchWithTimeout(
      `${endpoint}/report/getReport/${progressId}?prevId=${prevId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getToken()}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log("ERRRR" + errorData);
      throw new Error(errorData.error || "Fetching exercises failed");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
  }
};
