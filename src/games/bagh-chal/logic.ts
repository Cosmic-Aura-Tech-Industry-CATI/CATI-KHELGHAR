import { BaghBoard, Position, BaghMove, BaghGameState, PieceType } from './types';

export function createInitialBaghBoard(): BaghBoard {
  const board: BaghBoard = Array(5).fill(null).map(() => Array(5).fill(null));
  // 4 Tigers at 4 corners
  board[0][0] = 'tiger';
  board[0][4] = 'tiger';
  board[4][0] = 'tiger';
  board[4][4] = 'tiger';
  return board;
}

export function createInitialBaghState(): BaghGameState {
  return {
    board: createInitialBaghBoard(),
    turn: 'goat', // Goats place first
    phase: 'placing',
    goatsPlaced: 0,
    goatsCaptured: 0,
    winner: null,
    lastLog: 'Goats place first! Tap any empty spot on the grid.',
  };
}

function isInside(r: number, c: number): boolean {
  return r >= 0 && r < 5 && c >= 0 && c < 5;
}

// In Bagh-Chal, diagonal connections exist only on points where (r + c) is even
export function areConnected(p1: Position, p2: Position): boolean {
  const dr = Math.abs(p1.row - p2.row);
  const dc = Math.abs(p1.col - p2.col);

  // Orthogonal step
  if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) return true;

  // Diagonal step (only valid if start point supports diagonals: (r + c) % 2 === 0)
  if (dr === 1 && dc === 1 && (p1.row + p1.col) % 2 === 0) return true;

  return false;
}

export function getLegalBaghMoves(state: BaghGameState, from?: Position): BaghMove[] {
  const { board, turn, phase, goatsPlaced } = state;
  const moves: BaghMove[] = [];

  // 1. Goat placing phase (from is undefined)
  if (turn === 'goat' && phase === 'placing' && goatsPlaced < 20) {
    if (!from) {
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          if (!board[r][c]) {
            moves.push({ to: { row: r, col: c } });
          }
        }
      }
    }
    return moves;
  }

  // 2. Moving phase for Goats or Tigers
  if (!from) return [];
  const piece = board[from.row][from.col];
  if (piece !== turn) return [];

  // Steps to adjacent connected points
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (areConnected(from, { row: r, col: c }) && !board[r][c]) {
        moves.push({ from, to: { row: r, col: c } });
      }
    }
  }

  // Tiger Jumps over Goats
  if (piece === 'tiger') {
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1], // Orthogonal
      [-1, -1], [-1, 1], [1, -1], [1, 1], // Diagonal
    ];

    for (const [dr, dc] of directions) {
      const isDiag = Math.abs(dr) === 1 && Math.abs(dc) === 1;
      // Diagonals only allowed from even-parity points
      if (isDiag && (from.row + from.col) % 2 !== 0) continue;

      const midR = from.row + dr;
      const midC = from.col + dc;
      const landR = from.row + 2 * dr;
      const landC = from.col + 2 * dc;

      if (isInside(landR, landC) && board[midR][midC] === 'goat' && !board[landR][landC]) {
        moves.push({
          from,
          to: { row: landR, col: landC },
          captured: { row: midR, col: midC },
        });
      }
    }
  }

  return moves;
}

export function getAllBaghMoves(state: BaghGameState): BaghMove[] {
  if (state.turn === 'goat' && state.phase === 'placing') {
    return getLegalBaghMoves(state);
  }

  const all: BaghMove[] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (state.board[r][c] === state.turn) {
        all.push(...getLegalBaghMoves(state, { row: r, col: c }));
      }
    }
  }
  return all;
}

export function applyBaghMove(state: BaghGameState, move: BaghMove): BaghGameState {
  const nextBoard = state.board.map((row) => [...row]);
  let goatsPlaced = state.goatsPlaced;
  let goatsCaptured = state.goatsCaptured;
  let phase = state.phase;

  if (state.turn === 'goat') {
    if (phase === 'placing') {
      nextBoard[move.to.row][move.to.col] = 'goat';
      goatsPlaced++;
      if (goatsPlaced >= 20) {
        phase = 'moving';
      }
    } else if (move.from) {
      nextBoard[move.to.row][move.to.col] = 'goat';
      nextBoard[move.from.row][move.from.col] = null;
    }
  } else if (state.turn === 'tiger' && move.from) {
    nextBoard[move.to.row][move.to.col] = 'tiger';
    nextBoard[move.from.row][move.from.col] = null;
    if (move.captured) {
      nextBoard[move.captured.row][move.captured.col] = null;
      goatsCaptured++;
    }
  }

  // Check Tiger Victory (5 goats captured)
  let winner: 'tiger' | 'goat' | null = null;
  if (goatsCaptured >= 5) {
    winner = 'tiger';
  }

  const nextTurn = state.turn === 'goat' ? 'tiger' : 'goat';
  const tempState: BaghGameState = {
    ...state,
    board: nextBoard,
    turn: nextTurn,
    phase,
    goatsPlaced,
    goatsCaptured,
    winner,
  };

  // Check Goat Victory (Tigers have no legal moves)
  if (nextTurn === 'tiger' && !winner) {
    const tigerMoves = getAllBaghMoves(tempState);
    if (tigerMoves.length === 0) {
      winner = 'goat';
    }
  }

  return {
    board: nextBoard,
    turn: nextTurn,
    phase,
    goatsPlaced,
    goatsCaptured,
    winner,
    lastLog: move.captured
      ? '🐅 Tiger pounced and captured a goat!'
      : state.turn === 'goat' && state.phase === 'placing'
      ? `🐐 Goat placed (${goatsPlaced}/20).`
      : `${state.turn === 'goat' ? '🐐 Goat' : '🐅 Tiger'} moved.`,
  };
}

export function getBestBaghBotMove(state: BaghGameState): BaghMove | null {
  const moves = getAllBaghMoves(state);
  if (moves.length === 0) return null;

  // Tiger bot: prefer capture > center
  if (state.turn === 'tiger') {
    const capture = moves.find((m) => !!m.captured);
    if (capture) return capture;
  }

  return moves[Math.floor(Math.random() * moves.length)];
}
