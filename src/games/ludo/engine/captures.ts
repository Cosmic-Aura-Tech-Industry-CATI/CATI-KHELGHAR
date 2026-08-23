import { GameState, Pawn } from '../types';
import { HOME_LANE_START } from '../constants';
import { getTrackIndex } from './board';

// Find an opponent pawn at the given track index (null if none or safe)
export function findCaptureAtTrackIndex(
  state: GameState,
  movingPlayerId: string,
  targetTrackIndex: number
): Pawn | null {
  for (const player of state.players) {
    if (player.id === movingPlayerId) continue;
    for (const pawn of player.pawns) {
      if (pawn.status !== 'active') continue;
      if (pawn.steps < 0 || pawn.steps >= HOME_LANE_START) continue;
      const pawnTrackIdx = getTrackIndex(player.startTrackIndex, pawn.steps);
      if (pawnTrackIdx === targetTrackIndex) return pawn;
    }
  }
  return null;
}
