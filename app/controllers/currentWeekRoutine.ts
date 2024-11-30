import * as user from "./user";
import { fetchWithTimeout } from "./generateRoutine";
import { endpoint } from "../config";

export class CurrentWeekRoutine {
  // Method to fetch Current Weekly Routine from the backend
  static async setCurrentWeekRoutine(setWeeklyRoutine: any) {
    try {
      const response = await fetchWithTimeout(`${endpoint}/currentRoutine/fetch`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getToken()}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        // Check for 404 status and reset atom to default values if no routine found
        if (response.status === 404) {
          console.log("No current weekly routine found");
          setWeeklyRoutine({
            id: 0,
            startDate: "",
            endDate: "",
            daysPerWeek: 0,
            dailyRoutines: [],
          });
        } else {
          throw new Error(res.error || "Fetching weekly routine failed");
        }
      } else {
        setWeeklyRoutine(res.data);
      }
    } catch (error) {
      console.error("Error fetching current week's routine:", error);
    }
  }
}
