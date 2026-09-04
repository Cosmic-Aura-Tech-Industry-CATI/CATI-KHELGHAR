export type CellVal = 'S' | 'O' | null;

export interface SOSLine {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
  color: string;
}

export interface SOSGameState {
  grid: CellVal[][];
  size: number;
  turn: 0 | 1;
  scores: [number, number];
  selectedLetter: 'S' | 'O';
  lines: SOSLine[];
  isGameOver: boolean;
  winner: 0 | 1 | 'draw' | null;
}

export type SOSTheme = 'notebook' | 'chalkboard' | 'neon';
