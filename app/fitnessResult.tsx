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
  const [currentFitnessResult, setCurrentFitnessResult] = useState<any | null>(null);
  const [progressSummary, setProgressSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [prevFitnessResult, setPrevFitnessResult] = useState<any | null>(null);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const [fatLevel, setFatLevel] = useState<string[]>([]);
  const [ffmiLevel, setFfmiLevel] = useState<string[]>([]);

  // Get and set fitness data
  useEffect(() => {
    const getFitnessData = async () => {
      setLoading(true);

      const fitnessResult = await fitnessUtil.fetchFitnessResult(measurementId as string);
      setCurrentFitnessResult(fitnessResult);

      // Dynamically populate the classification list for comparison
      if (fitnessResult.ranges.classifications && fitnessResult.ffmiTable) {
        const fatLevel = fitnessResult.ranges.classifications.map((item: any) => item.classification);
        const ffmiLevel = fitnessResult.ffmiTable.map((item: any) => item.classification);

        setFatLevel([
          "Out of classification range", // Extreme case
          ...fatLevel,
        ]);
  
        setFfmiLevel([
          "Unusual/Extreme Result",     // Extreme case
          ...ffmiLevel,
        ]);
      }

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

        const prevFitnessResult = await fitnessUtil.fetchFitnessResult(progressResult.prevMeasurementId);
        setPrevFitnessResult(prevFitnessResult);
      }
      setLoading(false);
    };

    getFitnessData();
  }, [isProgress, measurementId, queryClient]);

  // Highlight the corresponding row based on body fat %
  const isHighlighted = (range: { classification: string; min: number; max: number }) => {
    if (currentFitnessResult.bodyFatPercent === null) return false;
    // range.max === null represents Infinity from the backend
    return currentFitnessResult.bodyFatPercent >= range.min && (range.max === null || currentFitnessResult.bodyFatPercent <= range.max);
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
                <ProgressSummary data={progressSummary} fontSize={19}/>
              ) : !isProgress ? (
                <Image
                  source={image}
                  resizeMode="contain"
                  className="w-[200px] h-[50px] justify-center mb-6"
                />
              ) : null}

              {/* Legend */}
              <View className="items-left justify-center mt-8 w-full">
                  <Text className="text-m ml-2 font-semibold">Legend:</Text>
                  
                  <View className="flex flex-row items-center mt-2">
                    <Text className="text-m text-green-500 ml-2">{`\u2794`}</Text>
                    <Text className="text-m ml-1">Improved</Text>
                  
                    <Text className="text-m text-red-500 ml-2">{`\u2794`}</Text>
                    <Text className="text-m ml-1">Regressed</Text>

                    <Text className="text-m ml-2">{`\u2794`}</Text>
                    <Text className="text-m ml-1">Unchanged / Not Compared</Text>
                  </View>
              </View>

              {/* Date Comparison */}
              <View className="flex flex-col items-center mb-6 mt-8 w-full px-2">
                <View className="flex flex-row justify-between items-center mb-3 w-full">
                  <Text className="text-xl font-semibold text-right w-[28%]">{``}</Text>
                  <Text className="text-lg w-[28%] text-center truncate font-semibold">{new Date(prevFitnessResult.date).toLocaleDateString(undefined, options)}</Text>
                  <Text className="text-xl w-[14%] text-center">{``}</Text>
                  <Text className="text-xl w-[28%] text-center truncate font-semibold">{new Date(currentFitnessResult.date).toLocaleDateString(undefined, options)}</Text>
                </View>

                {/* Body Fat */}
                <View className="flex flex-row justify-between items-center mb-3 w-full">
                  <Text className="text-xl font-semibold text-right w-[28%]">{`Body Fat:`}</Text>
                  <Text className="text-xl w-[28%] text-center truncate">{prevFitnessResult.bodyFatPercent}</Text>
                  <Text
                  className={`text-xl w-[14%] text-center ${currentFitnessResult.bodyFatPercent - prevFitnessResult.bodyFatPercent > 0 ? 'text-red-500' : 'text-green-500'}`}
                >
                  {`\u2794`}
                </Text>
                  <Text className="text-xl w-[28%] text-center truncate">{currentFitnessResult.bodyFatPercent} %</Text>
                </View>

                {/* Muscle Mass */}
                <View className="flex flex-row justify-between items-center mb-3 w-full">
                  <Text className="text-xl font-semibold text-right w-[30%]">{`Body Mass: `}</Text>
                  <Text className="text-xl w-[28%] text-center truncate">{prevFitnessResult.muscleMass}</Text>
                  <Text
                  className={`text-xl w-[14%] text-center ${prevFitnessResult.muscleMass - currentFitnessResult.muscleMass > 0 ? 'text-red-500' : 'text-green-500'}`}
                >
                  {`\u2794`}
                </Text>
                  <Text className="text-xl w-[28%] text-center truncate">{currentFitnessResult.muscleMass} kg</Text>
                </View>

                {/* Weight */}
                <View className="flex flex-row justify-between items-center mb-3 w-full">
                  <Text className="text-xl font-semibold text-right w-[28%]">{`Weight:`}</Text>
                  <Text className="text-xl w-[28%] text-center truncate">{prevFitnessResult.weight}</Text>
                  <Text
                  className={`text-xl w-[14%] text-center`}
                >
                  {`\u2794`}
                </Text>
                  <Text className="text-xl w-[28%] text-center truncate">{currentFitnessResult.weight} kg</Text>
                </View>

                {/* Fat Level */}
                <View className="flex flex-row justify-between items-center mb-3 w-full">
                  <Text className="text-xl font-semibold text-right w-[28%]">{`Fat Level:`}</Text>
                  <Text className="text-lg w-[28%] text-center truncate">{prevFitnessResult.classification}</Text>
                  <Text
                  className={`text-xl w-[14%] text-center
                    ${fatLevel.indexOf(prevFitnessResult.classification) - fatLevel.indexOf(currentFitnessResult.classification) === 0 ? {} : 
                    fatLevel.indexOf(prevFitnessResult.classification) - fatLevel.indexOf(currentFitnessResult.classification) < 0 ? 'text-red-500' : 'text-green-500'}`}
                >
                  {`\u2794`}
                </Text>
                  <Text className="text-lg w-[28%] text-center truncate">{currentFitnessResult.classification}</Text>
                </View>

                {/* FFMI */}
                <View className="flex flex-row justify-between items-center mb-3 w-full">
                  <Text className="text-xl font-semibold text-right w-[28%]">{`FFMI:`}</Text>
                  <Text className="text-lg w-[28%] text-center truncate">{prevFitnessResult.ffmiClassification}</Text>
                  <Text
                  className={`text-xl w-[14%] text-center
                    ${ffmiLevel.indexOf(prevFitnessResult.ffmiClassification) - ffmiLevel.indexOf(currentFitnessResult.ffmiClassification) === 0 ? {} :
                    ffmiLevel.indexOf(prevFitnessResult.ffmiClassification) - ffmiLevel.indexOf(currentFitnessResult.ffmiClassification) > 0 ? 'text-red-500' : 'text-green-500'}`}
                >
                  {`\u2794`}
                </Text>
                  <Text className="text-lg w-[28%] text-center truncate">{currentFitnessResult.ffmiClassification}</Text>
                </View>
              </View>
              
              <View className="flex flex-col items-center px-1 mb-6 mt-2"> 
                <Text className="text-sm text-left">
                  ** Fat Level reflects your body fat for your age, 
                  while FFMI indicates your muscle mass relative to your height.
                </Text>
              </View>

              {/* Body Fat Percentage Table */}
              <BodyFatChart ranges={currentFitnessResult.ranges.classifications} gender={gender} isHighlighted={isHighlighted} />

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
