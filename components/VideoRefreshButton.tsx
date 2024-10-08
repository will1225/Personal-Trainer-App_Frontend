import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type RefreshIconProps = {
  onRefresh: () => void
  style?: any
  color?: string
};

const VideoRefreshButton: React.FC<RefreshIconProps> = ({ onRefresh, style = {paddingBottom: 5}, color = "white" }) => {
  return (
    <View style={style}>
      <TouchableOpacity onPress={onRefresh} >
      <FontAwesome 
        name="refresh" 
        size={20} 
        color={color} 
      />
      </TouchableOpacity>
    </View>
  );
};

export default VideoRefreshButton;