'use client';

import React from 'react';
import { LadderDef } from '../types';
import { getCellCenterPercent } from '../logic';

interface LadderVectorProps {
  ladder: LadderDef;
}

export const LadderVector: React.FC<LadderVectorProps> = ({ ladder }) => {
  const pBase = getCellCenterPercent(ladder.from); // Lower tile
  const pTop = getCellCenterPercent(ladder.to);    // Higher tile

  const dx = pTop.x - pBase.x;
  const dy = pTop.y - pBase.y;
  const len = Math.hypot(dx, dy);

  // Normal vector for width
  const railSpacing = 1.6;
  const nx = (-dy / (len || 1)) * (railSpacing / 2);
  const ny = (dx / (len || 1)) * (railSpacing / 2);

  // Rail 1
  const r1Start = { x: pBase.x + nx, y: pBase.y + ny };
  const r1End = { x: pTop.x + nx, y: pTop.y + ny };

  // Rail 2
  const r2Start = { x: pBase.x - nx, y: pBase.y - ny };
  const r2End = { x: pTop.x - nx, y: pTop.y - ny };

  // Rungs
  const numRungs = Math.max(3, Math.floor(len / 4.5));
  const rungs: { x1: number; y1: number; x2: number; y2: number }[] = [];

  for (let i = 1; i <= numRungs; i++) {
    const t = i / (numRungs + 1);
    rungs.push({
      x1: r1Start.x + (r1End.x - r1Start.x) * t,
      y1: r1Start.y + (r1End.y - r1Start.y) * t,
      x2: r2Start.x + (r2End.x - r2Start.x) * t,
      y2: r2Start.y + (r2End.y - r2Start.y) * t
    });
  }

  return (
    <g className="ladder-vector transition-opacity duration-300">
      {/* Drop Shadows */}
      <g transform="translate(0.5, 0.7)" opacity="0.35">
        <line
          x1={r1Start.x}
          y1={r1Start.y}
          x2={r1End.x}
          y2={r1End.y}
          stroke="#000000"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          x1={r2Start.x}
          y1={r2Start.y}
          x2={r2End.x}
          y2={r2End.y}
          stroke="#000000"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {rungs.map((r, i) => (
          <line
            key={i}
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            stroke="#000000"
            strokeWidth="0.9"
          />
        ))}
      </g>

      {/* Main Wooden Rails */}
      <line
        x1={r1Start.x}
        y1={r1Start.y}
        x2={r1End.x}
        y2={r1End.y}
        stroke="#854d0e" // Dark Gold/Wood
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <line
        x1={r2Start.x}
        y1={r2Start.y}
        x2={r2End.x}
        y2={r2End.y}
        stroke="#854d0e"
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* Rail Highlights */}
      <line
        x1={r1Start.x}
        y1={r1Start.y}
        x2={r1End.x}
        y2={r1End.y}
        stroke="#fef08a"
        strokeWidth="0.4"
        strokeLinecap="round"
      />
      <line
        x1={r2Start.x}
        y1={r2Start.y}
        x2={r2End.x}
        y2={r2End.y}
        stroke="#fef08a"
        strokeWidth="0.4"
        strokeLinecap="round"
      />

      {/* Wooden Rungs */}
      {rungs.map((r, i) => (
        <g key={i}>
          <line
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            stroke="#ca8a04"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <line
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            stroke="#fef08a"
            strokeWidth="0.3"
          />
        </g>
      ))}
    </g>
  );
};
