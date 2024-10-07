import { SafeAreaView } from "react-native-safe-area-context";
import { View, TouchableOpacity, Text, ScrollView, TouchableWithoutFeedback, ActivityIndicator, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Profile } from "@/app/controllers/profile";
import { QueryClient, useQueryClient } from "react-query";

const EditGender = () => {
    const queryClient = useQueryClient();
    const { gender } = useLocalSearchParams();
    const [selectedGender, setSelectedGender] = useState(gender);
    const [loading, isLoading] = useState(false);

    const done = async () => {
        isLoading(true);
        console.log(selectedGender);
        const data = await Profile.update({gender: selectedGender as string, dob: undefined});
        if (data.status) {
            await queryClient.invalidateQueries({
                queryKey: ['profile']
            });
            router.back();
        } else {
            Alert.alert("Update Error", data.error);
            isLoading(false);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View className="relative flex-row justify-center items-center px-[16px] border-b-[1px] border-black py-[8px]">
                <TouchableOpacity className="absolute left-[16px]" onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back-ios" size={18} color="black" />
                </TouchableOpacity>
                <Text className="text-lg">
                    Gender
                </Text>
                <TouchableOpacity className="absolute right-[16px]" onPress={done} disabled={loading || !selectedGender}>
                    {
                        loading ?
                            (
                                <ActivityIndicator color="gray" />
                            ) :
                            (
                                <Text className={`text-lg ${selectedGender ? "text-blue-500" : "text-gray-500"}`}>
                                    Done
                                </Text>
                            )
                    }
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ flex: 1, paddingHorizontal: 16, paddingVertical: 8, gap: 10 }}>
                {/**Male */}
                <TouchableWithoutFeedback onPress={() => setSelectedGender('M')}>
                    <View className="flex-row items-center justify-between">
                        <Text className="text-xl">
                            Male
                        </Text>
                        <View className={`w-[16px] h-[16px] rounded-full border-[1px] border-black ${selectedGender === 'M' && "bg-blue-500"}`}>

                        </View>
                    </View>
                </TouchableWithoutFeedback>

                {/**Female */}
                <TouchableWithoutFeedback onPress={() => setSelectedGender('F')}>
                    <View className="flex-row items-center justify-between">
                        <Text className="text-xl">
                            Female
                        </Text>
                        <View className={`w-[16px] h-[16px] rounded-full border-[1px] border-black ${selectedGender === 'F' && "bg-pink-500"}`}>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditGender;