import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Profile } from "@/app/controllers/profile";
import { useQueryClient } from "react-query";
import { Text } from "@/components/Text";
import { useColorScheme } from 'nativewind';

const EditDOB = () => {
    //const { birthdate } = useLocalSearchParams();
    const queryClient = useQueryClient();
    const [dob, setDob] = useState<Date | undefined>(undefined);
    const [loading, isLoading] = useState(false);
    const [select, setSelect] = useState(false);
    const { colorScheme } = useColorScheme();
    const done = async () => {
        //Update dob
        isLoading(true);
        const data = await Profile.update({gender: undefined, dob: dob});

        if (data.status) {
            await queryClient.invalidateQueries({
                queryKey: ['profile']
            })
            router.back();
        } else {
            Alert.alert("Update Error", data.error);
            isLoading(false);
        }
    }

    const selectDate = (event: DateTimePickerEvent, date?: Date | undefined) => {
        if (event.type === 'dismissed') {
            setSelect(false);
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date) {
            const selectedDate = date;
            selectedDate.setHours(0, 0, 0, 0);

            if (date.getTime() > today.getTime()) {
                Alert.alert("Error", "Date cannot be in the future");
                setSelect(false);
            } else {
                //Proceed to set the dob
                setDob(date);
                setSelect(false);
            }
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View 
                className="relative flex-row justify-center items-center px-[16px] border-b-[1px] py-[8px]"
                style={{ borderColor: colorScheme === 'dark' ? 'white' : 'black' }}
            >
                <TouchableOpacity className="absolute left-[16px]" onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back-ios" size={18} color={colorScheme === 'dark' ? 'white' : 'black'}/>
                </TouchableOpacity>
                <Text className="text-lg">
                    Date of Birth
                </Text>
                <TouchableOpacity className="absolute right-[16px]" onPress={done} disabled={loading || !dob}>
                    {
                        loading ?
                            (
                                <ActivityIndicator color="gray" />
                            ) :
                            (
                                <Text className={`text-lg ${dob ? "text-blue-500" : "text-gray-500"}`}>
                                    Done
                                </Text>
                            )
                    }
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{flex: 1, paddingHorizontal: 16, paddingVertical: 8}}>
                <TouchableOpacity className="flex-row justify-between items-center py-[8px]" onPress={() => setSelect(true)}>
                    <Text className="text-lg">
                        {
                            dob?
                            (
                                `${dob}`
                            ):
                            (
                                "Select date of birth"
                            )
                        }
                    </Text>
                    <Ionicons name="calendar" size={30} color={colorScheme === 'dark' ? 'white' : 'black'} />
                </TouchableOpacity>
            </ScrollView>
            {
                select &&
                (
                    <DateTimePicker
                        value={dob || new Date()}
                        mode="date"
                        display="default"
                        onChange={selectDate}
                    />
                )
            }
        </SafeAreaView>
    )
}

export default EditDOB;