import { View, TouchableOpacity } from "react-native"
import { Text } from "@/components/Text"
import { useColorScheme } from 'nativewind';

interface Props {
    label: string,
    value: any,
    onPress?: any
}

const EditProfileData = ({label, value, onPress}: Props) => {
    const { colorScheme } = useColorScheme();

    return (
        <TouchableOpacity className="flex-row gap-5 items-center" onPress={onPress}>
            <Text className="text-lg w-[89.5px]">
                {label}
            </Text>
            <Text 
                className="flex-1 text-lg border-b-[1px] font-bold"
                style={{ borderColor: colorScheme === 'dark' ? 'white' : 'black' }}
            >
                {value}
            </Text>
        </TouchableOpacity>
    )
}

export default EditProfileData;