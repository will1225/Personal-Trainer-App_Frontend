import { View, Text, SafeAreaView, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import { Href, router, useLocalSearchParams } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { StatusBar } from "expo-status-bar";
import * as fitnessUtil from "./controllers/fitnessResult";

// Fitness Result screen
const fitnessResult = () => {
  const image = require("../assets/images/neonDumbell.png");  
  const { measurementId } = useLocalSearchParams(); // measurementId passing from the previous screen
  if (!measurementId) throw "Measurement ID is missing";
  
  // Hardcoded test
  // const measurementId = '2';

  // State variables
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const [muscleMass, setMuscleMass] = useState<number | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [ranges, setRanges] = useState<any[]>([]);

  // Get and set fitness data
  useEffect(() => {
    const getBodyFatPercentage = async () => {
      const result = await fitnessUtil.fetchFitnessResult(measurementId as string);
      setBodyFat(result.bodyFatPercent);
      setMuscleMass(result.muscleMass);
      setClassification(result.classification); 
      setRanges(result.ranges.classifications || []);
    };
    getBodyFatPercentage();
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
        <View className="w-full flex justify-center items-center px-4 mb-8">
          <Text className="text-3xl font-bold text-center mb-8">
            Your Current Fitness Level
          </Text>

          <Image
            source={image}
            resizeMode="contain"
            className="w-[200px] h-[50px] justify-center mb-6"
          />

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
                Lean Muscle Mass:
              </Text>
              <Text className="text-xl ml-2">
                {muscleMass !== null ? `${muscleMass} kg` : "Loading..."}
              </Text>
            </View>
            {classification && (
              <View className="flex flex-row justify-center mt-2">
                <Text className="text-xl w-48 text-right">
                  Classification:
                </Text>
                <Text className="text-xl ml-2">
                  {classification}
                </Text>
              </View>
            )}
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
            handlePress={() => router.push("/toBeDevelop" as Href<string>)}
            containerStyles="w-[230px]"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default fitnessResult;
