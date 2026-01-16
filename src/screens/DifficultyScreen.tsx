// src/screens/DifficultyScreen.tsx

import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Difficulty } from '../types';
import { ThemeContext } from '../utils/themeContext';
import SettingsModal from '../components/SettingsModal';

type RouteProps = RouteProp<RootStackParamList, 'Difficulty'>;
type NavProps = NativeStackNavigationProp<RootStackParamList, 'Difficulty'>;

const DifficultyScreen = () => {
  const { params } = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const { isDarkMode } = useContext(ThemeContext);

  const [showSettings, setShowSettings] = useState(false);

  const selectDifficulty = (difficulty: Difficulty) => {
    navigation.navigate('Game', {
      mode: params.mode,
      difficulty,
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/images/summer-bg.jpg')}
      style={styles.background}
    >

      <View style={styles.topRow}>
       <Pressable onPress={() => navigation.goBack()}>
         <Text style={styles.topIcon}>← Back</Text>
        </Pressable>

         <Pressable onPress={() => setShowSettings(true)}>
           <Text style={styles.topIcon}>⚙</Text>
         </Pressable>
      </View>

      <View style={[styles.overlay, isDarkMode && styles.dark]}>
        <Text style={[styles.title, isDarkMode && styles.textLight]}>
          Select Difficulty
        </Text>

        <Pressable style={styles.button} onPress={() => selectDifficulty('EASY')}>
          <Text style={styles.buttonText}>Easy</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => selectDifficulty('MEDIUM')}>
          <Text style={styles.buttonText}>Medium</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => selectDifficulty('HARD')}>
          <Text style={styles.buttonText}>Hard</Text>
        </Pressable>
      </View>

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dark: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  textLight: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  topRow: {
  position: 'absolute',
  top: 40,
  left: 20,
  right: 20,
  flexDirection: 'row',
  justifyContent: 'space-between',
  zIndex: 10,
},
topIcon: {
  color: '#fff',
  fontSize: 18,
},

});

export default DifficultyScreen;