'use client';

import React from 'react';
import { CellValue, TTTWinResult, TTTTheme } from './types';

interface TTTBoardProps {
  board: CellValue[];
  winResult: TTTWinResult | null;
  isGameOver: boolean;
  theme?: TTTTheme;
  onCellClick: (index: number) => void;
}

/* =========================================================================
   1. CLASSIC WOOD THEME PIECES
   ========================================================================= */
const ClassicXPiece: React.FC<{ isWinner?: boolean }> = ({ isWinner }) => (
  <svg
    viewBox="0 0 100 100"
    className={`w-4/5 h-4/5 transition-transform duration-200 ${
      isWinner
        ? 'scale-110 drop-shadow-[0_8px_16px_rgba(239,68,68,0.6)] animate-pulse'
        : 'drop-shadow-[0_6px_8px_rgba(0,0,0,0.35)]'
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

const ClassicOPiece: React.FC<{ isWinner?: boolean }> = ({ isWinner }) => (
  <svg
    viewBox="0 0 100 100"
    className={`w-4/5 h-4/5 transition-transform duration-200 ${
      isWinner
        ? 'scale-110 drop-shadow-[0_8px_16px_rgba(249,115,22,0.6)] animate-pulse'
        : 'drop-shadow-[0_6px_8px_rgba(0,0,0,0.35)]'
    }`}
  >
    <defs>
      <linearGradient id="oGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e84a34" />
        <stop offset="40%" stopColor="#d33420" />
        <stop offset="100%" stopColor="#a32010" />
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

/* =========================================================================
   2. MINECRAFT / VOXEL CRAFT THEME PIECES (Matches User Uploaded Reference)
   ========================================================================= */

/**
 * Reusable 3D Voxel Cube for Diamond Block X
 */
const VoxelDiamondCube: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Cube Base Drop Shadow */}
      <rect x={1} y={1} width={s} height={s} fill="#0d5452" opacity="0.6" />
      {/* Cube Main Face */}
      <rect x={0} y={0} width={s} height={s} fill="#4cedea" />
      {/* 3D Top Light Edge */}
      <line x1={0} y1={0.5} x2={s} y2={0.5} stroke="#affffe" strokeWidth="1.2" />
      {/* 3D Left Light Edge */}
      <line x1={0.5} y1={0} x2={0.5} y2={s} stroke="#80ffff" strokeWidth="1.2" />
      {/* 3D Bottom Dark Edge */}
      <line x1={0} y1={s - 0.5} x2={s} y2={s - 0.5} stroke="#1b9d99" strokeWidth="1.2" />
      {/* 3D Right Dark Edge */}
      <line x1={s - 0.5} y1={0} x2={s - 0.5} y2={s} stroke="#21b5b0" strokeWidth="1.2" />
      {/* Inner Diamond Texture Glint */}
      <rect x={s * 0.25} y={s * 0.25} width={s * 0.5} height={s * 0.5} fill="#62fbf8" />
      <rect x={s * 0.35} y={s * 0.35} width={s * 0.3} height={s * 0.3} fill="#d5ffff" />
    </g>
  );
};

/**
 * 3D Diamond Voxel 'X' Piece
 */
const VoxelXPiece: React.FC<{ isWinner?: boolean }> = ({ isWinner }) => {
  const s = 11.5; // cube size

  // Coordinates [x, y] of all cubes forming the X cross exactly like Minecraft Diamond Block X
  const cubes = [
    // Center 2x2 cluster
    { x: 44, y: 44 },
    { x: 44 + s, y: 44 },
    { x: 44, y: 44 + s },
    { x: 44 + s, y: 44 + s },

    // Top-Left Arm
    { x: 32.5, y: 32.5 },
    { x: 21, y: 21 },
    { x: 9.5, y: 9.5 },
    { x: 9.5, y: 21 },
    { x: 21, y: 9.5 },

    // Top-Right Arm
    { x: 55.5 + s, y: 32.5 },
    { x: 67 + s, y: 21 },
    { x: 78.5 + s, y: 9.5 },
    { x: 78.5 + s, y: 21 },
    { x: 67 + s, y: 9.5 },

    // Bottom-Left Arm
    { x: 32.5, y: 55.5 + s },
    { x: 21, y: 67 + s },
    { x: 9.5, y: 78.5 + s },
    { x: 9.5, y: 67 + s },
    { x: 21, y: 78.5 + s },

    // Bottom-Right Arm
    { x: 55.5 + s, y: 55.5 + s },
    { x: 67 + s, y: 67 + s },
    { x: 78.5 + s, y: 78.5 + s },
    { x: 78.5 + s, y: 67 + s },
    { x: 67 + s, y: 78.5 + s }
  ];

  return (
    <svg
      viewBox="0 0 110 110"
      className={`w-[88%] h-[88%] transition-transform duration-200 ${
        isWinner
          ? 'scale-110 drop-shadow-[0_0_18px_rgba(78,237,234,0.9)] animate-pulse'
          : 'drop-shadow-[0_8px_10px_rgba(0,0,0,0.55)]'
      }`}
    >
      <defs>
        <filter id="voxelGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>
      <g filter="url(#voxelGlow)">
        {cubes.map((c, i) => (
          <VoxelDiamondCube key={i} x={c.x} y={c.y} s={s} />
        ))}
      </g>
    </svg>
  );
};

/**
 * Reusable 3D Voxel Stone/Cobblestone Cube for Cobblestone 'O'
 */
const VoxelStoneCube: React.FC<{ x: number; y: number; s: number; variant?: number }> = ({
  x,
  y,
  s,
  variant = 0
}) => {
  const baseColors = ['#828282', '#757575', '#6b6b6b', '#8a8a8a'];
  const darkColors = ['#4a4a4a', '#3f3f3f', '#424242', '#363636'];
  const lightColors = ['#adadad', '#9e9e9e', '#a3a3a3', '#b5b5b5'];

  const bg = baseColors[variant % baseColors.length];
  const dark = darkColors[variant % darkColors.length];
  const light = lightColors[variant % lightColors.length];

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Ambient shadow */}
      <rect x={1} y={1} width={s} height={s} fill="#1a1a1a" opacity="0.7" />
      {/* Main Face */}
      <rect x={0} y={0} width={s} height={s} fill={bg} />
      {/* 3D Bevel Top & Left */}
      <line x1={0} y1={0.5} x2={s} y2={0.5} stroke={light} strokeWidth="1.2" />
      <line x1={0.5} y1={0} x2={0.5} y2={s} stroke={light} strokeWidth="1.2" />
      {/* 3D Bevel Bottom & Right */}
      <line x1={0} y1={s - 0.5} x2={s} y2={s - 0.5} stroke={dark} strokeWidth="1.2" />
      <line x1={s - 0.5} y1={0} x2={s - 0.5} y2={s} stroke={dark} strokeWidth="1.2" />
      {/* Cobblestone Chiseled Cracks */}
      <rect x={s * 0.2} y={s * 0.2} width={s * 0.3} height={s * 0.3} fill={dark} opacity="0.6" />
      <rect x={s * 0.6} y={s * 0.55} width={s * 0.25} height={s * 0.25} fill={light} opacity="0.5" />
      <rect x={s * 0.55} y={s * 0.2} width={s * 0.25} height={s * 0.25} fill={dark} opacity="0.5" />
      <line x1={s * 0.2} y1={s * 0.5} x2={s * 0.8} y2={s * 0.5} stroke={dark} strokeWidth="0.8" opacity="0.5" />
    </g>
  );
};

/**
 * 3D Cobblestone Voxel 'O' Ring Piece
 */
const VoxelOPiece: React.FC<{ isWinner?: boolean }> = ({ isWinner }) => {
  const s = 13.5; // stone block size

  // 12 stone blocks forming the octagonal cobblestone ring
  const stones = [
    // Top bar (3 stones)
    { x: 34.5, y: 13, v: 0 },
    { x: 48, y: 13, v: 1 },
    { x: 61.5, y: 13, v: 2 },

    // Top corners
    { x: 21, y: 24, v: 3 },
    { x: 75, y: 24, v: 1 },

    // Middle left & right
    { x: 13, y: 37.5, v: 2 },
    { x: 13, y: 51, v: 0 },
    { x: 13, y: 64.5, v: 3 },

    { x: 83, y: 37.5, v: 1 },
    { x: 83, y: 51, v: 2 },
    { x: 83, y: 64.5, v: 0 },

    // Bottom corners
    { x: 21, y: 78, v: 1 },
    { x: 75, y: 78, v: 3 },

    // Bottom bar (3 stones)
    { x: 34.5, y: 89, v: 2 },
    { x: 48, y: 89, v: 0 },
    { x: 61.5, y: 89, v: 1 }
  ];

  return (
    <svg
      viewBox="0 0 110 110"
      className={`w-[88%] h-[88%] transition-transform duration-200 ${
        isWinner
          ? 'scale-110 drop-shadow-[0_0_18px_rgba(200,200,200,0.9)] animate-pulse'
          : 'drop-shadow-[0_8px_10px_rgba(0,0,0,0.6)]'
      }`}
    >
      <defs>
        <filter id="stoneGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>
      <g filter="url(#stoneGlow)">
        {stones.map((st, i) => (
          <VoxelStoneCube key={i} x={st.x} y={st.y} s={s} variant={st.v} />
        ))}
      </g>
    </svg>
  );
};

/* =========================================================================
   3. NEON CYBER THEME PIECES
   ========================================================================= */
const NeonXPiece: React.FC<{ isWinner?: boolean }> = ({ isWinner }) => (
  <svg
    viewBox="0 0 100 100"
    className={`w-4/5 h-4/5 ${
      isWinner ? 'scale-110 drop-shadow-[0_0_20px_#06b6d4] animate-pulse' : 'drop-shadow-[0_0_12px_#06b6d4]'
    }`}
  >
    <line x1="20" y1="20" x2="80" y2="80" stroke="#22d3ee" strokeWidth="12" strokeLinecap="round" />
    <line x1="80" y1="20" x2="20" y2="80" stroke="#22d3ee" strokeWidth="12" strokeLinecap="round" />
    <line x1="20" y1="20" x2="80" y2="80" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
    <line x1="80" y1="20" x2="20" y2="80" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const NeonOPiece: React.FC<{ isWinner?: boolean }> = ({ isWinner }) => (
  <svg
    viewBox="0 0 100 100"
    className={`w-4/5 h-4/5 ${
      isWinner ? 'scale-110 drop-shadow-[0_0_20px_#f43f5e] animate-pulse' : 'drop-shadow-[0_0_12px_#f43f5e]'
    }`}
  >
    <circle cx="50" cy="50" r="32" fill="none" stroke="#fb7185" strokeWidth="12" />
    <circle cx="50" cy="50" r="32" fill="none" stroke="#ffffff" strokeWidth="4" />
  </svg>
);

/* =========================================================================
   MAIN TTT BOARD COMPONENT WITH THEME SUPPORT
   ========================================================================= */
export const TTTBoard: React.FC<TTTBoardProps> = ({
  board,
  winResult,
  isGameOver,
  theme = 'voxel',
  onCellClick
}) => {
  // Render Piece by theme
  const renderPiece = (cell: CellValue, isWinner: boolean) => {
    if (!cell) return null;
    if (theme === 'voxel') {
      return cell === 'X' ? <VoxelXPiece isWinner={isWinner} /> : <VoxelOPiece isWinner={isWinner} />;
    }
    if (theme === 'neon') {
      return cell === 'X' ? <NeonXPiece isWinner={isWinner} /> : <NeonOPiece isWinner={isWinner} />;
    }
    // Default: 'wood'
    return cell === 'X' ? <ClassicXPiece isWinner={isWinner} /> : <ClassicOPiece isWinner={isWinner} />;
  };

  /* -------------------------------------------------------------------------
     THEME 1: MINECRAFT / VOXEL CRAFT THEME (Grass + Log Frame)
     ------------------------------------------------------------------------- */
  if (theme === 'voxel') {
    return (
      <div className="relative w-full max-w-[370px] sm:max-w-[440px] mx-auto p-3 sm:p-4 rounded-3xl bg-[#5c3a1e] border-4 border-[#3e240e] shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_4px_6px_rgba(255,255,255,0.15)] select-none">
        {/* 4 Corner Log Post Caps */}
        <div className="absolute top-2 left-2 w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#9e6d38] border-2 border-[#42250d] shadow-sm flex items-center justify-center pointer-events-none z-10">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#6a421b] border border-[#d49955]" />
        </div>
        <div className="absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#9e6d38] border-2 border-[#42250d] shadow-sm flex items-center justify-center pointer-events-none z-10">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#6a421b] border border-[#d49955]" />
        </div>
        <div className="absolute bottom-2 left-2 w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#9e6d38] border-2 border-[#42250d] shadow-sm flex items-center justify-center pointer-events-none z-10">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#6a421b] border border-[#d49955]" />
        </div>
        <div className="absolute bottom-2 right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#9e6d38] border-2 border-[#42250d] shadow-sm flex items-center justify-center pointer-events-none z-10">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#6a421b] border border-[#d49955]" />
        </div>

        {/* Inner Wooden Inset with Dark Timber Beams */}
        <div className="p-1 sm:p-1.5 rounded-2xl bg-[#341d0b] shadow-inner">
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full bg-[#3d230e] p-1.5 sm:p-2 rounded-xl border-2 border-[#261406]">
            {board.map((cell, idx) => {
              const isWinningCell = winResult && winResult.line.includes(idx as any);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={cell !== null || isGameOver}
                  onClick={() => onCellClick(idx)}
                  aria-label={`Cell ${idx + 1}, ${cell ? cell : 'Empty'}`}
                  className={`aspect-square w-full flex items-center justify-center transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400 select-none rounded-lg relative overflow-hidden border border-[#2b5919] ${
                    cell === null
                      ? 'bg-[#4e8d27] hover:bg-[#589c2d] shadow-[inset_0_3px_5px_rgba(0,0,0,0.35),inset_0_-3px_5px_rgba(0,0,0,0.3)] cursor-pointer'
                      : isWinningCell
                      ? 'bg-[#5ea930] shadow-[inset_0_0_16px_rgba(250,204,21,0.8),0_0_12px_rgba(250,204,21,0.4)]'
                      : 'bg-[#478224] shadow-[inset_0_3px_5px_rgba(0,0,0,0.4),inset_0_-3px_5px_rgba(0,0,0,0.3)]'
                  }`}
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 25% 25%, rgba(100, 180, 50, 0.4) 1px, transparent 1px),
                      radial-gradient(circle at 75% 75%, rgba(40, 80, 20, 0.4) 1px, transparent 1px)
                    `,
                    backgroundSize: '12px 12px'
                  }}
                >
                  {renderPiece(cell, !!isWinningCell)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------
     THEME 2: NEON CYBER THEME
     ------------------------------------------------------------------------- */
  if (theme === 'neon') {
    return (
      <div className="relative w-full max-w-[360px] sm:max-w-[420px] mx-auto p-3.5 sm:p-4 rounded-3xl bg-slate-950 border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.25),inset_0_0_20px_rgba(6,182,212,0.15)] select-none">
        <div className="grid grid-cols-3 gap-2.5 w-full bg-slate-900/90 rounded-2xl p-2 border border-slate-800">
          {board.map((cell, idx) => {
            const isWinningCell = winResult && winResult.line.includes(idx as any);

            return (
              <button
                key={idx}
                type="button"
                disabled={cell !== null || isGameOver}
                onClick={() => onCellClick(idx)}
                aria-label={`Cell ${idx + 1}, ${cell ? cell : 'Empty'}`}
                className={`aspect-square w-full flex items-center justify-center rounded-xl transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400 select-none ${
                  cell === null
                    ? 'bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 cursor-pointer'
                    : isWinningCell
                    ? 'bg-cyan-950/60 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    : 'bg-slate-900 border border-slate-800'
                }`}
              >
                {renderPiece(cell, !!isWinningCell)}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------
     THEME 3: CLASSIC HANDCRAFTED WOOD THEME
     ------------------------------------------------------------------------- */
  return (
    <div className="relative w-full max-w-[360px] sm:max-w-[420px] mx-auto p-3 sm:p-4 rounded-[32px] bg-gradient-to-br from-[#6b4226] via-[#4a2c17] to-[#321d0f] shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-4px_8px_rgba(0,0,0,0.6)] border-4 border-[#3d2212] select-none">
      {/* Wood Bevel Inset */}
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
                {renderPiece(cell, !!isWinningCell)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
