import { Stack } from "expo-router"
import { useSetAtom } from "jotai";
import { profileAtom } from "@/store";
import { useQuery } from "react-query";
import { Profile } from "@/app/controllers/profile";
import * as SplashScreen from 'expo-splash-screen';

const HomeLayout = () => {
    const setProfile = useSetAtom(profileAtom);
    //Set the global use profile
    useQuery({
        queryKey: ["profile"],
        queryFn: async () => Profile.setProfileByToken(setProfile)
    });

    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}} />
        </Stack>
    )
}

export default HomeLayout;