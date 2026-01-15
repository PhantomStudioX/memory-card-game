// src/types.ts

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type RootStackParamList = {
  Stats: undefined;
  ModeSelect: undefined;
  Difficulty: { mode: 'PVP' | 'BOT' };
  Game: { mode: 'PVP' | 'BOT'; difficulty: Difficulty };
};

export type StatsType = {
  gamesPlayed: number;
  bestTime: number;
  lastGameTime: number;
  player1Wins: number;
  player2Wins: number;
  botWins: number;
};