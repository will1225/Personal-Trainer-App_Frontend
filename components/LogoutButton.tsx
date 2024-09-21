import { Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as user from "../app/controllers/user";

const LogoutButton = () => {
  const handleLogout = async () => {
    Alert.alert(
      "Logout", 
      "Are you sure you want to logout?", 
      [
        {
          text: "No", // Cancel button
          onPress: () => console.log("Logout cancelled"),
          style: "cancel",
        },
        {
          text: "Yes", // Confirm button
          onPress: async () => {
            await user.clearAllTokenData(); // Clear token data on confirmation
            console.log("Logged out");
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.text}>{"Logout"}</Text>
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
    color: "#64748b",
  },
});

export default LogoutButton;
