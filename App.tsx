import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ThemeProvider } from './src/utils/themeContext';
import ModeSelectScreen from './src/screens/ModeSelectScreen';
import DifficultyScreen from './src/screens/DifficultyScreen';
import GameScreen from './src/screens/GameScreen';
import StatsScreen from './src/screens/StatsScreen';
import { RootStackParamList } from './src/types';

import AdsterraBanner from './src/components/AdsterraBanner';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ThemeProvider>

      {/* 🚫 DO NOT PUT AD INSIDE SafeAreaView */}
      <View style={{ flex: 1 }}>

        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>

              <Stack.Screen name="Stats" component={StatsScreen} />
              <Stack.Screen name="ModeSelect" component={ModeSelectScreen} />
              <Stack.Screen name="Difficulty" component={DifficultyScreen} />
              <Stack.Screen name="Game" component={GameScreen} />

            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>

        {/* ⭐ FIXED: Banner stays at the bottom without pushing UI */}
        <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <AdsterraBanner />
        </View>

      </View>

    </ThemeProvider>
  );
}