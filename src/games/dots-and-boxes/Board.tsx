'use client';

import React, { useState } from 'react';
import { DotsPlayer } from './types';

interface DotsBoardProps {
  gridSize: number; // e.g. 3 (3x3 boxes)
  players: DotsPlayer[];
  currentTurnIndex: number;
  claimedLines: Record<string, number>;
  claimedBoxes: Record<string, number>;
  isGameOver: boolean;
  onLineClick: (lineKey: string) => void;
}

export const DotsBoard: React.FC<DotsBoardProps> = ({
  gridSize,
  players,
  currentTurnIndex,
  claimedLines,
  claimedBoxes,
  isGameOver,
  onLineClick
}) => {
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const activePlayer = players[currentTurnIndex];

  const getPlayerColor = (playerId?: number) => {
    if (playerId === undefined) return '#94a3b8';
    const p = players.find(player => player.id === playerId);
    return p ? p.color : '#94a3b8';
  };

  const getPlayerAvatar = (playerId?: number) => {
    if (playerId === undefined) return '';
    const p = players.find(player => player.id === playerId);
    return p ? p.avatar : '';
  };

  const getPlayerName = (playerId?: number) => {
    if (playerId === undefined) return '';
    const p = players.find(player => player.id === playerId);
    return p ? p.name : '';
  };

  return (
    <div className="relative w-full max-w-[420px] sm:max-w-[480px] aspect-square mx-auto p-3 sm:p-4 rounded-[32px] bg-gradient-to-br from-[#6b4226] via-[#4a2c17] to-[#321d0f] shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-4px_8px_rgba(0,0,0,0.6)] border-4 border-[#3d2212] select-none">
      {/* Inner Parchment Board */}
      <div className="relative w-full h-full p-4 sm:p-6 rounded-[22px] bg-[#fcf8f0] border-2 border-[#d8c7b0] shadow-inner flex flex-col justify-between">
        {Array.from({ length: gridSize }).map((_, r) => (
          <React.Fragment key={`row-${r}`}>
            {/* Horizontal Line Row */}
            <div className="flex items-center justify-between w-full">
              {Array.from({ length: gridSize }).map((_, c) => {
                const hKey = `h-${r}-${c}`;
                const isClaimed = claimedLines[hKey] !== undefined;
                const isHovered = hoveredLine === hKey && !isClaimed && !isGameOver;

                return (
                  <React.Fragment key={`h-seg-${r}-${c}`}>
                    {/* Dot */}
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#3e2212] shadow-md border border-white flex-shrink-0 z-20" />

                    {/* Horizontal Line Segment */}
                    <button
                      type="button"
                      disabled={isClaimed || isGameOver}
                      onClick={() => onLineClick(hKey)}
                      onMouseEnter={() => setHoveredLine(hKey)}
                      onMouseLeave={() => setHoveredLine(null)}
                      aria-label={`Draw top line of row ${r + 1} column ${c + 1}`}
                      className="flex-1 h-3 sm:h-4 mx-0.5 flex items-center justify-center cursor-pointer group focus:outline-none"
                    >
                      <div
                        className={`w-full h-1.5 sm:h-2 rounded-full transition-all duration-150 ${
                          isClaimed
                            ? 'shadow-md scale-y-110'
                            : isHovered
                            ? 'opacity-60 scale-y-125'
                            : 'bg-slate-300/60 hover:bg-slate-400/80'
                        }`}
                        style={{
                          backgroundColor: isClaimed
                            ? getPlayerColor(claimedLines[hKey])
                            : isHovered
                            ? activePlayer.color
                            : undefined
                        }}
                      />
                    </button>
                  </React.Fragment>
                );
              })}
              {/* Last Dot of this row */}
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#3e2212] shadow-md border border-white flex-shrink-0 z-20" />
            </div>

            {/* Boxes & Vertical Lines Row */}
            <div className="flex items-stretch justify-between w-full flex-1 my-0.5">
              {Array.from({ length: gridSize }).map((_, c) => {
                const vLeftKey = `v-${r}-${c}`;
                const isVLeftClaimed = claimedLines[vLeftKey] !== undefined;
                const isVLeftHovered = hoveredLine === vLeftKey && !isVLeftClaimed && !isGameOver;

                const boxKey = `${r}-${c}`;
                const boxOwnerId = claimedBoxes[boxKey];
                const isBoxClaimed = boxOwnerId !== undefined;

                return (
                  <React.Fragment key={`box-seg-${r}-${c}`}>
                    {/* Vertical Line on Left */}
                    <button
                      type="button"
                      disabled={isVLeftClaimed || isGameOver}
                      onClick={() => onLineClick(vLeftKey)}
                      onMouseEnter={() => setHoveredLine(vLeftKey)}
                      onMouseLeave={() => setHoveredLine(null)}
                      aria-label={`Draw left line of box row ${r + 1} column ${c + 1}`}
                      className="w-3 sm:w-4 flex items-center justify-center cursor-pointer group focus:outline-none flex-shrink-0"
                    >
                      <div
                        className={`h-full w-1.5 sm:w-2 rounded-full transition-all duration-150 ${
                          isVLeftClaimed
                            ? 'shadow-md scale-x-110'
                            : isVLeftHovered
                            ? 'opacity-60 scale-x-125'
                            : 'bg-slate-300/60 hover:bg-slate-400/80'
                        }`}
                        style={{
                          backgroundColor: isVLeftClaimed
                            ? getPlayerColor(claimedLines[vLeftKey])
                            : isVLeftHovered
                            ? activePlayer.color
                            : undefined
                        }}
                      />
                    </button>

                    {/* Box Interior */}
                    <div
                      className={`flex-1 mx-1 rounded-xl flex items-center justify-center transition-all duration-300 select-none ${
                        isBoxClaimed
                          ? 'shadow-inner border-2 animate-fadeIn'
                          : 'bg-[#f7f0e3]/40'
                      }`}
                      style={{
                        backgroundColor: isBoxClaimed
                          ? `${getPlayerColor(boxOwnerId)}22`
                          : undefined,
                        borderColor: isBoxClaimed
                          ? getPlayerColor(boxOwnerId)
                          : 'transparent'
                      }}
                    >
                      {isBoxClaimed && (
                        <div
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white flex items-center justify-center text-xs sm:text-base font-black shadow-md text-white"
                          style={{ backgroundColor: getPlayerColor(boxOwnerId) }}
                          title={`Captured by ${getPlayerName(boxOwnerId)}`}
                        >
                          <span>{getPlayerAvatar(boxOwnerId)}</span>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}

              {/* Last Vertical Line on Right */}
              {(() => {
                const vRightKey = `v-${r}-${gridSize}`;
                const isVRightClaimed = claimedLines[vRightKey] !== undefined;
                const isVRightHovered =
                  hoveredLine === vRightKey && !isVRightClaimed && !isGameOver;

                return (
                  <button
                    type="button"
                    disabled={isVRightClaimed || isGameOver}
                    onClick={() => onLineClick(vRightKey)}
                    onMouseEnter={() => setHoveredLine(vRightKey)}
                    onMouseLeave={() => setHoveredLine(null)}
                    aria-label={`Draw right line of row ${r + 1}`}
                    className="w-3 sm:w-4 flex items-center justify-center cursor-pointer group focus:outline-none flex-shrink-0"
                  >
                    <div
                      className={`h-full w-1.5 sm:w-2 rounded-full transition-all duration-150 ${
                        isVRightClaimed
                          ? 'shadow-md scale-x-110'
                          : isVRightHovered
                          ? 'opacity-60 scale-x-125'
                          : 'bg-slate-300/60 hover:bg-slate-400/80'
                      }`}
                      style={{
                        backgroundColor: isVRightClaimed
                          ? getPlayerColor(claimedLines[vRightKey])
                          : isVRightHovered
                          ? activePlayer.color
                          : undefined
                      }}
                    />
                  </button>
                );
              })()}
            </div>
          </React.Fragment>
        ))}

        {/* Bottom-most Horizontal Line Row */}
        <div className="flex items-center justify-between w-full">
          {Array.from({ length: gridSize }).map((_, c) => {
            const hBottomKey = `h-${gridSize}-${c}`;
            const isClaimed = claimedLines[hBottomKey] !== undefined;
            const isHovered = hoveredLine === hBottomKey && !isClaimed && !isGameOver;

            return (
              <React.Fragment key={`h-bottom-${c}`}>
                {/* Dot */}
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#3e2212] shadow-md border border-white flex-shrink-0 z-20" />

                {/* Horizontal Line Segment */}
                <button
                  type="button"
                  disabled={isClaimed || isGameOver}
                  onClick={() => onLineClick(hBottomKey)}
                  onMouseEnter={() => setHoveredLine(hBottomKey)}
                  onMouseLeave={() => setHoveredLine(null)}
                  aria-label={`Draw bottom line of column ${c + 1}`}
                  className="flex-1 h-3 sm:h-4 mx-0.5 flex items-center justify-center cursor-pointer group focus:outline-none"
                >
                  <div
                    className={`w-full h-1.5 sm:h-2 rounded-full transition-all duration-150 ${
                      isClaimed
                        ? 'shadow-md scale-y-110'
                        : isHovered
                        ? 'opacity-60 scale-y-125'
                        : 'bg-slate-300/60 hover:bg-slate-400/80'
                    }`}
                    style={{
                      backgroundColor: isClaimed
                        ? getPlayerColor(claimedLines[hBottomKey])
                        : isHovered
                        ? activePlayer.color
                        : undefined
                    }}
                  />
                </button>
              </React.Fragment>
            );
          })}
          {/* Very Last Dot (Bottom-Right) */}
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#3e2212] shadow-md border border-white flex-shrink-0 z-20" />
        </div>
      </div>
    </div>
  );
};
