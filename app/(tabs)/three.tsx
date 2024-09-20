import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Button,
  Alert,
  View,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Text } from "@/components/Themed";
import BackButton from "../../components/BackButton";
import { BodyMeasurements } from "../controllers/BodyMeasurement";

export default function BodyMeasurementsScreen() {
  const [thighSize, setThighSize] = useState("");
  const [chestSize, setChestSize] = useState("");
  const [error, setError] = useState("");

  const validateInput = () => {
    const thigh = parseFloat(thighSize);
    const chest = parseFloat(chestSize);

    if (isNaN(thigh) || thigh <= 0) {
      setError("Please enter a valid thigh size.");
      return false;
    }

    if (isNaN(chest) || chest <= 0) {
      setError("Please enter a valid chest size.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    try {
      const measurements = new BodyMeasurements(
        parseFloat(thighSize),
        parseFloat(chestSize)
      );
      await BodyMeasurements.submitMeasurements(
        measurements.thighSize,
        measurements.chestSize
      );
      Alert.alert("Success", "Measurements submitted successfully!", [
        { text: "OK", onPress: () => {} },
      ]);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred.");
      }
    }
  };

  const handleThighSizeChange = (input: string) => {
    // Only update state if input is numeric or empty
    if (/^\d*\.?\d*$/.test(input)) {
      setThighSize(input);
    }
  };

  const handleChestSizeChange = (input: string) => {
    // Only update state if input is numeric or empty
    if (/^\d*\.?\d*$/.test(input)) {
      setChestSize(input);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Enter Your Body Measurements</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Thigh Size (in cm)"
          value={thighSize}
          onChangeText={handleThighSizeChange}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Chest Size (in cm)"
          value={chestSize}
          onChangeText={handleChestSizeChange}
          keyboardType="numeric"
        />

        <Button title="Submit" onPress={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "100%",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
