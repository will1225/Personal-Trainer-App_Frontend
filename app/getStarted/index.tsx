import LogoutButton from "@/components/LogoutButton";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GetStarted = () => {
    const image = require("../../assets/images/neonDumbell.png");

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 8 }}>
            <View className="mb-10">
                <LogoutButton />
            </View>
            <ScrollView contentContainerStyle={{ paddingVertical: 20, alignItems: 'center' }}>
                {/* <Text className="text-4xl font-bold">
                    Get Started
                </Text> */}
                <Image
                    source={image}
                    resizeMode="contain"
                    className="w-[200px] h-[50px] justify-center mt-1 mb-10"
                />
                <Text className="text-4xl">
                    Welcome to the
                </Text>
                <Text className="font-bold text-4xl">Personal Trainer App!</Text>
                <View className="flex-1 justify-center items-center my-20">
                    <Text className="text-base font-bold">
                        Please press the button below to help you get started
                    </Text>
                    <TouchableOpacity className="items-center my-5" onPress={() => router.push("/getStarted/profileEntry")}>
                        <View className="rounded-xl bg-indigo-500 py-[16px] px-[8px]">
                            <Text className="text-lg text-white font-bold">
                                Get Started
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default GetStarted;