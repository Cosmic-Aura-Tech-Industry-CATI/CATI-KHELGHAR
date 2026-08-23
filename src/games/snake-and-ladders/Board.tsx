'use client';

import React from 'react';
import { SnakePlayer } from './types';

interface SnakeBoardProps {
  players: SnakePlayer[];
  snakes: Record<number, number>;
  ladders: Record<number, number>;
  currentTurnIndex: number;
}

export const SnakeBoard: React.FC<SnakeBoardProps> = ({
  players,
  snakes,
  ladders
}) => {
  // Generate 100 tiles in zigzag order (Row 10 at top: 100 down to 91, Row 9: 81 up to 90...)
  const rows: number[][] = [];
  for (let r = 9; r >= 0; r--) {
    const rowTiles: number[] = [];
    for (let c = 0; c < 10; c++) {
      if (r % 2 === 1) {
        // Even from bottom: 100 down to 91, 80 down to 71...
        rowTiles.push(r * 10 + (10 - c));
      } else {
        // Odd from bottom: 81 to 90, 61 to 70...
        rowTiles.push(r * 10 + c + 1);
      }
    }
    rows.push(rowTiles);
  }

  return (
    <div className="w-full max-w-[480px] sm:max-w-[540px] mx-auto p-2.5 sm:p-3.5 bg-gradient-to-br from-[#4a2c17] to-[#26150b] rounded-[28px] border-4 border-[#3e2212] shadow-2xl overflow-hidden select-none">
      {/* 10x10 Grid with explicit inline style */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
          gap: '2px'
        }}
        className="w-full bg-[#1c120a] rounded-2xl p-1 border border-[#3e2718] overflow-hidden"
      >
        {rows.map((rowTiles, rIdx) =>
          rowTiles.map(tNum => {
            const isSnakeHead = !!snakes[tNum];
            const isLadderBottom = !!ladders[tNum];
            const is100 = tNum === 100;
            const isAlt = (Math.floor((tNum - 1) / 10) + (tNum % 10)) % 2 === 0;

            const tokensHere = players.filter(p => p.position === tNum);

            return (
              <div
                key={tNum}
                className={`aspect-square relative flex flex-col justify-between p-0.5 rounded-lg border text-[10px] sm:text-xs transition-colors ${
                  is100
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black border-amber-300 shadow-md'
                    : isAlt
                    ? 'bg-[#f7f0e3] border-[#d8c7b0] text-[#3e2718]'
                    : 'bg-[#ebdcc8] border-[#cbb79c] text-[#4a2c17]'
                }`}
              >
                {/* Tile Number */}
                <div className="flex justify-between items-start leading-none font-bold">
                  <span className={is100 ? 'text-slate-950 font-black' : 'text-[#6b4226] text-[9px] sm:text-[10px]'}>
                    {tNum}
                  </span>
                  {is100 && <span>👑</span>}
                </div>

                {/* Snake or Ladder Badges */}
                <div className="text-center font-bold text-[7.5px] sm:text-[9px] leading-tight">
                  {isSnakeHead && (
                    <span className="inline-block px-0.5 sm:px-1 py-0.2 rounded bg-red-600 text-white shadow-sm font-black">
                      🐍➔{snakes[tNum]}
                    </span>
                  )}
                  {isLadderBottom && (
                    <span className="inline-block px-0.5 sm:px-1 py-0.2 rounded bg-emerald-700 text-white shadow-sm font-black">
                      🪜➔{ladders[tNum]}
                    </span>
                  )}
                </div>

                {/* Tokens on this tile */}
                <div className="flex flex-wrap items-center justify-center gap-0.5 min-h-[12px]">
                  {tokensHere.map((p, idx) => (
                    <div
                      key={idx}
                      className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] sm:text-xs shadow-md transform hover:scale-125 transition-transform"
                      style={{ backgroundColor: p.color }}
                      title={`${p.name} (Tile ${p.position})`}
                    >
                      {p.avatar}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
