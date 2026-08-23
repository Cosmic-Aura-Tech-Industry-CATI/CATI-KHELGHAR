'use client';

import React, { useMemo } from 'react';
import { SnakePlayer } from '../types';
import { generateBoardCells } from '../logic';
import { BoardCell } from './BoardCell';
import { BoardOverlay } from './BoardOverlay';
import { PlayerToken } from './PlayerToken';

interface GameBoardProps {
  players: SnakePlayer[];
  currentTurnIndex: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  players,
  currentTurnIndex
}) => {
  const cells = useMemo(() => generateBoardCells(), []);

  // Compute multi-player grouping by tile position
  const playersByTile = useMemo(() => {
    const map: Record<number, SnakePlayer[]> = {};
    players.forEach(p => {
      if (p.position > 0) {
        if (!map[p.position]) map[p.position] = [];
        map[p.position].push(p);
      }
    });
    return map;
  }, [players]);

  return (
    <div className="relative w-full max-w-[460px] sm:max-w-[520px] lg:max-w-[560px] aspect-square mx-auto p-3 sm:p-4 rounded-[32px] bg-gradient-to-br from-[#6b4226] via-[#4a2c17] to-[#321d0f] shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-4px_8px_rgba(0,0,0,0.6)] border-4 border-[#3d2212] select-none">
      {/* Outer Inner Bevel */}
      <div className="relative w-full h-full p-1 rounded-[22px] bg-[#1e130b] shadow-inner overflow-hidden">
        {/* 10x10 CSS Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(10, minmax(0, 1fr))',
            gap: '1px'
          }}
          className="relative w-full h-full bg-[#3d2718] rounded-[18px] overflow-hidden"
        >
          {cells.map(cell => (
            <BoardCell key={cell.number} cell={cell} />
          ))}
        </div>

        {/* SVG Snakes and Ladders Overlay */}
        <BoardOverlay />

        {/* Animated Player Tokens Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {players.map(p => {
            const listOnTile = playersByTile[p.position] || [];
            const indexOnTile = listOnTile.findIndex(item => item.id === p.id);
            const isTurn = players[currentTurnIndex]?.id === p.id;

            return (
              <PlayerToken
                key={p.id}
                player={p}
                allPlayersOnSameCell={listOnTile.length}
                playerIndexOnSameCell={indexOnTile >= 0 ? indexOnTile : 0}
                isCurrentTurn={isTurn}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
