'use client';

import React from 'react';
import { SnakePlayer } from '../types';

interface PlayerCardProps {
  player: SnakePlayer;
  isTurn: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, isTurn }) => {
  const percent = Math.min(100, Math.max(0, player.position));

  return (
    <div
      className={`p-3.5 rounded-2xl border transition-all duration-200 select-none ${
        isTurn
          ? 'bg-[#2b1b11] border-amber-500 ring-2 ring-amber-500/30 shadow-xl scale-[1.02]'
          : 'bg-slate-900/85 border-slate-800 opacity-85'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div
            className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm shadow-md flex-shrink-0"
            style={{ backgroundColor: player.color }}
          >
            {player.avatar}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">{player.name}</h4>
            <span className="text-[10px] text-slate-400 font-medium">
              {player.position === 0 ? 'Not started' : `Tile ${player.position} / 100`}
            </span>
          </div>
        </div>

        {isTurn && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm animate-pulse flex-shrink-0">
            Turn
          </span>
        )}
      </div>

      {/* Mini Progress Bar */}
      <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-2.5 overflow-hidden border border-slate-700/50">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%`, backgroundColor: player.color }}
        />
      </div>
    </div>
  );
};
