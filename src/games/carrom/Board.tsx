'use client';

import React from 'react';
import { CarromPiece, CarromPlayer } from './types';
import { POCKETS, getStrikerInitialPos } from './logic';

interface CarromBoardProps {
  pieces: CarromPiece[];
  currentTurnIndex: number;
  players: CarromPlayer[];
  strikerPos: number; // 20% to 80%
  aimAngle: number;
  power: number;
  isStriking: boolean;
  onStrikerPosChange: (pos: number) => void;
  onAimAngleChange: (angle: number) => void;
}

export const CarromBoard: React.FC<CarromBoardProps> = ({
  pieces,
  currentTurnIndex,
  players,
  strikerPos,
  aimAngle,
  power,
  isStriking,
  onStrikerPosChange,
  onAimAngleChange
}) => {
  const activePlayer = players[currentTurnIndex];
  const strikerInitial = getStrikerInitialPos(currentTurnIndex, strikerPos);

  // Calculate aim arrow endpoint
  const aimRad = (aimAngle * Math.PI) / 180;
  const arrowLen = (power / 100) * 18;
  const arrowEnd = {
    x: strikerInitial.x + Math.cos(aimRad) * arrowLen,
    y: strikerInitial.y + Math.sin(aimRad) * arrowLen
  };

  return (
    <div className="relative w-full max-w-[460px] sm:max-w-[520px] aspect-square mx-auto p-3 sm:p-4 rounded-[32px] bg-gradient-to-br from-[#5a3825] via-[#3e2213] to-[#26150b] shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-4px_8px_rgba(0,0,0,0.6)] border-4 border-[#2b170c] select-none">
      {/* Plywood Inner Surface */}
      <div className="relative w-full h-full rounded-[22px] bg-[#fbf6ed] shadow-inner border-4 border-[#201209] overflow-hidden">
        {/* SVG Board Markings */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* Center Floral Circle */}
          <circle
            cx="50"
            cy="50"
            r="8.5"
            fill="none"
            stroke="#b45309"
            strokeWidth="0.6"
          />
          <circle
            cx="50"
            cy="50"
            r="2.8"
            fill="#dc2626"
            stroke="#991b1b"
            strokeWidth="0.4"
          />

          {/* 4 Baselines */}
          {/* Bottom baseline (P1) */}
          <line
            x1="20"
            y1="84"
            x2="80"
            y2="84"
            stroke="#b45309"
            strokeWidth="0.5"
            strokeDasharray="1.5 1.5"
          />
          <circle cx="20" cy="84" r="2.2" fill="#ef4444" opacity="0.7" />
          <circle cx="80" cy="84" r="2.2" fill="#ef4444" opacity="0.7" />

          {/* Top baseline (P2) */}
          <line
            x1="20"
            y1="16"
            x2="80"
            y2="16"
            stroke="#b45309"
            strokeWidth="0.5"
            strokeDasharray="1.5 1.5"
          />
          <circle cx="20" cy="16" r="2.2" fill="#0284c7" opacity="0.7" />
          <circle cx="80" cy="16" r="2.2" fill="#0284c7" opacity="0.7" />

          {/* Left baseline */}
          <line
            x1="16"
            y1="20"
            x2="16"
            y2="80"
            stroke="#d8c7b0"
            strokeWidth="0.4"
          />
          {/* Right baseline */}
          <line
            x1="84"
            y1="20"
            x2="84"
            y2="80"
            stroke="#d8c7b0"
            strokeWidth="0.4"
          />

          {/* 4 Corner Arrows */}
          <line x1="16" y1="16" x2="30" y2="30" stroke="#b45309" strokeWidth="0.4" />
          <line x1="84" y1="16" x2="70" y2="30" stroke="#b45309" strokeWidth="0.4" />
          <line x1="16" y1="84" x2="30" y2="70" stroke="#b45309" strokeWidth="0.4" />
          <line x1="84" y1="84" x2="70" y2="70" stroke="#b45309" strokeWidth="0.4" />

          {/* 4 Mesh Corner Pockets */}
          {POCKETS.map((pocket, idx) => (
            <g key={idx}>
              <circle
                cx={pocket.x}
                cy={pocket.y}
                r={pocket.r}
                fill="#111827"
                stroke="#374151"
                strokeWidth="0.8"
              />
              <circle
                cx={pocket.x}
                cy={pocket.y}
                r={pocket.r - 1}
                fill="#030712"
              />
            </g>
          ))}

          {/* Aiming Trajectory Arrow when not striking */}
          {!isStriking && (
            <g>
              <line
                x1={strikerInitial.x}
                y1={strikerInitial.y}
                x2={arrowEnd.x}
                y2={arrowEnd.y}
                stroke="#f59e0b"
                strokeWidth="0.8"
                strokeDasharray="1 1"
              />
              <circle
                cx={arrowEnd.x}
                cy={arrowEnd.y}
                r="1"
                fill="#f59e0b"
              />
            </g>
          )}
        </svg>

        {/* Pieces Layer */}
        {pieces.map(p => {
          if (p.isPocketed) return null;

          let bgStyle = '';
          if (p.type === 'queen') {
            bgStyle =
              'bg-gradient-to-br from-[#ef4444] to-[#991b1b] border-2 border-amber-300 shadow-md';
          } else if (p.type === 'white') {
            bgStyle =
              'bg-gradient-to-br from-[#ffffff] to-[#d8c7b0] border border-amber-800/40 shadow-sm';
          } else if (p.type === 'black') {
            bgStyle =
              'bg-gradient-to-br from-[#334155] to-[#0f172a] border border-slate-600 shadow-sm';
          } else if (p.type === 'striker') {
            bgStyle =
              'bg-gradient-to-br from-[#f8fafc] to-[#94a3b8] border-2 border-amber-400 shadow-lg';
          }

          return (
            <div
              key={p.id}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.radius * 2}%`,
                height: `${p.radius * 2}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className={`absolute rounded-full pointer-events-none transition-transform select-none ${bgStyle}`}
            />
          );
        })}

        {/* Striker in Ready State (before strike) */}
        {!isStriking && (
          <div
            style={{
              left: `${strikerInitial.x}%`,
              top: `${strikerInitial.y}%`,
              width: '6.4%',
              height: '6.4%',
              transform: 'translate(-50%, -50%)'
            }}
            className="absolute rounded-full bg-gradient-to-br from-[#ffffff] via-[#e2e8f0] to-[#94a3b8] border-2 border-amber-400 shadow-xl flex items-center justify-center cursor-pointer z-30 animate-pulse"
          >
            <div className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
        )}
      </div>

      {/* Baseline Slider Control (Interactive) */}
      {!isStriking && (
        <div className="mt-2 px-3 py-1 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
            Position Striker:
          </span>
          <input
            type="range"
            min="22"
            max="78"
            value={strikerPos}
            onChange={e => onStrikerPosChange(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
        </div>
      )}
    </div>
  );
};
