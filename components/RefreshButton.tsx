import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RefreshButtonProps {
  onRefresh: () => void; // Set onRefresh to any
  style?: any
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh, style ={ alignItems: 'center', marginVertical: 1} }) => {
  return (
    <View style={style}>
      <TouchableOpacity onPress={onRefresh} style={{ paddingBottom: 5 }}>
        <Ionicons name="refresh" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default RefreshButton;