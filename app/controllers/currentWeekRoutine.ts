import * as user from "./user";
import { fetchWithTimeout } from "./generateRoutine";

// Production/Testing flag
let production = false; // Set to true in Production
let endpoint = production ? `https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev` : `http://10.10.4.173:8080`; // Replace with your own ip4 address for test


export class CurrentWeekRoutine {

    // Method to fetch Current Weekly Routine from the backend
    static async setCurrentWeekRoutine (setWeeklyRoutine: any) {
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

      const res = await response.json();

      if (!response.ok) {
        // Check for 404 status and reset atom to default values if no routine found
        if (response.status === 404) {
          setWeeklyRoutine({
            id: 0,
            startDate: "",
            endDate: "",
            daysPerWeek: 0,
            dailyRoutines: [],
          });
        }
        throw new Error(res.error || "Fetching weekly routine failed");
      }

      setWeeklyRoutine(res.data)
    } catch (error) {
      console.error("Error fetching current week's routine:", error);
    }
  };
}
