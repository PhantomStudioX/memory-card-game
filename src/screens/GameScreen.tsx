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

  const { mode, difficulty } = route.params;
  const { isDarkMode, isSoundOn } = useContext(ThemeContext);

  const difficultyCardMap = {
    EASY: 9,
    MEDIUM: 25,
    HARD: 30,
  };

  const totalCards = difficultyCardMap[difficulty];
  const numColumns =
  difficulty === 'EASY' ? 3 : difficulty === 'MEDIUM' ? 5 : 6;

  const [botMemory, setBotMemory] = useState<Record<string, number[]>>({});
  const [cards, setCards] = useState<CardType[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [celebrate, setCelebrate] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [turn, setTurn] = useState<'Player 1' | 'Player 2' | 'Bot'>('Player 1');
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [winner, setWinner] = useState<'PLAYER' | 'BOT' | 'P1' | 'P2' | null>(null);
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
    setBotMemory({});
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

      if (isSoundOn) {
        setTimeout(() => {
          playMatchSound();
        }, 150);
      }
    }

    if (!isMatch && mode === 'BOT') {
      setBotMemory(prev => {
        const updated = { ...prev };

        selectedCards.forEach(i => {
          const value = cards[i]?.value;
           if (!value) return;

           updated[value] = updated[value]
             ? Array.from(new Set([...updated[value], i]))
             : [i];
         });

         return updated;
       });
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

        let picks: number[] | null = null;

        // Try to find a known matching pair
        for (const indices of Object.values(botMemory)) {
          const valid = indices.filter(i => available.includes(i));
          if (valid.length >= 2) {
            picks = valid.slice(0, 2);
            break;
          }
        }
  
        // Fallback to random
        if (!picks) {
          picks = available.sort(() => 0.5 - Math.random()).slice(0, 2);
    }
        setSelectedCards([picks[0]]);
        if (isSoundOn) playFlipSound();

        setTimeout(() => {
          setSelectedCards(prev => [...prev, picks![1]]);
          if (isSoundOn) playFlipSound();
          setIsBotThinking(false);
        }, 700);
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

        let newWinner: typeof winner = null;

        if (mode === 'BOT') {
          newWinner = turn === 'Bot' ? 'BOT' : 'PLAYER';
        } else {
          newWinner = turn === 'Player 1' ? 'P1' : 'P2';
        }

        setWinner(newWinner);

        const updated: StatsType = {
          gamesPlayed: stats.gamesPlayed + 1,
          bestTime: stats.bestTime === 0 ? duration : Math.min(stats.bestTime, duration),
          lastGameTime: duration,
          player1Wins:
            newWinner === 'P1' ? stats.player1Wins + 1 : stats.player1Wins,
          player2Wins:
            newWinner === 'P2' ? stats.player2Wins + 1 : stats.player2Wins,
          botWins:
            newWinner === 'BOT' ? stats.botWins + 1 : stats.botWins,
        };

        saveStats(updated).then(() => setStats(updated));
      }
    }, [matchedCards]);

  const handleCardPress = (index: number) => {
    if (
      selectedCards.includes(index) ||
      matchedCards.includes(index) ||
      selectedCards.length >= 2 ||
      gameOver ||
      (mode === 'BOT' && (turn === 'Bot' || isBotThinking))
    ) {
      return;
    }

    setSelectedCards(prev => [...prev, index]);
    if (isSoundOn) playFlipSound();
  };

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const cardSpacing = 8;

  // width-based sizing
  const baseCardWidth =
    (screenWidth - cardSpacing * (numColumns + 1)) / numColumns;

  // make EASY cards smaller so 3 rows fit
  const sizeMultiplier =
    difficulty === 'EASY' ? 0.85 :
    difficulty === 'MEDIUM' ? 0.9 :
    0.85;

  const cardWidth = baseCardWidth * sizeMultiplier;

  // reduce height ratio so grid fits vertically
  const cardHeight =
    difficulty === 'EASY'
      ? cardWidth * 1.05
      : difficulty === 'MEDIUM'
      ? cardWidth * 1.15
      : cardWidth * 1.2;
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
              {mode === 'BOT'
                ? winner === 'PLAYER'
                  ? '🎉 You Win!'
                  : '😢 You Lost!'
                : '🎉 Game Over!'}
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
                setBotMemory({});
                setMatchedCards([]);
                setSelectedCards([]);
                setCelebrate(false);
                setGameOver(false);
                setTurn('Player 1');
                setStartTime(Date.now());
                setWinner(null);
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
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
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