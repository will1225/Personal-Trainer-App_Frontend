import * as user from "./user";
import { endpoint } from '../config';

/**
 * Method to get consolidated fitness results from the backend
 */
export const fetchFitnessResult = async (measurementId: string) => {
    if (!measurementId) throw "Measurement ID is required";
  
    try {
      const response = await fetch(
        `${endpoint}/measurement/result/${measurementId}`,
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

/**
 * Method to classify profile intensity and level and save to the backend. 
 */
export const saveIntensityAndLevel = async (bodyFatClassification: string, ffmiClassification: string) => {
  try {
    if (!bodyFatClassification) throw "Body Fat Classification is required";
    if (!ffmiClassification) throw "FFMI Classification is required";

    let intensityId;
    if (bodyFatClassification === "Essential Fat" || bodyFatClassification === "Athletes") {
      if (ffmiClassification === "Advanced Built" || ffmiClassification === "Intermediate Built") {
        intensityId = 4;
      } else if (ffmiClassification === "Average") {
        intensityId = 3;
      } else if (ffmiClassification === "Skinny") {
        intensityId = 2;
      } else {
        intensityId = 1; // extreme case
      }
    } else if (bodyFatClassification === "Fit") {
      if (ffmiClassification === "Advanced Built" || ffmiClassification === "Intermediate Built") {
        intensityId = 3;
      } else if (ffmiClassification === "Average" || ffmiClassification === "Skinny") {
        intensityId = 2;
      } else {
        intensityId = 1; // extreme case
      }
    } else if (bodyFatClassification === "Average") {
      if (ffmiClassification === "Advanced Built" || ffmiClassification === "Intermediate Built") {
        intensityId = 2;
      } else {
        intensityId = 1;
      }
    } else {
      intensityId = 1;
    }

    let levelId;
    if (ffmiClassification === "Skinny" || ffmiClassification === "Average") levelId = 1;
    if (ffmiClassification === "Intermediate Built") levelId = 2;
    if (ffmiClassification === "Advanced Built" || ffmiClassification === "Extremely Muscular") levelId = 3;
    if (ffmiClassification === "Unusual/Extreme Result") levelId = 1;

    const response = await fetch(
      `${endpoint}/user/profile/updateIntensityAndLevel`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await user.getToken()}`
        },
        body: JSON.stringify({ intensityId, levelId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error updating intensity and level");
    }    

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
}