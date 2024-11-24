import { View, SafeAreaView, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import BackButton from "@/components/BackButton";
import Modal from "react-native-modal";
import { Href, Link, router, useLocalSearchParams } from "expo-router";
import { getSelectedReport } from "../controllers/report";
import { Dropdown } from "react-native-element-dropdown";
import { CustomButton} from "@/components";
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
  const [prevId, setPrevId] = useState<string | null>(null);
  const [dropdownData, setDropdownData] = useState<{id: string, description: string}[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fatLevel = ["Essential Fat", "Athletes", "Fit", "Average", "Below Average", "Poor", "Out of classification range"]
  const ffmiLevel = ["Skinny", "Average", "Intermediate Built", "Advanced Built", "Extremely Muscular", "Unusual/Extreme Result"]


  console.log(data);
  useEffect(() => {
    const getReportData = async () => {
      setLoading(true)
      const fetchedData = await getSelectedReport(params.id, prevId);
      setData(fetchedData);
      const dropdownItems = fetchedData.progress.map((item: {id: string, date: string}) => ({
        id: item.id,
        description: new Date(item.date).toDateString()
      }));
      setDropdownData(dropdownItems);
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

  const handleCompare = async () => {
    setLoading(true)
    const fetchedData = await getSelectedReport(params.id, prevId);
    setData(fetchedData);
    const dropdownItems = fetchedData.progress.map((item: {id: string, date: string}) => ({
      id: item.id,
      description: new Date(item.date).toDateString()
    }));
    setDropdownData(dropdownItems);
    setRanges(fetchedData.ranges.classifications || []);
    setLoading(false);
  }

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
      <BackButton />
        <View className="w-full h-full flex justify-center items-center my-4 px-4 mt-12">
          <Text className="text-3xl font-bold text-center mb-2 pb-1">
            Progress Report
          </Text>
          <Text className="text-m font-bold text-center mb-1 pb-1">
            {new Date(data.reportDate).toLocaleDateString(undefined, options) + ", " + new Date(data.reportDate).getFullYear()}
          </Text>
          <Text className="text-lg font-bold text-center">
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

          <View className="flex flex-col items-center mb-6 mt-8 w-full px-4">
            <View className="flex flex-row justify-between items-center mb-3 w-full">
              <Text className="text-xl font-semibold text-right w-[28%]">{``}</Text>
              <Text className="text-lg w-[28%] text-center truncate font-semibold">{new Date(data.lastReportDate).toLocaleDateString(undefined, options)}</Text>
              <Text className="text-xl w-[14%] text-center">{``}</Text>
              <Text className="text-lg w-[28%] text-center truncate font-semibold">{new Date(data.reportDate).toLocaleDateString(undefined, options)}</Text>
            </View>

            {/* Body Fat */}
            <View className="flex flex-row justify-between items-center mb-3 w-full">
              <Text className="text-xl font-semibold text-right w-[28%]">{`Body Fat:`}</Text>
              <Text className="text-xl w-[28%] text-center truncate">{data.prevFat}</Text>
              <Text
              className={`text-xl w-[14%] text-center ${data.fat - data.prevFat > 0 ? 'text-red-500' : 'text-green-500'}`}
            >
              {`\u2794`}
            </Text>
              <Text className="text-xl w-[28%] text-center truncate">{data.fat} %</Text>
            </View>

            {/* Muscle Mass */}
            <View className="flex flex-row justify-between items-center mb-3 w-full">
              <Text className="text-xl font-semibold text-right w-[28%]">{`Muscle Mass:`}</Text>
              <Text className="text-xl w-[28%] text-center truncate">{data.prevMuscle}</Text>
              <Text
              className={`text-xl w-[14%] text-center ${data.prevMuscle - data.muscle > 0 ? 'text-red-500' : 'text-green-500'}`}
            >
              {`\u2794`}
            </Text>
              <Text className="text-xl w-[28%] text-center truncate">{data.muscle} kg</Text>
            </View>

            {/* Chest */}
            <View className="flex flex-row justify-between items-center mb-3 w-full">
              <Text className="text-xl font-semibold text-right w-[28%]">{`Chest:`}</Text>
              <Text className="text-xl w-[28%] text-center truncate">{data.prevChest}</Text>
              <Text
              className={`text-xl w-[14%] text-center ${data.prevChest - data.chest < 0 ? 'text-red-500' : 'text-green-500'}`}
            >
              {`\u2794`}
            </Text>
              <Text className="text-xl w-[28%] text-center truncate">{data.chest} mm</Text>
            </View>

            {/* Abdomen */}
            <View className="flex flex-row justify-between items-center mb-3 w-full">
              <Text className="text-xl font-semibold text-right w-[29%]">{`Abdomen:`}</Text>
              <Text className="text-xl w-[28%] text-center truncate">{data.prevAbdomen}</Text>
              <Text
              className={`text-xl w-[14%] text-center ${data.prevAbdomen - data.abdomen < 0 ? 'text-red-500' : 'text-green-500'}`}
            >
              {`\u2794`}
            </Text>
              <Text className="text-xl w-[28%] text-center truncate">{data.abdomen} mm</Text>
            </View>

            {/* Thigh */}
            <View className="flex flex-row justify-between items-center mb-3 w-full">
              <Text className="text-xl font-semibold text-right w-[28%]">{`Thigh:`}</Text>
              <Text className="text-xl w-[28%] text-center truncate">{data.prevThigh}</Text>
              <Text
              className={`text-xl w-[14%] text-center ${data.prevThigh - data.thigh < 0 ? 'text-red-500' : 'text-green-500'}`}
            >
              {`\u2794`}
            </Text>
              <Text className="text-xl w-[28%] text-center truncate">{data.thigh} mm</Text>
            </View>

            {/* Weight */}
            <View className="flex flex-row justify-between items-center mb-3 w-full">
              <Text className="text-xl font-semibold text-right w-[28%]">{`Weight:`}</Text>
              <Text className="text-xl w-[28%] text-center truncate">{data.prevWeight}</Text>
              <Text
              className={`text-xl w-[14%] text-center ${data.prevWeight - data.weight < 0 ? 'text-red-500' : 'text-green-500'}`}
            >
              {`\u2794`}
            </Text>
              <Text className="text-xl w-[28%] text-center truncate">{data.weight} kg</Text>
            </View>


            <View className="flex flex-row justify-between items-center mb-3 w-full">
              <Text className="text-xl font-semibold text-right w-[28%]">{`Fat Level:`}</Text>
              <Text className="text-lg w-[28%] text-center truncate">{data.prevFatClassification}</Text>
              <Text
              className={`text-xl w-[14%] text-center
                ${fatLevel.indexOf(data.prevFatClassification) - fatLevel.indexOf(data.fatClassification) < 0 ? 'text-red-500' : 'text-green-500'}`}
            >
              {`\u2794`}
            </Text>
              <Text className="text-lg w-[28%] text-center truncate">{data.fatClassification}</Text>
            </View>

            <View className="flex flex-row justify-between items-center mb-3 w-full">
              <Text className="text-xl font-semibold text-right w-[28%]">{`FFMI:`}</Text>
              <Text className="text-sm w-[28%] text-center truncate">{data.prevFfmiClassification}</Text>
              <Text
              className={`text-xl w-[14%] text-center
                ${ffmiLevel.indexOf(data.prevFfmiClassification) - ffmiLevel.indexOf(data.ffmiClassification) < 0 ? 'text-red-500' : 'text-green-500'}`}
            >
              {`\u2794`}
            </Text>
              <Text className="text-sm w-[28%] text-center truncate">{data.ffmiClassification}</Text>
            </View>
          </View>



          
          {/* Body Fat Percentage Table */}
          <View className="w-full mb-4">
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
          <View className="flex flex-row justify-center min-w-full ">
              <Dropdown
                style={{
                  height: 48,
                  minWidth: 200,
                  borderWidth: 2,
                  borderColor: "black",
                  backgroundColor: "white",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                }}
                placeholderStyle={{ fontSize: 16, color: "gray" }}
                selectedTextStyle={{ fontSize: 16 }}
                data={dropdownData}
                labelField="description"
                valueField="id"
                placeholder={dropdownData.length > 0 ? "Select a Report" : "No Previous Report"}
                value={prevId}
                onChange={(item) => {
                  setPrevId(item.id);
                }}
              />
               <CustomButton
                        title="Compare"
                        containerStyles="ml-2 w-26"
                        handlePress={() => handleCompare()}
              />
              <TouchableOpacity
                onPress={() => setIsModalOpen(true)}
                >
                <Ionicons name="help-circle-outline" size={40} color="gray" />
            </TouchableOpacity>

              
            </View>

            <Modal
                    isVisible={isModalOpen}
                    onBackdropPress={() => setIsModalOpen(false)}
                    >
                <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
                    <Text className="text-center text-lg font-bold">
                       You can compare the current report with an eariler one by selecting the date
                    </Text>
                    <Text className="text-sm font-pregular text-red-600 text-center mt-6">
                        * You can only compare with earlier reports *
                    </Text>
                
                    <CustomButton
                        title="Close"
                        containerStyles="mt-6"
                        handlePress={() => setIsModalOpen(false)}
                    />
                </View>
            </Modal>
        </View>
        
        </>)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default report;
