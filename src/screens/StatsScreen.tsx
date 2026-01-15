import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../utils/themeContext';
import { StatsType } from '../types';
import { loadStats } from '../utils/statsUtils';
import SettingsModal from '../components/SettingsModal';

const StatsScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useContext(ThemeContext);
  const [stats, setStats] = useState<StatsType>({
    gamesPlayed: 0,
    bestTime: 0,
    lastGameTime: 0,
    player1Wins: 0,
    player2Wins: 0,
    botWins: 0,
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadStats().then(setStats);
  }, []);

  return (
    <ImageBackground source={require('../../assets/images/summer-bg.jpg')} style={styles.background}>
      <View style={[styles.darkOverlay, isDarkMode && styles.darkOverlayOn]} />

      <View style={styles.topRight}>
        <Button title="⚙" onPress={() => setShowSettings(true)} color={isDarkMode ? '#ddd' : undefined} />
      </View>

      <View style={styles.centerContent}>
        <Text style={[styles.title, isDarkMode ? styles.textLight : styles.textDark]}>Game Stats</Text>
        <View style={styles.statBox}>
          <Text style={[styles.statText, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            🧠 Games Played: {stats.gamesPlayed}
          </Text>
          <Text style={[styles.statText, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            ⏱️ Best Time: {stats.bestTime}s
          </Text>
          <Text style={[styles.statText, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            ⌛ Last Game Time: {stats.lastGameTime}s
          </Text>
          <Text style={[styles.statText, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            🤝 Player 1 Wins: {stats.player1Wins}
          </Text>
          <Text style={[styles.statText, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            🤝 Player 2 Wins: {stats.player2Wins}
          </Text>
          <Text style={[styles.statText, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            🤖 Bot Wins: {stats.botWins}
          </Text>
        </View>
        <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate('ModeSelect' as never)}>
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>
      </View>

      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },
  darkOverlayOn: { backgroundColor: 'rgba(0,0,0,0.5)' },
  topRight: { position: 'absolute', top: 40, right: 20, zIndex: 10 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 25 },
  statBox: { alignItems: 'center', marginBottom: 30 },
  statText: { fontSize: 18, marginVertical: 6 },
  playButton: { backgroundColor: '#007bff', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  playButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  textLight: { color: '#fff' },
  textDark: { color: '#000' },
  textLightSecondary: { color: '#ccc' },
  textDarkSecondary: { color: '#333' },
});

export default StatsScreen;