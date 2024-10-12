import { View, Text, SafeAreaView, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { Bar } from "react-native-progress";
// import { Href, router } from "expo-router";
import { CustomButton } from "@/components";
import BackButton from "../../components/BackButton";
import * as currentWeekRoutine from "../controllers/currentWeekRoutine";
import * as generateRoutine from "../controllers/generateRoutine";
import { useAtom } from "jotai";
import { currentWeekRoutineAtom } from "../../store";


// Helper function for displaying the date range
const formatDateRange = (startDate: string, endDate: string): string => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    const start = new Date(startDate).toLocaleDateString(undefined, options);
    const end = new Date(endDate).toLocaleDateString(undefined, options);
  
    return `${start} - ${end}`;
};

// Helper function for calculating progress
const calculateProgress = (trainingDays: string[], startDateStr: string, currentDate: Date): number => {
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const startDate = new Date(startDateStr);
  
  let completedDays = 0;

  // Map training days to their actual date
  trainingDays.forEach(day => {
    const dayIndex = dayNames.indexOf(day); 
    
    // Calculate the day of the week adjusted for Monday start
    const currentDayIndex = (startDate.getDay() + 6) % 7;

    // Calculate the date of the training day based on the start date
    const trainingDayDate = new Date(startDate);
    trainingDayDate.setDate(startDate.getDate() + ((dayIndex - currentDayIndex + 6) % 7));

    // Check if the training day has passed
    if (trainingDayDate < currentDate) {
      completedDays += 1;
    }
  });

  const totalDays = trainingDays.length;
  return totalDays > 0 ? completedDays / totalDays : 0; // Prevent division by zero
};

// PLaceholder for handling the submit button
const handleUpdate = async () => {
    // TO-DO: Implement the logic!
    console.log("Update Pressed!");
};


const CurrentWeeklyRoutine = () => {
  const image1 = require("../../assets/images/HomePagePic1.jpeg");

  const [weeklyRoutine, setWeeklyRoutine] = useAtom(currentWeekRoutineAtom);

  useEffect(() => {
    const getCurrentWeeklyRoutine = async () => {
      try {
        const data = await currentWeekRoutine.fetchCurrentWeeklyRoutine();
        if (data) {
          setWeeklyRoutine(data);
        } else {
          console.error("Failed to fetch current weekly routine.");
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching current weekly routine",
          error
        );
      }
    };

    getCurrentWeeklyRoutine();
  }, [setWeeklyRoutine]);

  if (!weeklyRoutine) {
    return (
      <SafeAreaView>
        <Text>No Weekly Routine Found</Text>
      </SafeAreaView>
    );
  }

  // Get training days from the routine
  const trainingDays = generateRoutine.getDayNames(weeklyRoutine.startDate, weeklyRoutine.daysPerWeek);

  // Calculate progress
  const progress = calculateProgress(trainingDays, weeklyRoutine.startDate, new Date());

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 2, justifyContent: "center" }}>
        <View className="w-full h-full flex justify-center items-center my-4 px-4 mt-28">
          <BackButton />
          <Text className="text-3xl font-bold text-center">
            Current Week's Routine
          </Text>

          <Text className="text-lg font-semibold mt-2">
            {formatDateRange(weeklyRoutine.startDate, weeklyRoutine.endDate)}
          </Text>

          <Text className="text-lg font-pregular text-left px-4 mt-4 mb-4">
            As you regularly update your weekly results, we can generate better routines tailored to your fitness level.
          </Text>

           {/* Progress Bar */}
           <View className="w-full flex justify-center items-center my-4">
            <Text className="text-lg font-semibold text-center mb-2">
              Weekly Progress Bar
            </Text>
            <View className="w-full px-6">
                <Bar
                    progress={progress}
                    color="#4caf50"
                    width={null}
                    height={20}  
                    borderWidth={2}
                    borderColor="black"
                    borderRadius={15}
                />
            </View>            
          </View>

          {/* Update button placeholder*/}
            <View className="mt-2 items-center">
            <CustomButton
                    title="Update Results"
                    containerStyles="w-52"
                    handlePress={handleUpdate}
            />
            <Text className="text-lg mt-2">
                Reset and create a new routine
            </Text>
          </View>

          {/* Current Week's Routine Display */}
          <View className="w-full py-2 mt-4">
            {(() => {
              return weeklyRoutine.dailyRoutines.map((routine, dayIndex) => (
                <View key={dayIndex} className="mb-5">
                  {/* Day header */}
                  <Text className="text-xl font-semibold mb-2 text-center mt-6">
                    Day {routine.dayNumber} - {trainingDays[dayIndex]}
                  </Text>

                  {/* Muscle Groups Header */}
                  <Text className="text-lg text-center mb-2">
                    {Array.from(
                      new Set(
                        routine.exerciseDetails.flatMap((detail) =>
                          detail.exercise.muscleGroups.map((mg) => mg.description)
                        )
                      )
                    ).join(" & ")}
                  </Text>

                  {/* Exercise Details blocks */}
                  {routine.exerciseDetails.map((exercise, index) => (
                    <View key={index} className="flex-row mb-1 items-center">

                      {/* TODO: Update to YouTube Thumbnails later on*/}
                      <Image source={image1} className="w-[70] h-[70] mr-2" />

                      <View className="flex-1 border border-gray-300 items-center rounded-lg min-h-[65px]"
                        style={{ backgroundColor: "#e5e5e5" }}>

                        {/* Exercise Details header*/}
                        <View
                          className="flex-row mb-1 items-center rounded h-7"
                          style={{ backgroundColor: "#0369a1" }}
                        >
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
                            {exercise.exercise.name}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CurrentWeeklyRoutine;