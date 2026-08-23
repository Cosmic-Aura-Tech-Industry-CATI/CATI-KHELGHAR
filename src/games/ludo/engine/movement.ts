import { GameState, ValidMove, Player, Pawn } from '../types';
import { TOTAL_STEPS, HOME_LANE_START, SAFE_TRACK_INDICES } from '../constants';
import { getTrackIndex } from './board';
import { canExitHome, isSafeTrackIndex } from './rules';
import { findCaptureAtTrackIndex } from './captures';

export function getValidMoves(state: GameState): ValidMove[] {
  const diceValue = state.diceValue;
  if (diceValue === null) return [];
  const player = state.players[state.currentPlayerIndex];
  const moves: ValidMove[] = [];

  player.pawns.forEach(pawn => {
    if (pawn.status === 'finished') return;

    // Pawn in home yard
    if (pawn.status === 'home') {
      if (!canExitHome(diceValue)) return;
      // Check if start cell is blocked by 2+ own pawns
      const startTrackIdx = player.startTrackIndex;
      const ownPawnsOnStart = state.players
        .flatMap(p => p.pawns)
        .filter(pw => pw.id !== pawn.id && pw.playerId === player.id && pw.status === 'active')
        .filter(pw => getTrackIndex(player.startTrackIndex, pw.steps) === startTrackIdx && pw.steps < HOME_LANE_START);
      if (ownPawnsOnStart.length >= 2) return; // blocked by own blockade

      const capture = findCaptureAtTrackIndex(state, player.id, startTrackIdx);
      moves.push({
        pawnId: pawn.id,
        fromSteps: -1,
        toSteps: 0,
        isExitHome: true,
        isCapture: !!capture,
        capturedPawnId: capture?.id,
        capturedPlayerId: capture?.playerId,
        isFinish: false,
        isSafe: isSafeTrackIndex(startTrackIdx),
        trackIndex: startTrackIdx,
      });
      return;
    }

    // Active pawn on board
    const targetSteps = pawn.steps + diceValue;

    // Overshoot — invalid
    if (targetSteps > TOTAL_STEPS) return;

    // Finishing move
    if (targetSteps === TOTAL_STEPS) {
      moves.push({
        pawnId: pawn.id,
        fromSteps: pawn.steps,
        toSteps: TOTAL_STEPS,
        isExitHome: false,
        isCapture: false,
        isFinish: true,
        isSafe: true,
      });
      return;
    }

    // In home lane — no captures, just move forward
    if (pawn.steps >= HOME_LANE_START || targetSteps >= HOME_LANE_START) {
      moves.push({
        pawnId: pawn.id,
        fromSteps: pawn.steps,
        toSteps: targetSteps,
        isExitHome: false,
        isCapture: false,
        isFinish: false,
        isSafe: true,
      });
      return;
    }

    // On main track
    const targetTrackIdx = getTrackIndex(player.startTrackIndex, targetSteps);

    // Check if landing on own pawn blockade (2+ own pawns = blocked)
    const ownPawnsOnTarget = state.players
      .flatMap(p => p.pawns)
      .filter(pw => pw.playerId === player.id && pw.id !== pawn.id && pw.status === 'active')
      .filter(pw => pw.steps < HOME_LANE_START && getTrackIndex(player.startTrackIndex, pw.steps) === targetTrackIdx);
    if (ownPawnsOnTarget.length >= 2) return; // own blockade

    const isSafe = isSafeTrackIndex(targetTrackIdx);
    const capture = isSafe ? null : findCaptureAtTrackIndex(state, player.id, targetTrackIdx);

    moves.push({
      pawnId: pawn.id,
      fromSteps: pawn.steps,
      toSteps: targetSteps,
      isExitHome: false,
      isCapture: !!capture,
      capturedPawnId: capture?.id,
      capturedPlayerId: capture?.playerId,
      isFinish: false,
      isSafe,
      trackIndex: targetTrackIdx,
    });
  });

  return moves;
}

export function applyMove(state: GameState, pawnId: string): GameState {
  const move = state.validMoves.find(m => m.pawnId === pawnId);
  if (!move) return state;

  const diceValue = state.diceValue ?? 0;
  const currentPlayer = state.players[state.currentPlayerIndex];
  let newLog = [...state.activityLog];
  let newWinners = [...state.winnersRanking];

  // Apply move to target pawn
  let captured = false;
  const newPlayers = state.players.map(player => {
    // Reset captured pawn
    if (move.isCapture && move.capturedPlayerId === player.id) {
      captured = true;
      return {
        ...player,
        pawns: player.pawns.map(p =>
          p.id === move.capturedPawnId
            ? { ...p, status: 'home' as const, steps: -1 }
            : p
        ),
      };
    }

    if (player.id !== currentPlayer.id) return player;

    const newPawns = player.pawns.map(p => {
      if (p.id !== pawnId) return p;
      const newSteps = move.toSteps;
      const newStatus = newSteps === TOTAL_STEPS ? 'finished' as const : 'active' as const;
      return { ...p, steps: newSteps, status: newStatus };
    });

    return { ...player, pawns: newPawns };
  });

  // Check win condition
  const updatedCurrentPlayer = newPlayers.find(p => p.id === currentPlayer.id)!;
  let newGameStatus = state.gameStatus;
  let updatedPlayersWithRank = newPlayers;

  if (!updatedCurrentPlayer.hasWon && updatedCurrentPlayer.pawns.every(p => p.status === 'finished')) {
    const rank = newWinners.length + 1;
    newWinners = [...newWinners, currentPlayer.id];
    updatedPlayersWithRank = newPlayers.map(p =>
      p.id === currentPlayer.id ? { ...p, hasWon: true, rank } : p
    );
    newLog = [
      `🏆 ${currentPlayer.name} wins! (Rank #${rank})`,
      ...newLog.slice(0, 8)
    ];

    // All but one player has finished => game over
    if (newWinners.length >= newPlayers.length - 1) {
      newGameStatus = 'finished';
    }
  }

  // Log action
  if (move.isFinish) {
    newLog = [`⭐ ${currentPlayer.name}'s pawn reached HOME!`, ...newLog.slice(0, 8)];
  } else if (move.isExitHome) {
    newLog = [`🚀 ${currentPlayer.name} deployed a pawn!`, ...newLog.slice(0, 8)];
  } else if (captured) {
    newLog = [`💥 ${currentPlayer.name} captured a pawn! +1 turn`, ...newLog.slice(0, 8)];
  } else {
    newLog = [`${currentPlayer.name} moved pawn ${diceValue} steps.`, ...newLog.slice(0, 8)];
  }

  // Determine extra turn
  const extraTurn = (state.diceValue === 6 && state.consecutiveSixes < 3) || captured;
  const nextConsecutiveSixes = state.diceValue === 6 ? state.consecutiveSixes + 1 : 0;

  // Determine next player
  let nextPlayerIndex = state.currentPlayerIndex;
  let nextPhase: 'rolling' | 'selecting' | 'animating' | 'handoff' = 'rolling';
  let newGameStatusFinal = newGameStatus;

  if (newGameStatus === 'finished') {
    nextPhase = 'rolling';
  } else if (extraTurn) {
    nextPhase = 'rolling';
  } else {
    // advance to next non-won player
    let next = (state.currentPlayerIndex + 1) % updatedPlayersWithRank.length;
    while (updatedPlayersWithRank[next].hasWon && next !== state.currentPlayerIndex) {
      next = (next + 1) % updatedPlayersWithRank.length;
    }
    nextPlayerIndex = next;
    nextPhase = 'handoff';
    newGameStatusFinal = (newGameStatus as string) === 'finished' ? ('finished' as const) : ('handoff' as const);
  }

  return {
    ...state,
    players: updatedPlayersWithRank,
    currentPlayerIndex: nextPlayerIndex,
    diceValue: null,
    hasRolled: false,
    consecutiveSixes: extraTurn ? nextConsecutiveSixes : 0,
    phase: nextPhase,
    validMoves: [],
    selectedPawnId: null,
    animatingPawnId: null,
    animationStep: 0,
    winnersRanking: newWinners,
    gameStatus: newGameStatusFinal,
    turnNumber: extraTurn ? state.turnNumber : state.turnNumber + 1,
    lastAction: newLog[0] || '',
    activityLog: newLog,
  };
}
