'use client';

import React from 'react';
import { CheckersBoard as BoardType, CheckersPosition, CheckersMove, CheckersTheme } from './types';
import { Crown } from 'lucide-react';

interface CheckersBoardProps {
  board: BoardType;
  selectedPos: CheckersPosition | null;
  validMoves: CheckersMove[];
  theme: CheckersTheme;
  onSquareClick: (pos: CheckersPosition) => void;
}

const THEMES: Record<CheckersTheme, { light: string; dark: string; border: string; bg: string }> = {
  mahogany: {
    light: 'bg-[#f4ebd9]',
    dark: 'bg-[#5c2c16]',
    border: 'border-[#381a0e]',
    bg: 'bg-[#29130a]',
  },
  emerald: {
    light: 'bg-[#e2e8f0]',
    dark: 'bg-[#064e3b]',
    border: 'border-[#022c22]',
    bg: 'bg-[#021f18]',
  },
  neon: {
    light: 'bg-slate-800',
    dark: 'bg-slate-950',
    border: 'border-fuchsia-500/40',
    bg: 'bg-slate-900',
  },
};

export const CheckersBoardView: React.FC<CheckersBoardProps> = ({
  board,
  selectedPos,
  validMoves,
  theme,
  onSquareClick,
}) => {
  const currentTheme = THEMES[theme] || THEMES.mahogany;

  const isValidTarget = (r: number, c: number) =>
    validMoves.some((m) => m.to.row === r && m.to.col === c);

  return (
    <div className={`relative p-2.5 sm:p-3.5 rounded-3xl ${currentTheme.bg} border-4 ${currentTheme.border} shadow-2xl max-w-[500px] w-full mx-auto select-none`}>
      <div className="grid grid-cols-8 aspect-square rounded-2xl overflow-hidden border border-black/40 shadow-inner">
        {board.map((row, r) =>
          row.map((piece, c) => {
            const isDarkSquare = (r + c) % 2 === 1;
            const isSelected = selectedPos?.row === r && selectedPos?.col === c;
            const isTarget = isValidTarget(r, c);

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => onSquareClick({ row: r, col: c })}
                className={`relative aspect-square w-full h-full flex items-center justify-center overflow-hidden transition-colors duration-150 ${
                  isDarkSquare ? currentTheme.dark : currentTheme.light
                } ${isSelected ? 'ring-4 ring-inset ring-amber-400 z-10' : ''}`}
              >
                {/* Target Dot */}
                {isTarget && (
                  <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-400 shadow-md ring-2 ring-white animate-pulse pointer-events-none z-10" />
                )}

                {/* Checker Piece */}
                {piece && (
                  <div
                    className={`relative w-4/5 h-4/5 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ease-out select-none ${
                      piece.color === 'red'
                        ? 'bg-gradient-to-br from-red-500 to-rose-700 border-2 border-red-300 ring-2 ring-red-900 shadow-red-900/50'
                        : 'bg-gradient-to-br from-slate-700 to-slate-950 border-2 border-slate-500 ring-2 ring-black shadow-black/80'
                    } ${isSelected ? 'scale-110 -translate-y-1 shadow-[0_8px_16px_rgba(251,191,36,0.6)] z-20 ring-2 ring-amber-300' : 'hover:scale-105'}`}
                  >
                    {/* Ridge lines */}
                    <div className="w-3/4 h-3/4 rounded-full border border-white/20 flex items-center justify-center">
                      {piece.isKing && (
                        <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 drop-shadow-md animate-bounce" />
                      )}
                    </div>
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
