import { AshtaGameState, AshtaMove, Player, PlayerColor, Token } from './types';

// Outer ring (16 cells) + Inner ring (8 cells) + Center (1 cell) = 25 cells
// Coordinates on 5x5 grid: [row, col]
export const BOARD_COORDS: [number, number][] = [
  // Outer perimeter (0..15)
  [4, 2], [4, 1], [4, 0], [3, 0], [2, 0], [1, 0], [0, 0], [0, 1],
  [0, 2], [0, 3], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [4, 3],
  // Inner ring (16..23)
  [3, 2], [3, 1], [2, 1], [1, 1], [1, 2], [1, 3], [2, 3], [3, 3],
  // Center (24)
  [2, 2],
];

// Safe cells where tokens cannot be captured
export const SAFE_COORDS: [number, number][] = [
  [4, 2], [2, 0], [0, 2], [2, 4], [2, 2],
];

export const START_OFFSETS: Record<PlayerColor, number> = {
  red: 0,     // [4, 2] Bottom
  green: 4,   // [2, 0] Left
  yellow: 8,  // [0, 2] Top
  blue: 12,   // [2, 4] Right
};

export function rollCowrieShells(): { shells: [number, number, number, number]; value: number; isExtraTurn: boolean } {
  const s1 = Math.random() < 0.5 ? 1 : 0;
  const s2 = Math.random() < 0.5 ? 1 : 0;
  const s3 = Math.random() < 0.5 ? 1 : 0;
  const s4 = Math.random() < 0.5 ? 1 : 0;
  const count = s1 + s2 + s3 + s4;

  let value = count;
  let isExtraTurn = false;
  if (count === 0) {
    value = 8; // Ashta
    isExtraTurn = true;
  } else if (count === 4) {
    value = 4; // Chauka
    isExtraTurn = true;
  }

  return { shells: [s1, s2, s3, s4], value, isExtraTurn };
}

export function createInitialAshtaState(playerConfigs: { name: string; isBot: boolean }[]): AshtaGameState {
  const colors: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
  const count = Math.min(Math.max(playerConfigs.length, 2), 4);

  const players: Player[] = colors.slice(0, count).map((color, idx) => ({
    id: `p-${color}`,
    name: playerConfigs[idx]?.name || `Player ${idx + 1}`,
    color,
    hasCaptured: false,
    isBot: playerConfigs[idx]?.isBot || false,
    tokens: [0, 1].map((tIdx) => ({
      id: `${color}-${tIdx}`,
      playerId: `p-${color}`,
      color,
      stepIndex: -1,
    })),
  }));

  return {
    players,
    currentPlayerIndex: 0,
    shells: [1, 1, 0, 0],
    rollValue: null,
    isRolling: false,
    hasRolled: false,
    consecutiveExtraRolls: 0,
    validMoves: [],
    winners: [],
    lastLog: 'Roll the cowrie shells to begin!',
  };
}

export function getValidAshtaMoves(state: AshtaGameState): AshtaMove[] {
  if (state.rollValue === null) return [];
  const player = state.players[state.currentPlayerIndex];
  const roll = state.rollValue;
  const moves: AshtaMove[] = [];

  for (const token of player.tokens) {
    if (token.stepIndex === 24) continue; // already finished

    // Deploy from yard: requires Chauka (4) or Ashta (8)
    if (token.stepIndex === -1) {
      if (roll === 4 || roll === 8) {
        moves.push({
          tokenId: token.id,
          fromStep: -1,
          toStep: 0,
          isCapture: false,
          isFinished: false,
        });
      }
      continue;
    }

    const targetStep = token.stepIndex + roll;
    if (targetStep > 24) continue; // overshoot center

    // Check entry to inner sanctum (steps 16+): requires having captured at least 1 opponent token
    if (targetStep >= 16 && !player.hasCaptured && token.stepIndex < 16) {
      continue;
    }

    const isFinished = targetStep === 24;
    let isCapture = false;
    let capturedTokenId: string | undefined;

    if (!isFinished) {
      const targetCoord = getBoardCoordForStep(player.color, targetStep);
      const isSafe = SAFE_COORDS.some((sc) => sc[0] === targetCoord[0] && sc[1] === targetCoord[1]);

      if (!isSafe) {
        // Look for opponent token on targetCoord
        for (const otherPlayer of state.players) {
          if (otherPlayer.id === player.id) continue;
          for (const oppToken of otherPlayer.tokens) {
            if (oppToken.stepIndex >= 0 && oppToken.stepIndex < 24) {
              const oppCoord = getBoardCoordForStep(otherPlayer.color, oppToken.stepIndex);
              if (oppCoord[0] === targetCoord[0] && oppCoord[1] === targetCoord[1]) {
                isCapture = true;
                capturedTokenId = oppToken.id;
                break;
              }
            }
          }
        }
      }
    }

    moves.push({
      tokenId: token.id,
      fromStep: token.stepIndex,
      toStep: targetStep,
      isCapture,
      capturedTokenId,
      isFinished,
    });
  }

  return moves;
}

export function getBoardCoordForStep(color: PlayerColor, step: number): [number, number] {
  if (step === -1) {
    if (color === 'red') return [4, 2];
    if (color === 'green') return [2, 0];
    if (color === 'yellow') return [0, 2];
    return [2, 4];
  }
  if (step >= 24) return [2, 2];

  const offset = START_OFFSETS[color];
  if (step < 16) {
    // Outer loop (16 cells)
    const idx = (offset + step) % 16;
    return BOARD_COORDS[idx];
  }
  // Inner loop (8 cells: 16..23)
  const innerIdx = 16 + ((offset / 2 + (step - 16)) % 8);
  return BOARD_COORDS[innerIdx];
}

export function applyAshtaMove(state: AshtaGameState, move: AshtaMove): AshtaGameState {
  const currentPlayer = state.players[state.currentPlayerIndex];
  let hasCaptured = currentPlayer.hasCaptured;
  let grantedExtraTurn = state.rollValue === 4 || state.rollValue === 8;

  const nextPlayers = state.players.map((p) => {
    if (p.id === currentPlayer.id) {
      const nextTokens = p.tokens.map((t) =>
        t.id === move.tokenId ? { ...t, stepIndex: move.toStep } : t
      );
      if (move.isCapture) hasCaptured = true;
      return { ...p, tokens: nextTokens, hasCaptured };
    }

    // Reset captured opponent token back to yard (-1)
    if (move.isCapture && move.capturedTokenId) {
      grantedExtraTurn = true;
      const nextTokens = p.tokens.map((t) =>
        t.id === move.capturedTokenId ? { ...t, stepIndex: -1 } : t
      );
      return { ...p, tokens: nextTokens };
    }

    return p;
  });

  // Check win
  const updatedCurrentPlayer = nextPlayers.find((p) => p.id === currentPlayer.id)!;
  let nextWinners = [...state.winners];
  if (updatedCurrentPlayer.tokens.every((t) => t.stepIndex === 24) && !nextWinners.includes(currentPlayer.id)) {
    nextWinners.push(currentPlayer.id);
  }

  let nextPlayerIndex = state.currentPlayerIndex;
  if (!grantedExtraTurn || nextWinners.includes(currentPlayer.id)) {
    nextPlayerIndex = (state.currentPlayerIndex + 1) % nextPlayers.length;
    while (nextWinners.includes(nextPlayers[nextPlayerIndex].id) && nextWinners.length < nextPlayers.length) {
      nextPlayerIndex = (nextPlayerIndex + 1) % nextPlayers.length;
    }
  }

  return {
    ...state,
    players: nextPlayers,
    currentPlayerIndex: nextPlayerIndex,
    rollValue: null,
    hasRolled: false,
    validMoves: [],
    winners: nextWinners,
    lastLog: move.isCapture
      ? `💥 ${currentPlayer.name} captured an opponent token! +1 Extra Roll`
      : move.isFinished
      ? `⭐ ${currentPlayer.name} reached the Haveli!`
      : `${currentPlayer.name} moved token to step ${move.toStep}.`,
  };
}
