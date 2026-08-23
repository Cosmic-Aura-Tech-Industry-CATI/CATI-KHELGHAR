'use client';
import React, { useRef } from 'react';
import { GameState, BoardCell, ValidMove } from '../types';
import { LudoCell } from './LudoCell';
import { LudoPawn } from './LudoPawn';
import { getPawnPosition } from '../engine/board';

interface LudoBoardProps {
  gameState: GameState;
  boardCells: BoardCell[][];
  onPawnClick: (pawnId: string) => void;
}

// Calculate stacking offsets for multiple pawns on the same cell
function getStackOffsets(count: number, index: number): { dx: number; dy: number } {
  if (count === 1) return { dx: 0, dy: 0 };
  const offsets: { dx: number; dy: number }[] = [
    { dx: -6, dy: -6 }, { dx: 6, dy: -6 }, { dx: -6, dy: 6 }, { dx: 6, dy: 6 },
  ];
  return offsets[index] ?? { dx: 0, dy: 0 };
}

export const LudoBoard: React.FC<LudoBoardProps> = ({ gameState, boardCells, onPawnClick }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const { players, validMoves, selectedPawnId, currentPlayerIndex } = gameState;

  // Build pawn position map: "row,col" -> array of pawns there
  const pawnPositionMap = new Map<string, { pawnIndex: number; playerIndex: number }[]>();
  players.forEach((player, playerIndex) => {
    player.pawns.forEach((pawn, pawnIndex) => {
      const pawnArrayIndex = parseInt(pawn.id.split('-')[1], 10);
      const [row, col] = getPawnPosition(player.color, player.startTrackIndex, pawn.steps, pawnArrayIndex);
      const key = `${row},${col}`;
      const existing = pawnPositionMap.get(key) ?? [];
      pawnPositionMap.set(key, [...existing, { pawnIndex, playerIndex }]);
    });
  });

  const selectableIds = new Set(validMoves.map(m => m.pawnId));

  return (
    <div
      ref={boardRef}
      className="relative w-full aspect-square max-w-[540px] mx-auto rounded-2xl overflow-hidden
        shadow-[0_20px_60px_rgba(0,0,0,0.3),0_0_0_3px_#C99A3D]
        bg-[#FFF7EF]"
      style={{ border: '3px solid #C99A3D' }}
    >
      {/* Cherry blossom outer glow border decoration */}
      <div className="absolute inset-0 pointer-events-none z-30 rounded-2xl"
        style={{ boxShadow: 'inset 0 0 20px rgba(245,139,168,0.15), inset 0 0 2px rgba(201,154,61,0.4)' }}
      />

      {/* 15×15 Board Grid — the actual game board */}
      <div
        className="absolute inset-0 z-0"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(15, minmax(0, 1fr))', gap: '0px' }}
      >
        {boardCells.flat().map(cell => (
          <LudoCell key={`${cell.row}-${cell.col}`} cell={cell} />
        ))}
      </div>

      {/* Home yard circles decoration layer */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        {(['red', 'green', 'yellow', 'blue'] as const).map(color => {
          const yardData = [
            { color: 'red', rows: [1, 4], cols: [1, 4], bg: '#F8D0DA', ring: '#D95C83' },
            { color: 'green', rows: [1, 4], cols: [10, 13], bg: '#D5EAC8', ring: '#5a7a3a' },
            { color: 'yellow', rows: [10, 13], cols: [10, 13], bg: '#FDF0C0', ring: '#C99A3D' },
            { color: 'blue', rows: [10, 13], cols: [1, 4], bg: '#C5DCF5', ring: '#4a7ab8' },
          ].find(d => d.color === color)!;
          if (!yardData) return null;
          const cellSize = 100 / 15;
          const r1 = yardData.rows[0]; const r2 = yardData.rows[1];
          const c1 = yardData.cols[0]; const c2 = yardData.cols[1];
          const bigLeft = `${c1 * cellSize}%`;
          const bigTop = `${r1 * cellSize}%`;
          const bigW = `${(c2 - c1) * cellSize}%`;
          const bigH = `${(r2 - r1) * cellSize}%`;
          return (
            <div key={color} className="absolute rounded-xl border-2"
              style={{ left: bigLeft, top: bigTop, width: bigW, height: bigH, borderColor: yardData.ring, background: `${yardData.bg}99` }}
            >
              {/* 4 circle slots inside yard */}
              <div className="grid grid-cols-2 gap-[8%] p-[8%] w-full h-full">
                {[0,1,2,3].map(i => (
                  <div key={i} className="rounded-full border-2 bg-white/60" style={{ borderColor: yardData.ring }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Center finish area overlay */}
      <div
        className="absolute pointer-events-none z-2"
        style={{
          left: `${(6 / 15) * 100}%`,
          top: `${(6 / 15) * 100}%`,
          width: `${(3 / 15) * 100}%`,
          height: `${(3 / 15) * 100}%`,
        }}
      >
        <svg viewBox="0 0 3 3" className="w-full h-full">
          {/* 4 colored triangles meeting at center */}
          <polygon points="0,0 1.5,1.5 3,0" fill="#F58BA8" opacity="0.7" />
          <polygon points="3,0 1.5,1.5 3,3" fill="#8DAA62" opacity="0.7" />
          <polygon points="3,3 1.5,1.5 0,3" fill="#F2C45E" opacity="0.7" />
          <polygon points="0,3 1.5,1.5 0,0" fill="#7EA7D8" opacity="0.7" />
          {/* Sakura center */}
          <text x="1.5" y="1.8" textAnchor="middle" fontSize="1" fill="white" fontFamily="system-ui">🌸</text>
        </svg>
      </div>

      {/* Pawn Layer — absolutely positioned on top */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {players.flatMap((player, playerIndex) =>
          player.pawns.map((pawn) => {
            const pawnArrayIndex = parseInt(pawn.id.split('-')[1], 10);
            const [row, col] = getPawnPosition(player.color, player.startTrackIndex, pawn.steps, pawnArrayIndex);
            const key = `${row},${col}`;
            const allOnCell = pawnPositionMap.get(key) ?? [];
            const myIndexInCell = allOnCell.findIndex(e => e.playerIndex === playerIndex && e.pawnIndex === pawnArrayIndex);
            const stackOffset = getStackOffsets(allOnCell.length, myIndexInCell);
            const isSelectable = selectableIds.has(pawn.id) && gameState.phase === 'selecting';
            const isSelected = pawn.id === selectedPawnId;

            return (
              <div key={pawn.id} className="pointer-events-auto">
                <LudoPawn
                  pawn={pawn}
                  row={row}
                  col={col}
                  isSelectable={isSelectable}
                  isSelected={isSelected}
                  stackOffset={stackOffset}
                  onClick={() => onPawnClick(pawn.id)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
