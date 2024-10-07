import { useState } from "react";
import { Href, Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CustomButton, FormField } from "../../components";
import { View, Text, Alert, Image } from "react-native";
import { LoginButton } from "react-native-fbsdk-next";
import * as user from "../../app/controllers/user";
import BackButton from "../../components/BackButton";

/**
 * Sign in screen.
 * @returns void
 */
const SignIn = () => {
  const image = require("../../assets/images/neonDumbell.png");

  // State variables
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Regex for email and password validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>\/?~-]{8,}$/; // At least 1 uppercase and 1 number, minimum 8 chars

  // Form submission handling
  const submit = async () => {
    const { email, password } = form;

    // Check if fields are empty
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password");
      return;
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // Validate password format
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Error",
        "Password must contain at least 1 capital letter, 1 number, and be at least 8 characters long"
      );
      return;
    }

    setSubmitting(true);

    try {
      // API call
      const result = await user.loginUser(email, password);
      if (result.status) {
        router.replace({ pathname: "/(tabs)/home" });
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
        <View className="w-full flex justify-center items-center px-4 my-6" >
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
            Sign In
          </Text>

          {/* Use FormField components*/}
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            keyboardType="email-address"
            placeholder={"Enter Email"}
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            placeholder={"Enter Password"}
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="w-[250] mt-9"
            isLoading={isSubmitting}
          />

          <Link
            href={"/forgotPassword" as Href<string>}
            className="text-lg font-psemibold text-secondary mt-4 mb-8"
          >
            Forgot Password
          </Link>
          <View className="w-full flex justify-center items-center">
            <Text className="text-base  text-center font-psemibold w-full mb-3">
              Or continue with providers:
            </Text>
            <View style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}>
              <LoginButton
                onLoginFinished={user.facebookLogin}
                onLogoutFinished={() => console.log("User logged out")}
                permissions={["email", "public_profile"]}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
