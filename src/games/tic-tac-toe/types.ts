export type CellValue = 'X' | 'O' | null;

export type TTTMatchMode = 'unlimited' | 'bo3';

export interface TTTPlayer {
  id: number;
  name: string;
  symbol: 'X' | 'O';
  score: number;
  isBot?: boolean;
}

export interface TTTWinResult {
  winner: 'X' | 'O' | 'Draw';
  line: [number, number, number];
}

export interface TTTGameState {
  board: CellValue[];
  players: [TTTPlayer, TTTPlayer];
  turn: 'X' | 'O';
  isGameOver: boolean;
  winner: 'X' | 'O' | 'Draw' | null;
  winResult: TTTWinResult | null;
  mode: TTTMatchMode;
  matchWinner: TTTPlayer | null;
}
