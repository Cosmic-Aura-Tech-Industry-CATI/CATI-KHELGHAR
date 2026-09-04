'use client';

import React from 'react';
import { Board, Position, Move, PieceColor, ChessTheme } from './types';
import { ChessPieceIcon } from './PieceIcon';

interface ChessBoardProps {
  board: Board;
  selectedPos: Position | null;
  validMoves: Move[];
  lastMove: Move | null;
  isCheck: boolean;
  turn: PieceColor;
  theme: ChessTheme;
  flipped?: boolean;
  onSquareClick: (pos: Position) => void;
}

const PIECE_SYMBOLS: Record<string, string> = {
  'w-k': '♔',
  'w-q': '♕',
  'w-r': '♖',
  'w-b': '♗',
  'w-n': '♘',
  'w-p': '♙',
  'b-k': '♚',
  'b-q': '♛',
  'b-r': '♜',
  'b-b': '♝',
  'b-n': '♞',
  'b-p': '♟',
};

const THEMES: Record<
  ChessTheme,
  {
    light: string;
    dark: string;
    border: string;
    bg: string;
    whitePiece: string;
    blackPiece: string;
  }
> = {
  walnut: {
    light: 'bg-[#f4e4c1]',
    dark: 'bg-[#a3704c]',
    border: 'border-[#78350f]',
    bg: 'bg-[#451a03]',
    whitePiece: 'text-[#ffffff] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] [text-shadow:_0_1px_2px_rgb(0_0_0_/_80%)]',
    blackPiece: 'text-[#1e140d] drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)] [text-shadow:_0_0_2px_rgb(255_255_255_/_80%)]',
  },
  cyberpunk: {
    light: 'bg-[#1e293b]',
    dark: 'bg-[#0f172a]',
    border: 'border-cyan-500/40',
    bg: 'bg-slate-950',
    whitePiece: 'text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] [text-shadow:_0_0_8px_rgb(34_211_238_/_90%)]',
    blackPiece: 'text-fuchsia-400 drop-shadow-[0_0_12px_rgba(232,121,249,0.9)] [text-shadow:_0_0_10px_rgb(232_121_249_/_95%),_0_0_2px_#ffffff]',
  },
  sakura: {
    light: 'bg-[#fff1f2]',
    dark: 'bg-[#fda4af]',
    border: 'border-rose-400',
    bg: 'bg-[#4c0519]',
    whitePiece: 'text-white drop-shadow-[0_2px_4px_rgba(76,5,25,0.8)] [text-shadow:_0_1px_2px_rgb(76_5_25_/_70%)]',
    blackPiece: 'text-[#4c0519] drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)] [text-shadow:_0_0_3px_rgb(255_255_255_/_90%)]',
  },
};

export const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  selectedPos,
  validMoves,
  lastMove,
  isCheck,
  turn,
  theme,
  flipped = false,
  onSquareClick,
}) => {
  const currentTheme = THEMES[theme] || THEMES.walnut;
  const rows = flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const cols = flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

  const isValidTarget = (r: number, c: number) =>
    validMoves.some((m) => m.to.row === r && m.to.col === c);

  return (
    <div className={`relative p-2.5 sm:p-3.5 rounded-3xl ${currentTheme.bg} border-4 ${currentTheme.border} shadow-2xl max-w-[500px] w-full mx-auto select-none`}>
      <div className="grid grid-cols-8 aspect-square rounded-2xl overflow-hidden border border-black/30 shadow-inner">
        {rows.map((r) =>
          cols.map((c) => {
            const isDark = (r + c) % 2 === 1;
            const piece = board[r][c];
            const isSelected = selectedPos?.row === r && selectedPos?.col === c;
            const isTarget = isValidTarget(r, c);
            const isLastMoveSquare =
              (lastMove?.from.row === r && lastMove?.from.col === c) ||
              (lastMove?.to.row === r && lastMove?.to.col === c);
            const isKingInCheckSquare =
              isCheck && piece?.type === 'k' && piece?.color === turn;

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => onSquareClick({ row: r, col: c })}
                className={`relative aspect-square w-full h-full flex items-center justify-center overflow-hidden transition-colors duration-150 ${
                  isDark ? currentTheme.dark : currentTheme.light
                } ${isSelected ? 'ring-4 ring-inset ring-amber-400 z-10' : ''} ${
                  isLastMoveSquare ? 'after:absolute after:inset-0 after:bg-amber-300/25 pointer-events-auto' : ''
                } ${isKingInCheckSquare ? 'bg-red-500/50 animate-pulse ring-4 ring-inset ring-red-500' : ''}`}
              >
                {/* Target Dot or Ring for Valid Moves */}
                {isTarget && (
                  <span
                    className={`absolute rounded-full pointer-events-none z-10 ${
                      piece
                        ? 'w-full h-full ring-4 ring-inset ring-red-500/80 bg-red-500/20'
                        : 'w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-500/80 shadow-md ring-2 ring-white/50'
                    }`}
                  />
                )}

                {/* Chess Piece */}
                {piece && (
                  <div
                    className={`relative z-0 w-full h-full flex items-center justify-center transition-transform duration-150 ${
                      isSelected ? 'scale-110 drop-shadow-[0_4px_10px_rgba(251,191,36,0.9)]' : ''
                    }`}
                  >
                    <ChessPieceIcon
                      type={piece.type}
                      color={piece.color}
                      theme={theme}
                    />
                  </div>
                )}

                {/* File / Rank small labels */}
                {c === (flipped ? 7 : 0) && (
                  <span className="absolute top-0.5 left-1 text-[9px] font-bold opacity-40 leading-none">
                    {8 - r}
                  </span>
                )}
                {r === (flipped ? 0 : 7) && (
                  <span className="absolute bottom-0.5 right-1 text-[9px] font-bold opacity-40 leading-none">
                    {String.fromCharCode(97 + c)}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
