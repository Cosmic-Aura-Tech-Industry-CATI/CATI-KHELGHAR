import { Player, GameState } from '../types';

export function hasPlayerWon(player: Player): boolean {
  return player.pawns.every(p => p.status === 'finished');
}

export function isGameOver(state: GameState): boolean {
  return state.gameStatus === 'finished';
}

export function getWinner(state: GameState): Player | null {
  if (state.winnersRanking.length === 0) return null;
  const winnerId = state.winnersRanking[0];
  return state.players.find(p => p.id === winnerId) ?? null;
}

export function getRankedPlayers(state: GameState): Player[] {
  const ranked = state.winnersRanking
    .map(id => state.players.find(p => p.id === id))
    .filter((p): p is Player => !!p);
  const unranked = state.players.filter(p => !state.winnersRanking.includes(p.id));
  return [...ranked, ...unranked];
}
