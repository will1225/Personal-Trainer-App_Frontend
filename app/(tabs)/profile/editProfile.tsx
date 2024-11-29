import { profileAtom } from "@/store";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAtom } from "jotai";
import { Href, router } from "expo-router";
import EditProfileData from "@/components/EditProfileData";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "@/components/Text";
import { useColorScheme } from "nativewind";

const EditProfile = () => {
  const [profile] = useAtom(profileAtom);
  const { colorScheme } = useColorScheme();

  return (
    <SafeAreaView className="flex-1">
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
        <Text className="text-lg">Edit profile</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ flex: 1, paddingHorizontal: 16, paddingVertical: 8, gap: 10 }}
      >
        <EditProfileData
          label="First Name"
          value={profile.firstName}
          onPress={() => Alert.alert("Sorry", "Cannot update First name at this time")}
        />
        <EditProfileData
          label="Last Name"
          value={profile.lastName}
          onPress={() => Alert.alert("Sorry", "Cannot update Last name at this time")}
        />
        <EditProfileData
          label="Gender"
          value={profile.gender ? profile.gender : "N/A"}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/profile/edit/gender",
              params: {
                gender: profile.gender,
              },
            })
          }
        />
        <EditProfileData
          label="DOB"
          value={profile.dob ? `${new Date(profile.dob).toDateString()}` : "N/A"}
          onPress={() => router.push("/(tabs)/profile/edit/dob" as Href<string>)}
        />
        <EditProfileData
          label="Height"
          value={profile.height ? profile.height.toString() : "N/A"}
          onPress={() => router.push("/(tabs)/profile/edit/height" as Href<string>)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
