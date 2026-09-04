export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export type Board = (Piece | null)[][];

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  isCastling?: boolean;
  isEnPassant?: boolean;
  promotion?: PieceType;
}

export interface ChessGameState {
  board: Board;
  turn: PieceColor;
  moveHistory: Move[];
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  castlingRights: {
    w: { kingSide: boolean; queenSide: boolean };
    b: { kingSide: boolean; queenSide: boolean };
  };
  enPassantTarget: Position | null;
  capturedPieces: {
    w: Piece[];
    b: Piece[];
  };
}

export type ChessTheme = 'walnut' | 'cyberpunk' | 'sakura';
