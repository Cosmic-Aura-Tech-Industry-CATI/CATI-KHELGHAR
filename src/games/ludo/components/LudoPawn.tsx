'use client';
import React from 'react';
import { Pawn, PlayerColor } from '../types';

interface LudoPawnProps {
  pawn: Pawn;
  row: number;
  col: number;
  isSelectable: boolean;
  isSelected: boolean;
  stackOffset?: { dx: number; dy: number }; // for multiple pawns on same cell
  onClick: () => void;
}

const PAWN_COLORS: Record<PlayerColor, { ring: string; petalMid: string; petalEnd: string; petalStart: string }> = {
  red:    { ring: '#e11d48', petalStart: '#fda4af', petalMid: '#f43f5e', petalEnd: '#be123c' },
  green:  { ring: '#059669', petalStart: '#a7f3d0', petalMid: '#10b981', petalEnd: '#047857' },
  yellow: { ring: '#d97706', petalStart: '#fde68a', petalMid: '#f59e0b', petalEnd: '#b45309' },
  blue:   { ring: '#0284c7', petalStart: '#bae6fd', petalMid: '#0ea5e9', petalEnd: '#0369a1' },
};

export const LudoPawn = React.memo<LudoPawnProps>(function LudoPawn({ pawn, row, col, isSelectable, isSelected, stackOffset, onClick }) {
  const colors = PAWN_COLORS[pawn.color];
  const uid = pawn.id;
  const leftPct = ((col + 0.5) / 15) * 100;
  const topPct = ((row + 0.5) / 15) * 100;
  const dx = stackOffset?.dx ?? 0;
  const dy = stackOffset?.dy ?? 0;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isSelectable}
      aria-label={`${pawn.color} pawn – ${isSelectable ? 'click to move' : 'not movable'}`}
      className={`
        absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-300
        rounded-full focus:outline-none
        ${isSelectable ? 'cursor-pointer z-30 drop-shadow-[0_0_12px_rgba(251,191,36,1)] animate-bounce scale-110' : 'cursor-default'}
        ${isSelected ? 'scale-125 z-40' : ''}
      `}
      style={{
        left: `calc(${leftPct}% + ${dx}px)`,
        top: `calc(${topPct}% + ${dy}px)`,
        width: '5.5%',
        height: '5.5%',
        minWidth: '20px',
        minHeight: '20px',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`rim-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff8db" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <radialGradient id={`bed-${uid}`} cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#fffdf5" />
            <stop offset="100%" stopColor="#fef3c7" />
          </radialGradient>
          <radialGradient id={`ptl-${uid}`} cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor={colors.petalStart} />
            <stop offset="55%" stopColor={colors.petalMid} />
            <stop offset="100%" stopColor={colors.petalEnd} />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="49" fill={`url(#rim-${uid})`} />
        <circle cx="50" cy="50" r="43" fill={colors.ring} />
        <circle cx="50" cy="50" r="38" fill={`url(#rim-${uid})`} />
        <circle cx="50" cy="50" r="33" fill={`url(#bed-${uid})`} />
        <g transform="translate(50,50)">
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <ellipse key={i} cx="0" cy="-17" rx="8" ry="13" transform={`rotate(${deg})`}
              fill={`url(#ptl-${uid})`} stroke={colors.ring} strokeWidth="0.7" opacity="0.95" />
          ))}
          <circle cx="0" cy="0" r="7" fill={`url(#rim-${uid})`} />
          <circle cx="-2" cy="-2" r="2.5" fill="#fff" opacity="0.85" />
        </g>
        <ellipse cx="37" cy="33" rx="10" ry="5" fill="#fff" opacity="0.22" transform="rotate(-30 37 33)" />
        {isSelectable && (
          <circle cx="50" cy="50" r="48" fill="none" stroke="#fbbf24" strokeWidth="5"
            opacity="0.8" strokeDasharray="8 4">
            <animateTransform attributeName="transform" type="rotate"
              from="0 50 50" to="360 50 50" dur="2s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
    </button>
  );
});
