'use client';

import React from 'react';
import { sounds } from '@/lib/sounds';

interface DiceProps {
  value: number;
  isRolling: boolean;
  disabled: boolean;
  onRoll: () => void;
  playerName?: string;
}

export const Dice: React.FC<DiceProps> = ({
  value,
  isRolling,
  disabled,
  onRoll,
  playerName
}) => {
  const handleRoll = () => {
    if (disabled || isRolling) return;
    sounds.playDiceRoll();
    onRoll();
  };

  const renderPips = (val: number) => {
    const pipsLayout: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    };
    const activePips = pipsLayout[val] || [4];

    return (
      <div className="grid grid-cols-3 grid-rows-3 w-14 h-14 sm:w-16 sm:h-16 p-2.5 gap-1.5 bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#e2e8f0] rounded-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.15),0_8px_16px_rgba(0,0,0,0.4)] border border-slate-300 select-none">
        {Array.from({ length: 9 }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-center">
            {activePips.includes(idx) && (
              <span
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shadow-inner ${
                  val === 1 ? 'bg-red-600' : 'bg-slate-900'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* 3D Dice Cube */}
      <button
        type="button"
        disabled={disabled || isRolling}
        onClick={handleRoll}
        aria-label={`Roll Dice. Current value is ${value}.`}
        className={`relative p-2 rounded-3xl bg-[#1e293b] border-2 border-slate-700 shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-amber-500 ${
          isRolling
            ? 'animate-spin scale-110 shadow-2xl'
            : disabled
            ? 'opacity-60 cursor-not-allowed'
            : 'hover:scale-105 active:scale-95 cursor-pointer hover:border-amber-400'
        }`}
      >
        {renderPips(value)}
      </button>

      {/* Roll Action Button */}
      <button
        type="button"
        disabled={disabled || isRolling}
        onClick={handleRoll}
        className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 select-none ${
          disabled || isRolling
            ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 shadow-orange-500/20 active:scale-95 cursor-pointer'
        }`}
      >
        <span>{isRolling ? 'Rolling...' : `🎲 Roll for ${playerName || 'Player'}`}</span>
      </button>
    </div>
  );
};
