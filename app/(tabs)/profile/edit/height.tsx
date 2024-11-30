import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View, Alert, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Profile } from "@/app/controllers/profile";
import { useQueryClient } from "react-query";
import { Text } from "@/components/Text";
import { useColorScheme } from "nativewind";

const EditHeight = () => {
  const queryClient = useQueryClient();
  const [height, setHeight] = useState<number | undefined>(0);
  const [loading, isLoading] = useState(false);
  const { colorScheme } = useColorScheme();
  const done = async () => {    
    isLoading(true);
    const data = await Profile.update({ height: height });

    if (data.status) {
      await queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
      router.back();
    } else {
      Alert.alert("Update Error", data.error);
      isLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        className="relative flex-row justify-center items-center px-[16px] border-b-[1px] py-[8px]"
        style={{ borderColor: colorScheme === "dark" ? "white" : "black" }}
      >
        <TouchableOpacity className="absolute left-[16px]" onPress={() => router.back()}>
          <MaterialIcons
            name="arrow-back-ios"
            size={18}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
        <Text className="text-lg">Edit Height</Text>
        <TouchableOpacity
          className="absolute right-[16px]"
          onPress={done}
          disabled={loading || !height}
        >
          {loading ? (
            <ActivityIndicator color="gray" />
          ) : (
            <Text className={`text-lg ${height ? "text-blue-500" : "text-gray-500"}`}>Done</Text>
          )}
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ flex: 1, paddingHorizontal: 16, paddingVertical: 8 }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-lg">Enter your height:</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: colorScheme === "dark" ? "white" : "black",
              padding: 10,
              borderRadius: 8,
              color: colorScheme === "dark" ? "white" : "black",
              fontSize: 16,
              width: 100,
              textAlign: "right",
            }}
            keyboardType="numeric" 
            value={height ? height.toString() : ""}
            placeholder="in cm"
            placeholderTextColor="gray"
            onChangeText={(value) => setHeight(Number(value))}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditHeight;
