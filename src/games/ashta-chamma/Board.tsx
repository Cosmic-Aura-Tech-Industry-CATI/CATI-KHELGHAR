'use client';

import React from 'react';
import { AshtaGameState, AshtaTheme, PlayerColor } from './types';
import { BOARD_COORDS, SAFE_COORDS, getBoardCoordForStep } from './logic';

interface AshtaBoardProps {
  gameState: AshtaGameState;
  theme: AshtaTheme;
  onTokenClick: (tokenId: string) => void;
}

const THEMES: Record<AshtaTheme, { bg: string; cell: string; safe: string; border: string; center: string }> = {
  terracotta: {
    bg: 'bg-[#7c2d12]',
    cell: 'bg-[#ffedd5] border-[#c2410c]/30 text-[#7c2d12]',
    safe: 'bg-[#fed7aa] border-[#ea580c] text-orange-700',
    border: 'border-[#9a3412]',
    center: 'bg-[#ea580c] text-white',
  },
  haveli: {
    bg: 'bg-[#1e1b4b]',
    cell: 'bg-[#e0e7ff] border-[#4338ca]/30 text-[#1e1b4b]',
    safe: 'bg-[#c7d2fe] border-[#4f46e5] text-indigo-800',
    border: 'border-[#312e81]',
    center: 'bg-[#4f46e5] text-white',
  },
  sandalwood: {
    bg: 'bg-[#451a03]',
    cell: 'bg-[#fef3c7] border-[#b45309]/30 text-[#451a03]',
    safe: 'bg-[#fde68a] border-[#d97706] text-amber-800',
    border: 'border-[#78350f]',
    center: 'bg-[#d97706] text-white',
  },
};

const COLOR_MAP: Record<PlayerColor, string> = {
  red: 'bg-red-500 border-red-300 ring-2 ring-red-900',
  green: 'bg-emerald-500 border-emerald-300 ring-2 ring-emerald-900',
  yellow: 'bg-amber-400 border-amber-200 ring-2 ring-amber-800',
  blue: 'bg-sky-500 border-sky-300 ring-2 ring-sky-900',
};

export const AshtaBoardView: React.FC<AshtaBoardProps> = ({ gameState, theme, onTokenClick }) => {
  const currentTheme = THEMES[theme] || THEMES.terracotta;

  const isSafeSquare = (r: number, c: number) =>
    SAFE_COORDS.some((sc) => sc[0] === r && sc[1] === c);

  // Map of "r-c" to tokens positioned there
  const tokensOnSquare = (r: number, c: number) => {
    const list: { tokenId: string; color: PlayerColor; isSelectable: boolean }[] = [];
    gameState.players.forEach((p) => {
      p.tokens.forEach((t) => {
        if (t.stepIndex >= 0) {
          const coord = getBoardCoordForStep(t.color, t.stepIndex);
          if (coord[0] === r && coord[1] === c) {
            const isSelectable = gameState.validMoves.some((m) => m.tokenId === t.id);
            list.push({ tokenId: t.id, color: t.color, isSelectable });
          }
        }
      });
    });
    return list;
  };

  return (
    <div className={`relative p-3 rounded-3xl ${currentTheme.bg} border-4 ${currentTheme.border} shadow-2xl max-w-[460px] w-full mx-auto select-none`}>
      <div className="grid grid-cols-5 aspect-square rounded-2xl overflow-hidden gap-1 p-1 bg-black/20 shadow-inner">
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 5 }).map((__, c) => {
            const isSafe = isSafeSquare(r, c);
            const isCenter = r === 2 && c === 2;
            const tokens = tokensOnSquare(r, c);

            return (
              <div
                key={`${r}-${c}`}
                className={`relative flex items-center justify-center rounded-xl border transition-all duration-150 ${
                  isCenter ? currentTheme.center : isSafe ? currentTheme.safe : currentTheme.cell
                }`}
              >
                {/* Safe Cross Icon */}
                {isSafe && (
                  <span className="absolute text-xl sm:text-2xl font-black opacity-40 select-none">
                    ✕
                  </span>
                )}
                {isCenter && (
                  <span className="absolute text-xs sm:text-sm font-black uppercase tracking-wider opacity-60">
                    HAVELI
                  </span>
                )}

                {/* Tokens Stacked */}
                <div className="relative z-10 flex flex-wrap items-center justify-center gap-1 p-1">
                  {tokens.map((tok) => (
                    <button
                      key={tok.tokenId}
                      type="button"
                      onClick={() => onTokenClick(tok.tokenId)}
                      disabled={!tok.isSelectable}
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border shadow-md flex items-center justify-center transition-all ${
                        COLOR_MAP[tok.color]
                      } ${
                        tok.isSelectable
                          ? 'animate-bounce ring-4 ring-amber-300 scale-110 cursor-pointer z-20'
                          : ''
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-white/60" />
                    </button>
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
