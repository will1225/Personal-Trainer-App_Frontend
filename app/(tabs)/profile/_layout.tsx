import { Stack } from "expo-router";

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="editProfile" options={{ headerShown: false }} />
      <Stack.Screen name="edit/gender" options={{ headerShown: false }} />
      <Stack.Screen name="edit/dob" options={{ headerShown: false }} />
    </Stack>
  );
};

export default HomeLayout;
