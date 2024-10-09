import { View, Text, SafeAreaView, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import { Dropdown } from "react-native-element-dropdown";
import { Image } from "react-native";
import { CustomButton, FormField } from "@/components";
import { Href, router } from "expo-router";
import * as generateRoutine from "./controllers/generateRoutine";

type weeklyRoutine = {
  startDate: string;
  endDate: string;
  daysPerWeek: number;
  workoutEnvironmentId: number;
}

type ExerciseDetail = {
  exerciseId: number;
  sets: number;
  reps: number;
  youtubeURL: string;
};

type DailyRoutine = {
  dayNumber: number;
  exerciseDetails: ExerciseDetail[];
};

type MuscleGroup = {
  id: number;
  description: string;
};

// Weekly Routine Generation Screen
const GenerateRoutine = () => {
  const image1 = require("../assets/images/HomePagePic1.jpeg");

  // State Variables
  const [workoutEnv, setWorkoutEnv] = useState<{ description: string; id: string }[]>([]);
  const [selectedEnv, setSelectedEnv] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);  
  const [exercises, setExercises] = useState<any[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [weeklyRoutine, setWeeklyRoutine] = useState<weeklyRoutine | null>(null);
  const [dailyRoutines, setRoutines] = useState<DailyRoutine[]>([]);

  // Fetch workout environments and muscle groups when page starts up
  useEffect(() => {
    const fetchData = async () => {
      try {
        const envData = await generateRoutine.fetchWorkoutEnv();
        if (envData === null) return;
        
        if (JSON.stringify(envData) !== JSON.stringify(workoutEnv)) {
          setWorkoutEnv(envData);
        }
        
        const muscleData = await generateRoutine.fetchMuscleGroup();
        if (muscleData === null) return;

        if (JSON.stringify(muscleData) !== JSON.stringify(muscleGroups)) {
          setMuscleGroups(muscleData);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };  
    fetchData();
  }, []);

  // DatePicker handler
  const handleDateChange = (date: Date) => {
    setSelectedDate(date.toISOString());
  };

  // Helper function to fetch exercise name by exerciseId for UI display
  const getExerciseName = (id: number) => {
    const exercise = exercises.find((ex) => ex.id === id);
    return exercise ? exercise.name : "Unknown Exercise";
  };

  // Helper function to fetch muscle groups for each exercise for UI display
  const getMuscleGroups = (id: number) => {
    const exercise = exercises.find((ex) => ex.id === id);
    if (exercise) {
      const muscleGroupDescriptions = exercise.muscleGroups.map(
        (group: { muscleGroupId: number }) => {
          const muscleGroup = muscleGroups.find(
            (mg) => mg.id == group.muscleGroupId
          );
          return muscleGroup ? muscleGroup.description : "Unknown Group";
        }
      );
      // Use Set to remove duplicates muscle group for display
      const uniqueMuscleGroups = [...new Set(muscleGroupDescriptions)];
      return uniqueMuscleGroups.join(", ");
    }
    return "Unknown Group";
  };

  // Generate/Refresh button
  const handleGenerateRoutine = async () => {
    setSubmitting(true);

    try {
      if (!selectedEnv || !selectedDay || !selectedDate) {
        Alert.alert("Error", "Please select all fields");
        setSubmitting(false);
        return;
      }

      // Screen inputs
      const workoutEnvironmentId = Number(selectedEnv);
      const daysPerWeek = Number(selectedDay);
      const startDate = selectedDate;
      const endDate = new Date(new Date(startDate).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(); // Add 6 days

      // Level 1: Create Weekly Routine Object
      const weeklyRoutine = {
        startDate,
        endDate,
        daysPerWeek,
        workoutEnvironmentId,
      };

      // API Call: Fetch exercises based on optional params
      const currentMuscleGroup = [muscleGroups[0].id, muscleGroups[1].id]; // optional
      const fetchedExercises = await generateRoutine.fetchExercise(
        undefined,            // exercise name
        undefined,            // min intensity
        undefined,            // max intensity
        undefined,            // level id
        undefined,            // requiredEquipmentId
        workoutEnvironmentId, // workoutEnvironmentId
        undefined             // muscleGroups[], use currentMuscleGroup to search
      );

      if (!fetchedExercises || fetchedExercises.length === 0) {
        Alert.alert("Error", "No exercises found for the selected parameters.");
        setSubmitting(false);
        return;
      }

      // Level 2: Create Daily Routines based on days per week
      const dailyRoutines = [];
      for (let i = 1; i <= daysPerWeek; i++) {

        // TODO: Apply algorithm in later stage, now it temporary picks 4 random exercises
        const selectedExercises = fetchedExercises.sort(() => 0.5 - Math.random()).slice(0, 4);

        // Level 3: Create Exercise Details and assign selectedExercises to each
        // TODO: Change youtubeURL to actual URL when ready
        const exerciseDetails = selectedExercises.map((exercise: any) => ({
          exerciseId: exercise.id,
          sets: exercise.defaultSets,
          reps: exercise.defaultReps,
          youtubeURL: `https://youtube.com/watch?v=${exercise.exerciseId}`,
        }));

        // Bundle each Daily Routine with the assigned Exercise Details
        dailyRoutines.push({ dayNumber: i, exerciseDetails });
      }

      // Set objects state 
      setWeeklyRoutine(weeklyRoutine); // Passing to the backend
      setRoutines(dailyRoutines);      // Passing to the backend
      setExercises(fetchedExercises);  // For UI display
      
      setSubmitting(false);
      setButtonPressed(true);
    } catch (error) {
      console.error("Error during routine generation:", error);
    }
  };

  // Handle Confirm Button Press (Save Weekly Routine)
  const handleSaveRoutine = async () => {
    try {
      setSubmitting(true);

      // Bundle all Weekly, Daily, ExerciseDetails into one object
      const routineData = {
        weeklyRoutine,
        dailyRoutines // Contain ExerciseDetails
      };

      // API call
      const result = await generateRoutine.saveWeeklyRoutine(routineData);

      if (result) {
        Alert.alert("Success", "Routine saved successfully!");
        router.push("/(tabs)/three" as Href<string>);
      } else {
        Alert.alert("Error", "Failed to save routine.");
      }
    } catch (error) {
      console.error("Error saving routine:", error);
      Alert.alert("Error", "An error occurred while saving the routine.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 2, justifyContent: "center" }}>
        <BackButton />
        <View className="w-full flex justify-center items-center h-full my-4 px-4 mt-16">
          <Text className="text-3xl font-bold text-center">
            Your Personalized Weekly Routine
          </Text>

          <Text className="text-lg font-pregular text-left px-4 mt-4 mb-8">
            Routines are generated tailored to your profile, fitness level, progression, and other factors.
          </Text>

          {/* Environment Dropdown */}
          <View className="flex-row w-full">
            <View className="flex-[2] mr-2">
              <Text className="font-psemibold text-base mb-1">Environment</Text>
              <Dropdown
                style={{
                  height: 48,
                  borderWidth: 2,
                  borderColor: "black",
                  backgroundColor: "white",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                }}
                placeholderStyle={{ fontSize: 16, color: "gray" }}
                selectedTextStyle={{ fontSize: 16 }}
                data={workoutEnv}
                labelField="description"
                valueField="id"
                placeholder={"Select Workout Environment"}
                value={selectedEnv}
                onChange={(item) => {
                  setSelectedEnv(item.id);
                }}
              />
            </View>

            {/* Days Dropdown */}
            <View className="flex-[1]">
              <Text className="font-psemibold text-base mb-1">Days</Text>
              <Dropdown
                style={{
                  height: 48,
                  borderWidth: 2,
                  borderColor: "black",
                  backgroundColor: "white",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                }}
                placeholderStyle={{ fontSize: 16, color: "gray" }}
                selectedTextStyle={{ fontSize: 16 }}
                data={Array.from({ length: 6 }, (_, index) => ({
                  label: `${index + 1}`,
                  value: `${index + 1}`,
                }))}
                labelField="label"
                valueField="value"
                placeholder={"Select Days"}
                value={selectedDay}
                onChange={(item) => {
                  setSelectedDay(item.value);
                }}
              />
            </View>
          </View>

          {/* Start Date */}
          <FormField
            title="Start Date"
            value={selectedDate ? new Date(selectedDate).toDateString() : ""}
            handleChangeText={() => {}}
            placeholder={"Select the Start Date"}
            isDatePicker
            onDateChange={handleDateChange}
          />

          {/* Generate/Refresh button */}
          <View className={`${buttonPressed ? 'mt-6' : 'mt-10'} items-center`}>
            {buttonPressed && (
              <Text className="font-psemibold text-base text-center mb-4">
                Refresh as you'd like,{"\n"} 
                then scroll down and tap Confirm
              </Text>
            )}
            <CustomButton
              title={ buttonPressed ? "Refresh" : isSubmitting ? "Generating..." : "Generate" }
              handlePress={handleGenerateRoutine}
              containerStyles="w-52"
              isLoading={isSubmitting}
            />
          </View>

          {/* Routine Display */}
          {buttonPressed && (
            <View className="w-full py-2 mt-4">
              {(() => {
                // Evenly spread out the schedule (Mon, Wed, etc) based on days per week for display
                const dayNames = generateRoutine.getDayNames(selectedDate, dailyRoutines.length);
                return dailyRoutines.map((routine, dayIndex) => (
                  <View key={dayIndex} className="mb-5">

                    {/* Day header */}
                    <Text className="text-xl font-semibold mb-2 text-center mt-6">
                      Day {routine.dayNumber} - {dayNames[dayIndex]}
                    </Text>

                    {/* Muscle Groups Header */}
                    <Text className="text-lg text-center mb-2">
                      {[...new Set(routine.exerciseDetails.flatMap((exercise) => getMuscleGroups(exercise.exerciseId))),].join(" & ")}
                    </Text>

                    {/* Exercise Details blocks */}
                    {routine.exerciseDetails.map((exercise, index) => (
                      <View key={index} className="flex-row mb-1 items-center">
                        
                        {/* TODO: Update to YouTube Thumbnails later on*/}
                        <Image source={image1} className="w-[70] h-[70] mr-2" />

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

                          {/* Data row */}
                          <View className="flex-row items-center">
                            <Text className="flex-[2] text-center">
                              {getExerciseName(exercise.exerciseId)}
                            </Text>
                            <Text className="flex-[1] text-center">
                              {exercise.sets}
                            </Text>
                            <Text className="flex-[1] text-center">
                              {exercise.reps}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                ));
              })()}
            </View>
          )}

          {/* Confirm Button */}
          {buttonPressed && (
            <View className="mt-2 items-center">
              <Text className="font-bold text-lg text-center mb-4">
                Confirm your routine for this week!
              </Text>
              <CustomButton
                title="Confirm"
                handlePress={handleSaveRoutine}
                containerStyles="w-52 bg-green-800"
                isLoading={isSubmitting}
              />
              <Text className="font-psemibold text-base text-center px-8 mt-4">
                Don't forget to update your results in Current Week Routine after one week!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GenerateRoutine;
