import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";

// Define the types for the props
interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

// Function component with typed props
const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles = "", // Default empty string if not provided
  textStyles = "",
  isLoading = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading || disabled} // Disable if isLoading or disabled
      className={containerStyles} // This is for tailwind props
      style={{
        borderRadius: 15,
        overflow: "hidden", // Ensures the gradient covering the whole area
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <LinearGradient
        colors={
          disabled ? ["#ccc", "#ccc"] : ["#5851DB", "#5873F4", "#458EEF", "#25BCE7", "#10DAE2"]
        } // disable colors : normal colors
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.25, 0.5, 0.85, 1]}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Text className={`text-primary text-white font-bold text-lg ${textStyles}`}>{title}</Text>

        {isLoading && (
          <ActivityIndicator animating={isLoading} color="#fff" size="small" className="ml-2" />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CustomButton;
