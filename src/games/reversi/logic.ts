import { ReversiBoard, ReversiPosition, ReversiMove, ReversiGameState, DiskColor } from './types';

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export function createInitialReversiBoard(): ReversiBoard {
  const board: ReversiBoard = Array(8).fill(null).map(() => Array(8).fill(null));
  // Standard 4-center setup
  board[3][3] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
  board[4][4] = 'white';
  return board;
}

function isInside(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

export function getFlippedDisksForMove(board: ReversiBoard, pos: ReversiPosition, color: DiskColor): ReversiPosition[] {
  if (board[pos.row][pos.col] !== null) return [];

  const oppColor: DiskColor = color === 'black' ? 'white' : 'black';
  const allFlipped: ReversiPosition[] = [];

  for (const [dr, dc] of DIRECTIONS) {
    const directionFlipped: ReversiPosition[] = [];
    let step = 1;

    while (isInside(pos.row + dr * step, pos.col + dc * step)) {
      const nr = pos.row + dr * step;
      const nc = pos.col + dc * step;
      const cell = board[nr][nc];

      if (cell === oppColor) {
        directionFlipped.push({ row: nr, col: nc });
      } else if (cell === color) {
        if (directionFlipped.length > 0) {
          allFlipped.push(...directionFlipped);
        }
        break;
      } else {
        break;
      }
      step++;
    }
  }

  return allFlipped;
}

export function getValidMoves(board: ReversiBoard, color: DiskColor): ReversiMove[] {
  const moves: ReversiMove[] = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === null) {
        const flipped = getFlippedDisksForMove(board, { row: r, col: c }, color);
        if (flipped.length > 0) {
          moves.push({ row: r, col: c, flipped });
        }
      }
    }
  }

  return moves;
}

export function calculateScores(board: ReversiBoard): { black: number; white: number } {
  let black = 0;
  let white = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === 'black') black++;
      else if (board[r][c] === 'white') white++;
    }
  }
  return { black, white };
}

export function createInitialReversiState(): ReversiGameState {
  const board = createInitialReversiBoard();
  const validMoves = getValidMoves(board, 'black');
  return {
    board,
    turn: 'black',
    scores: calculateScores(board),
    validMoves,
    lastMove: null,
    recentlyFlipped: [],
    isGameOver: false,
    winner: null,
  };
}

export function applyReversiMove(state: ReversiGameState, move: ReversiMove): ReversiGameState {
  const nextBoard = state.board.map((row) => [...row]);
  const color = state.turn;
  const oppColor: DiskColor = color === 'black' ? 'white' : 'black';

  nextBoard[move.row][move.col] = color;
  for (const pos of move.flipped) {
    nextBoard[pos.row][pos.col] = color;
  }

  const scores = calculateScores(nextBoard);

  // Check if opponent can move
  let nextTurn: DiskColor = oppColor;
  let nextValidMoves = getValidMoves(nextBoard, nextTurn);
  let isGameOver = false;
  let winner: DiskColor | 'draw' | null = null;

  // If opponent has no moves, check if current player can move (pass turn)
  if (nextValidMoves.length === 0) {
    nextTurn = color;
    nextValidMoves = getValidMoves(nextBoard, nextTurn);

    // If neither can move, game over
    if (nextValidMoves.length === 0) {
      isGameOver = true;
      if (scores.black > scores.white) winner = 'black';
      else if (scores.white > scores.black) winner = 'white';
      else winner = 'draw';
    }
  }

  return {
    board: nextBoard,
    turn: nextTurn,
    scores,
    validMoves: nextValidMoves,
    lastMove: { row: move.row, col: move.col },
    recentlyFlipped: move.flipped,
    isGameOver,
    winner,
  };
}

export function getBestReversiBotMove(state: ReversiGameState): ReversiMove | null {
  if (state.validMoves.length === 0) return null;

  // Positional weights: corners are extremely valuable, edges good, squares adjacent to corners dangerous
  const WEIGHTS = [
    [100, -20,  10,   5,   5,  10, -20, 100],
    [-20, -50,  -2,  -2,  -2,  -2, -50, -20],
    [ 10,  -2,  -1,  -1,  -1,  -1,  -2,  10],
    [  5,  -2,  -1,   0,   0,  -1,  -2,   5],
    [  5,  -2,  -1,   0,   0,  -1,  -2,   5],
    [ 10,  -2,  -1,  -1,  -1,  -1,  -2,  10],
    [-20, -50,  -2,  -2,  -2,  -2, -50, -20],
    [100, -20,  10,   5,   5,  10, -20, 100],
  ];

  const scoredMoves = state.validMoves.map((m) => {
    let score = WEIGHTS[m.row][m.col];
    // Add number of flipped disks
    score += m.flipped.length * 2;
    return { move: m, score };
  });

  scoredMoves.sort((a, b) => b.score - a.score);
  return scoredMoves[0].move;
}
