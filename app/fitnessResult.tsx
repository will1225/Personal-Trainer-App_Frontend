import { View, SafeAreaView, ScrollView, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import { Href, Link, router, useLocalSearchParams } from "expo-router";
import CustomButton from "@/components/CustomButton";
import ProgressSummary from "@/components/ProgressSummary";
import * as fitnessUtil from "./controllers/fitnessResult";
import { getProgressResults } from "./controllers/progress";
import { useQueryClient } from "react-query";
import { Text } from "@/components/Text"
import LoadingAnimation from "@/components/LoadingAnimation";
import { useAtom } from "jotai";
import { profileAtom } from "@/store";
import BodyFatChart from "@/components/BodyFatChart";

// Fitness Result screen
const FitnessResult = () => {
  const queryClient = useQueryClient();
  const image = require("../assets/images/neonDumbell.png");
  const { measurementId, isProgress } = useLocalSearchParams(); // measurementId, progress passing from the previous screen
  if (!measurementId) throw "Measurement ID is missing";

  // Access profile atom to get gender
  const [profile] = useAtom(profileAtom);
  const gender = profile?.gender;
  
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

      if (fitnessResult.classification === "Out of classification range" || fitnessResult.ffmiClassification === "Unusual/Extreme Result") {
        Alert.alert(
          "WARNING",
          "Your body composition is outside the typical range. Consult a healthcare professional for assessment.",          
        );
      }

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
  }, [isProgress, measurementId, queryClient]);

  // Highlight the corresponding row based on body fat %
  const isHighlighted = (range: { classification: string; min: number; max: number }) => {
    if (bodyFat === null) return false;
    // range.max === null represents Infinity from the backend
    return bodyFat >= range.min && (range.max === null || bodyFat <= range.max);
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 2, justifyContent: "center" }}>
        <View className="w-full h-full flex justify-center items-center my-4 px-4 mt-28">
          <BackButton />
          <Text className="text-3xl font-bold text-center mb-8">
            Your Current Fitness Level
          </Text>

          {/* Render a loading state while the data is being fetched */}
          {loading ? (
            <LoadingAnimation isLoading={loading} />
          ) : ( 
            <>
              {/* Render progress summary if needed, else render the image */}
              {progressSummary ? (
                <ProgressSummary data={progressSummary} fontSize={17}/>
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
                    Lean Body Mass:
                  </Text>
                  <Text className="text-xl ml-2">
                  { muscleMass ? (
                    progressSummary ? (
                    <>
                      {muscleMass - progressSummary.gainedMuscle} {`\u2794`}{' '}
                      <Text 
                        style={
                          progressSummary.gainedMuscle === 0
                            ? {} // follow system scheme color if no changes
                            : { color: progressSummary.gainedMuscle > 0 ? 'green' : 'red' }
                        }
                      >
                        {muscleMass}{' '}
                      </Text>
                      kg
                    </>
                    ) : (
                      <>
                        {muscleMass} kg
                      </>
                    )
                  ): (
                    "Loading..."
                  )} 
                  </Text>
                </View>
                <View className="flex flex-row justify-center mt-2">
                  <Text className="text-xl w-48 text-right">
                    Body Fat %:
                  </Text>
                  <Text className="text-xl ml-2">
                  { bodyFat ? (
                    progressSummary ? (
                    <>
                      {bodyFat - progressSummary.gainedFat} {`\u2794`}{' '}
                      <Text
                        style={
                          progressSummary.gainedFat === 0
                            ? {} // follow system scheme color if no changes
                            : { color: progressSummary.gainedFat < 0 ? 'green' : 'red' }
                        }
                      >
                        {bodyFat}{' '}
                      </Text>
                      %
                    </>
                    ) : (
                      <>
                        {bodyFat} kg
                      </>
                    )
                  ): (
                    "Loading..."
                  )} 
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
              <BodyFatChart ranges={ranges} gender={gender} isHighlighted={isHighlighted} />

              <Text className="text-xl text-left mb-8">
                Ready to get in shape?
              </Text>          

              <CustomButton
                title="Get Personalized Routine"
                handlePress={() => router.push("/generateRoutine" as Href<string>)}
                containerStyles="w-[260px]"
              />
              
              <Link href={"/(tabs)/home" as Href<string>} className="mt-4 mb-8">
                <Text className="text-lg font-psemibold text-grey ">
                  I'll do it later.
                </Text>                
              </Link>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FitnessResult;
