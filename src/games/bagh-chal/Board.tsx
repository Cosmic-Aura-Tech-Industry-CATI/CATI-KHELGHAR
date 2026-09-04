'use client';

import React from 'react';
import { BaghBoard as BoardType, Position, BaghMove, BaghTheme } from './types';

interface BaghBoardProps {
  board: BoardType;
  selectedPos: Position | null;
  validMoves: BaghMove[];
  theme: BaghTheme;
  onPointClick: (row: number, col: number) => void;
}

const THEMES: Record<BaghTheme, { bg: string; line: string; point: string; border: string }> = {
  himalayan: {
    bg: 'bg-slate-900',
    line: '#64748b',
    point: 'bg-slate-800 border-slate-600',
    border: 'border-slate-700',
  },
  brass: {
    bg: 'bg-[#451a03]',
    line: '#b45309',
    point: 'bg-[#78350f] border-[#d97706]',
    border: 'border-[#b45309]',
  },
  forest: {
    bg: 'bg-[#052e16]',
    line: '#15803d',
    point: 'bg-[#14532d] border-[#22c55e]',
    border: 'border-[#166534]',
  },
};

export const BaghBoardView: React.FC<BaghBoardProps> = ({
  board,
  selectedPos,
  validMoves,
  theme,
  onPointClick,
}) => {
  const currentTheme = THEMES[theme] || THEMES.himalayan;

  const isValidTarget = (r: number, c: number) =>
    validMoves.some((m) => m.to.row === r && m.to.col === c);

  return (
    <div className={`relative p-4 sm:p-6 rounded-3xl ${currentTheme.bg} border-4 ${currentTheme.border} shadow-2xl max-w-[460px] w-full mx-auto select-none aspect-square flex items-center justify-center`}>
      {/* SVG Canvas for Alquerque Grid Lines */}
      <svg className="absolute inset-4 sm:inset-6 w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] h-[calc(100%-2rem)] sm:h-[calc(100%-3rem)] pointer-events-none" viewBox="0 0 400 400">
        {/* Horizontal & Vertical Grid Lines */}
        {[0, 100, 200, 300, 400].map((coord) => (
          <React.Fragment key={coord}>
            <line x1="0" y1={coord} x2="400" y2={coord} stroke={currentTheme.line} strokeWidth="3" opacity="0.7" />
            <line x1={coord} y1="0" x2={coord} y2="400" stroke={currentTheme.line} strokeWidth="3" opacity="0.7" />
          </React.Fragment>
        ))}
        {/* Outer Diagonals */}
        <line x1="0" y1="0" x2="400" y2="400" stroke={currentTheme.line} strokeWidth="3" opacity="0.7" />
        <line x1="400" y1="0" x2="0" y2="400" stroke={currentTheme.line} strokeWidth="3" opacity="0.7" />
        {/* Diamond Inner Lines */}
        <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke={currentTheme.line} strokeWidth="3" opacity="0.7" />
      </svg>

      {/* Grid of 25 Intersection Points */}
      <div className="relative z-10 w-full h-full grid grid-cols-5 grid-rows-5">
        {board.map((row, r) =>
          row.map((piece, c) => {
            const isSelected = selectedPos?.row === r && selectedPos?.col === c;
            const isTarget = isValidTarget(r, c);

            return (
              <div key={`${r}-${c}`} className="flex items-center justify-center relative">
                <button
                  type="button"
                  onClick={() => onPointClick(r, c)}
                  className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                    piece ? 'cursor-pointer' : isTarget ? 'cursor-pointer ring-4 ring-emerald-400 scale-110' : ''
                  } ${isSelected ? 'ring-4 ring-amber-400 scale-110' : ''}`}
                >
                  {/* Point Marker */}
                  <span className={`w-3 h-3 rounded-full border ${currentTheme.point}`} />

                  {/* Tiger Piece */}
                  {piece === 'tiger' && (
                    <span className="absolute text-2xl sm:text-3xl filter drop-shadow-md animate-pulse">
                      🐅
                    </span>
                  )}

                  {/* Goat Piece */}
                  {piece === 'goat' && (
                    <span className="absolute text-xl sm:text-2xl filter drop-shadow-md">
                      🐐
                    </span>
                  )}

                  {/* Target Dot */}
                  {isTarget && !piece && (
                    <span className="absolute w-3 h-3 rounded-full bg-emerald-400 shadow-md animate-ping" />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
