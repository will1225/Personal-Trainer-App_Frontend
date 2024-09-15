import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton, FormField } from "../../components";
import { TouchableOpacity } from "react-native";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import * as user from "../../app/controllers/user";
import BackButton from "../../components/BackButton";

/**
 * Sign up screen.
 * @returns void
 */
const SignUp = () => {
  const image = require("../../assets/images/neonDumbell.png");

  // State variables
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
  });

  // Regex for email and password validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 1 uppercase and 1 number, minimum 8 chars

  // Handle Date change
  const handleDateChange = (date: Date) => {
    setForm({ ...form, dob: date.toISOString() });
  };

  // Form submission handling
  const submit = async () => {
    const { email, password, password2, firstName, lastName, dob, gender } =
      form;

    // Check empty fields
    if (
      !email ||
      !password ||
      !password2 ||
      !firstName ||
      !lastName ||
      !dob ||
      !gender
    ) {
      Alert.alert("Error", "Please fill in all fields");
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

    // API call
    try {
      const result = await user.createUser(
        form.email,
        form.password,
        form.password2,
        form.firstName,
        form.lastName,
        form.dob,
        form.gender
      );

      if (result.status) {
        router.replace({ pathname: "/otp", params: { email: form.email } });
      }
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
        <View
          className="w-full flex justify-center items-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={image}
            resizeMode="contain"
            className="w-[115px] h-[34px] justify-center"
          />

          <Text className="text-2xl font-semibold mt-10 font-psemibold text-left w-full">
            Sign Up
          </Text>

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

          <FormField
            title="Confirm Password"
            value={form.password2}
            handleChangeText={(e) => setForm({ ...form, password2: e })}
            placeholder={"Enter Password Again"}
          />

          <FormField
            title="First Name"
            value={form.firstName}
            handleChangeText={(e) => setForm({ ...form, firstName: e })}
            placeholder={"Enter First Name"}
          />

          <FormField
            title="Last Name"
            value={form.lastName}
            handleChangeText={(e) => setForm({ ...form, lastName: e })}
            placeholder={"Enter Last Name"}
          />

          <FormField
            title="Date of Birth"
            value={form.dob ? new Date(form.dob).toDateString() : ""}
            handleChangeText={() => {}}
            placeholder={"Select Date of Birth"}
            isDatePicker
            onDateChange={handleDateChange}
          />

          <View className="w-full flex flex-row justify-between items-center mt-10">
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: "center",
                backgroundColor:
                  form.gender === "M" ? "#7dd3fc" : "transparent",
                padding: 10,
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
                backgroundColor:
                  form.gender === "F" ? "#f9a8d4" : "transparent",
                padding: 10,
                borderRadius: 5,
              }}
              onPress={() => setForm({ ...form, gender: "F" })}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>Female</Text>
            </TouchableOpacity>
          </View>

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="w-[250] mt-12"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
