import { useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProgress } from "../controllers/progress";
import { useQuery } from "react-query";
import { dateToString, monthToString } from "../controllers/utils";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Href, router } from "expo-router";
import { useAtomValue } from "jotai";
import { profileAtom } from "@/store";
import { Text } from "@/components/Text";
import CustomButton from "@/components/CustomButton";
import LoadingAnimation from "@/components/LoadingAnimation";

interface SelectedData {
  x: number;
  y: number;
  value: number;
}

export default function AnalysisScreen() {
  const profile = useAtomValue(profileAtom);
  const [selectedData, setSelectedData] = useState<SelectedData | null>(null);
  const [months, setMonths] = useState<string[]>([]);
  const [leanMuscles, setLeanMuscles] = useState<number[]>([]);
  const [weights, setWeights] = useState<number[]>([]);
  const [bodyFats, setBodyFats] = useState<number[]>([]);
  const [selectedReport, setSelectedReport] = useState({
    id: 0,
    date: "",
  });
  const [openDropdown, setOpenDropdown] = useState(false);
  // const [dummyData, setDummyData] = useState<number[]>([])

  const getWeeklAllWeeklyProgress = async () => {
    // Clear accumulated state data
    setMonths([]);
    setLeanMuscles([]);
    setWeights([]);
    setBodyFats([]);
    setSelectedData(null);
    setSelectedReport({ id: 0, date: "" });

    const data = await getProgress();
    if (!data) return [];

    // Performance issue here and update: Use temp arrays to store the fetched values instead of setting state for each variable inside the loop right away.
    let tempMonths: string[] = [];
    let tempLeanMuscles: number[] = [];
    let tempWeights: number[] = [];
    let tempBodyFats: number[] = [];

    data.forEach((e) => {
      const monthString = monthToString(new Date(e.date).getMonth()).substring(0, 3);

      // Store unique months to temp array
      if (!tempMonths.includes(monthString)) {
        tempMonths.push(monthString);
      }

      // Store these to temp arrays as well
      tempLeanMuscles.push(e.bodyMeasurement.muscleMass);
      tempWeights.push(e.bodyMeasurement.weight);
      tempBodyFats.push(e.bodyMeasurement.bodyFatPercent);
    });

    // Update the state all at once after the loop
    setMonths(tempMonths);
    setLeanMuscles(tempLeanMuscles);
    setWeights(tempWeights);
    setBodyFats(tempBodyFats);

    if (data.length > 0) {
      setSelectedReport({
        id: data[0].id,
        date: `${data[0].date}`,
      });
    }
    return data;
  };

  const { status, data } = useQuery({
    queryKey: [`weekly-progress-${profile.id}`],
    queryFn: getWeeklAllWeeklyProgress,
  });

  // Performance improvement: Use memo to memoize chart data to improve rendering performance
  const chartData = useMemo(
    () => ({
      labels: months,
      //Each datasets represents Lean muscle, Weight, Body Fat
      datasets: [
        {
          data: leanMuscles,
          color: (opacity = 0.8) => `rgba(3, 0, 255, 0.8)`,
        },
        {
          data: weights,
          color: (opacity = 0.8) => `rgba(247, 0, 0, 0.8)`,
        },
        {
          data: bodyFats,
          color: (opacity = 0.8) => `rgba(166, 97, 4, 0.8)`,
        },
      ],
      legend: ["Lean Muscle", "Weight", "Body Fat"],
    }),
    [months, leanMuscles, weights, bodyFats],
  );

  const handleDataPointClick = (data: any) => {
    const { x, y, value } = data;
    setSelectedData({ x, y, value });
  };

  const calculateLostOrGained = (latestMeasurement: number, firstWeekMeasurement: number) => {
    const result = Math.round((latestMeasurement - firstWeekMeasurement) * 20) / 20;

    if (result > 0) {
      return `gained ${Math.abs(result)}`;
    } else {
      return `lost ${Math.abs(result)}`;
    }
  };

  const handleOpenReport = () => {
    router.push(`/report/${selectedReport.id}` as Href<string>);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <Text className="text-4xl font-bold my-10">Progress Analysis</Text>
        <Text className="text-2xl font-bold my-2">Overall Progress</Text> */}
      {status === "loading" ? (
        <View className="items-center">
          <Text className="text-4xl font-bold my-10">Progress Analysis</Text>
          <Text className="text-2xl font-bold my-2">Overall Progress</Text>
          <ActivityIndicator size={"large"} />
        </View>
      ) : data &&
        leanMuscles.length > 0 &&
        weights.length > 0 &&
        bodyFats.length > 0 &&
        months.length > 0 ? (
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Text className="text-4xl font-bold my-10">Progress Analysis</Text>
          <Text className="text-2xl font-bold my-2">Overall Progress</Text>
          <TouchableOpacity className="items-start w-full" onPress={() => setSelectedData(null)}>
            <Text className="text-[12px] text-blue-500 font-bold">Hide value</Text>
          </TouchableOpacity>
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width - 32} // Width of the chart
            height={220} // Height of the chart
            //yAxisLabel="$"
            chartConfig={{
              backgroundColor: "white",
              backgroundGradientFrom: "white",
              backgroundGradientTo: "white",
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "3",
                strokeWidth: "0",
                stroke: "#ffa726",
              },
              fillShadowGradientFrom: "transparent", // Set to transparent to remove any fill shadow
              fillShadowGradientTo: "transparent", // Set to transparent to remove any fill shadow
              fillShadowGradient: "transparent", // Ensures the fill is transparent
              fillShadowGradientOpacity: 0, // Set opacity to 0 to remove fill completely
              fillShadowGradientFromOffset: 0,
              fillShadowGradientToOpacity: 0,
            }}
            //bezier //Uncomment for soft curve
            segments={5}
            //fromZero
            yAxisInterval={10}
            withVerticalLines={false}
            //withHorizontalLines={false}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            onDataPointClick={handleDataPointClick}
          />
          <View className="flex flex-row gap-5">
            <Text className="text-[12px] text-blue-500">Lean Muscle - kg</Text>
            <Text className="text-[12px] text-red-500">Weight - kg</Text>
            <Text className="text-[12px] text-amber-500">Body Fat - %</Text>
          </View>
          <Text className="text-xl my-5 font-bold text-center">
            Started from {dateToString(new Date(data[0].date))}, you have{" "}
            <Text className="text-blue-500">
              {calculateLostOrGained(
                data[data.length - 1].bodyMeasurement.muscleMass,
                data[0].bodyMeasurement.muscleMass,
              )}
              kg
            </Text>{" "}
            of Lean Muscle and{" "}
            <Text className="text-amber-500">
              {calculateLostOrGained(
                data[data.length - 1].bodyMeasurement.bodyFatPercent,
                data[0].bodyMeasurement.bodyFatPercent,
              )}
              %
            </Text>{" "}
            of Body Fat as of today.
          </Text>
          <View>
            <Text className="text-xl">See your previous reports</Text>
            <View className="relative my-3">
              <TouchableOpacity
                className="rounded-md border-black border-[1px] flex flex-row items-center p-2 bg-white"
                onPress={() => setOpenDropdown(!openDropdown)}
              >
                <View className="flex-1 justify-center items-center">
                  <Text className="font-bold" style={{ color: "#000" }}>
                    {dateToString(new Date(selectedReport.date))}
                  </Text>
                </View>
                <AntDesign name={openDropdown ? "caretup" : "caretdown"} size={15} color="black" />
              </TouchableOpacity>
              {openDropdown && (
                <View className="items-center w-full border-black border-[1px] rounded-md shadow-xl bg-white p-2">
                  <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                    {data.map((e, idx) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedReport({ id: e.id, date: `${e.date}` });
                            setOpenDropdown(false);
                          }}
                          className="w-full"
                          key={idx}
                        >
                          <Text
                            className={`text-center w-full my-1 rounded-md font-bold ${e.id === selectedReport.id && "bg-blue-500"} py-2`}
                            style={{ color: "#000" }}
                          >
                            {dateToString(new Date(e.date))}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>
            <View className="items-center my-4">
              <CustomButton title="Open" handlePress={handleOpenReport} containerStyles="w-48" />
            </View>
          </View>
          {selectedData && (
            <View
              className="flex-row absolute rounded-md bg-black p-1 shadow-xl items-center flex"
              style={{
                left: selectedData.x,
                top: selectedData.y + 220 - 5,
              }}
            >
              {/* <AntDesign name="close" size={15} color="white" /> */}
              <Text className="text-white font-bold">{selectedData.value}</Text>
            </View>
          )}
        </ScrollView>
      ) : !data ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl font-bold text-center">No weekly Progress Data to display</Text>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center">
          <LoadingAnimation isLoading={true} message="Generating Chart..." />
        </View>
      )}
    </SafeAreaView>
  );
}
