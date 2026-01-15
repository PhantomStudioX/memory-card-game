// src/screens/GameScreen.tsx
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Card from '../components/Card';
import ConfettiAnimation from '../components/ConfettiAnimation';
import SettingsModal from '../components/SettingsModal';
import { generateShuffledCards, CardType } from '../utils/cardUtils';
import { loadSounds, playFlipSound, playMatchSound } from '../utils/playSound';
import { loadStats, saveStats } from '../utils/statsUtils';
import { ThemeContext } from '../utils/themeContext';
import { RootStackParamList, StatsType } from '../types';

type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

const GameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<GameScreenRouteProp>();

  const { mode, difficulty } = route.params; // ✅ FIX
  const { isDarkMode, isSoundOn } = useContext(ThemeContext);

  const difficultyCardMap = {
    EASY: 12,
    MEDIUM: 20,
    HARD: 30,
  };

  const totalCards = difficultyCardMap[difficulty];
  const numColumns = difficulty === 'HARD' ? 6 : 4;

  const [cards, setCards] = useState<CardType[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [celebrate, setCelebrate] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [turn, setTurn] = useState<'Player 1' | 'Player 2' | 'Bot'>('Player 1');
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState<StatsType>({
    gamesPlayed: 0,
    bestTime: 0,
    lastGameTime: 0,
    player1Wins: 0,
    player2Wins: 0,
    botWins: 0,
  });

  useEffect(() => {
    setCards(generateShuffledCards(totalCards));
    loadSounds();
    loadStats().then(setStats);
    setStartTime(Date.now());
    setTurn('Player 1');
    setMatchedCards([]);
    setSelectedCards([]);
    setCelebrate(false);
    setGameOver(false);
  }, [totalCards]);

  // Handle card matching logic
  useEffect(() => {
    if (selectedCards.length !== 2) return;

    const [i1, i2] = selectedCards;
    const first = cards[i1];
    const second = cards[i2];
    if (!first || !second) return;

    const isMatch = first.value === second.value;
    if (isMatch) {
      setMatchedCards(prev => [...prev, i1, i2]);
      if (isSoundOn) playMatchSound();
    }

    setTimeout(() => {
      setSelectedCards([]);

      if (mode === 'BOT') {
        if (turn === 'Bot') {
          if (isMatch) {
            setTurn('Bot'); // Bot gets another turn
          } else {
            setTurn('Player 1'); // Switch to player
          }
        } else {
          setTurn(isMatch ? turn : 'Bot');
        }
      } else {
        setTurn(prev => (prev === 'Player 1' ? 'Player 2' : 'Player 1'));
      }
    }, 800);
  }, [selectedCards]);

  // Bot move logic
  useEffect(() => {
    if (
      mode === 'BOT' &&
      turn === 'Bot' &&
      !isBotThinking &&
      selectedCards.length === 0 &&
      !gameOver
    ) {
      setIsBotThinking(true);
      setTimeout(() => {
        const available = cards
          .map((_, i) => i)
          .filter(i => !matchedCards.includes(i));
        if (available.length < 2) {
          setIsBotThinking(false);
          return;
        }
        const picks = available.sort(() => 0.5 - Math.random()).slice(0, 2);
        setSelectedCards(picks);
        if (isSoundOn) playFlipSound();
        setIsBotThinking(false);
      }, 800);
    }
  }, [turn, isBotThinking, selectedCards, matchedCards, mode, gameOver, cards, isSoundOn]);

  // Check for game over
  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      setCelebrate(true);
      setGameOver(true);

      const updated: StatsType = {
        gamesPlayed: stats.gamesPlayed + 1,
        bestTime: stats.bestTime === 0 ? duration : Math.min(stats.bestTime, duration),
        lastGameTime: duration,
        player1Wins:
          mode === 'PVP' && turn === 'Player 1' ? stats.player1Wins + 1 : stats.player1Wins,
        player2Wins:
          mode === 'PVP' && turn === 'Player 2' ? stats.player2Wins + 1 : stats.player2Wins,
        botWins: mode === 'BOT' ? stats.botWins + 1 : stats.botWins,
      };

      saveStats(updated).then(() => setStats(updated));
    }
  }, [matchedCards]);

  const handleCardPress = (index: number) => {
    if (
      selectedCards.includes(index) ||
      matchedCards.includes(index) ||
      selectedCards.length >= 2 ||
      (mode === 'BOT' && turn === 'Bot') ||
      gameOver
    )
      return;

    setSelectedCards(prev => [...prev, index]);
    if (isSoundOn) playFlipSound();
  };

  const cardSpacing = 8;
  const cardWidth = (Dimensions.get('window').width - cardSpacing * (numColumns + 1)) / numColumns;
  const cardHeight = cardWidth * 1.15;

  return (
    <ImageBackground
      source={require('../../assets/images/summer-bg.jpg')}
      style={styles.background}
    >
      <View style={[styles.darkOverlay, isDarkMode && styles.darkOverlayOn]} />

      <View style={styles.topRow}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ color: '#fff', fontSize: 18 }}>← Back</Text>
        </Pressable>

        <Pressable onPress={() => setShowSettings(true)}>
           <Text style={{ color: '#fff', fontSize: 22 }}>⚙</Text>
       </Pressable>
      </View>

      <View style={styles.container}>
        <Text style={[styles.title, isDarkMode ? styles.textLight : styles.textDark]}>
          Memory Card Game
        </Text>

        <Text style={[styles.turnText, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
          {mode === 'BOT'
            ? turn === 'Bot'
              ? '🤖 Bot is thinking...'
              : '👤 Your Turn'
            : `🎮 ${turn}'s Turn`}
        </Text>

        <View style={styles.grid}>
          {cards.map((card, i) =>
            card ? (
              <Card
                key={i}
                value={card.value}
                isFlipped={selectedCards.includes(i) || matchedCards.includes(i)}
                shouldCelebrate={celebrate && matchedCards.includes(i)}
                onPress={() => handleCardPress(i)}
                width={cardWidth}
                height={cardHeight}
              />
            ) : null,
          )}
        </View>
      </View>

      {gameOver && (
        <View style={styles.gameOverOverlay}>
          <View style={[styles.gameOverContainer, isDarkMode && styles.gameOverContainerDark]}>
            <Text style={[styles.gameOverText, isDarkMode && styles.gameOverTextLight]}>
              🎉 Game Over! Press below to view stats.
            </Text>
            <Pressable
              style={{ paddingVertical: 10, paddingHorizontal: 25, backgroundColor: '#007AFF', borderRadius: 8 }}
              onPress={() => {
               setShowSettings(false);
                navigation.navigate('Stats' as never);
             }}
            >
             <Text style={{ color: '#fff', fontSize: 16 }}>View Stats</Text>
            </Pressable>

            <Pressable
              style={{ paddingVertical: 10, paddingHorizontal: 25, backgroundColor: '#007AFF', borderRadius: 8, marginTop: 10 }}
              onPress={() => {
                setCards(generateShuffledCards(totalCards));
                setMatchedCards([]);
                setSelectedCards([]);
                setCelebrate(false);
                setGameOver(false);
                setTurn('Player 1');
                setStartTime(Date.now());
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>Play Again</Text>
            </Pressable>
          </View>
        </View>
      )}

      {celebrate && <ConfettiAnimation />}
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  darkOverlayOn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  turnText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  textLight: { color: '#fff' },
  textDark: { color: '#000' },
  textLightSecondary: { color: '#ccc' },
  textDarkSecondary: { color: '#333' },

  gameOverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  gameOverContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    maxWidth: 350,
    alignItems: 'center',
  },
  gameOverContainerDark: {
    backgroundColor: '#222',
  },
  gameOverText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  gameOverTextLight: {
    color: '#eee',
  },
});

export default GameScreen;