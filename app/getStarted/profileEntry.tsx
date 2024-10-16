import { useState } from "react";
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton, FormField } from "../../components";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import BackButton from "../../components/BackButton";
import { useQuery} from 'react-query';
import { Profile } from '../controllers/profile';
import { profileAtom } from "../../store";
import { useAtom } from "jotai";
import { router } from "expo-router";


export default function TabTwoScreen() {
  const image = require("../../assets/images/neonDumbell.png");
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({dob: "", gender: "",});
  const [profile, setProfile] = useAtom(profileAtom);

  // Handle Date change
  const handleDateChange = (date: Date) => {
    setForm({ ...form, dob: date.toISOString() });
  };

  const submit = async () => {
    const {dob, gender } = form;

    // Check empty fields
    if (!dob || !gender) {
      Alert.alert("Error", "Choose The Date and Gender");
      return;
    }
    // API call
    try {
      setSubmitting(true);
      const data = await Profile.createProfile(form.dob, form.gender);
      
      // Update the atom with the new profile data
      setProfile((prevProfile) => ({
        ...prevProfile,
        dob: data.dob,
        gender: data.gender,
        updatedAt: data.updatedAt,
      }));
      
      router.push({ pathname: "../bodyMeasurement" });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
      <BackButton />
      
      <View className="w-full flex justify-center items-center h-full px-4 my-6">
        <Text className="text-2xl font-bold text-center">
              Profile Entry
        </Text>

        <Image
              source={image}
              resizeMode="contain"
              className="w-[200px] h-[50px] justify-center mt-9"
        />
        {/* Date of Birth Field */}
        <FormField
          title="Date of Birth"
          value={form.dob ? new Date(form.dob).toDateString() : ""}
          handleChangeText={() => {}}
          placeholder={"Select Date of Birth"}
          isDatePicker
          onDateChange={handleDateChange}
        />

        {/* Gender Selection */}
        <View className="w-full flex flex-row justify-between items-center mt-10">
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: form.gender === "M" ? "#7dd3fc" : "transparent",
              padding: 15,
              marginTop: 30,
              borderRadius: 5,
            }}
            onPress={() => setForm({ ...form, gender: "M" })}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: form.gender === "F" ? "#f9a8d4" : "transparent",
              padding: 15,
              marginTop: 30,
              borderRadius: 5,
            }}
            onPress={() => setForm({ ...form, gender: "F" })}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Female</Text>
          </TouchableOpacity>
        </View>

        <CustomButton
            title="Submit Profile"
            handlePress={submit}
            containerStyles="w-[250] mt-20"
            isLoading={isSubmitting}
          />
      </View>
      
   
    </ScrollView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
