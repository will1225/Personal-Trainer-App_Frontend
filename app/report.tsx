import { View, Text, SafeAreaView, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import { Href, Link, router, useLocalSearchParams } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { getSelectedReport } from "./controllers/report";

// Report Screen
const report = () => {
   const params = useLocalSearchParams();
   const progressId = params.progressId ? Number(params.dailyRoutineId): 6;
   const [data, setData] = useState<any>({});
   const [ranges, setRanges] = useState<any[]>([]);
   const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    console.log(data);
   useEffect(() => {
    const getReportData = async () => {
        const fetchedData = await getSelectedReport(progressId);
        setData(fetchedData);
        setRanges(fetchedData.ranges.classifications || []);
    };

    getReportData();
    }, [progressId]);

  // Highlight the corresponding row based on body fat %
  const isHighlighted = (range: { classification: string; min: number; max: number }) => {
    if (data.fat === null) return false;
    // range.max === null represents Infinity from the backend
    return data.fat >= range.min && (range.max === null || data.fat <= range.max);
};

//    setRanges(data.)
//   const { measurementId } = useLocalSearchParams(); // measurementId passing from the previous screen
//   if (!measurementId) throw "Measurement ID is missing";
  
//   // Hardcoded test
//   // const measurementId = '2';

//   // State variables
//   const [bodyFat, setBodyFat] = useState<number | null>(null);
//   const [muscleMass, setMuscleMass] = useState<number | null>(null);
//   const [classification, setClassification] = useState<string | null>(null);
//   const [ffmiClassification, setFFMIClassification] = useState<string | null>(null);
//   const [ranges, setRanges] = useState<any[]>([]);

//   // Get and set fitness data
//   useEffect(() => {
//     const getBodyFatPercentage = async () => {
//       const progressId = 297 // hardcoding for now


//       const result = await fitnessUtil.fetchFitnessResult(measurementId as string);
//       setBodyFat(result.bodyFatPercent);
//       setMuscleMass(result.muscleMass);
//       setClassification(result.classification); 
//       setFFMIClassification(result.ffmiClassification); 
//       setRanges(result.ranges.classifications || []);

//       // Save intensity and level after fetching fitness result
//       const updateResult = await fitnessUtil.saveIntensityAndLevel(result.classification, result.ffmiClassification);
//       if (updateResult.status) {
//         queryClient.invalidateQueries({
//           queryKey: ['profile']
//         });
//       }
//     };
//     getBodyFatPercentage();
//   }, [measurementId]);

    

  return (
    <SafeAreaView style={{ flex: 1 }}>
      
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <BackButton />
        <View className="w-full flex justify-center items-center px-4 mb-8 mt-12">
          <Text className="text-3xl font-bold text-center mb-1">
          {new Date(data.startDate).toLocaleDateString(undefined, options)} ~ {new Date(data.endDate).toLocaleDateString(undefined, options)}
          </Text>
          <Text className="text-sm text-center mb-4">
          {data.assess} You've 
            {data && typeof data.gainedMuscle === 'number' 
            ? (
            <>
                {data.gainedMuscle < 0 ? " lost " : " gained "}
                <Text style={{ color: data.gainedMuscle < 0 ? 'red' : 'green' }}>
                {Math.abs(data.gainedMuscle).toFixed(2)} kg
                </Text>
                {' '}of Lean Muscle and 
            </>
            ) 
            : '0.00'} 
            {data && typeof data.gainedFat === 'number' 
            ? (
            <>
                {data.gainedFat < 0 ? " lost " : " gained "}
                <Text style={{ color: data.gainedFat < 0 ? 'green' : 'red' }}>
                {Math.abs(data.gainedFat).toFixed(2)} %
                </Text>
            </>
            )
            : '0.00'} 
            {' '}of Body Fat Compared to Last Week 
            
          </Text>
          <View className="flex flex-col items-center mb-6 mt-2 w-full">
            <View className="flex flex-row justify-center">
              <Text className="text-xl w-36 text-right">
                Body Fat %:
              </Text>
              <Text className="text-xl ml-2">
                {data.fat}
              </Text>
            </View>
            <View className="flex flex-row justify-center mt-2 w-full">
              <Text className="text-xl w-36 text-right">
                Muscle Mass:
              </Text>
              <Text className="text-xl ml-2">
                {data.muscle} kg
              </Text>
            </View>
            <View className="flex flex-row justify-center mt-2">
              <Text className="text-xl w-36 text-right">
                Chest:
              </Text>
              <Text className="text-xl ml-2">
                {data.chest} mm
              </Text>
            </View>
            <View className="flex flex-row justify-center mt-2">
              <Text className="text-xl w-36 text-right">
                Abdomen:
              </Text>
              <Text className="text-xl ml-2">
                {data.abdomen} mm
              </Text>
            </View>
            <View className="flex flex-row justify-center mt-2">
              <Text className="text-xl w-36 text-right">
                Thigh:
              </Text>
              <Text className="text-xl ml-2">
                {data.thigh} mm
              </Text>
            </View>
            <View className="flex flex-row justify-center mt-2">
              <Text className="text-xl w-36 text-right">
                Weight:
              </Text>
              <Text className="text-xl ml-2">
                {data.weight} kg
              </Text>
            </View>
            <View className="flex flex-row justify-center mt-2">
              <Text className="text-xl w-36 text-right">
                Hight:
              </Text>
              <Text className="text-xl ml-2">
                {data.height} cm
              </Text>
            </View>
            <View className="flex flex-row justify-center mt-2">
              <Text className="text-xl w-36 text-right">
                FFMI :
              </Text>
              <Text className="text-xl ml-2">
                {data.ffmiClassification}
              </Text>
            </View>
            
            
            {/* {classification && (
              <View className="flex flex-row justify-center mt-2">
                <Text className="text-xl w-48 text-right">
                  Body Fat Class:
                </Text>
                <Text className="text-xl ml-2">
                  {classification}
                </Text>
              </View>
            )} */}
            
          </View>

          {/* {ffmiClassification && (
              <View className="flex flex-row justify-center mt-2">
                <Text className="text-xl w-48 text-right">
                  FFMI Class:
                </Text>
                <Text className="text-xl ml-2">
                  {ffmiClassification}
                </Text>
              </View>
            )} */}
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
                 {/*   */}
                <Text style={{ flex: 1, textAlign: "center" }}>{item.classification}</Text>
                <Text style={{ flex: 1, textAlign: "center" }}>{item.men}</Text>
                <Text style={{ flex: 1, textAlign: "center" }}>{item.women}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default report;
