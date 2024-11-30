import LogoutButton from "@/components/LogoutButton";
import { router } from "expo-router";
import { Button, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/Text";

const ExpiredSubscription = () => {
  return (
    <SafeAreaView className="flex-1">
      <View className="p-[15px]">
        <LogoutButton />
      </View>
      <ScrollView
        contentContainerStyle={{
          marginHorizontal: 16,
          gap: 10,
          marginVertical: 30,
          alignItems: "center",
        }}
      >
        <Text className="text-2xl font-bold text-center mb-5">Your Subscription has expired</Text>
        <Text className="text-base mb-[16px]">
          To continue using the app, you need to renew your subscription
        </Text>
        <Button
          title="Renew Subscription"
          onPress={() => router.replace("/subscription/subscribe")}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExpiredSubscription;
