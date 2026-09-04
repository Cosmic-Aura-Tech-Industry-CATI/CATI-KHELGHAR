import { Board, Piece, PieceColor, PieceType, Position, Move, ChessGameState } from './types';

export function createInitialBoard(): Board {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));

  const backRank: PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
  for (let c = 0; c < 8; c++) {
    board[0][c] = { type: backRank[c], color: 'b' };
    board[1][c] = { type: 'p', color: 'b' };
    board[6][c] = { type: 'p', color: 'w' };
    board[7][c] = { type: backRank[c], color: 'w' };
  }

  return board;
}

export function createInitialState(): ChessGameState {
  return {
    board: createInitialBoard(),
    turn: 'w',
    moveHistory: [],
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    castlingRights: {
      w: { kingSide: true, queenSide: true },
      b: { kingSide: true, queenSide: true },
    },
    enPassantTarget: null,
    capturedPieces: { w: [], b: [] },
  };
}

function isInside(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

export function getRawMoves(board: Board, pos: Position, state: ChessGameState): Move[] {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];
  const moves: Move[] = [];
  const { row: r, col: c } = pos;
  const color = piece.color;
  const oppColor: PieceColor = color === 'w' ? 'b' : 'w';

  if (piece.type === 'p') {
    const dir = color === 'w' ? -1 : 1;
    const startRow = color === 'w' ? 6 : 1;

    // 1 step forward
    if (isInside(r + dir, c) && !board[r + dir][c]) {
      moves.push({ from: pos, to: { row: r + dir, col: c }, piece });
      // 2 steps forward
      if (r === startRow && !board[r + 2 * dir][c]) {
        moves.push({ from: pos, to: { row: r + 2 * dir, col: c }, piece });
      }
    }

    // Diagonal captures
    for (const dc of [-1, 1]) {
      const nr = r + dir;
      const nc = c + dc;
      if (isInside(nr, nc)) {
        const target = board[nr][nc];
        if (target && target.color === oppColor) {
          moves.push({ from: pos, to: { row: nr, col: nc }, piece, captured: target });
        } else if (state.enPassantTarget && state.enPassantTarget.row === nr && state.enPassantTarget.col === nc) {
          moves.push({
            from: pos,
            to: { row: nr, col: nc },
            piece,
            captured: board[r][nc] || undefined,
            isEnPassant: true,
          });
        }
      }
    }
  }

  if (piece.type === 'n') {
    const deltas = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1],
    ];
    for (const [dr, dc] of deltas) {
      const nr = r + dr;
      const nc = c + dc;
      if (isInside(nr, nc)) {
        const target = board[nr][nc];
        if (!target || target.color === oppColor) {
          moves.push({ from: pos, to: { row: nr, col: nc }, piece, captured: target || undefined });
        }
      }
    }
  }

  if (piece.type === 'b' || piece.type === 'q') {
    const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dr, dc] of diagDirs) {
      let step = 1;
      while (isInside(r + dr * step, c + dc * step)) {
        const nr = r + dr * step;
        const nc = c + dc * step;
        const target = board[nr][nc];
        if (!target) {
          moves.push({ from: pos, to: { row: nr, col: nc }, piece });
        } else {
          if (target.color === oppColor) {
            moves.push({ from: pos, to: { row: nr, col: nc }, piece, captured: target });
          }
          break;
        }
        step++;
      }
    }
  }

  if (piece.type === 'r' || piece.type === 'q') {
    const straightDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of straightDirs) {
      let step = 1;
      while (isInside(r + dr * step, c + dc * step)) {
        const nr = r + dr * step;
        const nc = c + dc * step;
        const target = board[nr][nc];
        if (!target) {
          moves.push({ from: pos, to: { row: nr, col: nc }, piece });
        } else {
          if (target.color === oppColor) {
            moves.push({ from: pos, to: { row: nr, col: nc }, piece, captured: target });
          }
          break;
        }
        step++;
      }
    }
  }

  if (piece.type === 'k') {
    const dirs = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ];
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (isInside(nr, nc)) {
        const target = board[nr][nc];
        if (!target || target.color === oppColor) {
          moves.push({ from: pos, to: { row: nr, col: nc }, piece, captured: target || undefined });
        }
      }
    }

    // Castling
    const rights = state.castlingRights[color];
    const backRow = color === 'w' ? 7 : 0;
    if (r === backRow && c === 4 && !state.isCheck) {
      // King-side
      if (rights.kingSide && !board[backRow][5] && !board[backRow][6]) {
        const rook = board[backRow][7];
        if (rook && rook.type === 'r' && rook.color === color) {
          moves.push({ from: pos, to: { row: backRow, col: 6 }, piece, isCastling: true });
        }
      }
      // Queen-side
      if (rights.queenSide && !board[backRow][1] && !board[backRow][2] && !board[backRow][3]) {
        const rook = board[backRow][0];
        if (rook && rook.type === 'r' && rook.color === color) {
          moves.push({ from: pos, to: { row: backRow, col: 2 }, piece, isCastling: true });
        }
      }
    }
  }

  return moves;
}

export function findKing(board: Board, color: PieceColor): Position | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === 'k' && p.color === color) {
        return { row: r, col: c };
      }
    }
  }
  return null;
}

export function isKingInCheck(board: Board, color: PieceColor, state: ChessGameState): boolean {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  const oppColor: PieceColor = color === 'w' ? 'b' : 'w';

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.color === oppColor) {
        const moves = getRawMoves(board, { row: r, col: c }, state);
        if (moves.some((m) => m.to.row === kingPos.row && m.to.col === kingPos.col)) {
          return true;
        }
      }
    }
  }
  return false;
}

export function getLegalMoves(state: ChessGameState, pos: Position): Move[] {
  const rawMoves = getRawMoves(state.board, pos, state);
  const legal: Move[] = [];

  for (const move of rawMoves) {
    const nextBoard = state.board.map((row) => [...row]);
    nextBoard[move.to.row][move.to.col] = move.piece;
    nextBoard[move.from.row][move.from.col] = null;

    if (move.isEnPassant && move.captured) {
      nextBoard[move.from.row][move.to.col] = null;
    }

    if (!isKingInCheck(nextBoard, move.piece.color, state)) {
      legal.push(move);
    }
  }

  return legal;
}

export function getAllLegalMoves(state: ChessGameState): Move[] {
  const allMoves: Move[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = state.board[r][c];
      if (piece && piece.color === state.turn) {
        allMoves.push(...getLegalMoves(state, { row: r, col: c }));
      }
    }
  }
  return allMoves;
}

export function applyMove(state: ChessGameState, move: Move): ChessGameState {
  const nextBoard = state.board.map((row) => [...row]);
  let piece = { ...move.piece };

  // Pawn promotion to Queen by default
  if (piece.type === 'p' && (move.to.row === 0 || move.to.row === 7)) {
    piece = { type: move.promotion || 'q', color: piece.color };
  }

  nextBoard[move.to.row][move.to.col] = piece;
  nextBoard[move.from.row][move.from.col] = null;

  // Handle en passant capture
  if (move.isEnPassant) {
    nextBoard[move.from.row][move.to.col] = null;
  }

  // Handle castling rook movement
  if (move.isCastling) {
    if (move.to.col === 6) {
      // King-side: rook from 7 to 5
      nextBoard[move.to.row][5] = nextBoard[move.to.row][7];
      nextBoard[move.to.row][7] = null;
    } else if (move.to.col === 2) {
      // Queen-side: rook from 0 to 3
      nextBoard[move.to.row][3] = nextBoard[move.to.row][0];
      nextBoard[move.to.row][0] = null;
    }
  }

  // Castling rights updates
  const nextRights = JSON.parse(JSON.stringify(state.castlingRights));
  if (piece.type === 'k') {
    nextRights[piece.color].kingSide = false;
    nextRights[piece.color].queenSide = false;
  }
  if (piece.type === 'r') {
    if (move.from.col === 0) nextRights[piece.color].queenSide = false;
    if (move.from.col === 7) nextRights[piece.color].kingSide = false;
  }

  // En passant target setup
  let nextEnPassant: Position | null = null;
  if (piece.type === 'p' && Math.abs(move.to.row - move.from.row) === 2) {
    nextEnPassant = {
      row: (move.from.row + move.to.row) / 2,
      col: move.from.col,
    };
  }

  // Captured pieces
  const nextCaptured = {
    w: [...state.capturedPieces.w],
    b: [...state.capturedPieces.b],
  };
  if (move.captured) {
    if (move.captured.color === 'w') {
      nextCaptured.w.push(move.captured);
    } else {
      nextCaptured.b.push(move.captured);
    }
  }

  const nextTurn: PieceColor = state.turn === 'w' ? 'b' : 'w';

  // Check and checkmate evaluation
  const tempState: ChessGameState = {
    ...state,
    board: nextBoard,
    turn: nextTurn,
    castlingRights: nextRights,
    enPassantTarget: nextEnPassant,
  };

  const isCheck = isKingInCheck(nextBoard, nextTurn, tempState);
  const nextLegalMoves = getAllLegalMoves(tempState);
  const isCheckmate = isCheck && nextLegalMoves.length === 0;
  const isStalemate = !isCheck && nextLegalMoves.length === 0;

  return {
    board: nextBoard,
    turn: nextTurn,
    moveHistory: [...state.moveHistory, move],
    isCheck,
    isCheckmate,
    isStalemate,
    castlingRights: nextRights,
    enPassantTarget: nextEnPassant,
    capturedPieces: nextCaptured,
  };
}

export function getBestBotMove(state: ChessGameState): Move | null {
  const legalMoves = getAllLegalMoves(state);
  if (legalMoves.length === 0) return null;

  const pieceValues: Record<PieceType, number> = {
    p: 10,
    n: 30,
    b: 30,
    r: 50,
    q: 90,
    k: 900,
  };

  // Greedy capture > center control > random
  legalMoves.sort((a, b) => {
    const valA = a.captured ? pieceValues[a.captured.type] : 0;
    const valB = b.captured ? pieceValues[b.captured.type] : 0;
    if (valA !== valB) return valB - valA;
    // Prefer center squares (3, 4)
    const distA = Math.abs(3.5 - a.to.row) + Math.abs(3.5 - a.to.col);
    const distB = Math.abs(3.5 - b.to.row) + Math.abs(3.5 - b.to.col);
    return distA - distB;
  });

  return legalMoves[0];
}
