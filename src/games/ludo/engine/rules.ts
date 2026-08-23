import { RULES, SAFE_TRACK_INDICES, HOME_LANE_START, TOTAL_STEPS } from '../constants';
import { Pawn, Player } from '../types';
import { getTrackIndex } from './board';

export function isSafeTrackIndex(trackIndex: number): boolean {
  return SAFE_TRACK_INDICES.includes(trackIndex);
}

export function canExitHome(diceValue: number): boolean {
  return !RULES.requireSixToExitHome || diceValue === 6;
}

export function canFinish(pawn: Pawn, diceValue: number): boolean {
  const stepsNeeded = TOTAL_STEPS - pawn.steps;
  if (RULES.exactRollToFinish) return diceValue === stepsNeeded;
  return diceValue >= stepsNeeded;
}

export function wouldOvershoothome(pawn: Pawn, diceValue: number): boolean {
  return pawn.steps + diceValue > TOTAL_STEPS;
}

export function shouldGrantExtraTurn(
  diceValue: number,
  capturedSomething: boolean
): boolean {
  if (RULES.extraTurnOnSix && diceValue === 6) return true;
  if (RULES.extraTurnOnCapture && capturedSomething) return true;
  return false;
}

export function isInHomeLane(pawn: Pawn): boolean {
  return pawn.steps >= HOME_LANE_START && pawn.steps < TOTAL_STEPS;
}

export function isCellSafeForPawn(
  pawn: Pawn,
  targetSteps: number,
  startTrackIndex: number
): boolean {
  // Home lane is always safe
  if (targetSteps >= HOME_LANE_START) return true;
  const trackIndex = getTrackIndex(startTrackIndex, targetSteps);
  return isSafeTrackIndex(trackIndex);
}
