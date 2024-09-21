import { router } from "expo-router";
import { getToken } from "./user";

export class BodyMeasurements {
  private _weight!: number; // Added weight
  private _chest!: number; // Changed from _chestSize to _chest
  private _abdomen!: number; // Changed from _abdomenSize to _abdomen
  private _thigh!: number; // Changed from _thighSize to _thigh

  constructor(weight: number, chest: number, abdomen: number, thigh: number) {
    this.weight = weight; // Set weight
    this.chest = chest; // Set chest
    this.abdomen = abdomen; // Set abdomen
    this.thigh = thigh; // Set thigh
  }

  // Getter for weight
  get weight(): number {
    return this._weight;
  }

  // Setter for weight
  set weight(value: number) {
    if (value <= 0) {
      throw new Error("Weight must be greater than zero.");
    }
    this._weight = value;
  }

  // Getter for chest
  get chest(): number {
    return this._chest;
  }

  // Setter for chest
  set chest(value: number) {
    if (value <= 0) {
      throw new Error("Chest size must be greater than zero.");
    }
    this._chest = value;
  }

  // Getter for abdomen
  get abdomen(): number {
    return this._abdomen;
  }

  // Setter for abdomen
  set abdomen(value: number) {
    if (value <= 0) {
      throw new Error("Abdomen size must be greater than zero.");
    }
    this._abdomen = value;
  }

  // Getter for thigh
  get thigh(): number {
    return this._thigh;
  }

  // Setter for thigh
  set thigh(value: number) {
    if (value <= 0) {
      throw new Error("Thigh size must be greater than zero.");
    }
    this._thigh = value;
  }

  static async submitMeasurements(
    weight: number, // Added weight parameter
    chest: number, // Changed from chestSize to chest
    abdomen: number, // Changed from abdomenSize to abdomen
    thigh: number, // Changed from thighSize to thigh
    bodyFatPercentage?: number,
    leanMuscleMass?: number
  ) {
    try {
      const response = await fetch(
        "https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev/user/BodyMeasurement/enter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
          },
          body: JSON.stringify({
            weight, // Send weight
            chest, // Send chest
            abdomen, // Send abdomen
            thigh, // Send thigh
            bodyFatPercentage,
            leanMuscleMass,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get("Content-Type") || "";
      if (contentType.includes("application/json")) {
        const res = await response.json();
        if (res.status) {
          router.replace({ pathname: "../(tabs)/Home" });
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
