export interface DotsPlayer {
  id: number;
  name: string;
  color: string;
  avatar: string;
  score: number;
  isBot?: boolean;
}

export interface BoxData {
  r: number;
  c: number;
  ownerId: number | null;
}

export interface DotsGameState {
  gridSize: number; // e.g. 3 (3x3 boxes = 4x4 dots)
  players: DotsPlayer[];
  currentTurnIndex: number;
  // Key format: 'h-r-c' for horizontal lines, 'v-r-c' for vertical lines
  claimedLines: Record<string, number>; // key -> playerId
  claimedBoxes: Record<string, number>; // 'r-c' -> playerId
  isGameOver: boolean;
  winner: DotsPlayer | null;
  isDraw: boolean;
  activityLog: string[];
}
