export interface UserAccountProps {
    id: number,
    email: string,
    profile?: ProfileProps,
    otp?: OTPProps,
    verified: boolean,
    provider?: string,
    stripeId?: string,
    createdAt: Date,
    updatedAt?: Date
  id: number;
  email: string;
  profile?: ProfileProps;
  otp?: OTPProps;
  verified: boolean;
  provider?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ProfileProps {
    id: number,
    userAccount?: UserAccountProps,
    userId: number,
    firstName: string,
    lastName: string,
    dob?: Date,
    subscriptionStatus: string,
    gender?: string,
    height?: number,
    initBodyMeasurement?: BodyMeasurementProps,
    bodyMeasurementId?: number,
    levelId?: number,
    intensityId?: number,
    createdAt: Date,
    updatedAt?: Date
  id: number;
  userAccount?: UserAccountProps;
  userId: number;
  firstName: string;
  lastName: string;
  dob?: Date;
  gender?: string;
  height?: number;
  initBodyMeasurement?: BodyMeasurementProps;
  bodyMeasurementId?: number;
  levelId?: number;
  intensityId?: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface OTPProps {
  id: number;
  otp: string;
  userId: number;
  userAccount: UserAccountProps;
  createdAt: Date;
  updatedAt?: Date;
}

export interface BodyMeasurementProps {
  id: number;
  weight: number;
  chest?: number;
  abdomen?: number;
  thigh?: number;
  bypassMeasurementFlag: boolean;
  bodyFatPercent: number;
  muscleMass: number;
  profile?: ProfileProps;
  date: Date;
}

export interface WeeklyRoutineProps {
  id: number;
  startDate: string;
  endDate: string;
  daysPerWeek: number;
  dailyRoutines: DailyRoutineProps[];
}

export interface DailyRoutineProps {
  id: number;
  dayNumber: number;
  dayName: string;
  exerciseDetails: ExerciseDetailProps[];
}

export interface ExerciseDetailProps {
  id: number;
  sets: number;
  reps: number;
  minutes: number;
  youtubeURL: string;
  thumbnailURL?: string;
  dailyRoutineId;
  exercise: ExerciseProps;
}

export interface ExerciseProps {
  id: number;
  name: string;
  muscleGroups: MuscleGroupProps[];
  sets: number;
  reps: number;
}

export interface MuscleGroupProps {
  id: number;
  description: string;
}

// * DailyRoutine Page * //
export interface RequiredEquipment {
  id: number;
  description: string;
}

export interface WorkoutEnv {
  id: number;
  description: string;
}

export interface Level {
  id: number;
  description: string;
}

export interface SaveRoutine {
  exerciseDetailId: number;
  sets: number;
  reps: number;
  youtubeURL: string;
  dailyRoutineId: number;
  exerciseId: number;
}

export interface WeeklyProgressProps {
    id: number,
    weeklyRoutine: WeeklyRoutineProps,
    weeklyRoutineId: number,
    profile: ProfileProps,
    profileId: number,
    bodyMeasurement: BodyMeasurementProps,
    bodyMeasurementId: number,
    date: Date
}

export interface PaymentMethodProps {
    id: string,
    card: {
        last4: string
    }
}
// * ****** * //
