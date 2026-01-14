// app/utils/statsUtils.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatsType } from '../types';

const STORAGE_KEY = 'stats';

export const loadStats = async (): Promise<StatsType> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          gamesPlayed: 0,
          bestTime: 0,
          lastGameTime: 0,
          player1Wins: 0,
          player2Wins: 0,
          botWins: 0,
        };
  } catch {
    return {
      gamesPlayed: 0,
      bestTime: 0,
      lastGameTime: 0,
      player1Wins: 0,
      player2Wins: 0,
      botWins: 0,
    };
  }
};

export const saveStats = async (stats: StatsType) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('❌ Failed to save stats', e);
  }
};