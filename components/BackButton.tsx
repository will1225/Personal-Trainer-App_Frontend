import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";

const BackButton = () => {
  const { back } = useRouter();
  const { colorScheme } = useColorScheme();
  const textColor = colorScheme === "dark" ? "#B3B3B3" : "#64748b";

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        back();
      }}
    >
      <Text style={[styles.text, { color: textColor }]}>{"< Back"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 5,
    left: 10,
    padding: 10,
  },
  text: {
    fontSize: 18,
  },
});

export default BackButton;
