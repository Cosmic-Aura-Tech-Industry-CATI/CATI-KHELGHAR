export type CellStatus = 'empty' | 'ship' | 'hit' | 'miss';

export interface Ship {
  id: string;
  name: string;
  size: number;
  cells: [number, number][];
  hits: number;
  isSunk: boolean;
}

export interface PlayerArmada {
  grid: CellStatus[][];
  radar: ('unknown' | 'hit' | 'miss')[][];
  ships: Ship[];
}

export type BattlePhase = 'placement-p1' | 'handoff-p2' | 'placement-p2' | 'combat' | 'game-over';

export interface BattleshipGameState {
  p1: PlayerArmada;
  p2: PlayerArmada;
  turn: 0 | 1;
  phase: BattlePhase;
  winner: 0 | 1 | null;
  lastLog: string;
}

export type BattleshipTheme = 'sonar' | 'blueprint' | 'deepsea';
