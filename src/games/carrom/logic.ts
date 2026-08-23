import { CarromPiece, CarromGameState, CarromPlayer } from './types';

export const POCKETS = [
  { x: 8, y: 8, r: 4.8 },
  { x: 92, y: 8, r: 4.8 },
  { x: 8, y: 92, r: 4.8 },
  { x: 92, y: 92, r: 4.8 }
];

export const BOARD_BOUNDS = {
  minX: 8,
  maxX: 92,
  minY: 8,
  maxY: 92
};

export function createInitialPieces(): CarromPiece[] {
  const pieces: CarromPiece[] = [];

  // Center Queen
  pieces.push({
    id: 'queen',
    type: 'queen',
    x: 50,
    y: 50,
    vx: 0,
    vy: 0,
    radius: 2.6,
    isPocketed: false
  });

  // Inner ring: 6 coins around queen (radius 5.5)
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 * Math.PI) / 180;
    const type = i % 2 === 0 ? 'white' : 'black';
    pieces.push({
      id: `inner-${i}`,
      type,
      x: 50 + Math.cos(angle) * 5.6,
      y: 50 + Math.sin(angle) * 5.6,
      vx: 0,
      vy: 0,
      radius: 2.5,
      isPocketed: false
    });
  }

  // Outer ring: 12 coins (radius 11.2)
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 * Math.PI) / 180;
    const type = (i % 3 === 0 || i % 3 === 1) ? 'white' : 'black';
    pieces.push({
      id: `outer-${i}`,
      type,
      x: 50 + Math.cos(angle) * 11.2,
      y: 50 + Math.sin(angle) * 11.2,
      vx: 0,
      vy: 0,
      radius: 2.5,
      isPocketed: false
    });
  }

  return pieces;
}

export function createInitialCarromState(
  p1: { name: string; isBot?: boolean } | string = 'Player 1',
  p2: { name: string; isBot?: boolean } | string = 'Bot Alpha 🤖'
): CarromGameState {
  const p1Name = typeof p1 === 'string' ? p1 : p1.name;
  const p1Bot = typeof p1 === 'string' ? false : !!p1.isBot;

  const p2Name = typeof p2 === 'string' ? p2 : p2.name;
  const p2Bot = typeof p2 === 'string' ? p2Name.toLowerCase().includes('bot') : !!p2.isBot;

  return {
    players: [
      { id: 1, name: p1Name, color: '#dc2626', score: 0, coinsPocketed: 0, isBot: p1Bot },
      { id: 2, name: p2Name, color: '#0284c7', score: 0, coinsPocketed: 0, isBot: p2Bot }
    ],
    currentTurnIndex: 0,
    pieces: createInitialPieces(),
    strikerPos: 50, // 50% along baseline
    aimAngle: 270, // Aiming upward
    power: 60,
    isStriking: false,
    isGameOver: false,
    winner: null,
    activityLog: ['Match started! Position the striker, aim, and strike to pocket coins.']
  };
}

export function getStrikerInitialPos(
  playerIndex: number,
  strikerPosPercent: number
): { x: number; y: number } {
  // Player 1 (Bottom baseline)
  if (playerIndex === 0) {
    return { x: strikerPosPercent, y: 84 };
  }
  // Player 2 (Top baseline)
  return { x: strikerPosPercent, y: 16 };
}

/**
 * Intelligent Carrom AI bot shot calculation
 */
export function getBestCarromShot(state: CarromGameState): {
  strikerPos: number;
  aimAngle: number;
  power: number;
} {
  const isP1 = state.currentTurnIndex === 0;
  const baselineY = isP1 ? 84 : 16;
  const activeCoins = state.pieces.filter(p => !p.isPocketed && p.type !== 'striker');

  if (activeCoins.length === 0) {
    return { strikerPos: 50, aimAngle: isP1 ? 270 : 90, power: 70 };
  }

  // Find coin with cleanest angle to pocket or closest coin
  let bestCoin = activeCoins[0];
  let minDistance = Infinity;

  activeCoins.forEach(coin => {
    const distFromBaseline = Math.abs(coin.y - baselineY);
    if (distFromBaseline < minDistance) {
      minDistance = distFromBaseline;
      bestCoin = coin;
    }
  });

  // Position striker directly aligned with coin X (clamped 20% to 80%)
  const strikerPos = Math.max(25, Math.min(75, bestCoin.x + (Math.random() * 6 - 3)));
  const strikerX = strikerPos;

  // Aim towards the coin
  const dx = bestCoin.x - strikerX;
  const dy = bestCoin.y - baselineY;
  let angleRad = Math.atan2(dy, dx);
  let angleDeg = (angleRad * 180) / Math.PI;
  if (angleDeg < 0) angleDeg += 360;

  const power = Math.min(85, Math.max(45, Math.round(Math.hypot(dx, dy) * 1.3)));

  return {
    strikerPos,
    aimAngle: Math.round(angleDeg),
    power
  };
}

/**
 * Executes a single physics simulation tick for all active pieces on the board.
 */
export function updateCarromPhysics(pieces: CarromPiece[]): {
  updatedPieces: CarromPiece[];
  pocketedThisTick: CarromPiece[];
  allStopped: boolean;
} {
  const friction = 0.982;
  const stopThreshold = 0.04;
  const pocketedThisTick: CarromPiece[] = [];
  let isMoving = false;

  const activePieces = pieces.map(p => ({ ...p }));

  // 1. Move & Wall collision
  activePieces.forEach(p => {
    if (p.isPocketed) return;

    if (Math.hypot(p.vx, p.vy) > stopThreshold) {
      isMoving = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= friction;
      p.vy *= friction;

      // Check board border bounce
      if (p.x - p.radius < BOARD_BOUNDS.minX) {
        p.x = BOARD_BOUNDS.minX + p.radius;
        p.vx = -p.vx * 0.75;
      }
      if (p.x + p.radius > BOARD_BOUNDS.maxX) {
        p.x = BOARD_BOUNDS.maxX - p.radius;
        p.vx = -p.vx * 0.75;
      }
      if (p.y - p.radius < BOARD_BOUNDS.minY) {
        p.y = BOARD_BOUNDS.minY + p.radius;
        p.vy = -p.vy * 0.75;
      }
      if (p.y + p.radius > BOARD_BOUNDS.maxY) {
        p.y = BOARD_BOUNDS.maxY - p.radius;
        p.vy = -p.vy * 0.75;
      }

      // Check corner pockets
      for (const pocket of POCKETS) {
        const dist = Math.hypot(p.x - pocket.x, p.y - pocket.y);
        if (dist < pocket.r + 0.5) {
          p.isPocketed = true;
          p.vx = 0;
          p.vy = 0;
          pocketedThisTick.push(p);
          break;
        }
      }
    } else {
      p.vx = 0;
      p.vy = 0;
    }
  });

  // 2. Elastic circle-to-circle collisions
  for (let i = 0; i < activePieces.length; i++) {
    const p1 = activePieces[i];
    if (p1.isPocketed) continue;

    for (let j = i + 1; j < activePieces.length; j++) {
      const p2 = activePieces[j];
      if (p2.isPocketed) continue;

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.hypot(dx, dy);
      const minDist = p1.radius + p2.radius;

      if (dist < minDist && dist > 0) {
        // Overlap correction
        const overlap = (minDist - dist) / 2;
        const nx = dx / dist;
        const ny = dy / dist;

        p1.x -= nx * overlap;
        p1.y -= ny * overlap;
        p2.x += nx * overlap;
        p2.y += ny * overlap;

        // Elastic velocity swap along normal
        const kx = p1.vx - p2.vx;
        const ky = p1.vy - p2.vy;
        const p = 2 * (nx * kx + ny * ky) / 2;

        p1.vx -= p * nx * 0.85;
        p1.vy -= p * ny * 0.85;
        p2.vx -= p * nx * 0.85;
        p2.vy -= p * ny * 0.85;
      }
    }
  }

  return {
    updatedPieces: activePieces,
    pocketedThisTick,
    allStopped: !isMoving
  };
}
