'use client';

import React, { useState } from 'react';
import { ConnectFourCell, ConnectFourWinResult } from './types';
import { ROWS, COLS } from './logic';

interface ConnectFourBoardProps {
  board: ConnectFourCell[][];
  currentTurn: 'R' | 'Y';
  isGameOver: boolean;
  winResult: ConnectFourWinResult | null;
  onDrop: (col: number) => void;
}

export const ConnectFourBoard: React.FC<ConnectFourBoardProps> = ({
  board,
  currentTurn,
  isGameOver,
  winResult,
  onDrop
}) => {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  const isWinningCell = (r: number, c: number) => {
    if (!winResult || !winResult.winningCoords) return false;
    return winResult.winningCoords.some(([wr, wc]) => wr === r && wc === c);
  };

  return (
    <div className="relative w-full max-w-[500px] sm:max-w-[560px] mx-auto select-none space-y-2">
      {/* Top Column Drop Indicators */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 px-3 sm:px-4 h-9 sm:h-11">
        {Array.from({ length: COLS }).map((_, c) => {
          const isFull = board[0][c] !== null;
          const isHovered = hoveredCol === c && !isGameOver && !isFull;

          return (
            <button
              key={c}
              type="button"
              disabled={isFull || isGameOver}
              onClick={() => onDrop(c)}
              onMouseEnter={() => setHoveredCol(c)}
              onMouseLeave={() => setHoveredCol(null)}
              aria-label={`Drop disc in column ${c + 1}`}
              className="flex items-center justify-center transition-all duration-150 focus:outline-none"
            >
              {isHovered && (
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow-lg border-2 border-white/80 animate-bounce flex items-center justify-center text-xs ${
                    currentTurn === 'R'
                      ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-500/50'
                      : 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-500/50'
                  }`}
                >
                  <span className="text-white text-[10px]">▼</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Handcrafted Wooden Stand & Board */}
      <div className="p-3 sm:p-4 rounded-[32px] bg-gradient-to-br from-[#6b4226] via-[#4a2c17] to-[#321d0f] shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-4px_8px_rgba(0,0,0,0.6)] border-4 border-[#3d2212]">
        {/* Navy/Slate Grid Front Plate */}
        <div className="p-2 sm:p-3 rounded-[24px] bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] shadow-inner border border-blue-700/50">
          <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
            {Array.from({ length: COLS }).map((_, c) => {
              const isFull = board[0][c] !== null;

              return (
                <div
                  key={c}
                  onClick={() => !isFull && !isGameOver && onDrop(c)}
                  onMouseEnter={() => setHoveredCol(c)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`flex flex-col gap-2 sm:gap-2.5 rounded-xl p-0.5 transition-colors ${
                    !isFull && !isGameOver ? 'cursor-pointer hover:bg-white/5' : ''
                  }`}
                >
                  {Array.from({ length: ROWS }).map((_, r) => {
                    const cell = board[r][c];
                    const winning = isWinningCell(r, c);

                    return (
                      <div
                        key={`${r}-${c}`}
                        className="aspect-square relative w-full rounded-full bg-[#0b1120] shadow-[inset_0_4px_8px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.15)] flex items-center justify-center overflow-hidden border border-blue-950/80"
                      >
                        {cell === 'R' && (
                          <div
                            className={`w-4/5 h-4/5 rounded-full bg-gradient-to-br from-[#ef4444] via-[#dc2626] to-[#991b1b] border border-red-300 shadow-[0_4px_8px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.6)] transition-transform duration-200 ${
                              winning
                                ? 'scale-110 ring-4 ring-amber-300 animate-pulse shadow-red-500/80'
                                : 'scale-100'
                            }`}
                          />
                        )}

                        {cell === 'Y' && (
                          <div
                            className={`w-4/5 h-4/5 rounded-full bg-gradient-to-br from-[#fde047] via-[#f59e0b] to-[#b45309] border border-amber-200 shadow-[0_4px_8px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.7)] transition-transform duration-200 ${
                              winning
                                ? 'scale-110 ring-4 ring-amber-300 animate-pulse shadow-amber-500/80'
                                : 'scale-100'
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
