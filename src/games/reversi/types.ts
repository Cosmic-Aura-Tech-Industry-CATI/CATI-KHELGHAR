export type DiskColor = 'black' | 'white';

export type ReversiCell = DiskColor | null;

export type ReversiBoard = ReversiCell[][];

export interface ReversiPosition {
  row: number;
  col: number;
}

export interface ReversiMove {
  row: number;
  col: number;
  flipped: ReversiPosition[];
}

export interface ReversiGameState {
  board: ReversiBoard;
  turn: DiskColor;
  scores: {
    black: number;
    white: number;
  };
  validMoves: ReversiMove[];
  lastMove: ReversiPosition | null;
  recentlyFlipped: ReversiPosition[];
  isGameOver: boolean;
  winner: DiskColor | 'draw' | null;
}

export type ReversiTheme = 'green' | 'midnight' | 'marble';
