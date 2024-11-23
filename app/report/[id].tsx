import { View, SafeAreaView, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import { Href, Link, router, useLocalSearchParams } from "expo-router";
import { getSelectedReport } from "../controllers/report";
import ProgressSummary from "@/components/ProgressSummary"
import { Text } from "@/components/Text"
import LoadingAnimation from "@/components/LoadingAnimation";

// Report Screen
const report = () => {
  const image = require("../../assets/images/YouArrow.png"); 
  const params: any = useLocalSearchParams();
  console.log(`id ${params.id}`)
  const [data, setData] = useState<any>({});
  const [ranges, setRanges] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(false);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const [prevId, setPrevId] = useState<number>(0);
  const [progressList, setProgressList] = useState<any[]>([]);
  console.log(data);
  const summaryData = {
    assess: data.assess,
    gainedFat: data.gainedFat,
    gainedMuscle: data.gainedMuscle
  }
  useEffect(() => {
    const getReportData = async () => {
      setLoading(true)
      const fetchedData = await getSelectedReport(params.id, prevId);
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
        { isLoading ? (
        <View className="w-full flex justify-center items-center h-full my-4 px-4 mt-16">
         <LoadingAnimation isLoading={isLoading} />
       </View>
    ) : (
      <>
        <View className="w-full h-full flex justify-center items-center my-4 px-4 mt-28">
          <BackButton />
          <Text className="text-3xl font-bold text-center mb-2 pb-1">
            Progress Report
          </Text>
          <Text className="text-m font-bold text-center mb-1 pb-1">
            {new Date(data.reportDate).toLocaleDateString(undefined, options) + ", " + new Date(data.reportDate).getFullYear()}
          </Text>
          <Text className="text-lg font-bold">
            {data.assess} You've{' '}
            {data && typeof data.gainedMuscle === 'number' ? (
              <>
                {data.gainedMuscle < 0 ? 'lost ' : 'gained '}
                <Text style={{ color: data.gainedMuscle < 0 ? 'red' : 'green' }}>
                  {Math.abs(data.gainedMuscle).toFixed(2)} kg
                </Text>{' '}
                of Lean Muscle and{' '}
              </>
            ) : (
              '0.00'
            )}

            {data && typeof data.gainedFat === 'number' ? (
              <>
                {data.gainedFat < 0 ? 'lost ' : 'gained '}
                <Text style={{ color: data.gainedFat < 0 ? 'green' : 'red' }}>
                  {Math.abs(data.gainedFat).toFixed(2)} %
                </Text>
              </>
            ) : (
              '0.00'
            )}{' '}
            of Body Fat Compared to
            <Text style={{ color: 'purple' }}>
            {" " + new Date(data.lastReportDate).toLocaleDateString(undefined, options) + ", " + new Date(data.lastReportDate).getFullYear()}
            </Text>
          </Text>
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
          
          {/* Body Fat Percentage Table */}
          <View className="w-full mb-8">
            <Text
              className="text-2xl font-bold text-center mb-0 text-black"
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
                  color: '#000'
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
                  color: '#000'
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
                  color: '#000'
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
                  source={image}
                  resizeMode="contain"
                  style={{
                    position: "absolute",
                    left: -19, 
                    width: 38,
                    height: 38
                  }}
                  />
                )}
                <Text style={{ flex: 1, textAlign: "center", color: '#000' }}>{item.classification}</Text>
                <Text style={{ flex: 1, textAlign: "center", color: '#000' }}>{item.men}</Text>
                <Text style={{ flex: 1, textAlign: "center", color: '#000' }}>{item.women}</Text>
              </View>
            ))}
          </View>
          {/* <View className="flex-[2] mr-2">
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
                data={data.progress}
                labelField="description"
                valueField="id"
                placeholder={"Select a Progress"}
                value={data.progress.id}
                onChange={(item) => {
                  setPrevId(item.id);                  
                }}
              />
            </View> */}
        </View>
        </>)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default report;
