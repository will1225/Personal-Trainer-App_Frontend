import { useState } from "react";
import { View, Text, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton, FormField } from "@/components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Link, router } from "expo-router";


/**
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
      console.log(errorData.error);
    }

    // API returns status code 200 and message
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

/**
 * Forgot Password screen.
 * User enters an email and proceeds to the next Change Password Screen.
 * @returns 
 */
const forgotPassword = () => {
  const image = require("../../assets/images/neonDumbell.png");

  // State variables
  const [isSubmitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  // Email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex

  // Handle OTP request
  const sendEmail = async () => {    

    // Validate email format
    if (!email || !emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setSubmitting(true);

    try {
      // For security purpose, direct to the next screen even if there are errors, passing email form data 
      const result = await sendOtp(email);      
      router.replace({ pathname: "/changePassword", params: { email: email } });
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

          <Text className="text-2xl font-semibold mt-10 font-semibold text-left w-full">
            Reset Password
          </Text>
          <Text className="text-lg mt-2 w-full">
            An OTP will be sent to your email if it is associated with an account
          </Text>

          <View className="w-full flex justify-center items-center px-4 mt-4">
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
              containerStyles="w-[250] mt-12"
              isLoading={isSubmitting}
            />
          </View>
          
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg">Go back to</Text>
            <Link
              href="/sign-in"
              className="text-lg font-semibold text-secondary"
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
