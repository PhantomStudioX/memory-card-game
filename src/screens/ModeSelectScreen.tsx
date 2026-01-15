// src/screens/ModeSelectScreen.tsx

import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../utils/themeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import SettingsModal from '../components/SettingsModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ModeSelect'>;

const ModeSelectScreen = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigation = useNavigation<NavigationProp>();
  const [settingsVisible, setSettingsVisible] = useState(false);

  const overlayStyle = useMemo(
    () => ({
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.6)' : 'transparent',
    }),
    [isDarkMode]
  );

  return (
    <ImageBackground
      source={require('../../assets/images/summer-bg.jpg')}
      style={styles.background}
    >
      <View style={[styles.overlay, overlayStyle]}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, { color: '#fff' }]}>← Back</Text>
        </Pressable>

        <Pressable style={styles.settingsButton} onPress={() => setSettingsVisible(true)}>
          <Text style={[styles.settingsIcon, { color: '#fff' }]}>⚙</Text>
        </Pressable>

        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
          Select Game Mode
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Difficulty', { mode: 'PVP' })}
        >
          <Text style={styles.buttonText}>Player vs Player</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Difficulty', { mode: 'BOT' })}
        >
          <Text style={styles.buttonText}>Player vs Bot</Text>
        </Pressable>

        <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backText: {
    fontSize: 18,
  },
  settingsButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  settingsIcon: {
    fontSize: 22,
  },
});

export default ModeSelectScreen;