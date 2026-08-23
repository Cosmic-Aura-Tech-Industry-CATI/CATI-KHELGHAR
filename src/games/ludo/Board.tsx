'use client';

import React from 'react';
import { LudoPlayer, LudoValidMove, LudoTheme, LudoColor } from './types';
import { getLudoTokenPosition } from './logic';

interface LudoBoardProps {
  players: LudoPlayer[];
  validMoves: LudoValidMove[];
  currentTurnIndex: number;
  hasRolled: boolean;
  theme?: LudoTheme;
  onTokenClick: (tokenId: number) => void;
}

/**
 * Procedural 3D Sakura Blossom Vector Medallion — fills cell entirely, no max-size cap
 */
const SakuraVectorPawn: React.FC<{
  color: LudoColor;
  tokenId: number;
  isMovable: boolean;
  isMulti?: boolean;
  onClick?: () => void;
}> = ({ color, tokenId, isMovable, isMulti, onClick }) => {
  const palette = {
    red:    { ring: '#e11d48', pStart: '#fda4af', pMid: '#f43f5e', pEnd: '#be123c' },
    green:  { ring: '#059669', pStart: '#a7f3d0', pMid: '#10b981', pEnd: '#047857' },
    yellow: { ring: '#d97706', pStart: '#fde68a', pMid: '#f59e0b', pEnd: '#b45309' },
    blue:   { ring: '#0284c7', pStart: '#bae6fd', pMid: '#0ea5e9', pEnd: '#0369a1' }
  }[color];

  // unique gradient IDs per color+token so multiple pawns don't share defs
  const uid = `${color}-${tokenId}`;

  return (
    <button
      type="button"
      disabled={!isMovable}
      onClick={onClick}
      aria-label={`${color} token ${tokenId + 1}`}
      className={`relative flex items-center justify-center select-none transition-all duration-200 rounded-full ${
        isMulti ? 'w-4 h-4 flex-shrink-0' : 'w-full h-full'
      } ${
        isMovable
          ? 'z-30 animate-bounce cursor-pointer drop-shadow-[0_0_10px_rgba(251,191,36,1)]'
          : 'cursor-default'
      }`}
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full block">
        <defs>
          <linearGradient id={`rim-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#fff8db" />
            <stop offset="35%"  stopColor="#f59e0b" />
            <stop offset="70%"  stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <radialGradient id={`bed-${uid}`} cx="38%" cy="32%" r="65%">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="65%"  stopColor="#fffdf5" />
            <stop offset="100%" stopColor="#fef3c7" />
          </radialGradient>
          <radialGradient id={`ptl-${uid}`} cx="38%" cy="32%" r="68%">
            <stop offset="0%"   stopColor={palette.pStart} />
            <stop offset="55%"  stopColor={palette.pMid} />
            <stop offset="100%" stopColor={palette.pEnd} />
          </radialGradient>
        </defs>

        {/* Layers from outside in: gold bevel → color ring → gold inset → porcelain */}
        <circle cx="50" cy="50" r="49" fill={`url(#rim-${uid})`} />
        <circle cx="50" cy="50" r="43" fill={palette.ring} />
        <circle cx="50" cy="50" r="38" fill={`url(#rim-${uid})`} />
        <circle cx="50" cy="50" r="33" fill={`url(#bed-${uid})`} />

        {/* 5 elliptical petals */}
        <g transform="translate(50,50)">
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <ellipse
              key={i}
              cx="0" cy="-17" rx="8" ry="13"
              transform={`rotate(${deg})`}
              fill={`url(#ptl-${uid})`}
              stroke={palette.ring}
              strokeWidth="0.7"
              opacity="0.95"
            />
          ))}
          {/* Gold pistil */}
          <circle cx="0" cy="0" r="7"   fill={`url(#rim-${uid})`} />
          {/* Specular glint */}
          <circle cx="-2" cy="-2" r="2.5" fill="#fff" opacity="0.85" />
        </g>
        {/* Top-left highlight shimmer */}
        <ellipse cx="37" cy="33" rx="10" ry="5" fill="#fff" opacity="0.22" transform="rotate(-30 37 33)" />
      </svg>
    </button>
  );
};

export const LudoBoard: React.FC<LudoBoardProps> = ({
  players,
  validMoves,
  currentTurnIndex,
  hasRolled,
  theme = 'sakura',
  onTokenClick
}) => {
  const activePlayer = players[currentTurnIndex];

  const getThemePalette = () => {
    if (theme === 'sakura') {
      return {
        red:    { yard: 'bg-transparent', track: 'bg-[#e87a90]/70 text-white',       token: '#e87a90' },
        green:  { yard: 'bg-transparent', track: 'bg-[#8ea358]/70 text-white',       token: '#8ea358' },
        yellow: { yard: 'bg-transparent', track: 'bg-[#e5b84c]/70 text-slate-900',   token: '#e5b84c' },
        blue:   { yard: 'bg-transparent', track: 'bg-[#6b9ac4]/70 text-white',       token: '#6b9ac4' },
        center: 'bg-transparent', centerIcon: '', defaultTrack: 'bg-transparent',
        defaultBorder: 'border-transparent', safeStar: ''
      };
    }
    if (theme === 'voxel') {
      return {
        red:    { yard: 'bg-[#b91c1c]', track: 'bg-[#dc2626] text-white',       token: '#dc2626' },
        green:  { yard: 'bg-[#15803d]', track: 'bg-[#16a34a] text-white',       token: '#16a34a' },
        yellow: { yard: 'bg-[#d97706]', track: 'bg-[#eab308] text-slate-950',   token: '#eab308' },
        blue:   { yard: 'bg-[#1d4ed8]', track: 'bg-[#2563eb] text-white',       token: '#2563eb' },
        center: 'bg-[#1e1e1e] border-2 border-[#525252]', centerIcon: '💎',
        defaultTrack: 'bg-[#f0f0f0]', defaultBorder: 'border-[#b5b5b5]', safeStar: '★'
      };
    }
    return {
      red:    { yard: 'bg-red-600',      track: 'bg-red-500 text-white',       token: '#ef4444' },
      green:  { yard: 'bg-emerald-600',  track: 'bg-emerald-500 text-white',   token: '#10b981' },
      yellow: { yard: 'bg-amber-500',    track: 'bg-amber-400 text-slate-900', token: '#f59e0b' },
      blue:   { yard: 'bg-sky-600',      track: 'bg-sky-500 text-white',       token: '#0ea5e9' },
      center: 'bg-slate-900 border-2 border-amber-400/50', centerIcon: '★',
      defaultTrack: 'bg-white', defaultBorder: 'border-slate-300', safeStar: '★'
    };
  };

  const palette = getThemePalette();

  const getCellDetails = (r: number, c: number) => {
    if (theme === 'sakura') {
      return { type: 'sakura', color: 'bg-transparent', isCenter: r >= 6 && r <= 8 && c >= 6 && c <= 8 };
    }
    if (r < 6 && c < 6)  return { type: 'yard', color: palette.red.yard };
    if (r < 6 && c > 8)  return { type: 'yard', color: palette.green.yard };
    if (r > 8 && c > 8)  return { type: 'yard', color: palette.yellow.yard };
    if (r > 8 && c < 6)  return { type: 'yard', color: palette.blue.yard };
    if (r >= 6 && r <= 8 && c >= 6 && c <= 8) return { type: 'center', color: palette.center, isCenter: true };
    if (r === 7 && c >= 1 && c <= 5)   return { type: 'home', color: palette.red.track };
    if (c === 7 && r >= 1 && r <= 5)   return { type: 'home', color: palette.green.track };
    if (r === 7 && c >= 9 && c <= 13)  return { type: 'home', color: palette.yellow.track };
    if (c === 7 && r >= 9 && r <= 13)  return { type: 'home', color: palette.blue.track };
    if (r === 6 && c === 1)  return { type: 'start', color: palette.red.track,    star: true };
    if (r === 1 && c === 8)  return { type: 'start', color: palette.green.track,  star: true };
    if (r === 8 && c === 13) return { type: 'start', color: palette.yellow.track, star: true };
    if (r === 13 && c === 6) return { type: 'start', color: palette.blue.track,   star: true };
    const isStar = (r===2&&c===6)||(r===6&&c===12)||(r===12&&c===8)||(r===8&&c===2);
    return { type: 'track', color: palette.defaultTrack, star: isStar };
  };

  const getTokensAtCell = (r: number, c: number) => {
    const out: { player: LudoPlayer; tokenId: number; isMovable: boolean; color: string; isYard: boolean }[] = [];
    players.forEach(p => {
      const colorKey = p.color as keyof typeof palette;
      const customColor = (palette[colorKey] as { token: string }).token ?? p.colorHex;
      p.tokens.forEach(tok => {
        const [tr, tc] = getLudoTokenPosition(p, tok);
        if (tr === r && tc === c) {
          out.push({
            player: p,
            tokenId: tok.id,
            isMovable: hasRolled && p.id === activePlayer.id && validMoves.some(m => m.tokenId === tok.id),
            color: customColor,
            isYard: tok.step === -1
          });
        }
      });
    });
    return out;
  };

  // Yard circle cell detection (updated coords matching logic.ts)
  const isYardCircleCell = (r: number, c: number) =>
    (r === 2 && (c === 1 || c === 2)) || (r === 3 && (c === 1 || c === 2)) ||  // Red
    (r === 2 && (c === 9 || c === 10)) || (r === 3 && (c === 9 || c === 10)) || // Green
    (r === 11 && (c === 10 || c === 11)) || (r === 12 && (c === 10 || c === 11)) || // Yellow
    (r === 11 && (c === 1 || c === 2)) || (r === 12 && (c === 1 || c === 2));   // Blue

  const getBoardOuterStyle = () => {
    if (theme === 'sakura') return 'p-1 sm:p-2 bg-gradient-to-br from-[#f8d7da] via-[#fad4dc] to-[#edd0d7] rounded-[32px] border-4 border-[#e2a8b6] shadow-[0_20px_50px_rgba(226,168,182,0.4)]';
    if (theme === 'voxel')  return 'p-3 sm:p-4 bg-[#3a3a3a] rounded-[28px] border-4 border-[#222] shadow-[0_20px_50px_rgba(0,0,0,0.85)]';
    return 'p-3 sm:p-4 bg-gradient-to-br from-[#4a2c17] to-[#26150b] rounded-[28px] border-4 border-[#3e2212] shadow-2xl';
  };

  const renderPawn = (t: ReturnType<typeof getTokensAtCell>[0], idx: number, isMulti: boolean) => {
    if (theme === 'sakura') {
      return (
        <SakuraVectorPawn
          key={idx}
          color={t.player.color}
          tokenId={t.tokenId}
          isMovable={t.isMovable}
          isMulti={isMulti}
          onClick={() => { if (t.isMovable) onTokenClick(t.tokenId); }}
        />
      );
    }

    const baseClass = isMulti ? 'w-4 h-4 text-[8px]' : 'w-full h-full text-xs';
    const activeClass = t.isMovable ? 'ring-4 ring-yellow-400 z-30 cursor-pointer animate-bounce' : 'cursor-default';
    const shape = theme === 'voxel' ? 'rounded-sm' : 'rounded-full';
    return (
      <button
        key={idx}
        type="button"
        disabled={!t.isMovable}
        onClick={() => { if (t.isMovable) onTokenClick(t.tokenId); }}
        aria-label={`${t.player.name} token ${t.tokenId + 1}`}
        className={`flex items-center justify-center border border-white/80 font-black text-white shadow-md transition-all ${shape} ${baseClass} ${activeClass}`}
        style={{ backgroundColor: t.color }}
      >
        <span>{t.tokenId + 1}</span>
      </button>
    );
  };

  return (
    <div className={`w-full max-w-[480px] sm:max-w-[540px] mx-auto select-none transition-all duration-300 relative aspect-square overflow-hidden ${getBoardOuterStyle()}`}>
      {/* Board background image */}
      {theme === 'sakura' && (
        <div
          className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none"
          style={{ backgroundImage: "url('/themes/ludo/sakura/board.jpg')", backgroundSize: '100% 100%' }}
        />
      )}

      {theme === 'voxel' && (
        <>
          <div className="absolute top-1 left-1 text-sm pointer-events-none z-10">🔥</div>
          <div className="absolute top-1 right-1 text-sm pointer-events-none z-10">🔥</div>
          <div className="absolute bottom-1 left-1 text-sm pointer-events-none z-10">🔥</div>
          <div className="absolute bottom-1 right-1 text-sm pointer-events-none z-10">🔥</div>
        </>
      )}

      {/* 15×15 Grid Overlay */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(15, minmax(0, 1fr))', gap: '1px' }}
        className={`w-full h-full rounded-2xl relative z-10 overflow-hidden ${
          theme === 'sakura'
            ? 'p-[5.5%]'
            : theme === 'voxel'
            ? 'bg-[#262626] border border-[#404040] p-1'
            : 'bg-[#1c120a] border border-[#3e2718] p-1'
        }`}
      >
        {Array.from({ length: 15 }).map((_, r) =>
          Array.from({ length: 15 }).map((_, c) => {
            const cell = getCellDetails(r, c);
            const tokens = getTokensAtCell(r, c);
            const isMulti = tokens.length > 1;
            const isCircle = isYardCircleCell(r, c);

            if (cell.isCenter) {
              return (
                <div key={`${r}-${c}`} className="aspect-square relative flex flex-wrap items-center justify-center gap-0.5 p-0.5 bg-transparent">
                  {r === 7 && c === 7 && palette.centerIcon && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-black select-none pointer-events-none">
                      {palette.centerIcon}
                    </span>
                  )}
                  {tokens.map((t, idx) => renderPawn(t, idx, true))}
                </div>
              );
            }

            return (
              <div
                key={`${r}-${c}`}
                className={`aspect-square relative flex items-center justify-center ${cell.color} ${
                  theme !== 'sakura' && isCircle
                    ? theme === 'voxel'
                      ? '!bg-[#d4d4d4] rounded-sm border border-[#a3a3a3] m-px'
                      : '!bg-white/90 rounded-full m-px'
                    : ''
                }`}
              >
                {'star' in cell && cell.star && !tokens.length && palette.safeStar && (
                  <span className="font-black text-xs select-none text-amber-500">{palette.safeStar}</span>
                )}

                {tokens.length > 0 && (
                  <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-px p-px z-20">
                    {tokens.map((t, idx) => renderPawn(t, idx, isMulti))}
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
