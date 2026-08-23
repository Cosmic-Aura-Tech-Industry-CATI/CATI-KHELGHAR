import { LudoColor, LudoPlayer, LudoGameState, LudoValidMove, LudoToken } from './types';

// Standard 52-cell main track [row, col] on 15x15 board
export const LUDO_MAIN_TRACK: [number, number][] = [
  [6, 1],  // 0  Red Start (Safe ★)
  [6, 2],  // 1
  [6, 3],  // 2
  [6, 4],  // 3
  [6, 5],  // 4
  [5, 6],  // 5
  [4, 6],  // 6
  [3, 6],  // 7
  [2, 6],  // 8  Star Safe ★
  [1, 6],  // 9
  [0, 6],  // 10
  [0, 7],  // 11
  [0, 8],  // 12
  [1, 8],  // 13 Green Start (Safe ★)
  [2, 8],  // 14
  [3, 8],  // 15
  [4, 8],  // 16
  [5, 8],  // 17
  [6, 9],  // 18
  [6, 10], // 19
  [6, 11], // 20
  [6, 12], // 21 Star Safe ★
  [6, 13], // 22
  [6, 14], // 23
  [7, 14], // 24
  [8, 14], // 25
  [8, 13], // 26 Yellow Start (Safe ★)
  [8, 12], // 27
  [8, 11], // 28
  [8, 10], // 29
  [8, 9],  // 30
  [9, 8],  // 31
  [10, 8], // 32
  [11, 8], // 33
  [12, 8], // 34 Star Safe ★
  [13, 8], // 35
  [14, 8], // 36
  [14, 7], // 37
  [14, 6], // 38
  [13, 6], // 39 Blue Start (Safe ★)
  [12, 6], // 40
  [11, 6], // 41
  [10, 6], // 42
  [9, 6],  // 43
  [8, 5],  // 44
  [8, 4],  // 45
  [8, 3],  // 46
  [8, 2],  // 47 Star Safe ★
  [8, 1],  // 48
  [8, 0],  // 49
  [7, 0],  // 50
  [6, 0]   // 51
];

export const LUDO_SAFE_TRACK_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

export const LUDO_HOME_COLUMNS: Record<number, [number, number][]> = {
  0: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6]],     // Red
  1: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]],     // Green
  2: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9], [7, 8]], // Yellow
  3: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]]  // Blue
};

// Yard coordinates placing tokens directly into the printed yard circles
export const LUDO_PLAYER_CONFIGS: {
  id: number;
  color: LudoColor;
  name: string;
  colorHex: string;
  lightColorHex: string;
  startTrackIndex: number;
  yardCoords: [number, number][];
}[] = [
  {
    id: 0,
    color: 'red',
    name: 'Red',
    colorHex: '#dc2626',
    lightColorHex: '#fecaca',
    startTrackIndex: 0,
    yardCoords: [[2, 2], [2, 3], [3, 2], [3, 3]]
  },
  {
    id: 1,
    color: 'green',
    name: 'Green',
    colorHex: '#16a34a',
    lightColorHex: '#bbf7d0',
    startTrackIndex: 13,
    yardCoords: [[2, 11], [2, 12], [3, 11], [3, 12]]
  },
  {
    id: 2,
    color: 'yellow',
    name: 'Yellow',
    colorHex: '#ca8a04',
    lightColorHex: '#fef08a',
    startTrackIndex: 26,
    yardCoords: [[11, 11], [11, 12], [12, 11], [12, 12]]
  },
  {
    id: 3,
    color: 'blue',
    name: 'Blue',
    colorHex: '#0284c7',
    lightColorHex: '#bae6fd',
    startTrackIndex: 39,
    yardCoords: [[11, 2], [11, 3], [12, 2], [12, 3]]
  }
];

export function createInitialLudoState(
  playerCount: number = 4,
  customPlayers?: Array<{ name: string; isBot?: boolean }> | string[]
): LudoGameState {
  const selectedConfigIndices =
    playerCount === 2 ? [0, 2] : playerCount === 3 ? [0, 1, 2] : [0, 1, 2, 3];

  const players: LudoPlayer[] = selectedConfigIndices.map((cfgIdx, internalIdx) => {
    const cfg = LUDO_PLAYER_CONFIGS[cfgIdx];
    const raw = customPlayers?.[internalIdx];

    const name =
      typeof raw === 'string'
        ? raw
        : raw?.name || `Player ${internalIdx + 1} (${cfg.name})`;

    const isBot =
      typeof raw === 'string'
        ? name.toLowerCase().includes('bot')
        : raw?.isBot !== undefined
        ? raw.isBot
        : internalIdx > 0;

    return {
      id: cfg.id,
      color: cfg.color,
      name,
      colorHex: cfg.colorHex,
      lightColorHex: cfg.lightColorHex,
      startTrackIndex: cfg.startTrackIndex,
      yardCoords: cfg.yardCoords,
      tokens: [
        { id: 0, step: -1 },
        { id: 1, step: -1 },
        { id: 2, step: -1 },
        { id: 3, step: -1 }
      ],
      hasWon: false,
      isBot
    };
  });

  return {
    players,
    currentTurnIndex: 0,
    diceValue: 1,
    isRolling: false,
    hasRolled: false,
    consecutiveSixes: 0,
    validMoves: [],
    winnerRankings: [],
    isGameOver: false,
    activityLog: ['🎲 Game initialized. Roll a 6 to bring tokens onto the board!']
  };
}

export function getLudoTokenPosition(player: LudoPlayer, token: LudoToken): [number, number] {
  if (token.step === -1) {
    return player.yardCoords[token.id];
  }
  if (token.step >= 0 && token.step < 51) {
    const trackIndex = (player.startTrackIndex + token.step) % 52;
    return LUDO_MAIN_TRACK[trackIndex];
  }
  if (token.step >= 51 && token.step <= 56) {
    const homeIndex = token.step - 51;
    return LUDO_HOME_COLUMNS[player.id][homeIndex];
  }
  return [7, 7];
}

export function getLudoValidMoves(
  player: LudoPlayer,
  roll: number,
  allPlayers: LudoPlayer[]
): LudoValidMove[] {
  const validMoves: LudoValidMove[] = [];

  player.tokens.forEach(tok => {
    // Already in center Home
    if (tok.step === 56) return;

    // In Yard: Requires rolling a 6 to deploy
    if (tok.step === -1) {
      if (roll === 6) {
        const startTrackIdx = player.startTrackIndex;
        const isCapture = checkIfCapturePossible(player, startTrackIdx, allPlayers);
        validMoves.push({
          tokenId: tok.id,
          fromStep: -1,
          toStep: 0,
          isSpawn: true,
          isCapture,
          isSafe: true,
          isReachingHome: false
        });
      }
      return;
    }

    // On track or in home path
    const nextStep = tok.step + roll;
    if (nextStep > 56) return; // Overshoots home

    let isCapture = false;
    let isSafe = false;
    const isReachingHome = nextStep === 56;

    if (nextStep < 51) {
      const trackIdx = (player.startTrackIndex + nextStep) % 52;
      isSafe = LUDO_SAFE_TRACK_INDICES.includes(trackIdx);
      if (!isSafe) {
        isCapture = checkIfCapturePossible(player, trackIdx, allPlayers);
      }
    } else {
      isSafe = true; // Inside home column is safe
    }

    validMoves.push({
      tokenId: tok.id,
      fromStep: tok.step,
      toStep: nextStep,
      isSpawn: false,
      isCapture,
      isSafe,
      isReachingHome
    });
  });

  return validMoves;
}

function checkIfCapturePossible(
  movingPlayer: LudoPlayer,
  targetTrackIdx: number,
  allPlayers: LudoPlayer[]
): boolean {
  for (const other of allPlayers) {
    if (other.id === movingPlayer.id) continue;
    for (const tok of other.tokens) {
      if (tok.step >= 0 && tok.step < 51) {
        const otherTrackIdx = (other.startTrackIndex + tok.step) % 52;
        if (otherTrackIdx === targetTrackIdx) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Intelligent Ludo AI decision maker
 */
export function getBestLudoMove(validMoves: LudoValidMove[]): LudoValidMove | null {
  if (!validMoves || validMoves.length === 0) return null;
  if (validMoves.length === 1) return validMoves[0];

  let bestMove = validMoves[0];
  let highestScore = -Infinity;

  validMoves.forEach(m => {
    let score = 0;
    if (m.isReachingHome) score += 1000;
    if (m.isCapture) score += 500;
    if (m.isSpawn) score += 200;
    if (m.isSafe) score += 100;
    score += m.toStep; // prefer moving advanced tokens forward

    if (score > highestScore) {
      highestScore = score;
      bestMove = m;
    }
  });

  return bestMove;
}

export function executeLudoTokenMove(
  state: LudoGameState,
  tokenId: number
): {
  newState: LudoGameState;
  capturedToken: { player: LudoPlayer; token: LudoToken } | null;
  extraTurn: boolean;
  reachedHome: boolean;
} {
  const curPlayer = state.players[state.currentTurnIndex];
  const move = state.validMoves.find(m => m.tokenId === tokenId);

  if (!move) {
    return { newState: state, capturedToken: null, extraTurn: false, reachedHome: false };
  }

  let captured: { player: LudoPlayer; token: LudoToken } | null = null;
  let extraTurn = state.diceValue === 6;
  const reachedHome = move.isReachingHome;
  const newLog = [...state.activityLog];

  // Update target token step
  const updatedPlayers = state.players.map(p => {
    if (p.id === curPlayer.id) {
      const updatedTokens = p.tokens.map(t => {
        if (t.id === tokenId) {
          return { ...t, step: move.toStep };
        }
        return t;
      });
      return { ...p, tokens: updatedTokens };
    }
    return p;
  });

  // Check captures on common track (outside safe spots)
  if (move.toStep >= 0 && move.toStep < 51 && !move.isSpawn) {
    const landingTrackIdx = (curPlayer.startTrackIndex + move.toStep) % 52;
    if (!LUDO_SAFE_TRACK_INDICES.includes(landingTrackIdx)) {
      updatedPlayers.forEach(p => {
        if (p.id === curPlayer.id) return;
        p.tokens.forEach(t => {
          if (t.step >= 0 && t.step < 51) {
            const otherIdx = (p.startTrackIndex + t.step) % 52;
            if (otherIdx === landingTrackIdx) {
              // CAPTURE!
              t.step = -1;
              captured = { player: p, token: t };
              extraTurn = true;
              newLog.unshift(`💥 ${curPlayer.name} captured ${p.name}'s token! Extra turn granted.`);
            }
          }
        });
      });
    }
  }

  if (move.isSpawn) {
    newLog.unshift(`🚀 ${curPlayer.name} deployed a token to the start spot!`);
  } else if (reachedHome) {
    extraTurn = true;
    newLog.unshift(`⭐ ${curPlayer.name}'s token reached Home!`);
  } else if (!captured) {
    newLog.unshift(`${curPlayer.name} moved token #${tokenId + 1} by ${state.diceValue} steps.`);
  }

  // Check player win condition (all 4 tokens in home step 56)
  const newWinnerRankings = [...state.winnerRankings];
  let isGameOver = state.isGameOver;

  const thisPlayer = updatedPlayers.find(p => p.id === curPlayer.id)!;
  if (!thisPlayer.hasWon && thisPlayer.tokens.every(t => t.step === 56)) {
    thisPlayer.hasWon = true;
    thisPlayer.rank = newWinnerRankings.length + 1;
    newWinnerRankings.push(thisPlayer);
    newLog.unshift(`🏆 ${thisPlayer.name} has guided ALL 4 TOKENS to HOME (Rank #${thisPlayer.rank})!`);

    if (newWinnerRankings.length >= state.players.length - 1 || newWinnerRankings.length === 1) {
      isGameOver = true;
    }
  }

  // Advance turn if no extra roll
  let nextTurnIdx = state.currentTurnIndex;
  if (!extraTurn && !isGameOver) {
    do {
      nextTurnIdx = (nextTurnIdx + 1) % updatedPlayers.length;
    } while (updatedPlayers[nextTurnIdx].hasWon && !isGameOver);
  }

  return {
    newState: {
      ...state,
      players: updatedPlayers,
      currentTurnIndex: isGameOver ? state.currentTurnIndex : nextTurnIdx,
      hasRolled: false,
      validMoves: [],
      winnerRankings: newWinnerRankings,
      isGameOver,
      activityLog: newLog.slice(0, 10)
    },
    capturedToken: captured,
    extraTurn,
    reachedHome
  };
}

export function passLudoTurn(state: LudoGameState): LudoGameState {
  let nextTurnIdx = state.currentTurnIndex;
  do {
    nextTurnIdx = (nextTurnIdx + 1) % state.players.length;
  } while (state.players[nextTurnIdx].hasWon && !state.isGameOver);

  return {
    ...state,
    currentTurnIndex: nextTurnIdx,
    hasRolled: false,
    validMoves: []
  };
}
