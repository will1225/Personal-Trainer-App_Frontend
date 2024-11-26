import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useColorScheme } from "nativewind";

const LoadingAnimation = ({
  isLoading,
  message = "Just a moment...",
}: {
  isLoading: boolean;
  message?: string;
}) => {
  const { colorScheme } = useColorScheme();
  const textColor = colorScheme === "dark" ? "#25BCE7" : "#0369a1";

  if (!isLoading) return null;

  return (
    <View style={{ alignItems: "center" }}>
      <ActivityIndicator
        animating={isLoading}
        color={textColor}
        size="large"
        className="mb-5"
      />
      <Text style={{ marginBottom: 30, fontSize: 18, color: textColor }}>
        {message}
      </Text>
    </View>
  );
};

export default LoadingAnimation;
