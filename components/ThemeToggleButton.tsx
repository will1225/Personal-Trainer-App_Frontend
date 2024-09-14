// ThemeToggleButton.tsx
import React from 'react';
import { Switch, View, Text, StyleSheet } from 'react-native';

interface ThemeToggleButtonProps {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ isDarkTheme, toggleTheme }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: isDarkTheme ? '#d0d0c0' : '#242c40' }]}>
        {isDarkTheme ? 'Dark Mode' : 'Light Mode'}
      </Text>
      <Switch
        value={isDarkTheme}
        onValueChange={toggleTheme}
        thumbColor={isDarkTheme ? '#fff' : '#000'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    marginRight: 10,
  },
});

export default ThemeToggleButton;
