import ProfileData from "@/components/ProfileData";
import { profileAtom } from "@/store";
import { ProfileProps } from "@/types";
import { Href, router } from "expo-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ViewProfile = () => {
    const profile = useAtomValue(profileAtom);

    const [gender, setGender] = useState("");
    const [dob, setDob] = useState<Date | undefined>(undefined);

    const editProfile = () => {
        router.push("/(tabs)/profile/editProfile" as Href<string>);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text className="text-2xl font-bold mx-[16px] mb-5">
                Profile
            </Text>
            <ScrollView contentContainerStyle={{ flex: 1, marginHorizontal: 16 }}>
                <ProfileData label="First name" value={profile.firstName} />
                <ProfileData label="Last name" value={profile.lastName} />
                <ProfileData label="Email" value={profile.userAccount?.email} />
                <ProfileData label="Gender" value={profile.gender ? profile.gender : "N/A"}
                    setText={setGender} textValue={gender} />
                <ProfileData label="DOB" value={profile.dob ? `${new Date(profile.dob).toDateString()}` : "N/A"}
                    setText={setDob} textValue={dob} />
                <ProfileData label="Subscription Status" value={profile.subscriptionStatus === 'trialing' ? "Free Trial" : profile.subscriptionStatus} />
                <View className="flex-row justify-center my-10">
                    <TouchableOpacity className={`px-[16px] py-[8px] bg-blue-600 rounded-lg`} onPress={editProfile}>
                        <Text className="text-xl font-bold text-white">
                            Edit profile
                        </Text>
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
            </ScrollView>
        </SafeAreaView>
    );
}

export default ViewProfile;