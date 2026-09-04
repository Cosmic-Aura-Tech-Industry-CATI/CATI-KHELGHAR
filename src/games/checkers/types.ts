export type PieceColor = 'red' | 'black';

export interface CheckersPiece {
  id: string;
  color: PieceColor;
  isKing: boolean;
}

export type CheckersBoard = (CheckersPiece | null)[][];

export interface CheckersPosition {
  row: number;
  col: number;
}

export interface CheckersMove {
  from: CheckersPosition;
  to: CheckersPosition;
  captured?: CheckersPosition;
  subsequentJumps?: CheckersMove[];
}

export interface CheckersGameState {
  board: CheckersBoard;
  turn: PieceColor;
  mustJumpPiece: CheckersPosition | null; // locked to continuing a multi-jump
  capturedPieces: {
    red: number;
    black: number;
  };
  winner: PieceColor | 'draw' | null;
}

export type CheckersTheme = 'mahogany' | 'emerald' | 'neon';
