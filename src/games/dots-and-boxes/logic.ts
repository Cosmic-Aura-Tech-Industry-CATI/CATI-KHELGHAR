import { DotsGameState, DotsPlayer } from './types';

export const DOTS_PLAYER_COLORS = ['#dc2626', '#0284c7', '#ca8a04', '#16a34a'];
export const DOTS_PLAYER_AVATARS = ['🔴', '🔵', '🟡', '🟢'];

export function createInitialDotsState(
  playerCount: number = 2,
  gridSize: number = 3,
  customPlayers?: Array<{ name: string; isBot?: boolean }> | string[]
): DotsGameState {
  const players: DotsPlayer[] = [];

  for (let i = 0; i < playerCount; i++) {
    const raw = customPlayers?.[i];
    const name =
      typeof raw === 'string'
        ? raw
        : raw?.name || `Player ${i + 1}`;

    const isBot =
      typeof raw === 'string'
        ? name.toLowerCase().includes('bot')
        : raw?.isBot !== undefined
        ? raw.isBot
        : i > 0;

    players.push({
      id: i,
      name,
      color: DOTS_PLAYER_COLORS[i % DOTS_PLAYER_COLORS.length],
      avatar: DOTS_PLAYER_AVATARS[i % DOTS_PLAYER_AVATARS.length],
      score: 0,
      isBot
    });
  }

  return {
    gridSize,
    players,
    currentTurnIndex: 0,
    claimedLines: {},
    claimedBoxes: {},
    isGameOver: false,
    winner: null,
    isDraw: false,
    activityLog: ['Match started! Draw lines to capture boxes.']
  };
}

/**
 * Checks if a 1x1 box at (r, c) has all 4 surrounding lines claimed.
 */
function isBoxCompleted(
  r: number,
  c: number,
  lines: Record<string, number>
): boolean {
  const top = `h-${r}-${c}`;
  const bottom = `h-${r + 1}-${c}`;
  const left = `v-${r}-${c}`;
  const right = `v-${r}-${c + 1}`;

  return (
    lines[top] !== undefined &&
    lines[bottom] !== undefined &&
    lines[left] !== undefined &&
    lines[right] !== undefined
  );
}

/**
 * Counts how many sides a box at (r, c) currently has claimed.
 */
function countBoxSides(r: number, c: number, lines: Record<string, number>): number {
  const top = `h-${r}-${c}`;
  const bottom = `h-${r + 1}-${c}`;
  const left = `v-${r}-${c}`;
  const right = `v-${r}-${c + 1}`;

  let sides = 0;
  if (lines[top] !== undefined) sides++;
  if (lines[bottom] !== undefined) sides++;
  if (lines[left] !== undefined) sides++;
  if (lines[right] !== undefined) sides++;
  return sides;
}

/**
 * Intelligent Dots & Boxes AI Bot
 */
export function getBestDotsMove(state: DotsGameState): string | null {
  const size = state.gridSize;
  const allAvailableLines: string[] = [];

  // Horizontal lines: (size + 1) rows x size cols
  for (let r = 0; r <= size; r++) {
    for (let c = 0; c < size; c++) {
      const key = `h-${r}-${c}`;
      if (state.claimedLines[key] === undefined) {
        allAvailableLines.push(key);
      }
    }
  }

  // Vertical lines: size rows x (size + 1) cols
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size; c++) {
      const key = `v-${r}-${c}`;
      if (state.claimedLines[key] === undefined) {
        allAvailableLines.push(key);
      }
    }
  }

  if (allAvailableLines.length === 0) return null;

  // 1. Check for lines that complete a box (Priority 1)
  for (const lineKey of allAvailableLines) {
    const testLines = { ...state.claimedLines, [lineKey]: 999 };
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (
          state.claimedBoxes[`${r}-${c}`] === undefined &&
          isBoxCompleted(r, c, testLines)
        ) {
          return lineKey; // Capture!
        }
      }
    }
  }

  // 2. Safe lines that do NOT leave any box with 3 sides (Priority 2)
  const safeLines: string[] = [];
  for (const lineKey of allAvailableLines) {
    const testLines = { ...state.claimedLines, [lineKey]: 999 };
    let createsThree = false;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (state.claimedBoxes[`${r}-${c}`] === undefined) {
          const sides = countBoxSides(r, c, testLines);
          if (sides === 3) {
            createsThree = true;
            break;
          }
        }
      }
      if (createsThree) break;
    }

    if (!createsThree) {
      safeLines.push(lineKey);
    }
  }

  if (safeLines.length > 0) {
    return safeLines[Math.floor(Math.random() * safeLines.length)];
  }

  // 3. Fallback: Pick any random available line
  return allAvailableLines[Math.floor(Math.random() * allAvailableLines.length)];
}

/**
 * Claims a line and checks if any adjacent box was completed.
 */
export function claimLine(
  state: DotsGameState,
  lineKey: string
): { nextState: DotsGameState; boxesCaptured: number } {
  if (state.isGameOver || state.claimedLines[lineKey] !== undefined) {
    return { nextState: state, boxesCaptured: 0 };
  }

  const curPlayer = state.players[state.currentTurnIndex];
  const newLines = { ...state.claimedLines, [lineKey]: curPlayer.id };
  const newBoxes = { ...state.claimedBoxes };

  let newlyCompletedBoxes = 0;
  const size = state.gridSize;

  // Check all boxes that could be affected by this line
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const boxKey = `${r}-${c}`;
      if (newBoxes[boxKey] === undefined && isBoxCompleted(r, c, newLines)) {
        newBoxes[boxKey] = curPlayer.id;
        newlyCompletedBoxes++;
      }
    }
  }

  // Update player scores
  const nextPlayers = state.players.map(p =>
    p.id === curPlayer.id ? { ...p, score: p.score + newlyCompletedBoxes } : p
  );

  const totalBoxes = size * size;
  const totalClaimed = Object.keys(newBoxes).length;
  const isGameOver = totalClaimed === totalBoxes;

  let winner: DotsPlayer | null = null;
  let isDraw = false;

  if (isGameOver) {
    const sorted = [...nextPlayers].sort((a, b) => b.score - a.score);
    if (sorted[0].score > sorted[1].score) {
      winner = sorted[0];
    } else {
      isDraw = true;
    }
  }

  const newActivity = [...state.activityLog];
  if (newlyCompletedBoxes > 0) {
    newActivity.unshift(
      `📦 ${curPlayer.name} completed ${newlyCompletedBoxes} box(es) and earned a bonus turn!`
    );
  } else {
    newActivity.unshift(`${curPlayer.name} drew a line.`);
  }

  // If a box was completed, player gets an EXTRA turn! Otherwise turn switches.
  const nextTurnIndex =
    newlyCompletedBoxes > 0
      ? state.currentTurnIndex
      : (state.currentTurnIndex + 1) % state.players.length;

  return {
    boxesCaptured: newlyCompletedBoxes,
    nextState: {
      ...state,
      claimedLines: newLines,
      claimedBoxes: newBoxes,
      players: nextPlayers,
      currentTurnIndex: isGameOver ? state.currentTurnIndex : nextTurnIndex,
      isGameOver,
      winner,
      isDraw,
      activityLog: newActivity.slice(0, 8)
    }
  };
}
