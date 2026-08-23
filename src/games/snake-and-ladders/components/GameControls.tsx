'use client';

import React from 'react';
import { SnakePlayer } from '../types';
import { PlayerCard } from './PlayerCard';
import { Dice } from './Dice';
import { ActivityLog } from './ActivityLog';

interface GameControlsProps {
  players: SnakePlayer[];
  currentTurnIndex: number;
  diceValue: number;
  isRolling: boolean;
  isMoving: boolean;
  winner: SnakePlayer | null;
  activityLog: string[];
  onRollDice: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  players,
  currentTurnIndex,
  diceValue,
  isRolling,
  isMoving,
  winner,
  activityLog,
  onRollDice
}) => {
  const activePlayer = players[currentTurnIndex];

  return (
    <div className="space-y-4 w-full">
      {/* Player Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
        {players.map((p, idx) => (
          <PlayerCard
            key={p.id}
            player={p}
            isTurn={idx === currentTurnIndex && !winner}
          />
        ))}
      </div>

      {/* Main Dice Action Card */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col items-center space-y-3">
        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
            {winner ? 'Match Ended' : 'Current Turn'}
          </span>
          <h3 className="text-base font-black text-white flex items-center justify-center gap-1.5 mt-0.5">
            <span>{activePlayer?.avatar}</span>
            <span>{winner ? `${winner.name} Won! 👑` : activePlayer?.name}</span>
          </h3>
        </div>

        <Dice
          value={diceValue}
          isRolling={isRolling}
          disabled={isMoving || !!winner}
          onRoll={onRollDice}
          playerName={activePlayer?.name}
        />
      </div>

      {/* Activity Log */}
      <ActivityLog logs={activityLog} />
    </div>
  );
};
