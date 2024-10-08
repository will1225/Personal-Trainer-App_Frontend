import { View, Text, SafeAreaView, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import { Dropdown } from "react-native-element-dropdown";
import { Image } from "react-native";
import { CustomButton, FormField } from "@/components";
import { Href, router } from "expo-router";
import { getDailyRoutine } from "./controllers/dailyRoutine";
import { getOneExercise } from "./controllers/dailyRoutine";
import RefreshButton from '../components/RefreshButton'; 
import VideoRefreshButton from '../components/VideoRefreshButton'; 

type ExerciseDetail = {
  exerciseDetailId: number;
  exerciseName: string;
  sets: number;
  reps: number;
  youtubeURL: string;
  level: Level;
  requiredEquip: Equipment;
  workoutEnvs: WorkoutEnv[];
  muscleGroups: MuscleGroup[];
};

type Level = {
    id: number;
    description: string;
}

type Equipment = {
    id: number;
    description: string;
}

type DailyRoutine = {
  dayNumber: number;
  exerciseDetails: ExerciseDetail[];
};

type MuscleGroup = {
  id: number;
  description: string;
};

type WorkoutEnv = {
  id: number;
  description: string;
}

// Daily Routine Detail Page
const dailyRoutineDetail = () => {
  const image1 = require("../assets/images/HomePagePic1.jpeg");
  const dailyRoutineId = 42;
  const dayName = "Monday";

  const [isSubmitting, setSubmitting] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);  
  const [exerciseDetails, setExerciseDetails] = useState<ExerciseDetail[]>([]);

  
  useEffect(() => {
    const fetchData = async () => {
        try {
        const response = await getDailyRoutine(dailyRoutineId);
      
        response.forEach((detail: any) => {
            
            const level: Level = {
                id: Number(detail.exercise.level.id),
                description: detail.exercise.level.description
            }

            const equip: Equipment = {
                id: Number(detail.exercise.requiredEquipment.id),
                description: detail.exercise.requiredEquipment.description
            }

            const newWorkoutEnv: WorkoutEnv[] = [];

            detail.exercise.workoutEnvironments.forEach((e: any) => {
                const newEnv = {
                    id: Number(e.workoutEnvironment.id),
                    description: e.workoutEnvironment.description,
                }
                newWorkoutEnv.push(newEnv);
            })

            const newMuscleGroup: MuscleGroup[] = [];

            detail.exercise.muscleGroups.forEach((w: any) => {
                const newEnv = {
                    id: Number(w.muscleGroup.id),
                    description: w.muscleGroup.description
                }
                newMuscleGroup.push(newEnv);
            })
            
            const newExerciseDetail: ExerciseDetail = {
                exerciseDetailId: Number(detail.id),
                exerciseName: detail.exercise.name,
                sets: Number(detail.sets),
                reps: Number(detail.reps),
                youtubeURL: detail.youtubeURL,
                level: level,
                requiredEquip: equip,
                workoutEnvs: newWorkoutEnv,
                muscleGroups: newMuscleGroup
            };

            setExerciseDetails(prevDetails => [...prevDetails, newExerciseDetail]);
        })

        } catch (error) {
            console.error("Error fetching data", error);
        }
    };  
    fetchData();
  }, []);
  

  const refreshExercise = async (id: number) => {

    if (id == 0) {
        console.log("Refresh Exercise Pressed");
        return;
    }

    try {
    const detail = exerciseDetails.find(detail => detail.exerciseDetailId === id);

    if (!detail) {
        throw new Error(`Exercise detail with id ${id} not found`);
    }

    const muscleGroupIds = detail?.muscleGroups.map(muscle => muscle.id)

    
    const newExercise = await getOneExercise(
        undefined,
        undefined,
        undefined,
        detail.level.id,
        undefined,
        detail.workoutEnvs[0].id,
        muscleGroupIds
    )
    

    console.log(newExercise);

    const newYoutubeUrl = "https://www.youtube.com/watch?v="
    
    const level: Level = {
        id: Number(newExercise.level.id),
        description: newExercise.level.description
    }

    const equip: Equipment = {
        id: Number(newExercise.requiredEquipment.id),
        description: newExercise.requiredEquipment.description
    }

    const newWorkoutEnv: WorkoutEnv[] = [];

    newExercise.workoutEnvironments.forEach((e: any) => {
        const newEnv = {
            id: Number(e.workoutEnvironment.id),
            description: e.workoutEnvironment.description,
        }
        newWorkoutEnv.push(newEnv);
    })

    const newMuscleGroup: MuscleGroup[] = [];

    newExercise.muscleGroups.forEach((w: any) => {
        const newEnv = {
            id: Number(w.muscleGroup.id),
            description: w.muscleGroup.description
        }
        newMuscleGroup.push(newEnv);
    })

    const newExerciseDetail: ExerciseDetail = {
        exerciseDetailId: id,
        exerciseName: newExercise.name,
        sets: Number(newExercise.defaultSets),
        reps: Number(newExercise.defaultReps),
        youtubeURL: newYoutubeUrl,
        level: level,
        requiredEquip: equip,
        workoutEnvs: newWorkoutEnv,
        muscleGroups: newMuscleGroup
    };

    setExerciseDetails(prevDetails =>
        prevDetails.map(d =>
          d.exerciseDetailId === newExerciseDetail.exerciseDetailId ? newExerciseDetail : d
        )
    );

        console.log("Refresh Exercise Pressed");

    } catch (err) {
        console.log(err);
    }
  }

  const refreshVideo = async () => {
    console.log("Refresh Video Pressed");
  }

  let topPosn = 0;

  
  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 2, justifyContent: "center" }}>
        <BackButton />
        <View className="w-full flex justify-center items-center h-full my-4 px-4 mt-16">
          <Text className="text-3xl font-bold text-center">
            Daily Routine Detail
          </Text>

          <Text className="text-lg font-pregular text-left px-4 mt-4 mb-8">
            {dayName}
          </Text>

          <View className="w-full flex-row text-left" >    
                <RefreshButton onRefresh={() => refreshExercise(0)} />
                <Text className="pb-0 pt-1">
                    Swap an Exercise
                </Text>
          </View>

          <View className="flex-row items-center rounded h-6" >
            <View className="flex-[6] flex-row mb-1 items-center rounded h-7" style={{ backgroundColor: "#0369a1" }}>
                    <Text className="flex-[3] text-center font-semibold text-white">
                        Exercise
                    </Text>
                    <Text className="flex-[1] text-center font-semibold text-white">
                        Sets
                    </Text>
                    <Text className="flex-[1] text-center font-semibold text-white">
                        Reps
                    </Text>
            </View>
            <View className="flex-[1]"></View>
          </View>

          {exerciseDetails.map((item) => (
            <View key={item.exerciseDetailId} className="w-full py-1">
                {/* Data row */}
                <View className="flex-row items-center h-10">
                    <Text className="flex-[3] text-center">
                        {item.exerciseName}
                    </Text>
                    <Text className="flex-[1] text-center">
                        {item.sets}
                    </Text>
                    <Text className="flex-[1] text-center">
                        {item.reps}
                    </Text>
                    <View className="flex-[1]">    
                        <RefreshButton  onRefresh={() => refreshExercise(item.exerciseDetailId)} />
                    </View>
                </View>
            </View>
        ))}

            <View className="w-full flex-row text-left mt-2" >    
                <VideoRefreshButton 
                    onRefresh={refreshVideo}
                    style= {{
                        paddingTop: 2
                     }}
                     color= 'gray'
                />
                <Text className="ml-1 pb-2 pt-1">
                    Refresh a new video
                </Text>
            </View>

            {exerciseDetails.map((item, index) => (
            
                <View key={item.exerciseDetailId} className="w-full flex-row">
                    <View className="relative mr-2">
                        
                        <VideoRefreshButton 
                            onRefresh={refreshVideo}
                            style={{
                                position: 'absolute',
                                top: 2, // Adjust this value to create enough space between icons
                                left: 52,
                                zIndex: 10,
                                borderRadious: 10
                            }} 
                        />
                        <Image source={image1} className="w-[70] h-[70] z-0 relative" />
                    </View>

                    <View className="flex-1 border border-gray-300 items-center rounded-lg min-h-[65px]" style={{ backgroundColor: "#e5e5e5" }}>
                    
                        {/* Exercise Details header*/}
                        <View className="flex-row mb-1 items-center rounded h-7" style={{ backgroundColor: "#0369a1" }}>
                            <Text className="flex-[2] text-center font-semibold text-white">
                            Exercise
                            </Text>
                            <Text className="flex-[1] text-center font-semibold text-white">
                            Sets
                            </Text>
                            <Text className="flex-[1] text-center font-semibold text-white">
                            Reps
                            </Text>
                        </View>

                        <View className="flex-row items-center">
                            <Text className="flex-[2] text-center">
                                {item.exerciseName}
                            </Text>
                            <Text className="flex-[1] text-center">
                                {item.sets}
                            </Text>
                            <Text className="flex-[1] text-center">
                                {item.reps}
                            </Text>
                          </View>
                    </View>
                </View>

                
            ))}



        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default dailyRoutineDetail;


{/* For Reference
            <Text>YouTube URL: {item.youtubeURL}</Text>
            <Text>Level: {item.level.description}</Text>
            <Text>Required Equipment: {item.requiredEquip.description}</Text>
            <Text>Workout Environments:</Text>
            {item.workoutEnvs.map((env) => (
                <Text key={env.id}> {env.description}</Text>
            ))}

            <Text>Muscle Groups:</Text>
            {item.muscleGroups.map((group) => (
                <Text key={group.id}> {group.description}</Text>
            ))}
*/}