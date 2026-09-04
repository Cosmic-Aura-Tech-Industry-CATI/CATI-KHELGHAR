import { SOSGameState, CellVal, SOSLine } from './types';

export function createInitialSOSState(size = 6): SOSGameState {
  return {
    grid: Array(size).fill(null).map(() => Array(size).fill(null)),
    size,
    turn: 0,
    scores: [0, 0],
    selectedLetter: 'S',
    lines: [],
    isGameOver: false,
    winner: null,
  };
}

const DIRS = [
  [0, 1],   // horizontal
  [1, 0],   // vertical
  [1, 1],   // diagonal \
  [1, -1],  // diagonal /
];

export function checkSOSFormed(grid: CellVal[][], r: number, c: number, letter: 'S' | 'O', color: string): SOSLine[] {
  const size = grid.length;
  const formed: SOSLine[] = [];

  const get = (row: number, col: number): CellVal => {
    if (row < 0 || row >= size || col < 0 || col >= size) return null;
    return grid[row][col];
  };

  if (letter === 'O') {
    // Check if 'O' is in the middle of S-O-S
    for (const [dr, dc] of DIRS) {
      if (get(r - dr, c - dc) === 'S' && get(r + dr, c + dc) === 'S') {
        formed.push({ r1: r - dr, c1: c - dc, r2: r + dr, c2: c + dc, color });
      }
    }
  } else if (letter === 'S') {
    // Check if 'S' is an end of S-O-S
    for (const [dr, dc] of DIRS) {
      // S - O - S forward
      if (get(r + dr, c + dc) === 'O' && get(r + 2 * dr, c + 2 * dc) === 'S') {
        formed.push({ r1: r, c1: c, r2: r + 2 * dr, c2: c + 2 * dc, color });
      }
      // S - O - S backward
      if (get(r - dr, c - dc) === 'O' && get(r - 2 * dr, c - 2 * dc) === 'S') {
        formed.push({ r1: r, c1: c, r2: r - 2 * dr, c2: c - 2 * dc, color });
      }
    }
  }

  return formed;
}

export function applySOSMove(state: SOSGameState, r: number, c: number): SOSGameState {
  if (state.grid[r][c] !== null || state.isGameOver) return state;

  const nextGrid = state.grid.map((row) => [...row]);
  const letter = state.selectedLetter;
  nextGrid[r][c] = letter;

  const color = state.turn === 0 ? '#38bdf8' : '#f43f5e';
  const newLines = checkSOSFormed(nextGrid, r, c, letter, color);

  const nextScores: [number, number] = [...state.scores];
  let extraTurn = false;

  if (newLines.length > 0) {
    nextScores[state.turn] += newLines.length;
    extraTurn = true;
  }

  const isFull = nextGrid.every((row) => row.every((cell) => cell !== null));
  let isGameOver = false;
  let winner: 0 | 1 | 'draw' | null = null;

  if (isFull) {
    isGameOver = true;
    if (nextScores[0] > nextScores[1]) winner = 0;
    else if (nextScores[1] > nextScores[0]) winner = 1;
    else winner = 'draw';
  }

  const nextTurn = extraTurn ? state.turn : state.turn === 0 ? 1 : 0;

  return {
    ...state,
    grid: nextGrid,
    turn: nextTurn,
    scores: nextScores,
    lines: [...state.lines, ...newLines],
    isGameOver,
    winner,
  };
}
