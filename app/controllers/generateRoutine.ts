import * as user from "./user";

// Production/Testing flag
let production = false; // Set to true in Production
let endpoint = production ? `https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev` : `http://10.10.6.150:8080`; // Replace with your own ip4 address for test

/**
 * Timeout mechanism to prevent infinite loading if there are any connection issues to the backend.
 * @returns 
 */
export const fetchWithTimeout = async (url: string, options: RequestInit) => {
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
 * Method to save the frontend generated WeeklyRoutine, DailyRoutines, and ExerciseDetails to the backend.
 * @returns promise
 */
export const saveWeeklyRoutine = async (routineData: any) => {  
    try {
        const response = await fetchWithTimeout(
          `${endpoint}/routine/save`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await user.getToken()}`,
            },
            body: JSON.stringify(routineData)
          }
        );
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Saving Weekly Routine failed");
        }
    
        const data = await response.json();    
        return data;
    } catch (error) {
        console.error("Error Saving Weekly Routine:", error);
    }
};


/**
 * Method to fetch workout environment options form the db
 * @returns workoutEnvironment[]
 */
export const fetchWorkoutEnv = async () => {
  try {
    const response = await fetchWithTimeout(
      `${endpoint}/routine/workoutEnv`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Fetching workout environment failed");
    }

    const data = await response.json();
    const formattedData = data.map(
      (item: { description: string; id: number }) => ({
        description: item.description,
        id: item.id.toString(),
      })
    );

    return formattedData;
  } catch (error) {
    console.error("Error fetching workout environment:", error);
    return null;
  }
};

/**
 * Method to fetch MuscleGroup options from the backend.
 * @returns muscleGroup[]
 */
export const fetchMuscleGroup = async () => {
    try {
      const response = await fetchWithTimeout(
        `${endpoint}/routine/muscleGroup`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fetching muscle group failed");
      }
  
      const data = await response.json();
      const formattedData = data.map(
        (item: { description: string; id: number }) => ({
          description: item.description,
          id: item.id.toString(),
        })
      );
  
      return formattedData;
    } catch (error) {
      console.error("Error fetching workout environment:", error);
      return null;
    }
  };

/**
 * Method to fetch exercises with custom params. All params are optional. 
 * @returns exercise[]
 */
export const fetchExercise = async (
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
      `${endpoint}/routine/exercise${queryString}`,
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
    return data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
  }
};

/**
 * Helper function to evenly spread days within the workout week based on days per week
 * @returns scheduleDays[]
 */
export const getDayNames = (startDateStr: string, daysPerWeek: number) => {
    const startDate = new Date(startDateStr);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const scheduleDays = [];
  
    let currentDate = new Date(startDate);

    if (daysPerWeek <= 4) {
        // Spread days one day apart when less than 4 days
        for (let i = 0; i < daysPerWeek; i++) {
        scheduleDays.push(dayNames[currentDate.getDay()]);
        currentDate.setDate(currentDate.getDate() + 2); 
        }
    } else {
        // Spread across the full week for more than 4 days
        const interval = Math.floor(6 / (daysPerWeek - 2)); 
        const extraDays = 6 % (daysPerWeek - 2); // Distribute leftover 

        scheduleDays.push(dayNames[startDate.getDay()]); // Start with the first day

        for (let i = 1; i < daysPerWeek - 1; i++) {
        const gap = interval + (i <= extraDays ? 1 : 0);
        currentDate.setDate(currentDate.getDate() + gap);
        scheduleDays.push(dayNames[currentDate.getDay()]);
        }

        scheduleDays.push(dayNames[startDate.getDay()]); // End with the last day
    }

    return scheduleDays;
};
