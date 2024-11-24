import { Href, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import LogoutButton from "../../../components/LogoutButton";
import React from "react";
import { useAtom } from "jotai";
import { profileAtom } from "@/store";
import { useQuery } from "react-query";
import { Profile } from "@/app/controllers/profile";
import { Text } from "@/components/Text"
import ThemeSwitch from "@/components/ThemeSwitch";

export default function TabOneScreen() {
  const image1 = require("../../../assets/images/HomePagePic1.jpeg");
  const image2 = require("../../../assets/images/HomePagePic2.jpeg");
  const image3 = require("../../../assets/images/HomePagePic3.webp");
  const image4 = require("../../../assets/images/HomePagePic4.jpeg");

  // Get global user profile data
  const [profile, setProfile] = useAtom(profileAtom);
  useQuery("profile", () => Profile.setProfileByToken(setProfile));

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // Disable back button functionality
      };

      // Handle back button is being pressed on Home Page
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      // Clean up event listener
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="w-full flex-row justify-between items-center" style={{ padding: 15 }}>
        <ThemeSwitch />
        <LogoutButton />
      </View>
      
      <ScrollView>
        <View className="w-full flex justify-center items-center h-full my-4">
          
          <Text className="text-3xl font-semibold font-psemibold text-center w-full mb-4">
            Home
          </Text>

          <Text className="text-xl font-semibold font-psemibold text-center w-full mb-6">
            { profile?.updatedAt ?  `Welcome back, ${profile.firstName}!` : `Welcome!`}
          </Text>

          { !profile?.initBodyMeasurement ? (
            <View className="w-full justify-center items-center flex ">
              <Image
                source={image1}
                resizeMode="cover"
                className="w-full h-[200px]"
              />
              <Link
                href={"../../getStarted/profileEntry" as Href<string>}
                className="bg-primary text-2xl font-psemibold text-white absolute"
              >
                Get Started!
              </Link>
            </View>
          ) : null }

          <View className="w-full justify-center items-center flex">
            <Image
              source={image2}
              resizeMode="cover"
              className="w-full h-[200px]"
            />
            <Link
              href={"../three" as Href<string>}
              className="bg-primary text-2xl font-psemibold text-white absolute"
            >
              Current Week Routine
            </Link>
          </View>

          <View className="w-full justify-center items-center flex">
            <Image
              source={image3}
              resizeMode="cover"
              className="w-full h-[200px]"
            />
            <Link
              href={"../../analysis" as Href<string>}
              className="bg-primary text-2xl font-psemibold text-white absolute"
            >
              Progress Analysis
            </Link>
          </View>

          <View className="w-full justify-center items-center flex">
            <Image
              source={image4}
              resizeMode="cover"
              className="w-full h-[200px]"
            />
            <Link
              href={"../library" as Href<string>}
              className="bg-primary text-2xl font-psemibold text-white absolute"
            >
              Exercise Library
            </Link>
          </View>

          <View className="flex justify-center pt-5 flex-row gap-2 pb-5">
            <Text className="text-lg font-pregular">About Us - </Text>
            <Link
              href={"../../aboutUs" as Href<string>}
              className="text-lg font-semibold text-secondary"
            >
              Meet The Team
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
