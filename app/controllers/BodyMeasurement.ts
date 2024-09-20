import { router } from "expo-router";
import { getToken } from "./user";

export class BodyMeasurements {
  private _thighSize: number;
  private _chestSize: number;

  constructor(thighSize: number, chestSize: number) {
    this._thighSize = thighSize;
    this._chestSize = chestSize;
  }

  // Getter for thighSize
  get thighSize(): number {
    return this._thighSize;
  }

  // Setter for thighSize
  set thighSize(value: number) {
    if (value <= 0) {
      throw new Error("Thigh size must be greater than zero.");
    }
    this._thighSize = value;
  }

  // Getter for chestSize
  get chestSize(): number {
    return this._chestSize;
  }

  // Setter for chestSize
  set chestSize(value: number) {
    if (value <= 0) {
      throw new Error("Chest size must be greater than zero.");
    }
    this._chestSize = value;
  }

  // Method to submit measurements to the server
  static async submitMeasurements(thighSize: number, chestSize: number) {
    try {
      const response = await fetch(
        "http://your-api-url.com/dev/user/measurements/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
          },
          body: JSON.stringify({ thighSize, chestSize }),
        }
      );

      // Check if the response is OK (status code 2xx)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check if the response has JSON content
      const contentType = response.headers.get("Content-Type") || "";
      if (contentType.includes("application/json")) {
        const res = await response.json();
        if (res.status) {
          router.replace({ pathname: "../(tabs)/index" }); // Navigate on success
        } else {
          throw new Error(res.error || "Submission failed");
        }
      } else {
        throw new Error("Expected JSON response, but got something else.");
      }
    } catch (err: any) {
      console.error(err.message + ": Submit Failed");
    }
  }
}
