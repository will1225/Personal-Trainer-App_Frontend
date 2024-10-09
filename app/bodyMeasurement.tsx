import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton, FormField } from "../components";
import Modal from "react-native-modal";
import BackButton from "../components/BackButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as measurement from "./controllers/bodyMeasurement";
import {
  View,
  Text,
  Alert,
  Image,
  Switch,
  TouchableOpacity,
  Linking,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAtom } from "jotai";
import { profileAtom } from "@/store";
import { useQuery } from "react-query";
import { Profile } from "./controllers/profile";


/**
 * Body Measurement screen.
 * @returns void
 */
const BodyMeasurement = () => {
  const image = require("../assets/images/neonDumbell.png");
  const maleC = require("../assets/images/chest.png");
  const maleA = require("../assets/images/abd.png");
  const maleT = require("../assets/images/thigh.png");
  const femaleTricep = require("../assets/images/tricepFemale.jpg");
  const femaleSuprailiac = require("../assets/images/suprailiacFemale.jpg");
  const femaleThigh = require("../assets/images/thighFemale.jpg");

  // State variables
  const [isSubmitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useAtom(profileAtom);
  const [form, setForm] = useState({
    weight: "",
    chest: "",
    abdomen: "",
    thigh: "",
    bypassMeasurementFlag: false,
    bodyFatPercent: "",
    muscleMass: "",
  });
  const [modalContent, setModalContent] = useState({
    title: "",
    text: "",
    image: null,
  });

  // Get gender from the profile atom
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => Profile.setProfileByToken(setProfile)
  });
  const gender = profile?.gender;  

  // Form submission handling
  const submit = async () => {
    const {
      weight,
      chest,
      abdomen,
      thigh,
      bypassMeasurementFlag,
      bodyFatPercent,
      muscleMass,
    } = form;

    // Convert input values to float for validation
    const weightValue = parseFloat(weight);
    const chestValue = parseFloat(chest);
    const abdomenValue = parseFloat(abdomen);
    const thighValue = parseFloat(thigh);
    const bodyFatPercentValue = parseFloat(bodyFatPercent);
    const muscleMassValue = parseFloat(muscleMass);

    // Clear entered measurements if bypass flag is set before sending to API
    const adjustedChest = bypassMeasurementFlag ? null : parseFloat(chest);
    const adjustedAbdomen = bypassMeasurementFlag ? null : parseFloat(abdomen);
    const adjustedThigh = bypassMeasurementFlag ? null : parseFloat(thigh);

    // Validation logic
    if (bypassMeasurementFlag) {
      if (!weight || !bodyFatPercent || !muscleMass) {
        Alert.alert(
          "Error",
          "Please fill in weight, body fat, and muscle mass."
        );
        return;
      }
      if (bodyFatPercentValue >= 50) {
        Alert.alert("Error", "Body fat percentage must be below 50%.");
        return;
      }
      if (muscleMassValue > weightValue) {
        Alert.alert("Error", "Muscle mass cannot exceed weight.");
        return;
      }
    } else {
      if (!weight || !chest || !abdomen || !thigh) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }
      if (chestValue < 1 || chestValue > 80) {
        Alert.alert("Error", "Measurement must be between 1mm and 80mm.");
        return;
      }
      if (abdomenValue < 1 || abdomenValue > 80) {
        Alert.alert("Error", "Measurement must be between 1mm and 80mm.");
        return;
      }
      if (thighValue < 1 || thighValue > 80) {
        Alert.alert("Error", "Measurement must be between 1mm and 80mm.");
        return;
      }
    }

    setSubmitting(true);

    // API call
    try {
      const result = await measurement.saveMeasurement(
        parseFloat(form.weight),
        adjustedChest,
        adjustedAbdomen,
        adjustedThigh,
        form.bypassMeasurementFlag,
        parseFloat(form.bodyFatPercent),
        parseFloat(form.muscleMass)
      );

      if (result.status) {
        router.replace({
          pathname: "/fitnessResult",
          params: { measurementId: result.data.id },
        });
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Modals to show instruction images
  const handleShowModal = (part: any) => {
    switch (part) {
      case "chest":
        setModalContent({
          title:
            gender === "M"
              ? "How to Measure Chest"
              : "How to Measure Tricep",
          text:
            gender === "M"
              ? "Diagonal fold, midway between upper armpit and nipple"
              : "Vertical fold, midway between elbow and shoulder",
          image: gender === "M" ? maleC : femaleTricep,
        });
        break;
      case "abdomen":
        setModalContent({
          title:
            gender === "M"
              ? "How to Measure Abdomen"
              : "How to Measure Suprailiac",
          text:
            gender === "M"
              ? "Vertical fold, one inch to the right of navel"
              : "Diagonal fold, directly above iliac crest",
          image: gender === "M" ? maleA : femaleSuprailiac,
        });
        break;
      case "thigh":
        setModalContent({
          title: "How to Measure Thigh",
          text: "Vertical fold, midway between knee cap and top of thigh",
          image: gender === "M" ? maleT : femaleThigh,
        });
        break;
    }
    setShowModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView>
        <BackButton />
        <View className="w-full flex h-full px-4 my-6">
          <Image
            source={image}
            resizeMode="contain"
            className="w-[115px] h-[34px] justify-center items-center w-full mt-10"
          />

          <Text className="text-2xl font-semibold mt-10 font-psemibold text-center w-full">
            Body Measurement
          </Text>
          <Text
            style={{ width: 280 }}
            className="text-lg font-pregular text-left ml-14 mt-4"
          >
            Please use a{" "}
            <Text
              style={{ color: "blue", textDecorationLine: "underline" }}
              onPress={() =>
                Linking.openURL(
                  "https://www.google.com/search?q=body+fat+caliper&oq=body+fat+caliper"
                )
              }
            >
              Body Fat Caliper
            </Text>{" "}
            to measure for the most accurate results.
          </Text>

          <FormField
            title="Weight"
            value={form.weight}
            handleChangeText={(e) => setForm({ ...form, weight: e })}
            keyboardType="numeric"
            placeholder={"in kg"}
            containerStyles="w-[270px]"
          />

          <View className="flex-row items-center">
            <FormField
              title={gender === "M" ? "Chest" : "Tricep"}
              value={form.chest}
              handleChangeText={(e) => setForm({ ...form, chest: e })}
              keyboardType="numeric"
              placeholder={"in mm"}
              containerStyles="w-[270px]"
              editable={!form.bypassMeasurementFlag}
            />
            <TouchableOpacity
              onPress={() => handleShowModal("chest")}
              className="ml-8 mt-3"
            >
              <Text
                style={{ width: 60 }}
                className="text-m font-pregular text-left"
              >
                How to measure:
              </Text>
              <Ionicons name="help-circle-outline" size={40} color="gray" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center">
            <FormField
              title={gender === "M" ? "Abdomen" : "Suprailiac"}
              value={form.abdomen}
              handleChangeText={(e) => setForm({ ...form, abdomen: e })}
              keyboardType="numeric"
              placeholder={"in mm"}
              containerStyles="w-[270px]"
              editable={!form.bypassMeasurementFlag}
            />
            <TouchableOpacity
              onPress={() => handleShowModal("abdomen")}
              className="ml-8 mt-12"
            >
              <Ionicons name="help-circle-outline" size={40} color="gray" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center">
            <FormField
              title="Thigh"
              value={form.thigh}
              handleChangeText={(e) => setForm({ ...form, thigh: e })}
              keyboardType="numeric"
              placeholder={"in mm"}
              containerStyles="w-[270px]"
              editable={!form.bypassMeasurementFlag}
            />
            <TouchableOpacity
              onPress={() => handleShowModal("thigh")}
              className="ml-8 mt-12"
            >
              <Ionicons name="help-circle-outline" size={40} color="gray" />
            </TouchableOpacity>
          </View>

          <View className="flex flex-row items-left mt-6">
            <Switch
              value={form.bypassMeasurementFlag}
              onValueChange={() =>
                setForm({
                  ...form,
                  bypassMeasurementFlag: !form.bypassMeasurementFlag,
                })
              }
            />
            <Text className="text-base font-pregular ml-2">
              I know my Body Fat % and {"\n"} Lean Muscle Mass
            </Text>
          </View>

          <FormField
            title="Body Fat Percent"
            value={form.bodyFatPercent}
            handleChangeText={(e) => setForm({ ...form, bodyFatPercent: e })}
            keyboardType="numeric"
            placeholder="in %"
            containerStyles="w-[250px]"
            editable={form.bypassMeasurementFlag}
          />

          <FormField
            title="Muscle Mass"
            value={form.muscleMass}
            handleChangeText={(e) => setForm({ ...form, muscleMass: e })}
            keyboardType="numeric"
            placeholder="in kg"
            containerStyles="w-[250px]"
            editable={form.bypassMeasurementFlag}
          />

          <View className="w-full flex items-center">
            <CustomButton
              title="Save"
              handlePress={submit}
              containerStyles="w-[250] mt-12"
              isLoading={isSubmitting}
            />
          </View>
        </View>
        <Modal
          isVisible={showModal}
          onBackdropPress={() => setShowModal(false)}
        >
          <View
            style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
            >
              {modalContent.title}
            </Text>
            <Text className="text-lg font-pregular">{modalContent.text}</Text>
            {modalContent.image && (
              <Image
                source={modalContent.image}
                style={{ width: 300, height: 300, marginVertical: 20 }}
                resizeMode="contain"
              />
            )}
            <CustomButton
              title="Close"
              handlePress={() => setShowModal(false)}
            />
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default BodyMeasurement;
