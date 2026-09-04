export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export interface Token {
  id: string;
  playerId: string;
  color: PlayerColor;
  stepIndex: number; // -1: home yard, 0..24 path, 25: center finished
}

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  tokens: Token[];
  hasCaptured: boolean;
  isBot: boolean;
}

export interface AshtaMove {
  tokenId: string;
  fromStep: number;
  toStep: number;
  isCapture: boolean;
  capturedTokenId?: string;
  isFinished: boolean;
}

export interface AshtaGameState {
  players: Player[];
  currentPlayerIndex: number;
  shells: [number, number, number, number]; // 0 (flat) or 1 (open)
  rollValue: number | null; // 1, 2, 3, 4, or 8
  isRolling: boolean;
  hasRolled: boolean;
  consecutiveExtraRolls: number;
  validMoves: AshtaMove[];
  winners: string[]; // Player IDs in finish order
  lastLog: string;
}

export type AshtaTheme = 'terracotta' | 'haveli' | 'sandalwood';
