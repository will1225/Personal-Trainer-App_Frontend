import { useState } from "react";
import { View, Text, Alert, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton, FormField } from "@/components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Href, Link, router } from "expo-router";


/**
 * TODO: Need a password reset API
 * API function to resend the OTP code to the user's email
 * @param email
 * @returns promise data
 */
const sendOtp = async (email: string) => {
  try {
    const response = await fetch(
      `https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev/otp/send/${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Resend OTP Failed");
    }

    // API returns status code 200 and message
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

/**
 * API function to verify OTP
 * @param otp
 * @returns promise data
 */
const verifyOtp = async (otp: string) => {
  try {
    const response = await fetch(
      `https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev/user/verify/${otp}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "OTP Verification Failed");
    }

    // API returns status code 200 and message
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

const forgotPassword = () => {
  const image = require("../../assets/images/neonDumbell.png");

  // State variables
  const [isSubmitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  /**
   * Method to verify entered email and send OTP
   * @returns 
   */
  const sendEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex

    // Validate email format
    if (!email || !emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setSubmitting(true);

    try {
      const result = await sendOtp(email);

      if (result.status === "ok") {
        Alert.alert("Success", "Verification code sent to your email");
        setEmailSent(true); // Enable OTP input and Verify button if status is ok
      } else {
        throw new Error("Failed to send verification code");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Method to verify entered OTP code
   * @returns 
   */
  const verifyCode = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    setSubmitting(true);

    try {
      const result = await verifyOtp(otp); 
      if (result.status) {
        router.replace("/homePage" as Href<string>);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        enableOnAndroid={true}
      >
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

          <Text className="text-2xl font-semibold mt-10 font-psemibold text-left w-full">
            Reset Password
          </Text>
          <Text className="text-xl mt-2 w-full">
            A verification code will be sent to you email
          </Text>

          <View className="w-full flex justify-center items-center px-4 mb-6">
            <FormField
              title="Account Email"
              value={email}
              handleChangeText={(e) => setEmail(e)}
              keyboardType="email-address"
              placeholder={"Enter Email"}
            />

            <CustomButton
              title="Send"
              handlePress={sendEmail}
              containerStyles="w-[250] mt-6"
              isLoading={isSubmitting}
            />
          </View>

          <View className="w-full flex justify-center items-center px-4 mb-2">
            <FormField
              title="Enter Verification Code"
              value={otp}
              handleChangeText={(e) => setOtp(e)}
              keyboardType="numeric"
              placeholder={"Enter the 6 digit code"}
              editable={emailSent} // Enable OTP input only after email is sent and status is ok
            />

            <CustomButton
              title="Verify OTP"
              handlePress={verifyCode}
              containerStyles="w-[250] mt-6"
              isLoading={isSubmitting}
              disabled={!emailSent} // Disable Verify OTP button until email is sent and status is ok
            />
          </View>

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg font-pregular">Go back to</Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default forgotPassword;
