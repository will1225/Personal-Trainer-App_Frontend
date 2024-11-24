import { Stack } from "expo-router"

const LibraryLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="exerciseList" options={{ headerShown: false }} />
        </Stack>
    )
}
export default LibraryLayout;