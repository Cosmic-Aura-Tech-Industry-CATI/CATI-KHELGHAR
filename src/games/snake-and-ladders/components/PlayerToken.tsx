'use client';

import React from 'react';
import { SnakePlayer } from '../types';
import { getCellCenterPercent } from '../logic';

interface PlayerTokenProps {
  player: SnakePlayer;
  allPlayersOnSameCell: number; // How many players are on this tile
  playerIndexOnSameCell: number; // 0, 1, 2, 3
  isCurrentTurn: boolean;
}

export const PlayerToken: React.FC<PlayerTokenProps> = ({
  player,
  allPlayersOnSameCell,
  playerIndexOnSameCell,
  isCurrentTurn
}) => {
  if (player.position <= 0) return null; // Outside board initially

  const { x, y } = getCellCenterPercent(player.position);

  // Offset calculation if multiple tokens occupy same tile
  let offsetX = 0;
  let offsetY = 0;

  if (allPlayersOnSameCell > 1) {
    const offsets = [
      { dx: -1.4, dy: -1.4 },
      { dx: 1.4, dy: -1.4 },
      { dx: -1.4, dy: 1.4 },
      { dx: 1.4, dy: 1.4 }
    ];
    const off = offsets[playerIndexOnSameCell % offsets.length];
    offsetX = off.dx;
    offsetY = off.dy;
  }

  return (
    <div
      style={{
        left: `${x + offsetX}%`,
        top: `${y + offsetY}%`,
        transform: 'translate(-50%, -50%)'
      }}
      className={`absolute z-30 transition-all duration-300 ease-out pointer-events-none select-none ${
        isCurrentTurn ? 'scale-110 z-40' : 'scale-100'
      }`}
    >
      <div
        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white flex items-center justify-center text-xs sm:text-sm font-black shadow-lg transition-transform ${
          isCurrentTurn ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 animate-softPulse' : ''
        }`}
        style={{ backgroundColor: player.color }}
        title={`${player.name} (Tile ${player.position})`}
      >
        <span>{player.avatar}</span>
      </div>
    </div>
  );
};
