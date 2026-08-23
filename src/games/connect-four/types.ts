export type ConnectFourCell = 'R' | 'Y' | null; // R = Red, Y = Yellow

export interface ConnectFourPlayer {
  id: number;
  name: string;
  symbol: 'R' | 'Y';
  color: string;
  score: number;
  isBot?: boolean;
}

export interface ConnectFourWinResult {
  winner: 'R' | 'Y' | 'Draw';
  winningCoords: [number, number][]; // [row, col]
}

export interface ConnectFourState {
  board: ConnectFourCell[][]; // 6 rows x 7 cols
  players: [ConnectFourPlayer, ConnectFourPlayer];
  currentTurn: 'R' | 'Y';
  isGameOver: boolean;
  winResult: ConnectFourWinResult | null;
  activityLog: string[];
}
