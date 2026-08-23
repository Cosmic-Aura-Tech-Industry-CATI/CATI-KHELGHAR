export type CarromPieceType = 'white' | 'black' | 'queen' | 'striker';

export interface CarromPiece {
  id: string;
  type: CarromPieceType;
  x: number; // 0 to 100 relative board %
  y: number; // 0 to 100 relative board %
  vx: number;
  vy: number;
  radius: number;
  isPocketed: boolean;
}

export interface CarromPlayer {
  id: number;
  name: string;
  color: string;
  score: number;
  coinsPocketed: number;
  isBot?: boolean;
}

export interface CarromGameState {
  players: CarromPlayer[];
  currentTurnIndex: number;
  pieces: CarromPiece[];
  strikerPos: number; // 20% to 80% along current baseline
  aimAngle: number; // 0 to 360 degrees
  power: number; // 1 to 100
  isStriking: boolean;
  isGameOver: boolean;
  winner: CarromPlayer | null;
  activityLog: string[];
}
