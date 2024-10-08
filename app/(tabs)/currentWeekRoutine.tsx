import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import { Image } from "react-native";
// import { Href, router } from "expo-router";
import * as currentWeekRoutine from "../controllers/currentWeekRoutine";
import * as generateRoutine from "../controllers/generateRoutine";

type WeeklyRoutine = {
    startDate: string;
    endDate: string;
    daysPerWeek: number;
    workoutEnvironmentId: number;
    dailyRoutines: DailyRoutine[];
  }
  
  type ExerciseDetail = {
    exerciseId: number;
    sets: number;
    reps: number;
    youtubeURL: string;
    exercise: Exercise;
  };

  type Exercise = {
    exerciseId: number;
    name: string;
  }

  type DailyRoutine = {
    dayNumber: number;
    exerciseDetails: ExerciseDetail[];
};
  
const CurrentWeeklyRoutine = () => {
    const image1 = require("../assets/images/HomePagePic1.jpeg");

    const [weeklyRoutine, setWeeklyRoutine] = useState<WeeklyRoutine | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getCurrentWeeklyRoutine = async () => {
            try {
                const data = await currentWeekRoutine.fetchCurrentWeeklyRoutine();
                if (data) {
                    setWeeklyRoutine(data);
                } else {
                    setError("Failed to fetch current weekly routine.");
                }
            } catch (err) {
                setError("An error occurred while fetching the routine.");
            }
        };

        getCurrentWeeklyRoutine();
    }, []);

    if (error) {
        return (
            <SafeAreaView>
                <Text>Error: {error}</Text>
            </SafeAreaView>
        );
    }

    if (!weeklyRoutine) {
        return (
            <SafeAreaView>
                <Text>No Weekly Routine Found</Text>
            </SafeAreaView>
        );
    }

    console.log(weeklyRoutine.dailyRoutines)
    return (
        <SafeAreaView className="flex-1">
            <ScrollView contentContainerStyle={{ flexGrow: 2, justifyContent: "center" }}>
                <BackButton />
                <View className="w-full flex justify-center items-center my-4 px-4 mt-16">
                <Text className="text-3xl font-bold text-center">
                    Current Week's Routine
                </Text>
                </View>

                {/* Current Week's Routine Display */}
                <View className="w-full py-2 mt-2">
                {(() => {
                    // Evenly spread out the schedule (Mon, Wed, etc) based on days per week for display
                    const dayNames = generateRoutine.getDayNames(weeklyRoutine.startDate, weeklyRoutine.dailyRoutines.length);
                    return weeklyRoutine.dailyRoutines.map((routine, dayIndex) => (
                    <View key={dayIndex} className="mb-5">

                        {/* Day header */}
                        <Text className="text-xl font-semibold mb-2 text-center mt-6">
                        Day {routine.dayNumber} - {dayNames[dayIndex]}
                        </Text>

                        {/* Muscle Groups Header
                        <Text className="text-lg text-center mb-2">
                        {[...new Set(routine.exerciseDetails.flatMap((exercise) => getMuscleGroups(exercise.exerciseId))),].join(" & ")}
                        </Text> */}

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
            </ScrollView>
        </SafeAreaView>
    );
};

export default CurrentWeeklyRoutine;
