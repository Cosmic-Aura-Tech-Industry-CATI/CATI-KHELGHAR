import { MancalaGameState, PlayerIndex } from './types';

export function createInitialMancalaState(): MancalaGameState {
  const pits = Array(14).fill(4);
  pits[6] = 0;  // P1 Store
  pits[13] = 0; // P2 Store
  return {
    pits,
    turn: 0,
    lastSownPit: null,
    extraTurn: false,
    isGameOver: false,
    winner: null,
    lastLog: 'Player 1 starts! Choose any of your 6 pits to sow seeds.',
  };
}

export function isValidPitChoice(state: MancalaGameState, pitIdx: number): boolean {
  if (state.isGameOver) return false;
  if (state.turn === 0 && (pitIdx < 0 || pitIdx > 5)) return false;
  if (state.turn === 1 && (pitIdx < 7 || pitIdx > 12)) return false;
  return state.pits[pitIdx] > 0;
}

export function applyMancalaMove(state: MancalaGameState, pitIdx: number): MancalaGameState {
  if (!isValidPitChoice(state, pitIdx)) return state;

  const pits = [...state.pits];
  let seeds = pits[pitIdx];
  pits[pitIdx] = 0;

  let currentPit = pitIdx;
  const turn = state.turn;
  const ownStore = turn === 0 ? 6 : 13;
  const oppStore = turn === 0 ? 13 : 6;

  while (seeds > 0) {
    currentPit = (currentPit + 1) % 14;
    if (currentPit === oppStore) continue; // skip opponent's store
    pits[currentPit]++;
    seeds--;
  }

  let extraTurn = false;
  let captured = false;

  // Rule 1: Free turn if last seed landed in own store
  if (currentPit === ownStore) {
    extraTurn = true;
  }
  // Rule 2: Capture if last seed landed in an empty pit on own side
  else {
    const isOwnSide =
      turn === 0 ? currentPit >= 0 && currentPit <= 5 : currentPit >= 7 && currentPit <= 12;
    if (isOwnSide && pits[currentPit] === 1) {
      const oppositePit = 12 - currentPit;
      if (pits[oppositePit] > 0) {
        captured = true;
        pits[ownStore] += pits[oppositePit] + 1;
        pits[oppositePit] = 0;
        pits[currentPit] = 0;
      }
    }
  }

  // Check Game Over: are all pits of either player empty?
  const p1Empty = pits.slice(0, 6).every((s) => s === 0);
  const p2Empty = pits.slice(7, 13).every((s) => s === 0);

  let isGameOver = false;
  let winner: PlayerIndex | 'draw' | null = null;

  if (p1Empty || p2Empty) {
    isGameOver = true;
    // Sweep remaining seeds to respective stores
    for (let i = 0; i < 6; i++) {
      pits[6] += pits[i];
      pits[i] = 0;
    }
    for (let i = 7; i < 13; i++) {
      pits[13] += pits[i];
      pits[i] = 0;
    }

    if (pits[6] > pits[13]) winner = 0;
    else if (pits[13] > pits[6]) winner = 1;
    else winner = 'draw';
  }

  const nextTurn: PlayerIndex = extraTurn ? turn : turn === 0 ? 1 : 0;

  return {
    pits,
    turn: nextTurn,
    lastSownPit: currentPit,
    extraTurn,
    isGameOver,
    winner,
    lastLog: extraTurn
      ? '🎉 Last seed landed in Kalah store! Free extra turn!'
      : captured
      ? '💥 Captured opposite pit seeds!'
      : `Player ${turn + 1} sowed seeds.`,
  };
}

export function getBestMancalaBotMove(state: MancalaGameState): number | null {
  const validPits: number[] = [];
  const start = state.turn === 0 ? 0 : 7;
  const end = state.turn === 0 ? 5 : 12;

  for (let i = start; i <= end; i++) {
    if (state.pits[i] > 0) validPits.push(i);
  }
  if (validPits.length === 0) return null;

  // 1. Prefer move that gives a free turn
  const ownStore = state.turn === 0 ? 6 : 13;
  for (const pit of validPits) {
    if ((pit + state.pits[pit]) % 14 === ownStore) {
      return pit;
    }
  }

  // 2. Otherwise prefer pit with most seeds
  validPits.sort((a, b) => state.pits[b] - state.pits[a]);
  return validPits[0];
}
