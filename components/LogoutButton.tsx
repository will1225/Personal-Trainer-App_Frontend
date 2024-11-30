import { Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as user from "../app/controllers/user";
import { useColorScheme } from "nativewind";

const LogoutButton = () => {
  const { colorScheme } = useColorScheme();
  const textColor = colorScheme === "dark" ? "#B3B3B3" : "#64748b";

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Yes", // Confirm button
        onPress: async () => {
          await user.clearAllTokenData(); // Clear token data on confirmation
          console.log("Logged out");
        },
      },
      {
        text: "No", // Cancel button
        onPress: () => console.log("Logout cancelled"),
        style: "cancel",
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={[styles.text, { color: textColor }]}>{"Logout"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 0,
    right: 10,
    padding: 10,
  },
  text: {
    fontSize: 18,
  },
});

export default LogoutButton;
