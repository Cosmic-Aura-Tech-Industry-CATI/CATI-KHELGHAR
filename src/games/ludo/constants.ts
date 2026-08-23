import { LudoRules, PlayerColor } from './types';

// Standard 52-cell main track [row, col] on 15x15 board
export const MAIN_TRACK: [number, number][] = [
  [6, 1],  // 0  Red Start
  [6, 2],  // 1
  [6, 3],  // 2
  [6, 4],  // 3
  [6, 5],  // 4
  [5, 6],  // 5
  [4, 6],  // 6
  [3, 6],  // 7
  [2, 6],  // 8  Safe ★
  [1, 6],  // 9
  [0, 6],  // 10
  [0, 7],  // 11
  [0, 8],  // 12
  [1, 8],  // 13 Green Start
  [2, 8],  // 14
  [3, 8],  // 15
  [4, 8],  // 16
  [5, 8],  // 17
  [6, 9],  // 18
  [6, 10], // 19
  [6, 11], // 20
  [6, 12], // 21 Safe ★
  [6, 13], // 22
  [6, 14], // 23
  [7, 14], // 24
  [8, 14], // 25
  [8, 13], // 26 Yellow Start
  [8, 12], // 27
  [8, 11], // 28
  [8, 10], // 29
  [8, 9],  // 30
  [9, 8],  // 31
  [10, 8], // 32
  [11, 8], // 33
  [12, 8], // 34 Safe ★
  [13, 8], // 35
  [14, 8], // 36
  [14, 7], // 37
  [14, 6], // 38
  [13, 6], // 39 Blue Start
  [12, 6], // 40
  [11, 6], // 41
  [10, 6], // 42
  [9, 6],  // 43
  [8, 5],  // 44
  [8, 4],  // 45
  [8, 3],  // 46
  [8, 2],  // 47 Safe ★
  [8, 1],  // 48
  [8, 0],  // 49
  [7, 0],  // 50
  [6, 0],  // 51
];

// Safe track indices (start cells + star cells)
export const SAFE_TRACK_INDICES: number[] = [0, 8, 13, 21, 26, 34, 39, 47];

// Home lanes: 5 cells each (steps 52-56), [row, col]
export const HOME_LANES: Record<PlayerColor, [number, number][]> = {
  red:    [[7,1],[7,2],[7,3],[7,4],[7,5]],
  green:  [[1,7],[2,7],[3,7],[4,7],[5,7]],
  yellow: [[7,13],[7,12],[7,11],[7,10],[7,9]],
  blue:   [[13,7],[12,7],[11,7],[10,7],[9,7]],
};

// Center cell (step 57 = finished)
export const CENTER_CELL: [number, number] = [7, 7];

// Yard (home base) positions for each player's 4 pawns in yard
export const YARD_POSITIONS: Record<PlayerColor, [number, number][]> = {
  red:    [[2,2],[2,3],[3,2],[3,3]],
  green:  [[2,11],[2,12],[3,11],[3,12]],
  yellow: [[11,11],[11,12],[12,11],[12,12]],
  blue:   [[11,2],[11,3],[12,2],[12,3]],
};

// Player start track indices on MAIN_TRACK
export const START_TRACK_INDICES: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

// Player color config
export const COLOR_CONFIG: Record<PlayerColor, { hex: string; light: string; name: string }> = {
  red:    { hex: '#dc2626', light: '#fecaca', name: 'Red' },
  green:  { hex: '#16a34a', light: '#bbf7d0', name: 'Green' },
  yellow: { hex: '#ca8a04', light: '#fef08a', name: 'Yellow' },
  blue:   { hex: '#0284c7', light: '#bae6fd', name: 'Blue' },
};

// Color sequence for player count
export const COLOR_SEQUENCE: Record<number, PlayerColor[]> = {
  2: ['red', 'green'],
  3: ['red', 'green', 'yellow'],
  4: ['red', 'green', 'yellow', 'blue'],
};

// Centralized game rules
export const RULES: LudoRules = {
  extraTurnOnSix: true,
  extraTurnOnCapture: true,
  requireSixToExitHome: true,
  exactRollToFinish: true,
  maxConsecutiveSixes: 3,
  showPassAndPlayScreen: true,
};

export const TOTAL_STEPS = 57; // step at which pawn is finished
export const HOME_LANE_START = 52; // steps 52-56 are home lane
export const HOME_LANE_LENGTH = 5;
