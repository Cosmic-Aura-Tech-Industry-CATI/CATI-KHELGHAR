'use client';
import React from 'react';
import { Player } from '../types';

interface PlayerPanelProps {
  players: Player[];
  currentPlayerIndex: number;
  isGameOver: boolean;
}

export const PlayerPanel: React.FC<PlayerPanelProps> = ({ players, currentPlayerIndex, isGameOver }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {players.map((player, idx) => {
        const isTurn = idx === currentPlayerIndex && !isGameOver;
        const finishedCount = player.pawns.filter(p => p.status === 'finished').length;
        const activeCount = player.pawns.filter(p => p.status === 'active').length;
        const homeCount = player.pawns.filter(p => p.status === 'home').length;

        return (
          <div
            key={player.id}
            className={`p-2.5 rounded-2xl border transition-all ${
              isTurn
                ? 'ring-2 shadow-lg scale-[1.02]'
                : 'opacity-80'
            }`}
            style={{
              borderColor: isTurn ? player.colorHex : `${player.colorHex}40`,
              background: isTurn ? `${player.colorHex}15` : 'rgba(255,247,239,0.6)',
              boxShadow: isTurn ? `0 0 12px ${player.colorHex}30` : undefined,
              outlineColor: isTurn ? player.colorHex : undefined,
              outline: isTurn ? `2px solid ${player.colorHex}40` : undefined,
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-3 h-3 rounded-full flex-shrink-0 border border-white"
                style={{ backgroundColor: player.colorHex }} />
              <span className="text-xs font-bold truncate text-[#6B4536]">{player.name}</span>
            </div>
            {player.isBot && (
              <span className="text-[9px] text-purple-600 font-bold">🤖 AI Bot</span>
            )}
            {/* Pawn status dots */}
            <div className="flex gap-1 mt-1.5">
              {player.pawns.map(pawn => (
                <span
                  key={pawn.id}
                  className={`w-3 h-3 rounded-full border text-center flex items-center justify-center text-[6px]
                    ${pawn.status === 'finished' ? 'border-amber-400' : 'border-white/60'}`}
                  style={{
                    backgroundColor: pawn.status === 'finished' ? player.colorHex
                      : pawn.status === 'active' ? `${player.colorHex}90`
                      : '#e5e7eb',
                  }}
                  title={pawn.status}
                >
                  {pawn.status === 'finished' && '★'}
                </span>
              ))}
            </div>
            <div className="text-[9px] text-[#8B6442] mt-1">
              {finishedCount > 0 && <span>⭐{finishedCount} </span>}
              {activeCount > 0 && <span>🌸{activeCount} </span>}
              {homeCount > 0 && <span>🏠{homeCount}</span>}
              {player.hasWon && <span className="text-amber-600 font-bold ml-1">#{player.rank}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
