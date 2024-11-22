import { useState } from "react";
import { View, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton, FormField } from "@/components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Href, router, useLocalSearchParams } from "expo-router";
import * as user from "../../app/controllers/user";
import BackButton from "../../components/BackButton";
import { Text } from "@/components/Text"

const ChangePassword = () => {
  const { email } = useLocalSearchParams(); // Get email from previous screen
  const image = require("../../assets/images/neonDumbell.png");

  // State variables
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  // Regex for passwords
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  // Handle password reset form submission
  const submit = async () => {
    if (!otp || !password || !password2) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== password2) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Error",
        "Password must contain at least 1 capital letter, 1 number, and be at least 8 characters long"
      );
      return;
    }

    setSubmitting(true);

    try {
      const result = await user.changePasswordApi(otp, password, password2);
      if (result.status) {
        Alert.alert("Success", "Password reset successfully!");
        router.replace("/sign-in" as Href<string>);
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

          <Text className="text-2xl font-semibold mt-10 font-psemibold text-left w-full">
            Change Password
          </Text>
          <Text className="text-lg mt-2 w-full">
            Resetting the password for {"\n"}
            {email}
          </Text>

          <View className="w-full flex justify-center items-center px-4">
            <FormField
              title="OTP Code"
              value={otp}
              handleChangeText={(e) => setOtp(e)}
              placeholder={"Enter OTP"}
              keyboardType="numeric"
            />

            <FormField
              title="New Password"
              value={password}
              handleChangeText={(e) => setPassword(e)}
              placeholder={"Enter New Password"}
              secureTextEntry={true}
            />

            <FormField
              title="Confirm New Password"
              value={password2}
              handleChangeText={(e) => setPassword2(e)}
              placeholder={"Re-enter New Password"}
              secureTextEntry={true}
            />

            <CustomButton
              title="Submit"
              handlePress={submit}
              containerStyles="w-[250] mt-9"
              isLoading={isSubmitting}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
