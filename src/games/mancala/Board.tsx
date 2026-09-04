'use client';

import React from 'react';
import { MancalaGameState, MancalaTheme } from './types';

interface MancalaBoardProps {
  gameState: MancalaGameState;
  theme: MancalaTheme;
  onPitClick: (pitIdx: number) => void;
}

const THEMES: Record<MancalaTheme, { wood: string; pit: string; border: string; seed: string }> = {
  teak: {
    wood: 'bg-[#5c2c16]',
    pit: 'bg-[#381a0e] border-[#78350f]',
    border: 'border-[#29130a]',
    seed: 'bg-amber-300 border-amber-500 shadow-amber-900/80',
  },
  zen: {
    wood: 'bg-[#1e293b]',
    pit: 'bg-[#0f172a] border-[#334155]',
    border: 'border-[#020617]',
    seed: 'bg-cyan-300 border-cyan-500 shadow-cyan-900/80',
  },
  gold: {
    wood: 'bg-[#78350f]',
    pit: 'bg-[#451a03] border-[#b45309]',
    border: 'border-[#b45309]',
    seed: 'bg-yellow-400 border-yellow-200 shadow-yellow-900/80',
  },
};

export const MancalaBoardView: React.FC<MancalaBoardProps> = ({ gameState, theme, onPitClick }) => {
  const currentTheme = THEMES[theme] || THEMES.teak;
  const pits = gameState.pits;

  // Player 2 pits (top row): 12, 11, 10, 9, 8, 7 (reversed for left-to-right display)
  const topPits = [12, 11, 10, 9, 8, 7];
  // Player 1 pits (bottom row): 0, 1, 2, 3, 4, 5
  const bottomPits = [0, 1, 2, 3, 4, 5];

  const isClickable = (pitIdx: number) => {
    if (gameState.isGameOver) return false;
    if (gameState.turn === 0 && pitIdx >= 0 && pitIdx <= 5 && pits[pitIdx] > 0) return true;
    if (gameState.turn === 1 && pitIdx >= 7 && pitIdx <= 12 && pits[pitIdx] > 0) return true;
    return false;
  };

  return (
    <div className={`p-4 sm:p-6 rounded-3xl ${currentTheme.wood} border-4 ${currentTheme.border} shadow-2xl max-w-[560px] w-full mx-auto select-none`}>
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Player 2 Kalah Store (Left) */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            P2 Store
          </span>
          <div className={`w-14 sm:w-16 h-36 sm:h-44 rounded-2xl ${currentTheme.pit} border-2 flex flex-col items-center justify-center p-2 shadow-inner relative`}>
            <span className="text-xl sm:text-2xl font-black text-white">{pits[13]}</span>
            <div className="flex flex-wrap gap-1 justify-center max-h-24 overflow-hidden mt-1">
              {Array.from({ length: Math.min(pits[13], 16) }).map((_, i) => (
                <span key={i} className={`w-2 h-2 rounded-full border shadow-sm ${currentTheme.seed}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Middle 12 Pits (6 Top, 6 Bottom) */}
        <div className="flex-1 space-y-3">
          {/* Top Row: Player 2 */}
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
            {topPits.map((idx) => {
              const active = isClickable(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onPitClick(idx)}
                  disabled={!active}
                  className={`aspect-square rounded-2xl ${currentTheme.pit} border-2 flex flex-col items-center justify-center transition-all p-1 shadow-inner relative ${
                    active ? 'hover:scale-105 ring-2 ring-amber-400 cursor-pointer' : 'opacity-80'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-black text-white">{pits[idx]}</span>
                  <div className="flex flex-wrap gap-0.5 justify-center max-h-8 overflow-hidden mt-0.5">
                    {Array.from({ length: Math.min(pits[idx], 8) }).map((_, i) => (
                      <span key={i} className={`w-1.5 h-1.5 rounded-full border ${currentTheme.seed}`} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Row: Player 1 */}
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
            {bottomPits.map((idx) => {
              const active = isClickable(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onPitClick(idx)}
                  disabled={!active}
                  className={`aspect-square rounded-2xl ${currentTheme.pit} border-2 flex flex-col items-center justify-center transition-all p-1 shadow-inner relative ${
                    active ? 'hover:scale-105 ring-2 ring-amber-400 cursor-pointer' : 'opacity-80'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-black text-white">{pits[idx]}</span>
                  <div className="flex flex-wrap gap-0.5 justify-center max-h-8 overflow-hidden mt-0.5">
                    {Array.from({ length: Math.min(pits[idx], 8) }).map((_, i) => (
                      <span key={i} className={`w-1.5 h-1.5 rounded-full border ${currentTheme.seed}`} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Player 1 Kalah Store (Right) */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            P1 Store
          </span>
          <div className={`w-14 sm:w-16 h-36 sm:h-44 rounded-2xl ${currentTheme.pit} border-2 flex flex-col items-center justify-center p-2 shadow-inner relative`}>
            <span className="text-xl sm:text-2xl font-black text-white">{pits[6]}</span>
            <div className="flex flex-wrap gap-1 justify-center max-h-24 overflow-hidden mt-1">
              {Array.from({ length: Math.min(pits[6], 16) }).map((_, i) => (
                <span key={i} className={`w-2 h-2 rounded-full border shadow-sm ${currentTheme.seed}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
