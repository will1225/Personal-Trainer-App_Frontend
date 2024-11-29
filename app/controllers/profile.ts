import { getToken } from "./user";
import { endpoint } from "../config";

export class Profile {
  private _dob: string;
  private _gender: string;

  constructor(dob: string, gender: string) {
    this._dob = dob;
    this._gender = gender;
  }

  // Getter for dob
  get dob(): string {
    return this._dob;
  }

  // Setter for dob
  set dob(value: string) {
    // You can add validation or formatting here if needed
    this._dob = value;
  }

  // Getter for gender
  get gender(): string {
    return this._gender;
  }

  // Setter for gender
  set gender(value: string) {
    // You can add validation or formatting here if needed
    this._gender = value;
  }

  static async createProfile(dob: string, gender: string, height: number) {
    try {
      const response = await fetch(`${endpoint}/user/profile/enter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({ dob, gender, height }),
      });

      // Check if the response is OK (status code 2xx)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check if the response has JSON content
      const contentType = response.headers.get("Content-Type") || "";
      if (contentType.includes("application/json")) {
        const res = await response.json();
        console.log(res);

        if (res.status) {
          return res;
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

  static async setProfileByToken(setProfile: any) {
    console.log("Setting profile");
    const res = await fetch(`${endpoint}/user/profile?initBodyMeasurement=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
    });

    const data = await res.json();
    console.log(data.data);
    setProfile(data.data);
  }

  static async update({ gender, dob, height }: { gender?: string; dob?: Date; height?: number }) {
    const res = await fetch(`${endpoint}/user/profile/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
      body: JSON.stringify({
        gender,
        dob,
        height,
      }),
    });

    const data = await res.json();

    return data;
  }
}
