import { PrimitiveAtom, atom } from "jotai";
import { ProfileProps, WeeklyRoutineProps } from "./types";

export const profileAtom = atom<ProfileProps>(
    //Add default values
    {
        id: 0,
        userAccount: undefined,
        userId: 0,
        firstName: "",
        lastName: "",
        dob: undefined,
        gender: undefined,
        height: undefined,
        initBodyMeasurement: undefined,
        bodyMeasurementId: undefined,
        levelId: undefined,
        intensityId: undefined,
        createdAt: new Date(),
        updatedAt: undefined,
    }
);

export const currentWeekRoutineAtom = atom<WeeklyRoutineProps>(
    // Add default values
    {
        id: 0,
        startDate: "",
        endDate: "",
        daysPerWeek: 0,
        dailyRoutines: [],
    }
)