import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from "@/components/Text"
import {
  View,
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
  editable?: boolean;
  containerStyles?: string;
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
  editable = true,
  containerStyles,
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

      // Change validation based on title of date input
      if (title === "Start Date" && pickedDate.getTime() < today.getTime()) {
        setError("Selected date must be today or a future date.");
      } else if (title === "Date of Birth" && pickedDate.getTime() > today.getTime()) {
        setError("Selected date cannot be in the future.");
      } else {
        setError(null);
        setDate(selectedDate);
        onDateChange?.(selectedDate);
        const formattedDate = selectedDate.toISOString().split("T")[0]; 
        handleChangeText(formattedDate);
      }
    }
  };

  return (
    <View className={`mt-7 ${containerStyles}`}>
      <Text className="text-base font-pmedium">{title}</Text>

      {/* Standard field */}
      <View className={`w-full h-12 px-4 rounded-2xl border-2 ${
          editable ? 'border-black-200' : 'border-gray-300'
        } flex flex-row items-center`}
        style={{
          backgroundColor: editable ? 'white' : 'lightgray',
        }}>
        <TextInput
          className="flex-1 font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={editable ? handleChangeText : undefined}
          secureTextEntry={title === "Password" || title === "Confirm Password" && !showPassword}
          editable={editable && !isDatePicker} // Disable keyboard input
          style={{ color: editable ? "black" : "#7B7B8B" }}
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
