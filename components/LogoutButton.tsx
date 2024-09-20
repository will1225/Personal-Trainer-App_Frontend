import { Text, TouchableOpacity, StyleSheet } from "react-native";
import * as user from "../app/controllers/user";

const LogoutButton = () => {

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={async () => {
        console.log("Pressed");
        await user.clearAllTokenData();        
      }}
    >
      <Text style={styles.text}>{"Logout"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 20,
    right: 10,
    padding: 10,
  },
  text: {
    fontSize: 18,
    color: "#64748b",
  },
});

export default LogoutButton;
