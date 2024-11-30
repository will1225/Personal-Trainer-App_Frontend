import { fetchWithTimeout, fetchVideoData } from "./generateRoutine";
import { SaveRoutine } from "../../types";
import { endpoint } from "../config";

export const getOneExercise = async (
  name?: string,
  typeId?: number,
  minIntensity?: number,
  maxIntensity?: number,
  levelId?: number,
  requiredEquipmentId?: number,
  workoutEnvironmentId?: number,
  muscleGroups?: number[],
) => {
  try {
    // Build query string with optional params
    let queryParams = [];

    if (name) queryParams.push(`name=${encodeURIComponent(name)}`);
    if (typeId) queryParams.push(`typeId=${typeId}`);
    if (minIntensity) queryParams.push(`minIntensity=${minIntensity}`);
    if (maxIntensity) queryParams.push(`maxIntensity=${maxIntensity}`);
    if (levelId) queryParams.push(`levelId=${levelId}`);
    if (requiredEquipmentId) queryParams.push(`requiredEquipmentId=${requiredEquipmentId}`);
    if (workoutEnvironmentId) queryParams.push(`workoutEnvironmentId=${workoutEnvironmentId}`);
    if (muscleGroups && muscleGroups.length > 0) {
      const muscleGroupsString = muscleGroups.join(",");
      queryParams.push(`muscleGroups=${muscleGroupsString}`);
    }
    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : ""; // put all optional params together(if any)

    const response = await fetchWithTimeout(`${endpoint}/routine/getOneExercise${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Fetching exercises failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
  }
};

export const getDailyRoutine = async (id: number) => {
  const dailyRoutineId = id; // This is hard coding, should be changed

  try {
    const response = await fetchWithTimeout(`${endpoint}/routine/dailyRoutine/${dailyRoutineId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Fetching new Exercise failed");
    }

    const data = await response.json();

    return data.data;
  } catch (error) {
    console.error("Error DailyRoutine:", error);
  }
};

export const saveDailyRoutine = async (data: SaveRoutine[]) => {
  try {
    const response = await fetchWithTimeout(`${endpoint}/routine/updateDailyRoutine`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        "Error while saving daily routine:",
        errorData.error || "Saving Daily Routine failed",
      );
      return false; // Return false on error
    }

    return true; // Return true on success
  } catch (error) {
    console.log(error);
    return false;
  }
};
