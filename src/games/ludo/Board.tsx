'use client';

import React from 'react';
import { LudoPlayer, LudoValidMove } from './types';
import { getLudoTokenPosition } from './logic';

interface LudoBoardProps {
  players: LudoPlayer[];
  validMoves: LudoValidMove[];
  currentTurnIndex: number;
  hasRolled: boolean;
  onTokenClick: (tokenId: number) => void;
}

export const LudoBoard: React.FC<LudoBoardProps> = ({
  players,
  validMoves,
  currentTurnIndex,
  hasRolled,
  onTokenClick
}) => {
  const activePlayer = players[currentTurnIndex];

  // Helper to determine cell background and styling on 15x15 board
  const getCellDetails = (r: number, c: number) => {
    // Yards
    if (r < 6 && c < 6) return { type: 'yard', color: 'bg-red-600', border: 'border-red-700' };
    if (r < 6 && c > 8) return { type: 'yard', color: 'bg-emerald-600', border: 'border-emerald-700' };
    if (r > 8 && c > 8) return { type: 'yard', color: 'bg-amber-500', border: 'border-amber-600' };
    if (r > 8 && c < 6) return { type: 'yard', color: 'bg-sky-600', border: 'border-sky-700' };

    // Center Home
    if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
      return { type: 'center', color: 'bg-slate-900', isCenter: true };
    }

    // Home colored tracks
    if (r === 7 && c >= 1 && c <= 5) return { type: 'home-track', color: 'bg-red-500 text-white' };
    if (c === 7 && r >= 1 && r <= 5) return { type: 'home-track', color: 'bg-emerald-500 text-white' };
    if (r === 7 && c >= 9 && c <= 13) return { type: 'home-track', color: 'bg-amber-400 text-slate-900' };
    if (c === 7 && r >= 9 && r <= 13) return { type: 'home-track', color: 'bg-sky-500 text-white' };

    // Start positions
    if (r === 6 && c === 1) return { type: 'start', color: 'bg-red-500 text-white font-bold', star: true };
    if (r === 1 && c === 8) return { type: 'start', color: 'bg-emerald-500 text-white font-bold', star: true };
    if (r === 8 && c === 13) return { type: 'start', color: 'bg-amber-400 text-slate-900 font-bold', star: true };
    if (r === 13 && c === 6) return { type: 'start', color: 'bg-sky-500 text-white font-bold', star: true };

    // Safe star spots
    const isStar =
      (r === 2 && c === 6) ||
      (r === 6 && c === 12) ||
      (r === 12 && c === 8) ||
      (r === 8 && c === 2);

    return {
      type: 'track',
      color: 'bg-white',
      star: isStar
    };
  };

  // Find tokens on each cell
  const getTokensAtCell = (r: number, c: number) => {
    const tokensHere: {
      player: LudoPlayer;
      tokenId: number;
      isMovable: boolean;
    }[] = [];

    players.forEach(p => {
      p.tokens.forEach(tok => {
        const [tr, tc] = getLudoTokenPosition(p, tok);
        if (tr === r && tc === c) {
          const isMovable =
            hasRolled &&
            p.id === activePlayer.id &&
            validMoves.some(m => m.tokenId === tok.id);

          tokensHere.push({
            player: p,
            tokenId: tok.id,
            isMovable
          });
        }
      });
    });

    return tokensHere;
  };

  return (
    <div className="w-full max-w-[480px] sm:max-w-[540px] mx-auto p-2.5 sm:p-3.5 bg-gradient-to-br from-[#4a2c17] to-[#26150b] rounded-[28px] border-4 border-[#3e2212] shadow-2xl overflow-hidden select-none">
      {/* 15x15 CSS Grid with explicit inline style */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(15, minmax(0, 1fr))',
          gap: '1px'
        }}
        className="w-full bg-[#1c120a] rounded-2xl p-1 border border-[#3e2718] overflow-hidden"
      >
        {Array.from({ length: 15 }).map((_, r) =>
          Array.from({ length: 15 }).map((_, c) => {
            const cell = getCellDetails(r, c);
            const tokens = getTokensAtCell(r, c);

            // Center triangular quadrant render
            if (cell.isCenter) {
              if (r === 7 && c === 7) {
                return (
                  <div
                    key={`${r}-${c}`}
                    className="aspect-square relative flex items-center justify-center bg-slate-900 col-span-1 row-span-1"
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-amber-300">
                      ★
                    </div>
                    {/* Render Home finished tokens */}
                    <div className="relative z-10 flex flex-wrap gap-0.5 items-center justify-center p-0.5">
                      {tokens.map((t, idx) => (
                        <div
                          key={idx}
                          className="w-3.5 h-3.5 rounded-full border border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-white"
                          style={{ backgroundColor: t.player.colorHex }}
                        >
                          {t.tokenId + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={`${r}-${c}`}
                  className="aspect-square bg-slate-900 flex items-center justify-center p-0.5"
                >
                  {tokens.map((t, idx) => (
                    <div
                      key={idx}
                      className="w-3.5 h-3.5 rounded-full border border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ backgroundColor: t.player.colorHex }}
                    >
                      {t.tokenId + 1}
                    </div>
                  ))}
                </div>
              );
            }

            // Yard corner background circular base spots
            const isYardCircle =
              (r === 1 && (c === 1 || c === 4)) ||
              (r === 4 && (c === 1 || c === 4)) ||
              (r === 1 && (c === 10 || c === 13)) ||
              (r === 4 && (c === 10 || c === 13)) ||
              (r === 10 && (c === 10 || c === 13)) ||
              (r === 13 && (c === 10 || c === 13)) ||
              (r === 10 && (c === 1 || c === 4)) ||
              (r === 13 && (c === 1 || c === 4));

            return (
              <div
                key={`${r}-${c}`}
                className={`aspect-square relative flex items-center justify-center ${cell.color} ${
                  isYardCircle ? '!bg-white/90 rounded-full shadow-inner m-0.5' : ''
                }`}
              >
                {cell.star && !tokens.length && (
                  <span className="text-amber-500 font-black text-xs sm:text-sm select-none">
                    ★
                  </span>
                )}

                {/* Tokens Stack */}
                {tokens.length > 0 && (
                  <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 p-0.5 z-20">
                    {tokens.map((t, idx) => {
                      const isMulti = tokens.length > 1;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={!t.isMovable}
                          onClick={() => {
                            if (t.isMovable) onTokenClick(t.tokenId);
                          }}
                          aria-label={`${t.player.name} token ${t.tokenId + 1}`}
                          className={`rounded-full border-2 border-white font-black text-white shadow-md flex items-center justify-center transition-all ${
                            isMulti ? 'w-4 h-4 text-[8px]' : 'w-6 h-6 sm:w-7 sm:h-7 text-xs'
                          } ${
                            t.isMovable
                              ? 'ring-4 ring-amber-400 scale-125 z-30 cursor-pointer animate-bounce'
                              : 'cursor-default'
                          }`}
                          style={{ backgroundColor: t.player.colorHex }}
                        >
                          <span>{t.tokenId + 1}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
