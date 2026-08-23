'use client';

import React from 'react';
import { BoardCellData } from '../types';

interface BoardCellProps {
  cell: BoardCellData;
}

export const BoardCell: React.FC<BoardCellProps> = ({ cell }) => {
  const is100 = cell.isWinningCell;
  const is1 = cell.number === 1;

  // Classic board styling
  let bgClass = 'bg-[#fcf8f0] text-[#3e2718] border-[#e2d6c5]'; // Cream
  if (cell.isAlternate) {
    bgClass = 'bg-[#f3ead8] text-[#3e2718] border-[#dcceb9]'; // Soft Beige
  }
  if (is100) {
    bgClass = 'bg-gradient-to-br from-[#fbbf24] via-[#f59e0b] to-[#d97706] text-slate-950 font-black border-amber-400 shadow-md';
  } else if (is1) {
    bgClass = 'bg-gradient-to-br from-[#bae6fd] to-[#7dd3fc] text-slate-950 font-black border-sky-300';
  }

  return (
    <div
      data-cell={cell.number}
      className={`aspect-square relative flex flex-col justify-between p-1 rounded-md border text-[9px] sm:text-xs transition-colors shadow-sm select-none ${bgClass}`}
    >
      {/* Tile Number Header */}
      <div className="flex items-center justify-between w-full leading-none font-bold">
        <span
          className={`text-[9px] sm:text-[11px] font-black ${
            is100 ? 'text-slate-950 text-xs sm:text-sm' : 'text-[#6b4226]'
          }`}
        >
          {cell.number}
        </span>
        {is100 && <span className="text-xs sm:text-sm">👑</span>}
        {is1 && <span className="text-[8px] sm:text-[9px] font-black uppercase text-sky-900">Start</span>}
      </div>

      {/* Target indicator for snakes or ladders */}
      <div className="flex items-center justify-center text-[7.5px] sm:text-[8.5px] font-black">
        {cell.isLadderBottom && (
          <span className="px-1 py-0.2 rounded bg-amber-600 text-white shadow-xs">
            🪜 {cell.ladderTo}
          </span>
        )}
        {cell.isSnakeHead && (
          <span className="px-1 py-0.2 rounded bg-red-600 text-white shadow-xs">
            🐍 {cell.snakeTo}
          </span>
        )}
      </div>

      {/* Empty bottom spacer to keep cell layout balanced */}
      <div className="h-1.5" />
    </div>
  );
};
