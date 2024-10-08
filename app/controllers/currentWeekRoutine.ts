import * as user from "./user";
import { fetchWithTimeout } from "./generateRoutine";

// Production/Testing flag
let production = false; // Set to true in Production
let endpoint = production ? `https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev` : `http://10.10.4.173:8080`; // Replace with your own ip4 address for test

/**
 * Method to fetch Current Weekly Routine from the backend.
 * @returns weekly routine
 */
export const fetchCurrentWeeklyRoutine = async () => {
    try {
      const response = await fetchWithTimeout(
        `${endpoint}/currentRoutine/fetch`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getToken()}`,
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        throw new Error(errorData.error || "Fetching weekly routine failed");
      }
  
      const weeklyRoutine = await response.json();

      return weeklyRoutine.data;
    } catch (error) {
      console.error("Error fetching current week's routine:", error);
      return null;
    }
  };