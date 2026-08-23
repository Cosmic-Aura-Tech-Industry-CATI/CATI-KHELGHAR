'use client';

import React from 'react';
import { LudoPlayer, LudoValidMove, LudoTheme } from './types';
import { getLudoTokenPosition } from './logic';

interface LudoBoardProps {
  players: LudoPlayer[];
  validMoves: LudoValidMove[];
  currentTurnIndex: number;
  hasRolled: boolean;
  theme?: LudoTheme;
  onTokenClick: (tokenId: number) => void;
}

export const LudoBoard: React.FC<LudoBoardProps> = ({
  players,
  validMoves,
  currentTurnIndex,
  hasRolled,
  theme = 'sakura',
  onTokenClick
}) => {
  const activePlayer = players[currentTurnIndex];

  // Colors per theme for each quadrant
  const getThemePalette = () => {
    if (theme === 'sakura') {
      return {
        red: {
          yard: 'bg-[#f498ac] border-[#df7e93]',
          yardInner: 'bg-[#fff0f4]',
          track: 'bg-[#f498ac] text-white',
          token: '#e87a90',
          star: '🌸'
        },
        green: {
          yard: 'bg-[#8fa85b] border-[#7a9348]',
          yardInner: 'bg-[#f4f8ec]',
          track: 'bg-[#8fa85b] text-white',
          token: '#8ea358',
          star: '🌸'
        },
        yellow: {
          yard: 'bg-[#ebb953] border-[#d8a339]',
          yardInner: 'bg-[#fff9eb]',
          track: 'bg-[#ebb953] text-slate-900',
          token: '#e5b84c',
          star: '🌸'
        },
        blue: {
          yard: 'bg-[#6c9bc5] border-[#5584ae]',
          yardInner: 'bg-[#f0f6fc]',
          track: 'bg-[#6c9bc5] text-white',
          token: '#6b9ac4',
          star: '🌸'
        },
        center: 'bg-gradient-to-br from-[#fff7f9] to-[#fce4ec] border-2 border-amber-300 shadow-inner',
        centerIcon: '🌸',
        defaultTrack: 'bg-[#fffdfa]',
        defaultBorder: 'border-[#f2e6dc]',
        safeStar: '🌸'
      };
    }

    if (theme === 'voxel') {
      return {
        red: {
          yard: 'bg-[#b91c1c] border-[#991b1b]',
          yardInner: 'bg-[#e5e5e5]',
          track: 'bg-[#dc2626] text-white',
          token: '#dc2626',
          star: '★'
        },
        green: {
          yard: 'bg-[#15803d] border-[#166534]',
          yardInner: 'bg-[#e5e5e5]',
          track: 'bg-[#16a34a] text-white',
          token: '#16a34a',
          star: '★'
        },
        yellow: {
          yard: 'bg-[#d97706] border-[#b45309]',
          yardInner: 'bg-[#e5e5e5]',
          track: 'bg-[#eab308] text-slate-950',
          token: '#eab308',
          star: '★'
        },
        blue: {
          yard: 'bg-[#1d4ed8] border-[#1e40af]',
          yardInner: 'bg-[#e5e5e5]',
          track: 'bg-[#2563eb] text-white',
          token: '#2563eb',
          star: '★'
        },
        center: 'bg-[#1e1e1e] border-2 border-[#525252]',
        centerIcon: '💎',
        defaultTrack: 'bg-[#f0f0f0]',
        defaultBorder: 'border-[#b5b5b5]',
        safeStar: '★'
      };
    }

    // Default 'classic'
    return {
      red: {
        yard: 'bg-red-600 border-red-700',
        yardInner: 'bg-white',
        track: 'bg-red-500 text-white',
        token: '#ef4444',
        star: '★'
      },
      green: {
        yard: 'bg-emerald-600 border-emerald-700',
        yardInner: 'bg-white',
        track: 'bg-emerald-500 text-white',
        token: '#10b981',
        star: '★'
      },
      yellow: {
        yard: 'bg-amber-500 border-amber-600',
        yardInner: 'bg-white',
        track: 'bg-amber-400 text-slate-900',
        token: '#f59e0b',
        star: '★'
      },
      blue: {
        yard: 'bg-sky-600 border-sky-700',
        yardInner: 'bg-white',
        track: 'bg-sky-500 text-white',
        token: '#0ea5e9',
        star: '★'
      },
      center: 'bg-slate-900 border-2 border-amber-400/50',
      centerIcon: '★',
      defaultTrack: 'bg-white',
      defaultBorder: 'border-slate-300',
      safeStar: '★'
    };
  };

  const palette = getThemePalette();

  // Helper to determine cell background and styling on 15x15 board
  const getCellDetails = (r: number, c: number) => {
    // Yards
    if (r < 6 && c < 6) return { type: 'yard', color: palette.red.yard, border: palette.red.yard };
    if (r < 6 && c > 8) return { type: 'yard', color: palette.green.yard, border: palette.green.yard };
    if (r > 8 && c > 8) return { type: 'yard', color: palette.yellow.yard, border: palette.yellow.yard };
    if (r > 8 && c < 6) return { type: 'yard', color: palette.blue.yard, border: palette.blue.yard };

    // Center Home
    if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
      return { type: 'center', color: palette.center, isCenter: true };
    }

    // Home colored tracks
    if (r === 7 && c >= 1 && c <= 5) return { type: 'home-track', color: palette.red.track };
    if (c === 7 && r >= 1 && r <= 5) return { type: 'home-track', color: palette.green.track };
    if (r === 7 && c >= 9 && c <= 13) return { type: 'home-track', color: palette.yellow.track };
    if (c === 7 && r >= 9 && r <= 13) return { type: 'home-track', color: palette.blue.track };

    // Start positions
    if (r === 6 && c === 1) return { type: 'start', color: palette.red.track, star: true };
    if (r === 1 && c === 8) return { type: 'start', color: palette.green.track, star: true };
    if (r === 8 && c === 13) return { type: 'start', color: palette.yellow.track, star: true };
    if (r === 13 && c === 6) return { type: 'start', color: palette.blue.track, star: true };

    // Safe star spots
    const isStar =
      (r === 2 && c === 6) ||
      (r === 6 && c === 12) ||
      (r === 12 && c === 8) ||
      (r === 8 && c === 2);

    return {
      type: 'track',
      color: palette.defaultTrack,
      star: isStar
    };
  };

  // Find tokens on each cell
  const getTokensAtCell = (r: number, c: number) => {
    const tokensHere: {
      player: LudoPlayer;
      tokenId: number;
      isMovable: boolean;
      customColor: string;
    }[] = [];

    players.forEach(p => {
      // Map player theme color
      let customColor = p.colorHex;
      if (p.color === 'red') customColor = palette.red.token;
      else if (p.color === 'green') customColor = palette.green.token;
      else if (p.color === 'yellow') customColor = palette.yellow.token;
      else if (p.color === 'blue') customColor = palette.blue.token;

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
            isMovable,
            customColor
          });
        }
      });
    });

    return tokensHere;
  };

  // Outer Board Wrapper Style based on theme
  const getBoardOuterStyle = () => {
    if (theme === 'sakura') {
      return 'p-3 sm:p-4 bg-gradient-to-br from-[#f8d7da] via-[#fad4dc] to-[#edd0d7] rounded-[32px] border-4 border-[#e2a8b6] shadow-[0_20px_50px_rgba(226,168,182,0.35),inset_0_2px_4px_rgba(255,255,255,0.9)]';
    }
    if (theme === 'voxel') {
      return 'p-3 sm:p-4 bg-[#3a3a3a] rounded-[28px] border-4 border-[#222222] shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_2px_4px_rgba(255,255,255,0.1)]';
    }
    return 'p-3 sm:p-4 bg-gradient-to-br from-[#4a2c17] to-[#26150b] rounded-[28px] border-4 border-[#3e2212] shadow-2xl';
  };

  return (
    <div className={`w-full max-w-[480px] sm:max-w-[540px] mx-auto select-none transition-all duration-300 relative ${getBoardOuterStyle()}`}>
      {/* Corner Accents for Voxel (Torches) or Sakura (Cherry Flowers) */}
      {theme === 'voxel' && (
        <>
          <div className="absolute top-1 left-1 text-sm select-none pointer-events-none z-10">🔥</div>
          <div className="absolute top-1 right-1 text-sm select-none pointer-events-none z-10">🔥</div>
          <div className="absolute bottom-1 left-1 text-sm select-none pointer-events-none z-10">🔥</div>
          <div className="absolute bottom-1 right-1 text-sm select-none pointer-events-none z-10">🔥</div>
        </>
      )}

      {theme === 'sakura' && (
        <>
          <div className="absolute -top-1 -left-1 text-base select-none pointer-events-none z-10">🌸</div>
          <div className="absolute -top-1 -right-1 text-base select-none pointer-events-none z-10">🌸</div>
          <div className="absolute -bottom-1 -left-1 text-base select-none pointer-events-none z-10">🌸</div>
          <div className="absolute -bottom-1 -right-1 text-base select-none pointer-events-none z-10">🌸</div>
        </>
      )}

      {/* 15x15 CSS Grid with explicit inline style */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(15, minmax(0, 1fr))',
          gap: '1px'
        }}
        className={`w-full rounded-2xl p-1 overflow-hidden shadow-inner ${
          theme === 'sakura'
            ? 'bg-[#f4e4eb] border border-[#e6c2d0]'
            : theme === 'voxel'
            ? 'bg-[#262626] border border-[#404040]'
            : 'bg-[#1c120a] border border-[#3e2718]'
        }`}
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
                    className="aspect-square relative flex items-center justify-center bg-transparent col-span-1 row-span-1"
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-black drop-shadow-sm select-none">
                      {palette.centerIcon}
                    </div>
                    {/* Render Home finished tokens */}
                    <div className="relative z-10 flex flex-wrap gap-0.5 items-center justify-center p-0.5">
                      {tokens.map((t, idx) => (
                        <div
                          key={idx}
                          className="w-3.5 h-3.5 rounded-full border border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-white"
                          style={{ backgroundColor: t.customColor }}
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
                  className="aspect-square flex items-center justify-center p-0.5"
                >
                  {tokens.map((t, idx) => (
                    <div
                      key={idx}
                      className="w-3.5 h-3.5 rounded-full border border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ backgroundColor: t.customColor }}
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
                  isYardCircle
                    ? theme === 'sakura'
                      ? '!bg-[#fff7fa] rounded-full border border-[#f0c2d3] shadow-sm m-0.5'
                      : theme === 'voxel'
                      ? '!bg-[#d4d4d4] rounded-sm border border-[#a3a3a3] shadow-inner m-0.5'
                      : '!bg-white/90 rounded-full shadow-inner m-0.5'
                    : ''
                }`}
              >
                {cell.star && !tokens.length && (
                  <span className={`font-black text-xs sm:text-sm select-none ${
                    theme === 'sakura' ? 'text-pink-600' : 'text-amber-500'
                  }`}>
                    {palette.safeStar}
                  </span>
                )}

                {/* Tokens Stack */}
                {tokens.length > 0 && (
                  <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 p-0.5 z-20">
                    {tokens.map((t, idx) => {
                      const isMulti = tokens.length > 1;

                      // Themed Token shape
                      if (theme === 'voxel') {
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={!t.isMovable}
                            onClick={() => {
                              if (t.isMovable) onTokenClick(t.tokenId);
                            }}
                            aria-label={`${t.player.name} token ${t.tokenId + 1}`}
                            className={`rounded-sm border border-white/80 font-black text-white shadow-md flex items-center justify-center transition-all ${
                              isMulti ? 'w-4 h-4 text-[8px]' : 'w-6 h-6 sm:w-7 sm:h-7 text-xs'
                            } ${
                              t.isMovable
                                ? 'ring-4 ring-yellow-400 scale-125 z-30 cursor-pointer animate-bounce'
                                : 'cursor-default'
                            }`}
                            style={{
                              backgroundColor: t.customColor,
                              boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.4), inset -1px -1px 0 rgba(0,0,0,0.4)'
                            }}
                          >
                            <span>{t.tokenId + 1}</span>
                          </button>
                        );
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={!t.isMovable}
                          onClick={() => {
                            if (t.isMovable) onTokenClick(t.tokenId);
                          }}
                          aria-label={`${t.player.name} token ${t.tokenId + 1}`}
                          className={`rounded-full border-2 border-white/90 font-black text-white shadow-md flex items-center justify-center transition-all ${
                            isMulti ? 'w-4 h-4 text-[8px]' : 'w-6 h-6 sm:w-7 sm:h-7 text-xs'
                          } ${
                            t.isMovable
                              ? 'ring-4 ring-amber-400 scale-125 z-30 cursor-pointer animate-bounce'
                              : 'cursor-default'
                          }`}
                          style={{
                            backgroundColor: t.customColor,
                            boxShadow: theme === 'sakura' ? '0 2px 5px rgba(0,0,0,0.2), inset 0 2px 3px rgba(255,255,255,0.4)' : undefined
                          }}
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
