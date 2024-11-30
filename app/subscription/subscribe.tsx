import { useStripe, CardField } from "@stripe/stripe-react-native";
import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPaymentMethods, renewSubscription, subscribe } from "../controllers/user";
import { useEffect, useState } from "react";
import { Href, router } from "expo-router";
import LogoutButton from "@/components/LogoutButton";
import { useQueryClient } from "react-query";
import { useAtomValue } from "jotai";
import { profileAtom } from "@/store";
import { PaymentMethodProps } from "@/types";
import { Text } from "@/components/Text";

const Subscribe = () => {
  const queryClient = useQueryClient();
  const { initPaymentSheet, presentPaymentSheet, createPaymentMethod } = useStripe();
  const [loading, isLoading] = useState(false);
  const [thanks, setThanks] = useState(false);
  const [confirmPayment, setConfirmPayment] = useState(false);
  const profile = useAtomValue(profileAtom);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodProps[] | null>(null);

  const createSubscription = async () => {
    setConfirmPayment(false);
    isLoading(true);
    try {
      if (!profile.userAccount?.stripeId) {
        const { error, paymentMethod } = await createPaymentMethod({
          paymentMethodType: "Card",
        });

        if (error) {
          console.log(error.message);
          Alert.alert("Payment failed: " + error.message);
        } else if (paymentMethod) {
          await subscribe(paymentMethod.id);
          queryClient.invalidateQueries({
            queryKey: ["profile"],
          });
          setThanks(true);
        }
      } else {
        console.log("Paying with existing card");
        if (paymentMethods) {
          await renewSubscription(paymentMethods[0].id);
          queryClient.invalidateQueries({
            queryKey: ["profile"],
          });
          setThanks(true);
        } else {
          Alert.alert("Error subscribing, please try again");
        }
      }
    } catch (err: any) {
      console.log(err);
      if (err) {
        Alert.alert(err);
      } else {
        Alert.alert("Something went wrong while processing subscription");
      }
    }
    isLoading(false);
  };

  useEffect(() => {
    const getPayments = async () => {
      setPaymentMethods(await getPaymentMethods());
    };

    getPayments();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="p-[15px]">
        <LogoutButton />
      </View>
      {loading && (
        <Modal transparent>
          <View
            className="flex-1 items-center justify-center flex flex-col"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <ActivityIndicator size={50} color={"white"} />
            <Text className="text-white text-lg mt-5">Processing subscription, please wait...</Text>
          </View>
        </Modal>
      )}
      {thanks && (
        <Modal transparent>
          <View
            className="flex-1 items-center justify-center flex flex-col"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            {/* <ActivityIndicator size={50} color={"white"} /> */}
            <Text className="text-white text-xl my-5 font-bold">Thank you for subscribing!</Text>
            <Button title="Proceed" onPress={() => router.replace("/(tabs)/home")} />
          </View>
        </Modal>
      )}
      {confirmPayment && (
        <Modal transparent>
          <View
            className="flex-1 items-center justify-center flex flex-col"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            {/* <ActivityIndicator size={50} color={"white"} /> */}
            <View className="bg-white p-[8px]">
              <View className="flex-row items-center gap-1 my-5">
                <Text>By subscribing, you agree to our</Text>
                <TouchableOpacity
                  onPress={() => {
                    setConfirmPayment(false);
                    router.push("/subscription/policy" as Href<string>);
                  }}
                >
                  <Text className="text-indigo-500 font-bold">Subscription policy.</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row gap-2 items-center flex justify-around">
                <Button title="Confirm" onPress={createSubscription} />
                <Button title="Cancel" color="red" onPress={() => setConfirmPayment(false)} />
              </View>
            </View>
          </View>
        </Modal>
      )}
      <ScrollView contentContainerStyle={{ flex: 1, marginHorizontal: 16 }}>
        {profile.userAccount?.stripeId ? (
          !paymentMethods ? (
            <Text>Loading payment methods...</Text>
          ) : (
            <Text className="my-[16px]">
              Proceed with payment ending with {paymentMethods[0].card.last4}
            </Text>
          )
        ) : (
          <CardField
            postalCodeEnabled={false}
            placeholders={{
              number: "4242 4242 4242 4242",
            }}
            cardStyle={{
              backgroundColor: "#FFFFFF",
              textColor: "#000000",
            }}
            style={{
              width: "100%",
              height: 50,
              marginVertical: 30,
            }}
            // onCardChange={(cardDetails) => {
            //     console.log('cardDetails', cardDetails);

            // }}
            // onFocus={(focusedField) => {
            //     console.log('focusField', focusedField);
            // }}
          />
        )}
        <Button onPress={() => setConfirmPayment(true)} title="Subscribe" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Subscribe;
