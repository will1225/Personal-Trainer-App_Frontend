import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

interface RefreshButtonProps {
  onRefresh: () => void; // Set onRefresh to any
  style?: any;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  style = { alignItems: "center", marginVertical: 1 },
}) => {
  const { colorScheme } = useColorScheme();

  return (
    <View style={style}>
      <TouchableOpacity onPress={onRefresh} style={{ paddingBottom: 5 }}>
        <Ionicons
          name="refresh"
          size={24}
          color={colorScheme === "dark" ? "white" : "black"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default RefreshButton;
