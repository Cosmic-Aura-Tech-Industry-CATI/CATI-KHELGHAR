import { BoardCell, PlayerColor } from '../types';
import { MAIN_TRACK, SAFE_TRACK_INDICES, HOME_LANES, CENTER_CELL, YARD_POSITIONS, HOME_LANE_START } from '../constants';

// Build the complete 15x15 board cell map
export function buildBoardCells(): BoardCell[][] {
  const grid: BoardCell[][] = Array.from({ length: 15 }, (_, r) =>
    Array.from({ length: 15 }, (_, c) => ({
      row: r,
      col: c,
      type: 'empty',
    }))
  );

  // Mark home areas (6x6 corners)
  const markHomeArea = (color: PlayerColor, rowStart: number, colStart: number) => {
    for (let r = rowStart; r < rowStart + 6; r++) {
      for (let c = colStart; c < colStart + 6; c++) {
        grid[r][c] = { row: r, col: c, type: 'home-area', color };
      }
    }
  };
  markHomeArea('red', 0, 0);
  markHomeArea('green', 0, 9);
  markHomeArea('yellow', 9, 9);
  markHomeArea('blue', 9, 0);

  // Mark center
  grid[7][7] = { row: 7, col: 7, type: 'center' };
  // Center adjacent cells (triangular areas)
  const centerArea: [number, number][] = [
    [6,6],[6,7],[6,8],[7,6],[7,8],[8,6],[8,7],[8,8]
  ];
  centerArea.forEach(([r,c]) => {
    grid[r][c] = { row: r, col: c, type: 'center' };
  });

  // Mark main track path cells
  MAIN_TRACK.forEach(([r, c], idx) => {
    const isSafe = SAFE_TRACK_INDICES.includes(idx);
    // Determine color for start cells
    const startColors: Partial<Record<number, PlayerColor>> = { 0: 'red', 13: 'green', 26: 'yellow', 39: 'blue' };
    grid[r][c] = {
      row: r,
      col: c,
      type: isSafe && !startColors[idx] ? 'safe' : startColors[idx] ? 'start' : 'path',
      color: startColors[idx],
      pathIndex: idx,
      isSafe,
    };
  });

  // Mark home lanes
  const colors: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
  colors.forEach(color => {
    HOME_LANES[color].forEach(([r, c], idx) => {
      grid[r][c] = { row: r, col: c, type: 'home-lane', color, homeLaneIndex: idx };
    });
  });

  return grid;
}

// Get [row, col] for a pawn given its player color and steps
export function getPawnPosition(
  color: PlayerColor,
  startTrackIndex: number,
  steps: number,
  pawnIndex: number // 0-3, for yard slot
): [number, number] {
  if (steps === -1) {
    return YARD_POSITIONS[color][pawnIndex];
  }
  if (steps >= HOME_LANE_START && steps < 57) {
    const laneIdx = steps - HOME_LANE_START;
    return HOME_LANES[color][laneIdx];
  }
  if (steps === 57) {
    return CENTER_CELL;
  }
  // Main track
  const trackIndex = (startTrackIndex + steps) % 52;
  return MAIN_TRACK[trackIndex];
}

// Get the track index for a given step count and player start
export function getTrackIndex(startTrackIndex: number, steps: number): number {
  return (startTrackIndex + steps) % 52;
}
