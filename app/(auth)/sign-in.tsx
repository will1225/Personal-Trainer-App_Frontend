import { useState } from "react";
import { Href, Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CustomButton, FormField } from "../../components";
import { View, Text, Alert, Image } from "react-native";
import * as SecureStore from "expo-secure-store";

/**
 * API function to log in
 * @param email 
 * @param password 
 * @returns promise data
 */
const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(
      "https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev/user/signin",
      {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        // If not verified, redirect to OTP page and pass the email
        router.replace({ pathname: "/otp", params: { email: email } });
      }
      const errorData = await response.json();
      throw new Error(errorData.error || "Login failed");
    }

    const data = await response.json(); 

    // TODO: Temporary storing solution, change it to API method after upstream is ready
    const cookiesHeader = response.headers.get('set-cookie');
    if (cookiesHeader) {
      // Extract token from the cookiesHeader
      const tokenMatch = cookiesHeader.match(/token=([^;]+)/);
      if (tokenMatch && tokenMatch[1]) {
        const token = tokenMatch[1];
        await SecureStore.setItemAsync('userToken', token); // Store the token
      }
    }
    /*
    // Extract token from response
    if (data.token) {
      await SecureStore.setItemAsync('userToken', data.token);
    }
    */

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

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
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 1 uppercase and 1 number, minimum 8 chars

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
      // TODO: Confirm home page route with Faisal
      // API call
      const result = await loginUser(email, password);
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
            className="text-lg font-psemibold text-secondary mt-4"
          >
            Forgot Password
          </Link>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
