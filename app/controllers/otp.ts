/**
 * API function to verify OTP
 * @param otp
 * @returns promise data
 */
export const verifyOtp = async (otp: string) => {
  try {
    const response = await fetch(
      `https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev/user/verify/${otp}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
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
export const resendOtp = async (email: string) => {
  try {
    const response = await fetch(
      `https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev/otp/send/${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
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
 * API function to resend the OTP code to the user's email
 * @param email
 * @returns promise data
 */
export const sendOtp = async (email: string) => {
  try {
    const response = await fetch(
      `https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev/otp/send/${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
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
