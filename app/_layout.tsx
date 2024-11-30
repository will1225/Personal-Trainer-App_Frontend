import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeProvider } from "@react-navigation/native";
import { DarkTheme, DefaultTheme } from "../components/lightDarkThemes";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar as RNStatusBar } from "react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "react-query";
import * as SecureStore from "expo-secure-store"; // Roll back point
import { StripeProvider } from '@stripe/stripe-react-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [goHome, setGoHome] = useState(false);
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      <QueryClientProvider client={queryClient}>
        <StripeProvider publishableKey='pk_test_51NRGPKALN5ZJppZ0Xp5gr0YfkzxtyHkO9aiExVZWEoG0ymHjcogM2yzmHgjOTbtyYBDCNDs0Rirn5KRRZ0cniR1T005TNFcdX0'>
          <RootLayoutNav goHome={goHome} />
        </StripeProvider>
      </QueryClientProvider>
  );
}

function RootLayoutNav({goHome}: {goHome: boolean}) {
  const { colorScheme, setColorScheme } = useColorScheme(); // Using NativeWind's color scheme hook

  // Load the stored theme from SecureStore when starts up
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await SecureStore.getItemAsync("colorScheme");
      if (savedTheme === "dark" || savedTheme === "light") {
        setColorScheme(savedTheme);
      }
    };

    loadTheme();
  }, []);

  // Save theme changes to SecureStore
  useEffect(() => {
    SecureStore.setItemAsync("colorScheme", colorScheme);
  }, [colorScheme]);

  // Apply theme color based on the current theme "light" or "dark"
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  // Status bar icons changes color based on the current theme
  useEffect(() => {
    RNStatusBar.setBarStyle(colorScheme === "dark" ? "light-content" : "dark-content");
    RNStatusBar.setBackgroundColor(
      colorScheme === "dark" ? DarkTheme.colors.background : DefaultTheme.colors.background,
    );
  }, [colorScheme]);

  return (
    <ThemeProvider value={theme}>
      <View className="flex-1">
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="aboutUs" />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </View>
    </ThemeProvider>
  );
}
