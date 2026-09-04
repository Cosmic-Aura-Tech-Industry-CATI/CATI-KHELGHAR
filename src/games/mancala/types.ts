export type PlayerIndex = 0 | 1;

export interface MancalaGameState {
  // Pits 0..5 (Player 1), Pit 6 (Player 1 Kalah Store)
  // Pits 7..12 (Player 2), Pit 13 (Player 2 Kalah Store)
  pits: number[];
  turn: PlayerIndex;
  lastSownPit: number | null;
  extraTurn: boolean;
  isGameOver: boolean;
  winner: PlayerIndex | 'draw' | null;
  lastLog: string;
}

export type MancalaTheme = 'teak' | 'zen' | 'gold';
