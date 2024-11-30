import LogoutButton from "@/components/LogoutButton";
import { Href, router } from "expo-router";
import { Button, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Subscription = () => {
    return (
        <SafeAreaView className="flex-1">
            <View className="p-[15px]">
                <LogoutButton />
            </View>
            <ScrollView contentContainerStyle={{ flex: 1, marginHorizontal: 16, marginVertical: 16, alignItems: 'center' }}>
                <Text className="font-bold text-2xl">
                    Free Trial Ended
                </Text>
                <Text className="my-[16px] text-lg">
                    Your free trial of <Text className="font-bold">3 months</Text> has officialy ended. If you enjoyed using our app and want to support us, kindly press the <Text className="font-bold">Subscribe</Text> button. Our subscription is only <Text className="font-bold">$1</Text>/month recurring. By subscribing, you can continue enjoying our app and support our hard-working developers at the same time.
                </Text>
                <View className="my-[16px]">
                    <Button title="Subscribe" onPress={() => router.replace("/subscription/subscribe")} />
                </View>
                <TouchableOpacity onPress={() => router.push("/subscription/policy" as Href<string>)}>
                    <Text className="text-indigo-500 font-bold">Subscription Policy.</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Subscription;