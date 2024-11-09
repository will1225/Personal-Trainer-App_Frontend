import { View, Text, SafeAreaView, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import { Href, Link, router, useLocalSearchParams } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { getSelectedReport } from "../controllers/report";
import ProgressSummary from "@/components/ProgressSummary"

// Report Screen
const report = () => {
  const params: any = useLocalSearchParams();
  console.log(`id ${params.id}`)
  const [data, setData] = useState<any>({});
  const [ranges, setRanges] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(false);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  console.log(data);
  const summaryData = {
    assess: data.assess,
    gainedFat: data.gainedFat,
    gainedMuscle: data.gainedMuscle
  }
  useEffect(() => {
    const getReportData = async () => {
      setLoading(true)
      const fetchedData = await getSelectedReport(params.id);
      setData(fetchedData);
      setRanges(fetchedData.ranges.classifications || []);
      setLoading(false);
    };

    getReportData();
  }, [params.id]);

  // Highlight the corresponding row based on body fat %
  const isHighlighted = (range: { classification: string; min: number; max: number }) => {
    if (data.fat === null) return false;
    // range.max === null represents Infinity from the backend
    return data.fat >= range.min && (range.max === null || data.fat <= range.max);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <BackButton />
        { isLoading ? (
         <View className="w-full flex justify-center items-center h-full my-4 px-4 mt-16">
         <Text className="text-xl text-center">Loading...</Text>
       </View>
    ) : (
      <>
        <View className="w-full flex justify-center items-center px-4 mb-8 mt-12">
          <Text className="text-3xl font-bold text-center mb-1 pb-1">
            Progress Report
          </Text>
          <Text className="text-m font-bold text-center mb-1 pb-1">
            {new Date(data.reportDate).toLocaleDateString(undefined, options) + ", " + new Date(data.startDate).getFullYear()}
          </Text>
          <ProgressSummary data={summaryData} fontSize={18}></ProgressSummary>
          <View className="flex flex-col items-center mb-4 mt-2 w-full">
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
                Fat Levels:
              </Text>
              <Text className="text-xl ml-2">
                {data.fatClassification}
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
          </View>
          <Text className="text-m font-bold text-center mb-3 pb-1">
            {'Workout Period: ' + new Date(data.startDate).toLocaleDateString(undefined, options)} ~ {new Date(data.endDate).toLocaleDateString(undefined, options) + ' (' + new Date(data.startDate).getFullYear() + ') ' }
            </Text>
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
        </View>
        </>)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default report;
