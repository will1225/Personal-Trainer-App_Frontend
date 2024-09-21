import { useState } from "react";
import { Href, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CustomButton, FormField } from "../../components";
import { View, Text, Alert, Image, TouchableOpacity } from "react-native";
import * as otp from "../../app/controllers/otp";
import BackButton from "../../components/BackButton";

/**
 * OTP Verification Screen.
 * This screen allows the user to input the OTP code, verify, and resend.
 * @returns void
 */
const Otp = () => {
  const image = require("../../assets/images/neonDumbell.png");
  const { email } = useLocalSearchParams(); // Get email from previous screen

  // State variables
  const [isSubmitting, setSubmitting] = useState(false);
  const [otpCode, setOtp] = useState("");

  // OTP submission handling
  const submit = async () => {
    if (!otpCode) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    setSubmitting(true);

    try {
      // API call
      const result = await otp.verifyOtp(otpCode);
      if (result.status) {
        Alert.alert("Verify Success", "Please Log in");
        router.replace({ pathname: "/sign-in" });
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // OTP resend handling
  const handleResendOtp = async () => {
    if (!email) {
      Alert.alert("Error", "Email is not available");
      return;
    }

    try {
      // API call to resend OTP
      await otp.resendOtp(email as string);
      Alert.alert("Success", "OTP has been resent");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        enableOnAndroid={true}
      >
        <BackButton />
        <View className="w-full flex justify-center items-center px-4 my-6">
          <View className="w-full flex justify-center items-center px-4 mb-6">
            <Text className="text-3xl font-bold text-center">
              Personal Trainer App
            </Text>

            <Image
              source={image}
              resizeMode="contain"
              className="w-[200px] h-[50px] justify-center mt-9"
            />
          </View>

          <Text className="text-2xl font-semibold mt-10 font-semibold text-center w-full">
            Email Verification
          </Text>

          <Text className="text-xl mt-5 mb-5 font-semibold text-center w-full">
            {email}
          </Text>

          <FormField
            title="Enter Verification Code"
            value={otpCode}
            handleChangeText={(e) => setOtp(e)}
            keyboardType="numeric"
            placeholder={"Enter the 6 digit code"}
          />

          <CustomButton
            title="Verify OTP"
            handlePress={submit}
            containerStyles="w-[250] mt-12"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg font-pregular">
              Did not receive the email?
            </Text>
            <TouchableOpacity onPress={handleResendOtp}>
              <Text className="text-lg font-psemibold text-secondary">
                Resend OTP
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Otp;
