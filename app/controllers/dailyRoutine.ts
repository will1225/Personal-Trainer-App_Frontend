import { fetchWithTimeout, fetchVideoData } from "./generateRoutine";

// Production/Testing flag
let production = false; // Set to true in Production
let endpoint = production ? `https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev` : `http://localhost:8080`; // Replace with your own ip4 address for test

type saveRoutine = {
  exerciseDetailId: number,
  sets: number,
  reps: number,
  youtubeURL: string,
  dailyRoutineId: number,
  exerciseId: number
}

export const getOneExercise = async (
    name?: string,
    minIntensity?: number,
    maxIntensity?: number,
    levelId?: number,
    requiredEquipmentId?: number,
    workoutEnvironmentId?: number,
    muscleGroups?: number[]
  ) => {
    try {
      // Build query string with optional params
      let queryParams = [];
  
      if (name) queryParams.push(`name=${encodeURIComponent(name)}`);
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
      
      const response = await fetchWithTimeout(
        `${endpoint}/routine/getOneExercise${queryString}`,
      {
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
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

export const getDailyRoutine = async (id: number) => {
    const dailyRoutineId = id; // This is hard coding, should be changed

    try {
        const response = await fetchWithTimeout(
            `${endpoint}/routine/dailyRoutine/${dailyRoutineId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Fetching DailyRoutine failed");
          }
      
          const data = await response.json();

          return data.data;
        } catch (error) {
          console.error("Error DailyRoutine:", error);
        }

  }

  export const saveDailyRoutine = async (data: saveRoutine[]) => {
    try{
      const response = await fetchWithTimeout(
        `${endpoint}/routine/updateDailyRoutine`,
        {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(data),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error while saving daily routine:", errorData.error || "Fetching DailyRoutine failed");
          return false; // Return false on error
      }
  
      return true; // Return true on success
    } catch (error) {
      console.log(error);
      return false;
    }
  }