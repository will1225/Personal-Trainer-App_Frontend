import React from "react";
import { View, Image } from "react-native";
import { useColorScheme } from "nativewind";
import { Text } from "@/components/Text";

type ExerciseDetailVariation1 = {
  sets: number;
  reps?: number;
  minutes?: number;
  thumbnailURL: string;
  name: string;
};

type ExerciseDetailVariation2 = {
  sets: number;
  reps?: number;
  minutes?: number;
  thumbnailURL?: string;
  exercise: {
    name: string;
  };
};

type ExerciseDetail = ExerciseDetailVariation1 | ExerciseDetailVariation2;

interface ExerciseDetailsBlockProps {
  exercise: ExerciseDetail;
}

const ExerciseDetailsBlock: React.FC<ExerciseDetailsBlockProps> = ({
  exercise,
}) => {
  const name = "name" in exercise ? exercise.name : exercise.exercise.name;
  const thumbnailURL = exercise.thumbnailURL;
  const { colorScheme } = useColorScheme();
  const headerColor = colorScheme === "dark" ? "#1B4A72" : "#0369a1";
  const blockColor = colorScheme === "dark" ? "#2A3442" : "#e5e5e5";
  const borderColor = colorScheme === "dark" ? "#4B5563" : "#D1D5DB";

  return (
    <View className="flex-row mb-1 items-center">
      {/* YouTube Thumbnails */}
      <Image
        source={
          typeof thumbnailURL === "string"
            ? { uri: thumbnailURL }
            : thumbnailURL
        }
        className="w-[70] h-[70] mr-2"
        resizeMode="cover"
      />

      <View
        className="flex-1 border items-center rounded-lg min-h-[65px]"
        style={{
          backgroundColor: blockColor,
          borderColor: borderColor,
        }}
      >
        {/* Exercise Details Header */}
        <View
          className="flex-row mb-1 items-center h-7"
          style={{
            backgroundColor: headerColor,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Text className="flex-[2] text-center font-semibold text-white">
            Exercise
          </Text>
          <Text className="flex-[1] text-center font-semibold text-white">
            Sets
          </Text>
          <Text className="flex-[1] text-center font-semibold text-white">
            {exercise.reps ? "Reps" : "Mins"}
          </Text>
        </View>

        {/* Data Row */}
        <View className="flex-row items-center">
          <Text className="flex-[2] text-center">{name}</Text>
          <Text className="flex-[1] text-center">{exercise.sets}</Text>
          <Text className="flex-[1] text-center">
            {exercise.reps ? exercise.reps : exercise.minutes}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ExerciseDetailsBlock;
