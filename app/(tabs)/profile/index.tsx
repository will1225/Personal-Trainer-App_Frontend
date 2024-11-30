import ProfileData from "@/components/ProfileData";
import { profileAtom } from "@/store";
import { ProfileProps } from "@/types";
import { Href, router } from "expo-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/Text";

const ViewProfile = () => {
  const [updatable, isUpdatable] = useState(false);
  const profile = useAtomValue(profileAtom);

  const [gender, setGender] = useState("");
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(profile.height);

  const update = () => {
    if (!gender) {
      Alert.alert("Error", "Gender is missing");
    }
    console.log(gender);
    console.log(dob);
  };

  const editProfile = () => {
    router.push("/(tabs)/profile/editProfile" as Href<string>);
  };

  return (
    <SafeAreaView className="flex-1">
      <Text className="text-2xl font-bold mx-[16px] mb-5">Profile</Text>
      <ScrollView contentContainerStyle={{ marginHorizontal: 16 }}>
        <View>
          <ProfileData label="First name" value={profile.firstName} />
          <ProfileData label="Last name" value={profile.lastName} />
          <ProfileData label="Email" value={profile.userAccount?.email} />
          <ProfileData
            label="Gender"
            value={profile.gender ? profile.gender : "N/A"}
            setText={setGender}
            textValue={gender}
          />
          <ProfileData
            label="DOB"
            value={profile.dob ? `${new Date(profile.dob).toDateString()}` : "N/A"}
            setText={setDob}
            textValue={dob}
          />
          <ProfileData
            label="Height"
            value={profile.height ? profile.height.toString() : "N/A"}
            setText={setHeight}
            textValue={height}
          />
          <ProfileData label="Subscription Status" value={profile.subscriptionStatus === 'trialing' ? "Free Trial" : profile.subscriptionStatus} />
          <View className="flex-row justify-center my-10">
            <TouchableOpacity
              className={`px-[16px] py-[8px] bg-blue-600 rounded-lg`}
              onPress={editProfile}
            >
              <Text className="text-xl font-bold text-white">Edit profile</Text>
            </TouchableOpacity>
          </View>
          {
            profile.subscriptionStatus === 'active' &&
            (
              <View className="items-center justify-center">
                <TouchableOpacity onPress={() => router.push("/subscription/cancel" as Href<string>)}>
                  <Text className="text-red-500 font-bold">
                    Cancel Subscription
                  </Text>
                </TouchableOpacity>
              </View>
            )
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewProfile;
