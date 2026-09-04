export type PieceType = 'tiger' | 'goat' | null;

export type BaghBoard = PieceType[][];

export interface Position {
  row: number;
  col: number;
}

export interface BaghMove {
  from?: Position; // undefined when placing a goat in Phase 1
  to: Position;
  captured?: Position;
}

export type BaghPhase = 'placing' | 'moving';

export interface BaghGameState {
  board: BaghBoard;
  turn: 'tiger' | 'goat';
  phase: BaghPhase;
  goatsPlaced: number;
  goatsCaptured: number;
  winner: 'tiger' | 'goat' | null;
  lastLog: string;
}

export type BaghTheme = 'himalayan' | 'brass' | 'forest';
