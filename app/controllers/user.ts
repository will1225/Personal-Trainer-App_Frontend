import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { AccessToken, LoginManager, LoginResult } from "react-native-fbsdk-next";

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
 * Method to clear token data
 */
export const clearAllTokenData = async () => {
  try {
    // Clear SecureStore Token
    await SecureStore.deleteItemAsync("userToken");
    console.log("User token cleared from SecureStore.");

    // Clear Facebook Access Token
    const accessToken = await AccessToken.getCurrentAccessToken();
    if (accessToken) {
      console.log("Clearing Facebook access token...");
      LoginManager.logOut(); // Logs out and clears session
    }
  } catch (error) {
    console.error("Error clearing data: ", error);
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
 * @returns promise data
 */
export const createUser = async (
  email: string,
  password: string,
  password2: string,
  firstName: string,
  lastName: string
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
          lastName
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

/**
 * API call to log in the user via third-party (facebook)
 * @param error
 * @param result
 */
export const facebookLogin = async (error: any, result: LoginResult) => {
  try {
    const data = await AccessToken.getCurrentAccessToken();
    const accessToken = data?.accessToken.toString();

    if (accessToken) {
      // Fetch facebook user data
      const fbResponse = await fetch(
        `https://graph.facebook.com/me?fields=email,name&access_token=${accessToken}`
      );
      const userData = await fbResponse.json();

      // Extract name and email
      const { name, email } = userData;

      if (name && email) {
        // API call
        const response = await fetch(
          "https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev/user/signin/provider",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              provider: "facebook",
              name,
            }),
          }
        );
        const result = await response.json();
        console.log(result);

        // Direct to Home page if succeeded
        if (result.status) {
          Alert.alert("Success", "Logged in with Facebook");
          router.replace({ pathname: "/(tabs)/home" });
        } else {
          throw new Error(result.error || "Error logging in with provider");
        }
      } else {
        throw new Error("Failed to retrieve name or email from Facebook.");
      }
    }
  } catch (err: any) {
    Alert.alert(
      "Error",
      err.message || "An error occurred while logging in with Facebook"
    );
  }
};
