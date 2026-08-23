'use client';

import React from 'react';
import { sounds } from '@/lib/sounds';

interface DiceRollerProps {
  value: number;
  isRolling: boolean;
  disabled: boolean;
  onRoll: () => void;
  color?: string;
  label?: string;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  value,
  isRolling,
  disabled,
  onRoll,
  color = '#f97316',
  label = 'Roll Dice'
}) => {
  const handleRoll = () => {
    if (disabled || isRolling) return;
    sounds.playDiceRoll();
    onRoll();
  };

  // Render 1 to 6 pips on the 2D dice face
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
      <div className="grid grid-cols-3 grid-rows-3 w-12 h-12 p-2 gap-1 bg-white rounded-2xl shadow-inner border border-slate-200">
        {Array.from({ length: 9 }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-center">
            {activePips.includes(idx) && (
              <span
                className={`w-2.5 h-2.5 rounded-full ${
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
    <div className="flex flex-col items-center gap-3">
      {/* Interactive Dice Cube Button */}
      <button
        type="button"
        disabled={disabled || isRolling}
        onClick={handleRoll}
        aria-label={`${label}, Current value ${value}`}
        className={`relative p-2.5 rounded-3xl bg-white shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-amber-400 ${
          isRolling
            ? 'animate-spin scale-110 shadow-2xl'
            : disabled
            ? 'opacity-60 cursor-not-allowed'
            : 'hover:scale-105 active:scale-95 cursor-pointer shadow-orange-500/20'
        }`}
      >
        {renderPips(value)}
      </button>

      <button
        type="button"
        disabled={disabled || isRolling}
        onClick={handleRoll}
        className={`px-5 py-2 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${
          disabled || isRolling
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 shadow-lg shadow-orange-500/20 active:scale-95'
        }`}
      >
        {isRolling ? 'Rolling...' : `🎲 ${label}`}
      </button>
    </div>
  );
};
