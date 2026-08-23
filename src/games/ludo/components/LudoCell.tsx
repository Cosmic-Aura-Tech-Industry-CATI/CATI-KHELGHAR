'use client';
import React from 'react';
import { BoardCell } from '../types';

interface LudoCellProps {
  cell: BoardCell;
}

const HOME_AREA_COLORS = {
  red:    'bg-[#F8D0DA]',
  green:  'bg-[#D5EAC8]',
  yellow: 'bg-[#FDF0C0]',
  blue:   'bg-[#C5DCF5]',
};

const HOME_LANE_COLORS = {
  red:    'bg-[#F58BA8]',
  green:  'bg-[#8DAA62]',
  yellow: 'bg-[#F2C45E]',
  blue:   'bg-[#7EA7D8]',
};

const START_COLORS = {
  red:    'bg-[#F58BA8] ring-1 ring-[#D95C83]',
  green:  'bg-[#8DAA62] ring-1 ring-[#5a7a3a]',
  yellow: 'bg-[#F2C45E] ring-1 ring-[#C99A3D]',
  blue:   'bg-[#7EA7D8] ring-1 ring-[#4a7ab8]',
};

export const LudoCell = React.memo<LudoCellProps>(function LudoCell({ cell }) {
  if (cell.type === 'empty') {
    return <div className="aspect-square" />;
  }

  if (cell.type === 'home-area') {
    const colorClass = cell.color ? HOME_AREA_COLORS[cell.color] : 'bg-gray-100';
    return (
      <div className={`aspect-square ${colorClass} border border-[#C99A3D]/20`} />
    );
  }

  if (cell.type === 'center') {
    return (
      <div className="aspect-square bg-[#FFF7EF] border border-[#C99A3D]/30 flex items-center justify-center">
        {cell.row === 7 && cell.col === 7 && (
          <span className="text-[6px] sm:text-[8px] select-none opacity-60">🌸</span>
        )}
      </div>
    );
  }

  if (cell.type === 'home-lane') {
    const colorClass = cell.color ? HOME_LANE_COLORS[cell.color] : 'bg-gray-200';
    const isLast = cell.homeLaneIndex === 4;
    return (
      <div className={`aspect-square ${colorClass} border border-[#C99A3D]/40 flex items-center justify-center ${isLast ? 'opacity-90' : ''}`}>
        {isLast && <span className="text-[6px] select-none">⭐</span>}
      </div>
    );
  }

  if (cell.type === 'safe' || cell.type === 'start') {
    const colorClass = cell.color && cell.type === 'start'
      ? START_COLORS[cell.color]
      : 'bg-[#FFFDF9]';
    return (
      <div className={`aspect-square ${colorClass} border border-[#C99A3D]/50 flex items-center justify-center`}>
        <span className="text-[7px] sm:text-[9px] select-none leading-none">🌸</span>
      </div>
    );
  }

  // Path cell
  return (
    <div className="aspect-square bg-[#FFFDF9] border border-[#C99A3D]/30 hover:bg-[#FFF3E0]/50 transition-colors" />
  );
});
