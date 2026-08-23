'use client';

import React from 'react';
import { SnakeDef } from '../types';
import { getCellCenterPercent } from '../logic';

interface SnakeVectorProps {
  snake: SnakeDef;
}

export const SnakeVector: React.FC<SnakeVectorProps> = ({ snake }) => {
  const pHead = getCellCenterPercent(snake.from); // Head at higher tile
  const pTail = getCellCenterPercent(snake.to);   // Tail at lower tile

  // Midpoint with slight curve offset
  const dx = pTail.x - pHead.x;
  const dy = pTail.y - pHead.y;
  const len = Math.hypot(dx, dy);

  // Perpendicular curve offset
  const nx = -dy / (len || 1);
  const ny = dx / (len || 1);
  const curveIntensity = len * 0.22;

  const c1x = pHead.x + dx * 0.33 + nx * curveIntensity;
  const c1y = pHead.y + dy * 0.33 + ny * curveIntensity;

  const c2x = pHead.x + dx * 0.66 - nx * curveIntensity;
  const c2y = pHead.y + dy * 0.66 - ny * curveIntensity;

  const pathD = `M ${pHead.x} ${pHead.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${pTail.x} ${pTail.y}`;

  // Angle of head
  const headAngle = (Math.atan2(c1y - pHead.y, c1x - pHead.x) * 180) / Math.PI;

  return (
    <g className="snake-vector transition-opacity duration-300">
      {/* Drop Shadow */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(0, 0, 0, 0.4)"
        strokeWidth="3.2"
        strokeLinecap="round"
        transform="translate(0.6, 0.8)"
      />

      {/* Snake Outer Body */}
      <path
        d={pathD}
        fill="none"
        stroke={snake.color}
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Snake Inner Belly / Pattern */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="1.2"
        strokeDasharray="1.5 1.5"
        strokeLinecap="round"
      />

      {/* Snake Head */}
      <g transform={`translate(${pHead.x}, ${pHead.y}) rotate(${headAngle - 90})`}>
        {/* Head Shadow */}
        <circle cx="0.4" cy="0.4" r="2.2" fill="rgba(0,0,0,0.3)" />
        {/* Head Shape */}
        <ellipse cx="0" cy="0" rx="2.2" ry="2.6" fill={snake.color} />
        {/* Eyes */}
        <circle cx="-1" cy="-0.6" r="0.6" fill="#ffffff" />
        <circle cx="1" cy="-0.6" r="0.6" fill="#ffffff" />
        <circle cx="-1" cy="-0.6" r="0.3" fill="#000000" />
        <circle cx="1" cy="-0.6" r="0.3" fill="#000000" />
        {/* Tongue */}
        <path d="M 0 2.2 L 0 3.6 L -0.5 4.2 M 0 3.6 L 0.5 4.2" stroke="#ef4444" strokeWidth="0.4" fill="none" />
      </g>

      {/* Snake Tail Tip */}
      <circle cx={pTail.x} cy={pTail.y} r="0.8" fill={snake.color} />
    </g>
  );
};
