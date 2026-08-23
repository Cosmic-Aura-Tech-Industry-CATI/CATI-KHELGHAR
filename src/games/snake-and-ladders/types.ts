export interface SnakeDef {
  id: string;
  from: number; // Head (higher tile)
  to: number;   // Tail (lower tile)
  color: string;
}

export interface LadderDef {
  id: string;
  from: number; // Base (lower tile)
  to: number;   // Top (higher tile)
  color: string;
}

export interface BoardCellData {
  number: number;
  row: number; // 0 to 9 from top
  col: number; // 0 to 9 from left
  isSnakeHead: boolean;
  isSnakeTail: boolean;
  isLadderBottom: boolean;
  isLadderTop: boolean;
  snakeTo?: number;
  ladderTo?: number;
  isWinningCell: boolean;
  isAlternate: boolean;
}

export interface SnakePlayer {
  id: number;
  name: string;
  color: string;
  avatar: string;
  position: number; // 0 = start (outside), 1..100
  hasWon: boolean;
  rank?: number;
  isBot?: boolean;
}

export interface SnakeGameState {
  players: SnakePlayer[];
  currentTurnIndex: number;
  diceValue: number;
  isRolling: boolean;
  isMoving: boolean;
  winner: SnakePlayer | null;
  activityLog: string[];
}
