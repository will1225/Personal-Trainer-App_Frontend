import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

/**
 * Method to retrieve user token from expo secure storage
 * @returns String
 */
export const getToken = async () => {
    try {
      return await SecureStore.getItemAsync("userToken");
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  };

/**
 * API function to log in
 * @param email
 * @param password
 * @returns promise data
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(
      "https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev/user/signin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
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
    const cookiesHeader = response.headers.get("set-cookie");
    if (cookiesHeader) {
      // Extract token from the cookiesHeader
      const tokenMatch = cookiesHeader.match(/token=([^;]+)/);
      if (tokenMatch && tokenMatch[1]) {
        const token = tokenMatch[1];
        await SecureStore.setItemAsync("userToken", token); // Store the token
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
 * API function to register a user
 * @param email
 * @param password
 * @param password2
 * @param firstName
 * @param lastName
 * @param dob
 * @param gender
 * @returns promise data
 */
export const createUser = async (
  email: string,
  password: string,
  password2: string,
  firstName: string,
  lastName: string,
  dob: string,
  gender: string
) => {
  try {
    const response = await fetch(
      "https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev/user/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          password2,
          firstName,
          lastName,
          dob,
          gender,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Sign-up failed");
    }

    const data = await response.json();
    return data; // Assume API returns ok 200
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

/**
 * API call to submit new password with OTP
 * @param otp
 * @param password
 * @param password2
 * @returns
 */
export const changePasswordApi = async (
  otp: string,
  password: string,
  password2: string
) => {
  try {
    const response = await fetch(
      "https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev/user/forgot",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, password, password2 }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to reset password");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};
