import { useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text } from "@/components/Text";

interface Props {
  label: string;
  value?: string;
  isEditable?: boolean;
  setText?: any;
  textValue?: any;
}

const ProfileData = ({
  label,
  value,
  isEditable,
  setText,
  textValue,
}: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Date picker handler
  const onChange = (event: any, selectedDate?: Date) => {
    //setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      // Get today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get selected date for comparison
      const pickedDate = new Date(selectedDate);
      pickedDate.setHours(0, 0, 0, 0);

      // Check if the selected date is greater than today
      if (pickedDate.getTime() > today.getTime()) {
        //setError("Selected date cannot be in the future.");
        Alert.alert("Error", "Selected date cannot be in the future.");
      } else {
        //setError(null);
        //setDate(selectedDate);
        //onDateChange?.(selectedDate); // Call the handler passed as prop
        const formattedDate = selectedDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
        //handleChangeText(formattedDate); // Set formatted date to parent component
        setText(formattedDate);
        setShowDatePicker(false);
      }
    }
  };

  return (
    <View className=" gap-1 py-2 w-full max-w-screen">
      <Text className="text-lg">{label}:</Text>
      <View
        className="w-full h-12 px-4 rounded-2xl border-2 flex flex-row items-center"
        style={{ backgroundColor: "white" }}
      >
        {!editMode ? (
          <>
            <Text
              className="text-lg font-bold flex-1"
              style={{ color: "#000" }}
            >
              {value}
            </Text>
            {isEditable && (
              <TouchableOpacity onPress={() => setEditMode(true)}>
                <Text className="text-blue-500">Edit</Text>
              </TouchableOpacity>
            )}
          </>
        ) : label === "Gender" ? (
          <View className="flex-row flex-1 justify-around items-center">
            <TouchableOpacity
              style={{
                //flex: 1,
                alignItems: "center",
                //backgroundColor: form.gender === "M" ? "#7dd3fc" : "transparent",
                //padding: 15,
                //marginTop: 30,
                //borderRadius: 5,
              }}
              className={`${textValue === "M" && "bg-blue-400"} flex-1 rounded-md py-1`}
              onPress={() => setText("M")}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                //flex: 1,
                alignItems: "center",
                //backgroundColor: form.gender === "F" ? "#f9a8d4" : "transparent",
                //padding: 15,
                //marginTop: 30,
                //borderRadius: 5,
              }}
              className={`${textValue === "F" && "bg-pink-400"} flex-1 rounded-md py-1`}
              onPress={() => setText("F")}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setText("");
                setEditMode(false);
              }}
              className="px-1"
            >
              <Text className="text-blue-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-between"
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{`${textValue ? textValue : "Select Date of Birth"}`}</Text>
              <Ionicons name="calendar" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setText(undefined);
                setEditMode(false);
              }}
              className="px-1"
            >
              <Text className="text-blue-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={textValue ? new Date(textValue) : new Date()}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default ProfileData;
