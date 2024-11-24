import { View, SafeAreaView, ScrollView, Alert, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import { Dropdown } from "react-native-element-dropdown";
import { CustomButton, FormField } from "@/components";
import { Href, router } from "expo-router";
import * as generateRoutine from "./controllers/generateRoutine";
import Ionicons from "@expo/vector-icons/Ionicons";
import { profileAtom } from "@/store";
import { useAtom } from "jotai";
import { useFocusEffect } from "@react-navigation/native";
import { Text } from "@/components/Text"
import ExerciseDetailsBlock from "@/components/ExerciseDetailsBlock";

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
  minutes: number;
  youtubeURL: string;
  thumbnailURL: string;
  name: string;
  muscleGroups: number[];
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

  // State Variables
  const [workoutEnv, setWorkoutEnv] = useState<{ description: string; id: string }[]>([]);
  const [selectedEnv, setSelectedEnv] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [weeklyRoutine, setWeeklyRoutine] = useState<weeklyRoutine | null>(null);
  const [dailyRoutines, setRoutines] = useState<DailyRoutine[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [showRoutineDisplay, setShowRoutineDisplay] = useState(false);
  const [profile, setProfile] = useAtom(profileAtom);

  // Validate if measurementId exists before proceeding
  const isBodyMeasurementValid = async () => {    
    if (!profile.bodyMeasurementId) {
      Alert.alert(
        "Body Measurement Required",
        "Please input your body measurements to proceed.",
        [
          {
            text: "OK",
            onPress: () => router.push("./bodyMeasurement"), 
          },
          {
            text: "Cancel",
            onPress: () => router.push("/(tabs)/home")
          }
        ]
      );
    }
  };

  // Check on mount 
  useFocusEffect(
    useCallback(() => {
      isBodyMeasurementValid();
    }, []) 
  );

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

  // Fetch analysis logs from the backend for display
  const handlePollLogs = async () => {
    try {
      const result = await generateRoutine.pollLogs();
      if (!Array.isArray(result)) return;

      return new Promise<void>((resolve) => {
          result.forEach((log, index) => {
              setTimeout(() => {

                // If the user is identified as overtrained, pop an alert
                if (log.startsWith("Warning")) {
                  Alert.alert("Warning Alert", log);
                }

                setLogs((prevLogs) => [...prevLogs, log]);

                // Each log is displayed one second apart for readability
                if (index === result.length - 1) {
                    setTimeout(() => {
                        setShowRoutineDisplay(true);
                        resolve();
                    }, 1000);
                }
              }, index * 1000);
          });
      });

    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };  

  // Helper function to fetch muscle groups for each exercise for UI display
  const getMuscleGroups = (ids: number[]) => {
      const muscleGroupDescriptions = ids.map((muscleId) => {
        const muscleGroup = muscleGroups.find((mg) => mg.id == muscleId);
        return muscleGroup ? muscleGroup.description : "Unknown Group";
      });

    return muscleGroupDescriptions ? muscleGroupDescriptions : "Unknown Group";
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

      // Level 2: Create dailyRoutines and each of its exerciseDetails (It is now processed by the Algorithm from the backend)
      const { dailyRoutines } = await generateRoutine.getRecommendation(daysPerWeek, workoutEnvironmentId);   
      
      // Fetch pollLogs only for the first generation (Refresh will not refetch logs)
      if (!buttonPressed) await handlePollLogs();

      // Set objects state 
      setWeeklyRoutine(weeklyRoutine); // Save to the backend
      setRoutines(dailyRoutines);      // Save to the backend
      
      setSubmitting(false);
      setButtonPressed(true);
      
    } catch (error) {
      console.error("Error during routine generation:", error);
      setSubmitting(false);
      return;
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
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ flexGrow: 2, justifyContent: "center" }}>
        <View className="w-full h-full flex justify-center items-center my-4 px-4 mt-28">
          <BackButton />
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
                  if (item.id === '2' || item.id === '3') {
                    Alert.alert("Note", "Some exercises may be limited to Gym. While we try to find the best alternatives for you, some exercises may be omitted");
                  }
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
                data={Array.from({ length: 5 }, (_, index) => ({
                  label: `${index + 1}`,
                  value: `${index + 1}`,
                }))}
                labelField="label"
                valueField="value"
                placeholder={"Select Days"}
                value={selectedDay}
                onChange={(item) => {
                  const days = Number(item.value);
                  if (days < 3 || days > 4) {
                    Alert.alert("Suggestion", "We suggest 3 to 4 days for an effective and manageable routine. \n\nNote: Some recommended plans may not exceed 4 days");
                  }
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

            <View className="flex-row items-center">
              <CustomButton
                title={ buttonPressed && showRoutineDisplay ? "Refresh" : isSubmitting ? "Generating..." : "Generate" }
                handlePress={handleGenerateRoutine}
                containerStyles="w-52"
                isLoading={isSubmitting}
              />

              {buttonPressed && (
                <View className="top-[-30]">
                  <TouchableOpacity
                    onPress={() =>  Alert.alert("Analysis Logs", logs.join('\n'))}
                    className="absolute right-[-80]"
                  >
                    <Text className="text-m font-pregular text-center">
                      Logs:
                    </Text>
                    
                    <Ionicons name="clipboard-outline" size={35} color="gray" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Display Algorithm Logs */}
          {logs.length > 0 && !showRoutineDisplay && !buttonPressed && (
            <View className="w-full py-2 mt-4 items-center">
              <Text className="text-xl font-semibold mb-2 text-center">Analysis Logs</Text>              
              <Text className="text-base text-left mx-4">{logs[logs.length - 1]}</Text>              
            </View>
          )}

          {/* Routine Display */}
          {buttonPressed && showRoutineDisplay && (
            <View className="w-full py-2 mt-4">
              {(() => {
                // Evenly spread out the schedule (Mon, Wed, etc.) based on days per week for display
                const dayNames = generateRoutine.getDayNames(selectedDate, dailyRoutines.length);

                return dailyRoutines.map((routine, dayIndex) => {

                  // Get all included muscle group names for rendering
                  const uniqueMuscleGroups = [...new Set(routine.exerciseDetails.flatMap((exercise) => getMuscleGroups(exercise.muscleGroups)))].join(" & ");

                  return (
                    <View key={dayIndex} className="mb-5">

                      {/* Day Header */}
                      <Text className="text-xl font-semibold mb-2 text-center mt-6">
                        Day {routine.dayNumber} - {dayNames[dayIndex]}
                      </Text>

                      {/* Muscle Groups Header */}
                      <Text className="text-lg text-center mb-2">
                        {uniqueMuscleGroups}
                      </Text>

                      {/* Exercise Details blocks */}
                      {routine.exerciseDetails.map((exercise) => (
                        <ExerciseDetailsBlock key={exercise.exerciseId} exercise={exercise} />
                      ))}
                    </View>
                  );
                });
              })()}
            </View>
          )}

          {/* Confirm Button */}
          {buttonPressed && showRoutineDisplay && (
            <View className="mt-2 items-center">
              <Text className="font-bold text-lg text-center mb-4">
                Confirm your routine for this week!
              </Text>
              <CustomButton
                title="Confirm"
                handlePress={handleSaveRoutine}
                containerStyles="w-52"
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
