import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const BackButton = () => {
  const { back } = useRouter();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        back(); 
      }}
    >
      <Text style={styles.text}>{"< Back"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 10,
  },
  text: {
    fontSize: 18,
    color: "#64748b",
  },
});

export default BackButton;
