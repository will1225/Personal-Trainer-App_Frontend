import { View, Text, SafeAreaView, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import { Href, Link, router, useLocalSearchParams } from "expo-router";
import CustomButton from "@/components/CustomButton";
import ProgressSummary from "@/components/ProgressSummary";
import { StatusBar } from "expo-status-bar";
import * as fitnessUtil from "./controllers/fitnessResult";
import { getProgressResults } from "./controllers/progress";
import { useQueryClient } from "react-query";
import Ionicons from "@expo/vector-icons/Ionicons";

// Fitness Result screen
const fitnessResult = () => {
  const queryClient = useQueryClient();
  const image = require("../assets/images/neonDumbell.png");  
  const image2 = require("../assets/images/YouArrow.png"); 
  const { measurementId, isProgress } = useLocalSearchParams(); // measurementId, progress passing from the previous screen
  if (!measurementId) throw "Measurement ID is missing";

  
  // State variables
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const [muscleMass, setMuscleMass] = useState<number | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [ffmiClassification, setFFMIClassification] = useState<string | null>(null);
  const [ranges, setRanges] = useState<any[]>([]);
  const [progressSummary, setProgressSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Get and set fitness data
  useEffect(() => {
    const getFitnessData = async () => {
      setLoading(true);

      const fitnessResult = await fitnessUtil.fetchFitnessResult(measurementId as string);
      setBodyFat(fitnessResult.bodyFatPercent);
      setMuscleMass(fitnessResult.muscleMass);
      setClassification(fitnessResult.classification); 
      setFFMIClassification(fitnessResult.ffmiClassification); 
      setRanges(fitnessResult.ranges.classifications || []);

      // Save intensity and level after fetching fitness result
      const updateResult = await fitnessUtil.saveIntensityAndLevel(fitnessResult.classification, fitnessResult.ffmiClassification);
      if (updateResult.status) {
        queryClient.invalidateQueries({
          queryKey: ['profile']
        });
      }

      // Get the progress summary info if needed to display progress results
      if (isProgress) {
        const progressResult = await getProgressResults();
        setProgressSummary(progressResult);
      }
      setLoading(false);
    };


    getFitnessData();
  }, [measurementId]);

  // Highlight the corresponding row based on body fat %
  const isHighlighted = (range: { classification: string; min: number; max: number }) => {
    if (bodyFat === null) return false;
    // range.max === null represents Infinity from the backend
    return bodyFat >= range.min && (range.max === null || bodyFat <= range.max);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BackButton />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View className="w-full flex justify-center items-center px-4 mb-8 mt-16">
          <Text className="text-3xl font-bold text-center mb-8">
            Your Current Fitness Level
          </Text>

          {/* Render a loading state while the data is being fetched */}
          {loading ? (
            <Text className="text-lg text-center mt-4">Loading...</Text>
          ) : ( 
            <>
              {/* Render progress summary if needed, else render the image */}
              {progressSummary ? (
                <ProgressSummary data={progressSummary} />
              ) : !isProgress ? (
                <Image
                  source={image}
                  resizeMode="contain"
                  className="w-[200px] h-[50px] justify-center mb-6"
                />
              ) : null}

              <View className="flex flex-col items-center mb-6 mt-2">
                <View className="flex flex-row justify-center">
                  <Text className="text-xl w-48 text-right">
                    Body Fat %:
                  </Text>
                  <Text className="text-xl ml-2">
                    {bodyFat !== null ? `${bodyFat} %` : "Loading..."}
                  </Text>
                </View>
                <View className="flex flex-row justify-center mt-2">
                  <Text className="text-xl w-48 text-right">
                    Lean Body Mass:
                  </Text>
                  <Text className="text-xl ml-2">
                    {muscleMass !== null ? `${muscleMass} kg` : "Loading..."}
                  </Text>
                </View>
                {classification && (
                  <View className="flex flex-row justify-center mt-2">
                    <Text className="text-xl w-48 text-right">
                      Body Fat Class:
                    </Text>
                    <Text className="text-xl ml-2">
                      {classification}
                    </Text>
                  </View>
                )}
                {ffmiClassification && (
                  <View className="flex flex-row justify-center mt-2">
                    <Text className="text-xl w-48 text-right">
                      FFMI Class:
                    </Text>
                    <Text className="text-xl ml-2">
                      {ffmiClassification}
                    </Text>
                  </View>
                )}
                <Text className="text-sm text-left px-1 mt-6">
                  ** Body Fat Class reflects your body fat for your age, 
                  while FFMI Class indicates your muscle mass relative to your height.
                </Text>
              </View>

              {/* Body Fat Percentage Table */}
              <View className="w-full mb-8">
                <Text
                  className="text-2xl font-bold text-center mb-0"
                  style={{ backgroundColor: "#fbbf24", height: 40, lineHeight: 40 }}
                >
                  Body Fat Chart
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#fcd34d",
                    height: 30,
                  }}
                >
                  <Text
                    className="font-bold"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontSize: 16,
                      backgroundColor: "#fcd34d",
                    }}
                  >
                    Classification
                  </Text>
                  <Text
                    className="font-bold"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontSize: 16,
                      backgroundColor: "#fcd34d",
                    }}
                  >
                    Men
                  </Text>
                  <Text
                    className="font-bold"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontSize: 16,
                      backgroundColor: "#fcd34d",
                    }}
                  >
                    Women
                  </Text>
                </View>

                {ranges.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      height: 32,
                      backgroundColor: isHighlighted(item) ? "#4ade80" : "#e5e5e5",
                      borderBottomWidth: 1,
                      borderBottomColor: "#ddd",
                    }}
                  >
                    {isHighlighted(item) && (
                      <Image
                      source={image2}
                      resizeMode="contain"
                      style={{
                        position: "absolute",
                        left: -19, 
                        width: 38,
                        height: 38
                      }}
                      />
                    )}
                    <Text style={{ flex: 1, textAlign: "center" }}>{item.classification}</Text>
                    <Text style={{ flex: 1, textAlign: "center" }}>{item.men}</Text>
                    <Text style={{ flex: 1, textAlign: "center" }}>{item.women}</Text>
                  </View>
                ))}
              </View>

              <Text className="text-xl text-left mb-8">
                Ready to get in shape?
              </Text>          

              <CustomButton
                title="Get Personalized Routine"
                handlePress={() => router.push("/generateRoutine" as Href<string>)}
                containerStyles="w-[230px]"
              />
              
              <Link href={"/(tabs)/home" as Href<string>} className="text-lg font-psemibold text-grey mt-4 mb-8">
                I'll do it later.
              </Link>
            </>
          )}
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default fitnessResult;
