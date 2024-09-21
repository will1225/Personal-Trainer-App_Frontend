import * as user from "./user";

// API function
export const fetchFitnessResult = async (measurementId: string) => {
    if (!measurementId) throw "Measurement ID is required";
  
    try {
      const response = await fetch(
        // local testing
        // `http://10.10.6.150:8080/user/result/${measurementId}`,
  
        // Production
        `https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev/user/result/${measurementId}`,
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
        throw new Error(errorData.error || "Error fetching Result");
      }    
  
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Something went wrong");
    }
  };