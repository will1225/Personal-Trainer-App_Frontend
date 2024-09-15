import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { router, Link, Href } from "expo-router";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "../components";
import * as SecureStore from "expo-secure-store";

/**
 * Method to retrieve user token from expo secure storage
 * @returns String
 */
const getToken = async () => {
  try {
    return await SecureStore.getItemAsync("userToken");
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

/**
 * Landing screen
 * @returns void
 */
const LandingPage = () => {
  const image = require("../assets/images/download.jpeg");

  // Flag to skip landing screen if token presents, must set to true in production
  let skipLandingPage = false;

  // Check stored token on app, skip landing page if already logged in
  if (skipLandingPage) {
    useEffect(() => {
      const checkToken = async () => {
        const token = await getToken();
        if (token) {
          router.replace("/homePage" as Href<string>);
        }
      };
      checkToken();
    }, []);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="w-full flex justify-center items-center h-full px-4">
        <Text className="text-3xl font-bold text-center">
          Personal Trainer App
        </Text>

        <Image
          source={image}
          className="max-w-[380px] w-full h-[298px]"
          resizeMode="contain"
        />

        <Text className="text-xl font-bold text-center mb-8">
          Your personal fitness coach, {"\n"}
          tailored for your Goals
        </Text>

        <CustomButton
          title="Login"
          handlePress={() => router.push("/sign-in" as Href<string>)}
          containerStyles="w-[230px] mt-7"
        />

        <Text className="text-base font-pregular mt-7 text-center">
          Don't have an account?
        </Text>
        <Link
          href={"/sign-up" as Href<string>}
          className="text-lg font-psemibold text-secondary"
        >
          Register Here
        </Link>
      </View>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default LandingPage;
