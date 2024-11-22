import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { useColorScheme } from 'nativewind';
import { DarkTheme, DefaultTheme } from './lightDarkThemes';

// Method to change text color based on the system theme
export const Text = ({ children, style, ...props }: TextProps) => {
  const { colorScheme } = useColorScheme();  
  const textColor = colorScheme === 'dark' ? DarkTheme.colors.text : DefaultTheme.colors.text;

  return (
    <RNText {...props} style={[{ color: textColor }, style]}>
      {children}
    </RNText>
  );
};
