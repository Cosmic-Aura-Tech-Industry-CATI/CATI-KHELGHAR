import { CheckersBoard, CheckersPiece, CheckersPosition, CheckersMove, CheckersGameState, PieceColor } from './types';

export function createInitialCheckersBoard(): CheckersBoard {
  const board: CheckersBoard = Array(8).fill(null).map(() => Array(8).fill(null));

  let idCounter = 1;
  // Black pieces on top rows (0, 1, 2)
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) {
        board[r][c] = { id: `b-${idCounter++}`, color: 'black', isKing: false };
      }
    }
  }

  // Red pieces on bottom rows (5, 6, 7)
  for (let r = 5; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) {
        board[r][c] = { id: `r-${idCounter++}`, color: 'red', isKing: false };
      }
    }
  }

  return board;
}

export function createInitialCheckersState(): CheckersGameState {
  return {
    board: createInitialCheckersBoard(),
    turn: 'red', // Red moves first
    mustJumpPiece: null,
    capturedPieces: { red: 0, black: 0 },
    winner: null,
  };
}

function isInside(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

export function getPieceMoves(board: CheckersBoard, pos: CheckersPosition): CheckersMove[] {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];

  const moves: CheckersMove[] = [];
  const jumps: CheckersMove[] = [];
  const { row: r, col: c } = pos;
  const oppColor: PieceColor = piece.color === 'red' ? 'black' : 'red';

  const forwardDirs = piece.color === 'red' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
  const allDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  const directions = piece.isKing ? allDirs : forwardDirs;

  for (const [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;

    // Check single diagonal step
    if (isInside(nr, nc) && !board[nr][nc]) {
      moves.push({ from: pos, to: { row: nr, col: nc } });
    }

    // Check jump capture
    const jr = r + 2 * dr;
    const jc = c + 2 * dc;
    if (isInside(jr, jc) && !board[jr][jc]) {
      const mid = board[nr][nc];
      if (mid && mid.color === oppColor) {
        jumps.push({
          from: pos,
          to: { row: jr, col: jc },
          captured: { row: nr, col: nc },
        });
      }
    }
  }

  // If jump is available for this piece, jumps take priority
  return jumps.length > 0 ? jumps : moves;
}

export function getAllLegalMoves(state: CheckersGameState): CheckersMove[] {
  const board = state.board;
  const turn = state.turn;

  // If in the middle of a multi-jump
  if (state.mustJumpPiece) {
    const moves = getPieceMoves(board, state.mustJumpPiece);
    return moves.filter((m) => !!m.captured);
  }

  const allJumps: CheckersMove[] = [];
  const allSimpleMoves: CheckersMove[] = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === turn) {
        const moves = getPieceMoves(board, { row: r, col: c });
        for (const m of moves) {
          if (m.captured) allJumps.push(m);
          else allSimpleMoves.push(m);
        }
      }
    }
  }

  // Mandatory capture rule: if any jump exists on board, player must jump
  return allJumps.length > 0 ? allJumps : allSimpleMoves;
}

export function applyCheckersMove(state: CheckersGameState, move: CheckersMove): CheckersGameState {
  const nextBoard = state.board.map((row) => [...row]);
  const piece = { ...nextBoard[move.from.row][move.from.col]! };

  nextBoard[move.to.row][move.to.col] = piece;
  nextBoard[move.from.row][move.from.col] = null;

  // Crown King
  if (!piece.isKing) {
    if (piece.color === 'red' && move.to.row === 0) piece.isKing = true;
    if (piece.color === 'black' && move.to.row === 7) piece.isKing = true;
  }

  let nextCaptured = { ...state.capturedPieces };
  let canMultiJump = false;

  if (move.captured) {
    nextBoard[move.captured.row][move.captured.col] = null;
    if (piece.color === 'red') nextCaptured.black++;
    else nextCaptured.red++;

    // Check for consecutive multi-jump from landing position
    const subsequentMoves = getPieceMoves(nextBoard, move.to).filter((m) => !!m.captured);
    if (subsequentMoves.length > 0) {
      canMultiJump = true;
    }
  }

  if (canMultiJump) {
    return {
      ...state,
      board: nextBoard,
      mustJumpPiece: move.to,
      capturedPieces: nextCaptured,
    };
  }

  // Switch turn
  const nextTurn: PieceColor = state.turn === 'red' ? 'black' : 'red';
  const tempState: CheckersGameState = {
    board: nextBoard,
    turn: nextTurn,
    mustJumpPiece: null,
    capturedPieces: nextCaptured,
    winner: null,
  };

  // Check game over
  const nextLegalMoves = getAllLegalMoves(tempState);
  let winner: PieceColor | 'draw' | null = null;
  if (nextLegalMoves.length === 0) {
    winner = state.turn; // current player won because opponent has no moves left
  }

  return {
    board: nextBoard,
    turn: nextTurn,
    mustJumpPiece: null,
    capturedPieces: nextCaptured,
    winner,
  };
}

export function getBestCheckersBotMove(state: CheckersGameState): CheckersMove | null {
  const legalMoves = getAllLegalMoves(state);
  if (legalMoves.length === 0) return null;

  // Prefer jumps > advancing toward king row > center
  legalMoves.sort((a, b) => {
    if (a.captured && !b.captured) return -1;
    if (!a.captured && b.captured) return 1;

    // Favor kinging
    const isKingingA = (state.turn === 'black' && a.to.row === 7) || (state.turn === 'red' && a.to.row === 0);
    const isKingingB = (state.turn === 'black' && b.to.row === 7) || (state.turn === 'red' && b.to.row === 0);
    if (isKingingA && !isKingingB) return -1;
    if (!isKingingA && isKingingB) return 1;

    return Math.random() - 0.5;
  });

  return legalMoves[0];
}
