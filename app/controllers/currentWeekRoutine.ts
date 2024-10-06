import * as user from "./user";

// Production/Testing flag
let production = false; // Set to true in Production
let endpoint = production ? `https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev` : `http://10.10.4.173:8080`; // Replace with your own ip4 address for test

/**
 * Timeout mechanism to prevent infinite loading if there are any connection issues to the backend.
 * @returns 
 */
const fetchWithTimeout = async (url: string, options: RequestInit) => {
    return new Promise<Response>(async (resolve, reject) => {
      const controller = new AbortController();
      const id = setTimeout(() => {
        controller.abort();
        reject(new Error('Request timed out'));
      }, 5000); // Timeout in 5 seconds
  
      try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
};


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