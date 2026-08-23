'use client';

import { useReducer, useCallback, useEffect, useRef } from 'react';
import { GameState, GameAction, Player, PlayerColor, Pawn } from '../types';
import { RULES, COLOR_CONFIG, COLOR_SEQUENCE, YARD_POSITIONS, HOME_LANES, START_TRACK_INDICES, TOTAL_STEPS } from '../constants';
import { getValidMoves, applyMove } from '../engine/movement';
import { buildBoardCells } from '../engine/board';

export interface PlayerSetupConfig {
  name: string;
  isBot: boolean;
}

function createPawn(playerId: string, color: PlayerColor, pawnIndex: number): Pawn {
  return {
    id: `${color}-${pawnIndex}`,
    playerId,
    color,
    status: 'home',
    steps: -1,
  };
}

export function createInitialState(configs: PlayerSetupConfig[], playerCount: number): GameState {
  const colors = COLOR_SEQUENCE[playerCount] ?? COLOR_SEQUENCE[4];
  const players: Player[] = configs.slice(0, playerCount).map((cfg, i) => {
    const color = colors[i];
    const id = `player-${color}`;
    return {
      id,
      name: cfg.name || `Player ${i + 1}`,
      color,
      colorHex: COLOR_CONFIG[color].hex,
      lightColorHex: COLOR_CONFIG[color].light,
      startTrackIndex: START_TRACK_INDICES[color],
      homeYardPositions: YARD_POSITIONS[color],
      homeLanePositions: HOME_LANES[color],
      pawns: [0, 1, 2, 3].map(j => createPawn(id, color, j)),
      isBot: cfg.isBot,
      hasWon: false,
    };
  });

  return {
    players,
    currentPlayerIndex: 0,
    diceValue: null,
    diceRolling: false,
    hasRolled: false,
    consecutiveSixes: 0,
    phase: 'rolling',
    validMoves: [],
    selectedPawnId: null,
    animatingPawnId: null,
    animationStep: 0,
    winnersRanking: [],
    gameStatus: 'playing',
    turnNumber: 1,
    lastAction: '',
    activityLog: ['🎲 Game started! Roll a 6 to bring your pawns into play.'],
  };
}

function ludoReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ROLL_DICE': {
      if (state.hasRolled || state.diceRolling || state.gameStatus === 'finished') return state;
      return { ...state, diceRolling: true, diceValue: action.value };
    }

    case 'DICE_ROLLED': {
      const { validMoves } = action;
      const currentPlayer = state.players[state.currentPlayerIndex];

      // No valid moves → auto pass turn
      if (validMoves.length === 0) {
        let next = (state.currentPlayerIndex + 1) % state.players.length;
        const visited = new Set<number>();
        while (state.players[next].hasWon && !visited.has(next)) {
          visited.add(next);
          next = (next + 1) % state.players.length;
        }
        return {
          ...state,
          diceRolling: false,
          hasRolled: false,
          validMoves: [],
          currentPlayerIndex: next,
          phase: RULES.showPassAndPlayScreen ? 'handoff' : 'rolling',
          gameStatus: RULES.showPassAndPlayScreen ? 'handoff' : 'playing',
          activityLog: [
            `${currentPlayer.name} rolled ${state.diceValue} — no moves available.`,
            ...state.activityLog.slice(0, 8),
          ],
        };
      }

      return {
        ...state,
        diceRolling: false,
        hasRolled: true,
        validMoves,
        phase: 'selecting',
      };
    }

    case 'SELECT_PAWN': {
      if (state.phase !== 'selecting') return state;
      const move = state.validMoves.find(m => m.pawnId === action.pawnId);
      if (!move) return state;
      return { ...state, selectedPawnId: action.pawnId, phase: 'animating' };
    }

    case 'MOVE_COMPLETE': {
      const newState = applyMove(state, action.pawnId);
      // If handoff phase, switch game status
      if (newState.phase === 'handoff' && RULES.showPassAndPlayScreen) {
        return { ...newState, gameStatus: 'handoff' };
      }
      return newState;
    }

    case 'CONFIRM_HANDOFF': {
      return {
        ...state,
        phase: 'rolling',
        gameStatus: 'playing',
      };
    }

    case 'NEXT_TURN': {
      let next = (state.currentPlayerIndex + 1) % state.players.length;
      const visited = new Set<number>();
      while (state.players[next].hasWon && !visited.has(next)) {
        visited.add(next);
        next = (next + 1) % state.players.length;
      }
      const phase: GameState['phase'] = RULES.showPassAndPlayScreen ? 'handoff' : 'rolling';
      const gameStatus: GameState['gameStatus'] = RULES.showPassAndPlayScreen ? 'handoff' : 'playing';
      return { ...state, currentPlayerIndex: next, phase, gameStatus, hasRolled: false, diceValue: null, validMoves: [] };
    }

    case 'RESTART': {
      return createInitialState(
        action.players.map(p => ({ name: p.name, isBot: p.isBot })),
        action.players.length
      );
    }

    default:
      return state;
  }
}

export function useLudoGame(initialConfigs: PlayerSetupConfig[], playerCount: number) {
  const [state, dispatch] = useReducer(
    ludoReducer,
    undefined,
    () => createInitialState(initialConfigs, playerCount)
  );

  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentPlayer = state.players[state.currentPlayerIndex];

  const rollDice = useCallback(() => {
    if (state.hasRolled || state.diceRolling || state.gameStatus === 'finished') return;
    // Use crypto for fairness
    const arr = new Uint8Array(1);
    crypto.getRandomValues(arr);
    const value = (arr[0] % 6) + 1;
    dispatch({ type: 'ROLL_DICE', value });

    setTimeout(() => {
      const currentState = state; // captured in closure
      const tempState = { ...state, diceValue: value, diceRolling: false, hasRolled: true };
      const validMoves = getValidMoves({ ...tempState });
      dispatch({ type: 'DICE_ROLLED', validMoves });
    }, 600);
  }, [state]);

  const selectPawn = useCallback((pawnId: string) => {
    dispatch({ type: 'SELECT_PAWN', pawnId });
    // Complete movement after animation delay
    setTimeout(() => {
      dispatch({ type: 'MOVE_COMPLETE', pawnId });
    }, 800);
  }, []);

  const confirmHandoff = useCallback(() => {
    dispatch({ type: 'CONFIRM_HANDOFF' });
  }, []);

  const restart = useCallback((players: Player[]) => {
    dispatch({ type: 'RESTART', players });
  }, []);

  // Bot auto-play
  useEffect(() => {
    if (state.gameStatus === 'finished' || state.gameStatus === 'handoff') return;
    if (!currentPlayer?.isBot) return;

    if (!state.hasRolled && !state.diceRolling) {
      botTimerRef.current = setTimeout(() => rollDice(), 800);
    } else if (state.hasRolled && state.phase === 'selecting' && state.validMoves.length > 0) {
      botTimerRef.current = setTimeout(() => {
        // Simple AI: prefer capture > finish > exit home > furthest advanced
        const sorted = [...state.validMoves].sort((a, b) => {
          if (a.isFinish && !b.isFinish) return -1;
          if (!a.isFinish && b.isFinish) return 1;
          if (a.isCapture && !b.isCapture) return -1;
          if (!a.isCapture && b.isCapture) return 1;
          if (a.isExitHome && !b.isExitHome) return -1;
          if (!a.isExitHome && b.isExitHome) return 1;
          return b.toSteps - a.toSteps;
        });
        selectPawn(sorted[0].pawnId);
      }, 500);
    }

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [
    state.gameStatus,
    state.hasRolled,
    state.diceRolling,
    state.phase,
    state.validMoves,
    currentPlayer?.isBot,
    currentPlayer?.id,
  ]);

  const boardCells = buildBoardCells();

  return { state, currentPlayer, rollDice, selectPawn, confirmHandoff, restart, boardCells };
}
