import {
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import * as generateRoutine from "../../controllers/generateRoutine";
import { router } from "expo-router";
import { Text } from "@/components/Text";

type MuscleGroupImg = {
  id: number;
  description: string;
  image: ImageSourcePropType;
};

const ExerciseLibrary = () => {
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroupImg[]>([]);

  useEffect(() => {
    // Fetch muscle groups to attach images
    const fetchData = async () => {
      try {
        const muscleData = await generateRoutine.fetchMuscleGroup();
        if (muscleData === null) return;

        // Better to map it manually to ensure correct images
        const muscleGroupImg = [
          {
            id: muscleData[2].id,
            description: muscleData[2].description,
            image: require("../../../assets/images/abs_0.jpg"),
          },
          {
            id: muscleData[0].id,
            description: muscleData[0].description,
            image: require("../../../assets/images/biceps_0.jpg"),
          },
          {
            id: muscleData[6].id,
            description: muscleData[6].description,
            image: require("../../../assets/images/calves_0.webp"),
          },
          {
            id: muscleData[8].id,
            description: muscleData[8].description,
            image: require("../../../assets/images/chest_0.jpg"),
          },
          {
            id: muscleData[13].id,
            description: muscleData[13].description,
            image: require("../../../assets/images/forearms_0.jpg"),
          },
          {
            id: muscleData[10].id,
            description: muscleData[10].description,
            image: require("../../../assets/images/glutes_0.webp"),
          },
          {
            id: muscleData[12].id,
            description: muscleData[12].description,
            image: require("../../../assets/images/hamstrings_0.webp"),
          },
          {
            id: muscleData[7].id,
            description: muscleData[7].description,
            image: require("../../../assets/images/lats_0.jpg"),
          },
          {
            id: muscleData[14].id,
            description: muscleData[14].description,
            image: require("../../../assets/images/obliques.jpg"),
          },
          {
            id: muscleData[3].id,
            description: muscleData[3].description,
            image: require("../../../assets/images/quads_1.webp"),
          },
          {
            id: muscleData[1].id,
            description: muscleData[1].description,
            image: require("../../../assets/images/shoulders_0.jpg"),
          },
          {
            id: muscleData[4].id,
            description: muscleData[4].description,
            image: require("../../../assets/images/traps_0.webp"),
          },
          {
            id: muscleData[5].id,
            description: muscleData[5].description,
            image: require("../../../assets/images/triceps_0.jpg"),
          },
          {
            id: muscleData[9].id,
            description: muscleData[9].description,
            image: require("../../../assets/images/upperback.jpg"),
          },
          {
            id: muscleData[11].id,
            description: muscleData[11].description,
            image: require("../../../assets/images/cardio.png"),
          },
        ];
        setMuscleGroups(muscleGroupImg);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ flexGrow: 2, justifyContent: "center" }}>
        <View className="w-full h-full flex justify-center items-center my-4 px-4 mt-28">
          <BackButton />
          {/* Big header */}
          <Text className="text-3xl font-bold text-center">Exercise Library</Text>

          {/* Sub header */}
          <Text className="text-lg font-pregular text-left px-4 mt-4 mb-8">
            Select a muscle group to view its related exercises and further filter the results on
            the next page.
          </Text>

          {/* Muscle Groups*/}
          <View className="flex-row flex-wrap justify-center w-full">
            {muscleGroups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={{ flexBasis: "29%", margin: 8 }}
                onPress={() =>
                  router.push({
                    pathname: "/library/exerciseList",
                    params: { id: group.id, description: group.description },
                  })
                }
              >
                <View className="items-center">
                  <Text className="font-semibold text-base">{group.description}</Text>
                  <Image source={group.image} className="w-full h-[80]" resizeMode="contain" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExerciseLibrary;
