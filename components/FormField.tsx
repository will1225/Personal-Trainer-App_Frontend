import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  Platform,
} from "react-native";

interface FormFieldProps extends TextInputProps {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (text: string) => void;
  isDatePicker?: boolean;
  onDateChange?: (date: Date) => void;
}

/**
 * Reusable form field for different types of inputs (text, email, password, data picker)
 * @param param0 
 * @returns 
 */
const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  isDatePicker = false,
  onDateChange,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Date picker handler
  const onChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      // Get today
      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      // Get selected date for comparison
      const pickedDate = new Date(selectedDate);
      pickedDate.setHours(0, 0, 0, 0);

      // Check if the selected date is greater than today
      if (pickedDate.getTime() > today.getTime()) {
        setError("Selected date cannot be in the future.");
      } else {
        setError(null);
        setDate(selectedDate);
        onDateChange?.(selectedDate); // Call the handler passed as prop
        const formattedDate = selectedDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
        handleChangeText(formattedDate); // Set formatted date to parent component
      }
    }
  };

  return (
    <View className="mt-7">
      <Text className="text-base font-pmedium">{title}</Text>

      {/* Standard field */}
      <View className="w-full h-12 px-4 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
        <TextInput
          className="flex-1 font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" || title === "Confirm Password" && !showPassword}
          editable={!isDatePicker} // Disable keyboard input
          style={{ color: value ? "black" : "#7B7B8B" }}
          {...props}
        />

        {/* Password field */}
        {title === "Password" || title === "Confirm Password" && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
          ></TouchableOpacity>
        )}

        {/* Date field */}
        {isDatePicker && (
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View className="h-12 px-4 flex-row items-center">
              <Text className="flex-1 font-psemibold text-base">
                {value || placeholder}
              </Text>
              <Ionicons name="calendar" size={30} color="black" />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}

      {/* Error message */}
      {error && <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>}
    </View>
  );
};

export default FormField;
