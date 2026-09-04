'use client';

import React from 'react';
import { ReversiBoard as BoardType, ReversiMove, ReversiTheme, ReversiPosition } from './types';

interface ReversiBoardProps {
  board: BoardType;
  validMoves: ReversiMove[];
  lastMove: ReversiPosition | null;
  recentlyFlipped: ReversiPosition[];
  theme: ReversiTheme;
  onSquareClick: (row: number, col: number) => void;
}

const THEMES: Record<ReversiTheme, { bg: string; grid: string; cell: string; border: string }> = {
  green: {
    bg: 'bg-[#064e3b]',
    grid: 'bg-[#042f2e]',
    cell: 'bg-[#0f766e]/40 hover:bg-[#0f766e]/70',
    border: 'border-[#134e4a]',
  },
  midnight: {
    bg: 'bg-slate-950',
    grid: 'bg-slate-900',
    cell: 'bg-slate-800/60 hover:bg-slate-700/80',
    border: 'border-slate-700',
  },
  marble: {
    bg: 'bg-[#475569]',
    grid: 'bg-[#334155]',
    cell: 'bg-[#64748b]/50 hover:bg-[#64748b]/80',
    border: 'border-[#1e293b]',
  },
};

export const ReversiBoardView: React.FC<ReversiBoardProps> = ({
  board,
  validMoves,
  lastMove,
  recentlyFlipped,
  theme,
  onSquareClick,
}) => {
  const currentTheme = THEMES[theme] || THEMES.green;

  const getValidMove = (r: number, c: number) =>
    validMoves.find((m) => m.row === r && m.col === c);

  const isFlippedRecently = (r: number, c: number) =>
    recentlyFlipped.some((pos) => pos.row === r && pos.col === c);

  return (
    <div className={`relative p-2.5 sm:p-3.5 rounded-3xl ${currentTheme.bg} border-4 ${currentTheme.border} shadow-2xl max-w-[480px] w-full mx-auto select-none`}>
      <div className={`grid grid-cols-8 aspect-square rounded-2xl overflow-hidden gap-1 p-1 ${currentTheme.grid} shadow-inner`}>
        {board.map((row, r) =>
          row.map((cell, c) => {
            const validMove = getValidMove(r, c);
            const isLast = lastMove?.row === r && lastMove?.col === c;
            const isFlipped = isFlippedRecently(r, c);

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => onSquareClick(r, c)}
                disabled={!validMove && cell === null}
                className={`relative flex items-center justify-center rounded-lg transition-colors duration-150 ${currentTheme.cell} ${
                  isLast ? 'ring-2 ring-amber-400' : ''
                }`}
              >
                {/* Legal Move Indicator */}
                {validMove && (
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/40 shadow-sm animate-pulse" />
                )}

                {/* Disk */}
                {cell && (
                  <div
                    className={`relative w-4/5 h-4/5 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                      cell === 'black'
                        ? 'bg-gradient-to-br from-slate-800 to-slate-950 border-2 border-slate-600 shadow-black/80'
                        : 'bg-gradient-to-br from-white to-slate-200 border-2 border-slate-300 shadow-slate-900/30'
                    } ${isFlipped ? 'scale-110' : ''}`}
                  >
                    <div className="w-2/3 h-2/3 rounded-full border border-white/10" />
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
