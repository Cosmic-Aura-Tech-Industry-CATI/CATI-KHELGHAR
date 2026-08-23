export type LudoColor = 'red' | 'green' | 'yellow' | 'blue';

export type LudoTheme = 'sakura' | 'voxel' | 'classic';

export interface LudoToken {
  id: number; // 0, 1, 2, 3
  step: number; // -1 = In Yard, 0..50 = On 52-cell Track, 51..55 = In Home Column, 56 = Home!
}

export interface LudoPlayer {
  id: number;
  color: LudoColor;
  name: string;
  colorHex: string;
  lightColorHex: string;
  startTrackIndex: number;
  yardCoords: [number, number][]; // 4 yard circles [r, c]
  tokens: LudoToken[];
  hasWon: boolean;
  rank?: number;
  isBot?: boolean;
}

export interface LudoValidMove {
  tokenId: number;
  fromStep: number;
  toStep: number;
  isSpawn: boolean;
  isCapture: boolean;
  isSafe: boolean;
  isReachingHome: boolean;
}

export interface LudoGameState {
  players: LudoPlayer[];
  currentTurnIndex: number;
  diceValue: number;
  isRolling: boolean;
  hasRolled: boolean;
  consecutiveSixes: number;
  validMoves: LudoValidMove[];
  winnerRankings: LudoPlayer[];
  isGameOver: boolean;
  activityLog: string[];
  theme?: LudoTheme;
}
