import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ThemeProvider } from './src/utils/themeContext';
import ModeSelectScreen from './src/screens/ModeSelectScreen';
import DifficultyScreen from './src/screens/DifficultyScreen';
import GameScreen from './src/screens/GameScreen';
import StatsScreen from './src/screens/StatsScreen';
import { RootStackParamList } from './src/types';

import AdsterraBanner from './src/components/AdsterraBanner';   // ⭐ ADDED THIS LINE

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>

            {/* ✅ Correct screen names */}
            <Stack.Screen name="Stats" component={StatsScreen} />
            <Stack.Screen name="ModeSelect" component={ModeSelectScreen} />
            <Stack.Screen name="Difficulty" component={DifficultyScreen} />
            <Stack.Screen name="Game" component={GameScreen} />

          </Stack.Navigator>
        </NavigationContainer>

        {/* ⭐ ADSTERRE AD — EXACT INSERTION POINT (DO NOT MOVE) */}
        <AdsterraBanner />

      </SafeAreaView>
    </ThemeProvider>
  );
}