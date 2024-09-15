import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

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
      className={`${
        disabled ? "bg-gray-400" : "bg-darkBlue2"
      } rounded-xl min-h-[50px] flex flex-row justify-center items-center ${containerStyles} ${
        isLoading || disabled ? "opacity-50" : ""
      }`}
      disabled={isLoading || disabled} // Disable if isLoading or disabled
    >
      <Text
        className={`text-primary text-white font-bold text-lg ${textStyles}`}
      >
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
