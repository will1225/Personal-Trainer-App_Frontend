import { router } from "expo-router";
import { Text, TouchableOpacity, View, ScrollView, Modal, Button } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const SubscriptionPolicy = () => {
    const policy = [
        {
            title: "Subscription Terms",
            sub_policy: [
                {
                    title: "Recurring Payments",
                    description: "The subscription fee of $1 will be charged monthly to your chosen payment method."
                },
                {
                    title: "Billing Cycle",
                    description: "The billing cycle starts on the day of subscription and renews on the same date each month (e.g., subscribing on December 15 will result in billing on January 15, February 15, etc.)."
                }
            ]
        },
        {
            title: "Payment and Billing",
            sub_policy: [
                {
                    title: "Payment Methods Accepted",
                    description: "Credit cards, debit cards, and other payment options as specified during checkout."
                },
                {
                    title: "Failed Payments",
                    description: "If a payment fails, we will attempt to process it again. If the issue persists, access to premium services may be temporarily suspended."
                }
            ]
        },
        {
            title: "Cancellation Policy",
            sub_policy: [
                {
                    title: "Cancellation Process",
                    description: "You can cancel your subscription anytime through your account settings or by contacting support."
                },
                {
                    title: "Access After Cancellation",
                    description: "Upon cancellation, you will retain access to premium features until the end of the current billing cycle. No further payments will be charged."
                }
            ]
        },
        {
            title: "Refund Policy",
            sub_policy: [
                {
                    title: "No Refunds",
                    description: "All subscription fees are non-refundable, except in cases of accidental billing or errors."
                }
            ]
        }
    ]

    return (
        <SafeAreaView className="flex-1">
            <View className="p-[15px]">
                <TouchableOpacity onPress={() => router.back()}>
                    <Text>
                        Back
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ marginHorizontal: 16, gap: 10, marginBottom: 30 }}>
                <Text className="text-2xl font-bold text-center mb-5">
                    Subscription Policy
                </Text>
                <View>
                    <Text className="font-bold text-lg">
                        1. Overview
                    </Text>
                    <Text className="text-base">
                        This subscription allows users to access premium content or services for $1 per month, automatically billed on a recurring basis. By subscribing, you agree to the terms outlined in this policy.
                    </Text>
                </View>
                <View className="border-t-[1px] border-black" />
                {
                    policy.map((e, idx) => {
                        return (
                            <View key={idx}>
                                <View className="mb-5">
                                    <Text className="font-bold text-lg">
                                        {idx + 2}. {e.title}
                                    </Text>
                                    {
                                        e.sub_policy.map((e, idx) => {
                                            return (
                                                <View key={idx}>
                                                    <Text className="font-bold text-base">
                                                        - {e.title}:
                                                    </Text>
                                                    <Text className="text-base">
                                                        {" "} {e.description}
                                                    </Text>
                                                </View>
                                            );
                                        })
                                    }
                                </View>
                                <View className="border-t-[1px] border-black" />
                            </View>
                        );
                    })
                }
                <View>
                    <Text className="font-bold text-lg">
                        7. Changes to the Policy
                    </Text>
                    <Text className="text-base">
                        We reserve the right to update or modify the subscription policy at any time. Subscribers will be notified of any significant changes 30 days in advance.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SubscriptionPolicy;