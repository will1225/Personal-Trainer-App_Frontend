import * as user from "./user";

/**
 * Method to get the latest user information from backend
 * @returns 
 */
export const userGlobalState = async (): Promise<Record<string, any> | null> => {
    try {
      const response = await fetch(
        // local testing
        // `http://10.10.6.150:8080/user/globalState`,
  
        // Production
        `https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev/user/globalState`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${await user.getToken()}`
          }
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fetching Global State failed");
      }
  
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Error retrieving User Global State:", error);
      return null;
    }
  };