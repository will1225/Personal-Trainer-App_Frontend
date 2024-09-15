import { useState } from "react";
import { Href, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CustomButton, FormField } from "../../components";
import { View, Text, Alert, Image, TouchableOpacity } from "react-native";


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

/**
 * API function to resend the OTP code to the user's email
 * @param email 
 * @returns promise data
 */
const resendOtp = async (email: string) => {
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
 * OTP Verification Screen.
 * This screen allows the user to input the OTP code, verify, and resend.
 * @returns void
 */
const Otp = () => {
  const image = require("../../assets/images/neonDumbell.png");
  const { email } = useLocalSearchParams(); // Get email from previous screen

  // State variables
  const [isSubmitting, setSubmitting] = useState(false);
  const [otp, setOtp] = useState("");

  // OTP submission handling
  const submit = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    setSubmitting(true);

    try {
      // API call
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

  // OTP resend handling
  const handleResendOtp = async () => {
    if (!email) {
      Alert.alert("Error", "Email is not available");
      return;
    }

    try {
      // API call to resend OTP
      await resendOtp(email as string);
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
            value={otp}
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
