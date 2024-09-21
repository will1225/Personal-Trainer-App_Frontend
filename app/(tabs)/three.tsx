import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton"; // Import custom button component
import BackButton from "../../components/BackButton"; // Import back button component
import { BodyMeasurements } from "../controllers/BodyMeasurement"; // Import API controller for body measurements
import { useRouter } from "expo-router"; // Import router for navigation

export default function BodyMeasurementScreen() {
  // State for submitting and form data
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    weight: "", // Added weight input
    chest: "", // Changed from chestSize to chest
    abdomen: "", // Same as abdomenSize
    thigh: "", // Changed from thighSize to thigh
    bodyFatPercentage: "",
    leanMuscleMass: "",
    bypass: false, // State to control if user is bypassing measurement entry
  });

  // State for image modal
  const [imageVisible, setImageVisible] = useState(false);
  const [imageSource, setImageSource] = useState<any>(null);
  const router = useRouter(); // Initialize router for navigation

  // Function to handle changes in input fields
  const handleInputChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value }); // Update form state
  };

  // Function to toggle the bypass option
  const handleBypassChange = () => {
    setForm({ ...form, bypass: !form.bypass }); // Toggle bypass state
  };

  // Function to display an image based on the selected measurement type
  const showImage = (type: string) => {
    let source; // Variable to hold the image source
    switch (type) {
      case "chest":
        source = require("../../../assets/images/Chest.jpg"); // Chest image
        break;
      case "abdomen":
        source = require("../../../assets/images/Abdomen.jpg"); // Abdomen image
        break;
      case "thigh":
        source = require("../../../assets/images/Thigh.jpg"); // Thigh image
        break;
      default:
        return;
    }
    setImageSource(source); // Set the image source
    setImageVisible(true); // Show the image modal
  };

  // Function to handle the submission of body measurements
  const submit = async () => {
    const {
      weight,
      chest,
      abdomen,
      thigh,
      bodyFatPercentage,
      leanMuscleMass,
      bypass,
    } = form;

    // Check if required fields are filled or bypass is checked
    if (!bypass && (!chest || !abdomen || !thigh || !weight)) {
      Alert.alert(
        "Error",
        "Please enter all required measurements or check the bypass option."
      );
      return; // Exit if validation fails
    }

    // Validate that the measurements are numeric
    if (
      !/^\d+\.?\d*$/.test(weight) || // Updated to allow decimals for weight
      !/^\d+$/.test(chest) ||
      !/^\d+$/.test(abdomen) ||
      !/^\d+$/.test(thigh)
    ) {
      Alert.alert(
        "Error",
        "Please enter only numeric values in the measurements."
      );
      return; // Exit if validation fails
    }

    try {
      setSubmitting(true); // Set submitting state to true

      // Submit measurements through the API
      await BodyMeasurements.submitMeasurements(
        Number(form.weight), // Convert weight to number
        Number(form.chest), // Convert chestSize to number
        Number(form.abdomen), // Convert abdomenSize to number
        Number(form.thigh), // Convert thighSize to number
        bypass ? Number(form.bodyFatPercentage) : undefined, // Conditionally include body fat
        bypass ? Number(form.leanMuscleMass) : undefined // Conditionally include muscle mass
      );

      // Navigate to the home screen on successful submission
      router.replace({ pathname: "../(tabs)/Home" });
    } catch (error: any) {
      Alert.alert("Error", error.message || "An unknown error occurred."); // Handle API errors
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <BackButton /> {/* Back button */}
        <View style={styles.container}>
          <Text style={styles.title}>Body Measurement</Text>
          <Text>
            Please use a body fat caliper for the most accurate results.
          </Text>

          {/* Input for Weight */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              value={form.weight}
              onChangeText={(value) => handleInputChange("weight", value)} // Update weight
              placeholder="Enter Weight"
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          {/* Input for Chest Size */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Chest (mm)</Text>
            <TextInput
              value={form.chest}
              onChangeText={(value) => handleInputChange("chest", value)} // Update chest size
              placeholder="Enter Chest Size"
              keyboardType="numeric"
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => showImage("chest")}
              style={styles.imageButton}
            >
              <Text>Show Image</Text> {/* Button to show chest image */}
            </TouchableOpacity>
          </View>

          {/* Input for Abdomen Size */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Abdomen (mm)</Text>
            <TextInput
              value={form.abdomen}
              onChangeText={(value) => handleInputChange("abdomen", value)} // Update abdomen size
              placeholder="Enter Abdomen Size"
              keyboardType="numeric"
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => showImage("abdomen")}
              style={styles.imageButton}
            >
              <Text>Show Image</Text> {/* Button to show abdomen image */}
            </TouchableOpacity>
          </View>

          {/* Input for Thigh Size */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Thigh (mm)</Text>
            <TextInput
              value={form.thigh}
              onChangeText={(value) => handleInputChange("thigh", value)} // Update thigh size
              placeholder="Enter Thigh Size"
              keyboardType="numeric"
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => showImage("thigh")}
              style={styles.imageButton}
            >
              <Text>Show Image</Text> {/* Button to show thigh image */}
            </TouchableOpacity>
          </View>

          {/* Checkbox for Bypass Option */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={handleBypassChange}>
              <View
                style={[styles.checkbox, form.bypass && styles.checkboxChecked]}
              />{" "}
              {/* Visual checkbox */}
            </TouchableOpacity>
            <Text>I know my Body Fat % and Lean Muscle Mass</Text>
          </View>

          {/* Conditional Inputs for Body Fat Percentage and Lean Muscle Mass */}
          {form.bypass && (
            <>
              <Text style={styles.label}>Body Fat %</Text>
              <TextInput
                value={form.bodyFatPercentage}
                onChangeText={(value) =>
                  handleInputChange("bodyFatPercentage", value)
                } // Update body fat percentage
                placeholder="Enter Body Fat Percentage"
                keyboardType="numeric"
                style={styles.input}
              />

              <Text style={styles.label}>Lean Muscle Mass (kg)</Text>
              <TextInput
                value={form.leanMuscleMass}
                onChangeText={(value) =>
                  handleInputChange("leanMuscleMass", value)
                } // Update lean muscle mass
                placeholder="Enter Lean Muscle Mass"
                keyboardType="numeric"
                style={styles.input}
              />
            </>
          )}

          {/* Button to submit measurements */}
          <CustomButton
            title="Submit Measurements"
            handlePress={submit} // Handle submit action
            isLoading={isSubmitting} // Show loading state
          />

          {/* Image Modal to display the selected image */}
          <Modal
            visible={imageVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <Image
                source={imageSource}
                style={styles.image}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setImageVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>{" "}
                {/* Close button for modal */}
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles for your components
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  imageButton: {
    marginTop: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#007BFF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  image: {
    width: "90%",
    height: "90%",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
  },
});
