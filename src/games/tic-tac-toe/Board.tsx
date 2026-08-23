'use client';

import React from 'react';
import { CellValue, TTTWinResult } from './types';

interface TTTBoardProps {
  board: CellValue[];
  winResult: TTTWinResult | null;
  isGameOver: boolean;
  onCellClick: (index: number) => void;
}

/**
 * 3D Sculpted Charcoal 'X' Piece SVG matching the classic wooden theme
 */
const ClassicXPiece: React.FC<{ isWinner?: boolean }> = ({ isWinner }) => (
  <svg
    viewBox="0 0 100 100"
    className={`w-4/5 h-4/5 transition-transform duration-200 ${
      isWinner ? 'scale-110 drop-shadow-[0_8px_16px_rgba(239,68,68,0.6)] animate-pulse' : 'drop-shadow-[0_6px_8px_rgba(0,0,0,0.35)]'
    }`}
  >
    <defs>
      <linearGradient id="xGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3d4450" />
        <stop offset="50%" stopColor="#252a32" />
        <stop offset="100%" stopColor="#15181e" />
      </linearGradient>
      <linearGradient id="xHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
      <filter id="xBevel" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="-1" dy="-1" stdDeviation="1" floodColor="rgba(255,255,255,0.3)" />
      </filter>
    </defs>

    <g filter="url(#xBevel)">
      {/* Bar 1 (\) */}
      <rect
        x="42"
        y="12"
        width="16"
        height="76"
        rx="8"
        transform="rotate(45 50 50)"
        fill={isWinner ? '#ef4444' : 'url(#xGrad)'}
      />
      {/* Bar 2 (/) */}
      <rect
        x="42"
        y="12"
        width="16"
        height="76"
        rx="8"
        transform="rotate(-45 50 50)"
        fill={isWinner ? '#ef4444' : 'url(#xGrad)'}
      />

      {/* Highlights */}
      <rect
        x="43"
        y="14"
        width="14"
        height="35"
        rx="7"
        transform="rotate(45 50 50)"
        fill="url(#xHighlight)"
      />
      <rect
        x="43"
        y="14"
        width="14"
        height="35"
        rx="7"
        transform="rotate(-45 50 50)"
        fill="url(#xHighlight)"
      />
    </g>
  </svg>
);

/**
 * 3D Sculpted Terracotta Red 'O' Ring SVG matching the classic wooden theme
 */
const ClassicOPiece: React.FC<{ isWinner?: boolean }> = ({ isWinner }) => (
  <svg
    viewBox="0 0 100 100"
    className={`w-4/5 h-4/5 transition-transform duration-200 ${
      isWinner ? 'scale-110 drop-shadow-[0_8px_16px_rgba(249,115,22,0.6)] animate-pulse' : 'drop-shadow-[0_6px_8px_rgba(0,0,0,0.35)]'
    }`}
  >
    <defs>
      <linearGradient id="oGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e84a34" />
        <stop offset="40%" stopColor="#d33420" />
        <stop offset="100%" stopColor="#a32010" />
      </linearGradient>
      <linearGradient id="oHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>

    {/* Outer Ring */}
    <circle
      cx="50"
      cy="50"
      r="36"
      fill="none"
      stroke={isWinner ? '#f59e0b' : 'url(#oGrad)'}
      strokeWidth="15"
    />

    {/* Inner shadow */}
    <circle
      cx="50"
      cy="50"
      r="28.5"
      fill="none"
      stroke="rgba(0,0,0,0.2)"
      strokeWidth="1.5"
    />

    {/* Top-left Arc Highlight */}
    <path
      d="M 24 50 A 26 26 0 0 1 50 24"
      fill="none"
      stroke="rgba(255,255,255,0.45)"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);

export const TTTBoard: React.FC<TTTBoardProps> = ({
  board,
  winResult,
  isGameOver,
  onCellClick
}) => {
  return (
    <div className="relative w-full max-w-[360px] sm:max-w-[420px] mx-auto p-3 sm:p-4 rounded-[32px] bg-gradient-to-br from-[#6b4226] via-[#4a2c17] to-[#321d0f] shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-4px_8px_rgba(0,0,0,0.6)] border-4 border-[#3d2212] select-none">
      {/* Subtle Wood Bevel Inset */}
      <div className="p-1 rounded-[24px] bg-[#1e130b] shadow-inner">
        {/* 3x3 Ivory Tiles Grid with Dark Ebony Grooves */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full bg-[#2a1a10] rounded-[20px] p-1.5 sm:p-2 border border-[#3e2718]">
          {board.map((cell, idx) => {
            const isWinningCell = winResult && winResult.line.includes(idx as any);

            // Rounded outer corners for the 4 corner cells
            let cornerRadius = 'rounded-xl';
            if (idx === 0) cornerRadius = 'rounded-tl-[16px] rounded-tr-lg rounded-bl-lg rounded-br-lg';
            if (idx === 2) cornerRadius = 'rounded-tr-[16px] rounded-tl-lg rounded-bl-lg rounded-br-lg';
            if (idx === 6) cornerRadius = 'rounded-bl-[16px] rounded-tl-lg rounded-tr-lg rounded-br-lg';
            if (idx === 8) cornerRadius = 'rounded-br-[16px] rounded-tl-lg rounded-tr-lg rounded-bl-lg';

            return (
              <button
                key={idx}
                type="button"
                disabled={cell !== null || isGameOver}
                onClick={() => onCellClick(idx)}
                aria-label={`Cell ${idx + 1}, ${cell ? cell : 'Empty'}`}
                className={`aspect-square w-full flex items-center justify-center transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 select-none ${cornerRadius} ${
                  cell === null
                    ? 'bg-gradient-to-br from-[#fcf8f0] via-[#f7f0e3] to-[#ebdcc8] hover:from-[#ffffff] hover:to-[#f3e7d5] shadow-[inset_0_2px_3px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.15)] cursor-pointer'
                    : isWinningCell
                    ? 'bg-gradient-to-br from-[#fff7ed] to-[#fed7aa] shadow-[inset_0_0_12px_rgba(249,115,22,0.4)]'
                    : 'bg-gradient-to-br from-[#fbf6ed] via-[#f4ebd9] to-[#e8d7be] shadow-[inset_0_2px_3px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.1)]'
                }`}
              >
                {cell === 'X' && <ClassicXPiece isWinner={isWinningCell} />}
                {cell === 'O' && <ClassicOPiece isWinner={isWinningCell} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
