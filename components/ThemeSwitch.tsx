import { Switch, Text, View } from "react-native";
import { useColorScheme } from "nativewind";

// A switch that toggle light or dark theme
const ThemeSwitch = () => {
  const { colorScheme, setColorScheme } = useColorScheme(); // NativeWind's hook for color scheme

  const toggleTheme = () => {
    const newTheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(newTheme);
  };

  return (
    <View className="absolute top-3 left-5 flex-row items-center space-x-2">
      <Text className="text-base font-medium dark:text-white">Dark Mode</Text>
      <Switch value={colorScheme === "dark"} onChange={toggleTheme} />
    </View>
  );
};

export default ThemeSwitch;
