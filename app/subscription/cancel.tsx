import { Href, router } from "expo-router";
import { useState } from "react";
import {
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Button,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cancelSubscription } from "../controllers/user";
import { dateToString } from "../controllers/utils";
import { useQueryClient } from "react-query";
import { Text } from "@/components/Text";

const CancelSubscription = () => {
  const queryClient = useQueryClient();
  const [loading, isLoading] = useState(false);

  const handleCancelSubscription = async () => {
    isLoading(true);
    try {
      const data = await cancelSubscription();
      const endDate = dateToString(new Date(data.endDate));
      isLoading(false);
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
      Alert.alert(
        "Subscription cancelled successfully",
        `You can access the app until: ${endDate}`,
        [
          {
            text: "Go Home",
            onPress: () => router.replace("/(tabs)/home"),
          },
        ],
      );
    } catch (err: any) {
      Alert.alert(err);
    }
    isLoading(false);
  };

  const uSure = () => {
    Alert.alert(
      "Are you sure?",
      "Do you want to cancel your Subscription?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Confirm",
          onPress: handleCancelSubscription,
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="p-[15px]">
        <TouchableOpacity onPress={() => router.back()}>
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <Modal transparent>
          <View
            className="flex-1 items-center justify-center flex flex-col"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <ActivityIndicator size={50} color={"white"} />
            <Text className="text-white text-lg mt-5">Cancelling subscription, please wait...</Text>
          </View>
        </Modal>
      )}
      <ScrollView
        contentContainerStyle={{
          marginHorizontal: 16,
          gap: 10,
          marginBottom: 30,
          alignItems: "center",
        }}
      >
        <Text className="text-2xl font-bold text-center mb-5">Cancel Subscription</Text>
        <Text>
          By pressing the <Text className="text-red-500">cancel</Text> button, as per our{" "}
          <Text className="font-bold">policy 4 {"(Cancellation Policy)"}</Text> in our{" "}
          <TouchableWithoutFeedback
            onPress={() => router.push("/subscription/policy" as Href<string>)}
          >
            <Text className="text-indigo-500 font-bold">Policy Subscription:</Text>
          </TouchableWithoutFeedback>
        </Text>
        <View>
          <Text className="font-bold">Access After Cancellation:</Text>
          <Text>
            Upon cancellation, you will retain access to premium features until the end of the
            current billing cycle. No further payments will be charged.
          </Text>
        </View>
        <View className="my-[16px]">
          <Button title="Cancel Subscription" color="red" onPress={uSure} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CancelSubscription;
