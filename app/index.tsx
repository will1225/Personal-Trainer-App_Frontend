import { useEffect, useState } from "react";
import { router, Link, Href } from "expo-router";
import { View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "../components";
import * as user from "../app/controllers/user";
import { endpoint } from "./config";
import { useSetAtom } from "jotai";
import { trialAtom } from "@/store";
import { isThreeMonthsOld } from "./controllers/utils";import { Text } from "@/components/Text";
import ThemeSwitch from "@/components/ThemeSwitch";
import LoadingAnimation from "@/components/LoadingAnimation";

/**
 * Landing screen
 * @returns void
 */
const LandingPage = () => {
  const image = require("../assets/images/download.jpeg");
  const trial = useSetAtom(trialAtom);  const [isLoading, setIsLoading] = useState(true);

  // Flag to skip landing screen if token presents, must set to true in production
  let skipLandingPage = true;

  // Check stored token on app, skip landing page if already logged in

  useEffect(() => {
    const checkToken = async () => {
      if (skipLandingPage) {
        const token = await user.getToken();
        if (token) {
          try {
            const response = await fetch(
              `${endpoint}/user/authenticate`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (response.ok) {
              const data = await response.json();
              console.log("Index data:", data.data)
              if (!data.data.gender) {
                router.replace("/getStarted");
              } else {
                if (!data.data.userAccount.stripeId) {
                  if (isThreeMonthsOld(new Date(data.data.createdAt))) {
                    router.replace("/subscription/trial_ended" as Href<string>);
                    return;
                  } else {
                    router.replace({ pathname: "/(tabs)/home" });
                  }

                  const rem = new Date(data.data.createdAt);
                  rem.setMonth(rem.getMonth() + 3);
                  trial({isTrial: true, remaining: rem})
                } else {
                  //if stripe id is present then check if the subscription is valid
                  const isSubActive = await user.isSubscriptionActive();
                  // const dummy = false;
                  if (isSubActive.isActive) {
                    router.replace({ pathname: "/(tabs)/home" });
                  } else {
                    router.replace("/subscription/expired" as Href<string>);
                  }
                  //If subscription is not active, then redirect to Subscribe page
                }
              }
            }
          } catch (error: any) {
            throw new Error(error.message || "Something went wrong");
          } finally {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [skipLandingPage]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <LoadingAnimation isLoading={isLoading} message="Verifying Token..." />
        </View>
      ) : (
        <View className="w-full flex justify-center items-center h-full px-4">
          <ThemeSwitch />
          <Text className="text-3xl font-bold text-center">Personal Trainer App</Text>

          <Image source={image} className="max-w-[380px] w-full h-[298px]" resizeMode="contain" />

          <Text className="text-xl font-bold text-center mb-8">
            Your personal fitness coach, {"\n"}
            tailored for your Goals
          </Text>

          <CustomButton
            title="Login"
            handlePress={() => router.push("/sign-in" as Href<string>)}
            containerStyles="w-[230px] mt-7"
          />

          <Text className="text-base font-pregular mt-7 text-center">Don't have an account?</Text>
          <Link href={"/sign-up" as Href<string>} className="text-lg font-semibold text-secondary">
            Register Here
          </Link>
        </View>
      )}
    </SafeAreaView>
  );
};

export default LandingPage;
