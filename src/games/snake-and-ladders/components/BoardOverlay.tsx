'use client';

import React from 'react';
import { SNAKES_CONFIG, LADDERS_CONFIG } from '../logic';
import { SnakeVector } from './SnakeVector';
import { LadderVector } from './LadderVector';

export const BoardOverlay: React.FC = () => {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none z-10 select-none"
    >
      <defs>
        {/* Shadow filter */}
        <filter id="boardDropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0.5" dy="0.8" stdDeviation="0.6" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>

      {/* 1. Ladders Layer (Behind snakes) */}
      <g className="ladders-layer">
        {LADDERS_CONFIG.map(ladder => (
          <LadderVector key={ladder.id} ladder={ladder} />
        ))}
      </g>

      {/* 2. Snakes Layer */}
      <g className="snakes-layer">
        {SNAKES_CONFIG.map(snake => (
          <SnakeVector key={snake.id} snake={snake} />
        ))}
      </g>
    </svg>
  );
};
