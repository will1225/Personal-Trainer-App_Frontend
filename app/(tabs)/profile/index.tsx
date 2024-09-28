import { ProfileProps } from "@/types";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "react-query";

const getProfileByUserId = async (): Promise<ProfileProps> => {
    const res = await fetch("http://10.0.0.44:8080/user/profile/57");
    const data = await res.json();
    console.log(data)
    return data.data;
}
const ViewProfile = () => {
    
    const query = useQuery({
        queryKey: ['profile', 57],
        queryFn: getProfileByUserId
    });

    return (
        <SafeAreaView style={{flex: 1}}>
            <View>
                {
                    query.status === "loading" ?
                    (
                        <Text>Loading...</Text>
                    ):
                    (
                        <View>
                            <Text>
                                First Name: {query.data?.firstName}
                            </Text>
                            <Text>
                                Last Name: {query.data?.lastName}
                            </Text>
                            <Text>
                                Gender: {query.data?.gender}
                            </Text>
                        </View>
                    )
                }
                {/* <TouchableOpacity className="bg-blue-600 items-center my-5 py-2">
                    <Text className="font-bold">Update</Text>
                </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    );
}

export default ViewProfile;