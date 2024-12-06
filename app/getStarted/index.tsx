import LogoutButton from "@/components/LogoutButton";
import { Href, Link, router } from "expo-router";
import { ScrollView, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/Text";
import CustomButton from "@/components/CustomButton";

const GetStarted = () => {
  const image = require("../../assets/images/neonDumbell.png");
  const image1 = require("../../assets/images/getStarted2.jpeg");

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 8 }}>
      <View className="mb-10">
        <LogoutButton />
      </View>
      <ScrollView contentContainerStyle={{ paddingVertical: 20, alignItems: "center" }}>
        {/* <Text className="text-4xl font-bold">
                    Get Started
                </Text> */}
        <Image
          source={image}
          resizeMode="contain"
          className="w-[200px] h-[50px] justify-center mt-1 mb-10"
        />
        <Text className="text-3xl mb-2">Welcome to the</Text>
        <Text className="font-bold text-3xl">Personal Trainer App!</Text>
        <View className="flex-1 justify-center items-center my-12 px-2">
          <Image source={image1} resizeMode="cover" className="w-[370] h-[200px]" />

          <Text className="text-2xl semi-bold text-center mt-10">
            Let's begin by assessing your fitness level.
          </Text>

          <CustomButton
            title="Get Started"
            handlePress={() => router.push("/getStarted/profileEntry")}
            containerStyles="w-48 mt-6"
          />

          <Link href={"/(tabs)/home" as Href<string>} className="mt-6 mb-8">
            <Text className="text-lg font-psemibold text-grey ">I'll do it later.</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GetStarted;
