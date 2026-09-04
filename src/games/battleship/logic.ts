import { BattleshipGameState, PlayerArmada, Ship, CellStatus, BattlePhase } from './types';

export const GRID_SIZE = 6;

export const SHIP_CONFIGS = [
  { id: 'carrier', name: 'Carrier', size: 3 },
  { id: 'cruiser', name: 'Cruiser', size: 2 },
  { id: 'submarine', name: 'Submarine', size: 2 },
];

function createEmptyGrid<T>(val: T): T[][] {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(val));
}

function createArmada(): PlayerArmada {
  return {
    grid: createEmptyGrid<CellStatus>('empty'),
    radar: createEmptyGrid<'unknown' | 'hit' | 'miss'>('unknown'),
    ships: [],
  };
}

export function createInitialBattleshipState(): BattleshipGameState {
  return {
    p1: createArmada(),
    p2: createArmada(),
    turn: 0,
    phase: 'placement-p1',
    winner: null,
    lastLog: 'Player 1: Place your fleet on the grid!',
  };
}

export function autoPlaceFleet(): { grid: CellStatus[][]; ships: Ship[] } {
  const grid = createEmptyGrid<CellStatus>('empty');
  const ships: Ship[] = [];

  for (const cfg of SHIP_CONFIGS) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      attempts++;
      const isHorizontal = Math.random() < 0.5;
      const maxR = isHorizontal ? GRID_SIZE : GRID_SIZE - cfg.size;
      const maxC = isHorizontal ? GRID_SIZE - cfg.size : GRID_SIZE;

      const r = Math.floor(Math.random() * maxR);
      const c = Math.floor(Math.random() * maxC);

      const cells: [number, number][] = [];
      let canPlace = true;

      for (let i = 0; i < cfg.size; i++) {
        const cr = isHorizontal ? r : r + i;
        const cc = isHorizontal ? c + i : c;
        if (grid[cr][cc] !== 'empty') {
          canPlace = false;
          break;
        }
        cells.push([cr, cc]);
      }

      if (canPlace) {
        for (const [cr, cc] of cells) {
          grid[cr][cc] = 'ship';
        }
        ships.push({
          id: cfg.id,
          name: cfg.name,
          size: cfg.size,
          cells,
          hits: 0,
          isSunk: false,
        });
        placed = true;
      }
    }
  }

  return { grid, ships };
}

export function fireShot(state: BattleshipGameState, row: number, col: number): BattleshipGameState {
  if (state.phase !== 'combat' || state.winner !== null) return state;

  const attackerArmada = state.turn === 0 ? state.p1 : state.p2;
  const defenderArmada = state.turn === 0 ? state.p2 : state.p1;

  if (attackerArmada.radar[row][col] !== 'unknown') return state; // already fired

  const nextRadar = attackerArmada.radar.map((r) => [...r]);
  const nextDefenderGrid = defenderArmada.grid.map((r) => [...r]);
  const nextShips = defenderArmada.ships.map((s) => ({ ...s }));

  let isHit = false;
  let sunkShipName: string | null = null;

  if (nextDefenderGrid[row][col] === 'ship') {
    isHit = true;
    nextRadar[row][col] = 'hit';
    nextDefenderGrid[row][col] = 'hit';

    // Find ship and increment hit
    for (const ship of nextShips) {
      if (ship.cells.some(([cr, cc]) => cr === row && cc === col)) {
        ship.hits++;
        if (ship.hits >= ship.size) {
          ship.isSunk = true;
          sunkShipName = ship.name;
        }
        break;
      }
    }
  } else {
    nextRadar[row][col] = 'miss';
    nextDefenderGrid[row][col] = 'miss';
  }

  const allSunk = nextShips.every((s) => s.isSunk);
  let winner: 0 | 1 | null = null;
  let phase: BattlePhase = state.phase;
  if (allSunk) {
    winner = state.turn;
    phase = 'game-over';
  }

  const nextTurn = isHit ? state.turn : state.turn === 0 ? 1 : 0;

  const updatedP1 = state.turn === 0 ? { ...attackerArmada, radar: nextRadar } : { ...defenderArmada, grid: nextDefenderGrid, ships: nextShips };
  const updatedP2 = state.turn === 1 ? { ...attackerArmada, radar: nextRadar } : { ...defenderArmada, grid: nextDefenderGrid, ships: nextShips };

  return {
    p1: updatedP1,
    p2: updatedP2,
    turn: nextTurn,
    phase,
    winner,
    lastLog: sunkShipName
      ? `💥 HIT & SUNK! Enemy ${sunkShipName} destroyed!`
      : isHit
      ? '🎯 DIRECT HIT! Bonus shot granted!'
      : '🌊 Splash! Shot missed.',
  };
}
