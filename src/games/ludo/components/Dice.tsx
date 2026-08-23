'use client';
import React from 'react';

interface DiceProps {
  value: number | null;
  rolling: boolean;
  disabled: boolean;
  onRoll: () => void;
}

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
};

export const Dice: React.FC<DiceProps> = ({ value, rolling, disabled, onRoll }) => {
  const dots = value ? DOT_POSITIONS[value] : DOT_POSITIONS[1];

  return (
    <button
      type="button"
      onClick={onRoll}
      disabled={disabled || rolling}
      aria-label={rolling ? 'Dice rolling' : `Roll dice${value ? `, current: ${value}` : ''}`}
      className={`
        relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl select-none transition-all duration-150
        border-b-4 border-r-4 active:border-b-0 active:border-r-0 active:translate-y-1
        focus:outline-none focus:ring-4 focus:ring-amber-400/50
        ${rolling ? 'animate-[diceSpin_0.5s_ease-in-out_infinite]' : ''}
        ${disabled && !rolling
          ? 'opacity-50 cursor-not-allowed bg-slate-200 border-slate-400'
          : 'cursor-pointer bg-[#FFFDF9] border-[#C99A3D] shadow-[0_6px_0_#8B6914,0_6px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_3px_0_#8B6914,0_3px_12px_rgba(0,0,0,0.2)] hover:-translate-y-0.5'
        }
      `}
    >
      {/* Dots */}
      <div className="absolute inset-1 relative">
        {dots.map(([x, y], i) => (
          <span
            key={i}
            className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#6B4536] shadow-inner"
            style={{
              left: `calc(${x}% - 5px)`,
              top: `calc(${y}% - 5px)`,
            }}
          />
        ))}
      </div>
      {/* Corner decorations */}
      <span className="absolute top-0.5 right-0.5 text-[6px] opacity-30 select-none">🌸</span>
      <span className="absolute bottom-0.5 left-0.5 text-[6px] opacity-30 select-none">🌸</span>
    </button>
  );
};
