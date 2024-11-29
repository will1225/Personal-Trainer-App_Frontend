import { SafeAreaView, ScrollView, View, Image, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { Text } from "@/components/Text";
import { LinearGradient } from "react-native-linear-gradient";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";

const AboutUs = () => {
  const { colorScheme } = useColorScheme();
  const backgroundColor =
    colorScheme === "dark"
      ? ["#181B2B", "#2D335E", "#429EB6", "#FFC857"]
      : ["#F5F5F5", "#F5F5F5", "#D9D9E6", "#FFC857"];

  // TODO: Fill in your info and upload an image
  const members = [
    {
      name: "William",
      role: "Team Lead",
      email: "ixus_tse@hotmail.com",
      description: "Hi there! I'll save the things I want to say at the end of the course.",
      image: require("../assets/images/William.jpg"),
    },
    {
      name: "Member",
      role: "Role",
      email: "Email",
      description: "Say anything",
      image: null,
    },
    {
      name: "Member",
      role: "Role",
      email: "Email",
      description: "Say anything",
      image: null,
    },
    {
      name: "Arina",
      role: "Full-Stack Developer",
      email: "arinak1017@gmail.com",
      description:
        "Hi all, if you see this it means I forgot to edit the description at the end of the term",
      image: require("../assets/images/Arina.jpg"),
    },
  ];

  // User will be redirected to email application
  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <LinearGradient
      colors={backgroundColor} // Gradient colors
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.4, 0.9, 1]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="w-full flex justify-center items-center h-full px-1 my-16">
            <BackButton />

            <Text className="text-3xl font-bold text-center mb-4">About Us</Text>

            {members.map((member, index) => (
              <View key={index} className="flex-row items-center my-4 p-4 rounded-lg">
                {/* Gradient background for Profile Pic */}
                <LinearGradient
                  colors={getRandomGradientColors()}
                  className="p-[2px] rounded-full"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  locations={[0, 0.25, 0.75, 1]}
                  style={{
                    width: 110,
                    height: 110,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    className="bg-white rounded-full overflow-hidden"
                    style={{ width: 100, height: 100 }}
                  >
                    <Image
                      source={
                        member.image ? member.image : require("../assets/images/HomePagePic1.jpeg")
                      }
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                </LinearGradient>

                {/* Member info */}
                <View className="ml-8 flex-1 justify-between" style={{ gap: 8 }}>
                  <Text className="text-xl font-bold">{member.name}</Text>
                  <Text className="text-base">{member.role}</Text>
                  <TouchableOpacity onPress={() => handleEmailPress(member.email)}>
                    <Text className="text-base underline">{member.email}</Text>
                  </TouchableOpacity>
                  <Text className="text-base italic">{member.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const getRandomGradientColors = () => {
  const colors = [
    "#5851DB",
    "#5873F4",
    "#458EEF",
    "#25BCE7",
    "#10DAE2",
    "#C13584",
    "#E1306C",
    "#FD1D1D",
    "#F77737",
    "#36D1DC",
    "#5B86E5",
    "#FF7E5F",
    "#feb47b",
    "#00c6ff",
    "#0072ff",
    "#FF8A00",
    "#FF6347",
    "#32CD32",
    "#FFD700",
    "#FF1493",
    "#9B59B6",
    "#F39C12",
    "#D35400",
    "#1ABC9C",
    "#2ECC71",
    "#8E44AD",
    "#2980B9",
    "#27AE60",
    "#16A085",
    "#F1C40F",
    "#E74C3C",
    "#95A5A6",
    "#34495E",
    "#2C3E50",
    "#1F77B4",
    "#FF6F61",
    "#A29BFE",
    "#FF3366",
    "#FF33FF",
    "#2D9CDB",
    "#D4A5A5",
    "#8B80F9",
    "#FFB6C1",
    "#F5CBA7",
    "#45B39D",
    "#F0E68C",
    "#7C3C48",
    "#A5C1D9",
    "#F9E79F",
    "#F4A300",
    "#4D4DFF",
    "#F74D61",
    "#8F8F8F",
    "#4CAF50",
    "#008080",
    "#FF6347",
    "#FF4500",
    "#D2691E",
    "#EE82EE",
    "#800080",
    "#FFD700",
    "#E0FFFF",
  ];

  const shuffledColors = [...colors].sort(() => 0.5 - Math.random()).slice(0, 4);

  return shuffledColors;
};

export default AboutUs;
