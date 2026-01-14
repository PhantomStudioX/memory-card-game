// app/types.ts
export type RootStackParamList = {
  Stats: undefined;
  ModeSelect: undefined;
  Game: { mode: 'PVP' | 'BOT' };
  Settings: undefined; // If you're using the settings popup/modal
};

export type StatsType = {
  gamesPlayed: number;
  bestTime: number;
  lastGameTime: number;
  player1Wins: number;
  player2Wins: number;
  botWins: number;
};