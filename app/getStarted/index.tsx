import LogoutButton from "@/components/LogoutButton";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GetStarted = () => {
    const image = require("../../assets/images/neonDumbell.png");
    const image1 = require("../../assets/images/getStarted2.jpeg");

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
                <Text className="text-4xl mb-2">
                    Welcome to the
                </Text>
                <Text className="font-bold text-4xl">Personal Trainer App!</Text>
                <View className="flex-1 justify-center items-center my-12 px-2">
                    <Image
                        source={image1}
                        resizeMode="cover"
                        className="w-[370] h-[200px]"
                    />

                    <Text className="text-xl semi-bold text-center mt-6">
                        Let's begin by assessing your fitness level.
                    </Text>

                    <TouchableOpacity className="items-center my-5" onPress={() => router.push("/getStarted/profileEntry")}>
                        <View className="rounded-xl bg-indigo-500 py-[16px] px-[25px]">
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