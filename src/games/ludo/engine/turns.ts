import { GameState, Player } from '../types';

export function getNextPlayerIndex(state: GameState): number {
  const total = state.players.length;
  let next = (state.currentPlayerIndex + 1) % total;
  const visited = new Set<number>();
  while (state.players[next].hasWon && !visited.has(next)) {
    visited.add(next);
    next = (next + 1) % total;
  }
  return next;
}

export function getCurrentPlayer(state: GameState): Player {
  return state.players[state.currentPlayerIndex];
}
