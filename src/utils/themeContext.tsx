// utils/themeContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext<{
  isDarkMode: boolean;
  toggleTheme: () => void;
  isSoundOn: boolean;
  toggleSound: () => void;
}>({
  isDarkMode: false,
  toggleTheme: () => {},
  isSoundOn: true,
  toggleSound: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const storedTheme = await AsyncStorage.getItem('theme');
      const storedSound = await AsyncStorage.getItem('sound');
      setIsDarkMode(storedTheme === 'dark');
      setIsSoundOn(storedSound !== 'off');
    };
    loadSettings();
  }, []);

  const toggleTheme = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    await AsyncStorage.setItem('theme', newValue ? 'dark' : 'light');
  };

  const toggleSound = async () => {
    const newValue = !isSoundOn;
    setIsSoundOn(newValue);
    await AsyncStorage.setItem('sound', newValue ? 'on' : 'off');
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, isSoundOn, toggleSound }}>
      {children}
    </ThemeContext.Provider>
  );
};