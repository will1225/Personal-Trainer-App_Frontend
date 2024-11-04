import * as user from "./user";
import { endpoint } from '../config';


/**
 * Method to save body measurement data to db
 * If weekly routine id is provided, saves weekly progress data to db
 * Note: chest, abdomen, and thigh are optional in db, but are required if bypass flag is true on UI
 */
export const saveMeasurement = async (
    weight: number,
    chest: number | null,
    abdomen: number | null,
    thigh: number | null,
    bypassMeasurementFlag: boolean,
    bodyFatPercent: number,
    muscleMass: number,
    weeklyRoutineId: number | null,
  ) => {
    try {
      const measureRes = await fetch(
        `${endpoint}/measurement/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getToken()}`,
          },
          body: JSON.stringify({
            weight,
            chest,
            abdomen,
            thigh,
            bypassMeasurementFlag,
            bodyFatPercent,
            muscleMass,
          }),
        }
      );

      const measurementData = await measureRes.json();
  
      if (!measureRes.ok) {
        throw new Error(measurementData.error || "Failed to save body measurement!");
      }

      console.log(measurementData)

      if (weeklyRoutineId) {
        const weeklyProgressData = await saveWeeklyProgress(weeklyRoutineId, measurementData.data.id);
        measurementData.data.weeklyProgressId = weeklyProgressData.data.id
      }

      return measurementData;
    } catch (error: any) {
      throw new Error(error.message || "Something went wrong");
    }
  };


/**
 * Method to save weekly progress data to the database.
 * This function is called within saveMeasurement if weeklyRoutineId is provided.
 */
const saveWeeklyProgress = async (weeklyRoutineId: number, measurementId: number) => {
  console.log(measurementId);
  try {
      const progressRes = await fetch(
          `${endpoint}/progress/save`,
          {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${await user.getToken()}`,
              },
              body: JSON.stringify({
                  weeklyRoutineId,
                  measurementId,
              }),
          }
      );

      const progressData = await progressRes.json();

      if (!progressRes.ok) {
          throw new Error( "Failed to save weekly progress!");
      }

      return progressData;
  } catch (error: any) {
      throw new Error(error.message || "Something went wrong in saving weekly progress");
  }
};