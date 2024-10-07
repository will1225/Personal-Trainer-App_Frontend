import { View, Text, TouchableOpacity } from "react-native"

interface Props {
    label: string,
    value: any,
    onPress?: any
}

const EditProfileData = ({label, value, onPress}: Props) => {
    return (
        <TouchableOpacity className="flex-row gap-5 items-center" onPress={onPress}>
            <Text className="text-lg w-[89.5px]">
                {label}
            </Text>
            <Text className="flex-1 text-lg border-b-[1px] border-black font-bold">
                {value}
            </Text>
        </TouchableOpacity>
    )
}

export default EditProfileData;