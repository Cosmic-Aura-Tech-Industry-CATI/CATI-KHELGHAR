import { SnakeDef, LadderDef, BoardCellData, SnakeGameState, SnakePlayer } from './types';

export const SNAKES_CONFIG: SnakeDef[] = [
  { id: 's1', from: 99, to: 7, color: '#dc2626' },   // Giant Red Snake
  { id: 's2', from: 89, to: 68, color: '#9333ea' },  // Purple Snake
  { id: 's3', from: 76, to: 41, color: '#ea580c' },  // Orange Snake
  { id: 's4', from: 54, to: 31, color: '#ec4899' },  // Pink Snake
  { id: 's5', from: 43, to: 18, color: '#0284c7' },  // Blue Snake
  { id: 's6', from: 27, to: 5, color: '#16a34a' }    // Green Snake
];

export const LADDERS_CONFIG: LadderDef[] = [
  { id: 'l1', from: 4, to: 25, color: '#d97706' },
  { id: 'l2', from: 13, to: 46, color: '#d97706' },
  { id: 'l3', from: 33, to: 49, color: '#d97706' },
  { id: 'l4', from: 50, to: 69, color: '#d97706' },
  { id: 'l5', from: 62, to: 81, color: '#d97706' },
  { id: 'l6', from: 74, to: 92, color: '#d97706' }
];

export const SNAKE_PLAYER_COLORS = ['#dc2626', '#0284c7', '#ca8a04', '#16a34a'];
export const SNAKE_PLAYER_AVATARS = ['🐱', '🚀', '🦊', '🐼'];

/**
 * Calculates SVG percentage coordinates (0% to 100%) for the center of a given tile.
 */
export function getCellCenterPercent(tile: number): { x: number; y: number } {
  if (tile < 1) tile = 1;
  if (tile > 100) tile = 100;
  const n = tile - 1;
  const rowFromBottom = Math.floor(n / 10);
  let col = n % 10;
  if (rowFromBottom % 2 === 1) {
    col = 9 - col;
  }
  const x = col * 10 + 5;
  const y = (9 - rowFromBottom) * 10 + 5;
  return { x, y };
}

/**
 * Generates the full 100 board cells in order from Row 10 (top) down to Row 1 (bottom).
 */
export function generateBoardCells(): BoardCellData[] {
  const cells: BoardCellData[] = [];

  const snakeHeadMap: Record<number, number> = {};
  const snakeTailMap: Record<number, boolean> = {};
  SNAKES_CONFIG.forEach(s => {
    snakeHeadMap[s.from] = s.to;
    snakeTailMap[s.to] = true;
  });

  const ladderBottomMap: Record<number, number> = {};
  const ladderTopMap: Record<number, boolean> = {};
  LADDERS_CONFIG.forEach(l => {
    ladderBottomMap[l.from] = l.to;
    ladderTopMap[l.to] = true;
  });

  for (let r = 9; r >= 0; r--) {
    for (let c = 0; c < 10; c++) {
      let tileNum: number;
      if (r % 2 === 1) {
        tileNum = r * 10 + (10 - c);
      } else {
        tileNum = r * 10 + c + 1;
      }

      const rowFromTop = 9 - r;
      const isAlt = (r + c) % 2 === 0;

      cells.push({
        number: tileNum,
        row: rowFromTop,
        col: c,
        isSnakeHead: !!snakeHeadMap[tileNum],
        isSnakeTail: !!snakeTailMap[tileNum],
        isLadderBottom: !!ladderBottomMap[tileNum],
        isLadderTop: !!ladderTopMap[tileNum],
        snakeTo: snakeHeadMap[tileNum],
        ladderTo: ladderBottomMap[tileNum],
        isWinningCell: tileNum === 100,
        isAlternate: isAlt
      });
    }
  }

  return cells;
}

export function createInitialSnakeGameState(
  playerCount: number = 2,
  customPlayers?: Array<{ name: string; isBot?: boolean }> | string[]
): SnakeGameState {
  const players: SnakePlayer[] = [];

  for (let i = 0; i < playerCount; i++) {
    const raw = customPlayers?.[i];
    const name =
      typeof raw === 'string'
        ? raw
        : raw?.name || (i === 1 ? 'Bot Alpha 🤖' : `Player ${i + 1}`);

    const isBot =
      typeof raw === 'string'
        ? name.toLowerCase().includes('bot')
        : raw?.isBot !== undefined
        ? raw.isBot
        : i > 0;

    players.push({
      id: i,
      name,
      color: SNAKE_PLAYER_COLORS[i % SNAKE_PLAYER_COLORS.length],
      avatar: SNAKE_PLAYER_AVATARS[i % SNAKE_PLAYER_AVATARS.length],
      position: 0,
      hasWon: false,
      isBot
    });
  }

  return {
    players,
    currentTurnIndex: 0,
    diceValue: 1,
    isRolling: false,
    isMoving: false,
    winner: null,
    activityLog: ['🎲 Game started! Roll the dice to race to tile 100.']
  };
}

/**
 * Plans the movement sequence for a roll, including intermediate steps and snake/ladder transitions.
 */
export function planMoveSequence(
  startPos: number,
  roll: number
): {
  stepPath: number[];
  finalTile: number;
  isSnake: boolean;
  isLadder: boolean;
  snakeTo?: number;
  ladderTo?: number;
  isWin: boolean;
  extraTurn: boolean;
  overshot: boolean;
} {
  const initial = startPos === 0 ? 0 : startPos;
  const target = initial + roll;

  if (target > 100) {
    return {
      stepPath: [startPos],
      finalTile: startPos,
      isSnake: false,
      isLadder: false,
      isWin: false,
      extraTurn: false,
      overshot: true
    };
  }

  const stepPath: number[] = [];
  const startStep = startPos === 0 ? 1 : startPos + 1;
  for (let i = startStep; i <= target; i++) {
    stepPath.push(i);
  }

  const ladder = LADDERS_CONFIG.find(l => l.from === target);
  const snake = SNAKES_CONFIG.find(s => s.from === target);

  let finalTile = target;
  let isLadder = false;
  let isSnake = false;
  let ladderTo: number | undefined;
  let snakeTo: number | undefined;

  if (ladder) {
    isLadder = true;
    ladderTo = ladder.to;
    finalTile = ladderTo;
  } else if (snake) {
    isSnake = true;
    snakeTo = snake.to;
    finalTile = snakeTo;
  }

  const isWin = finalTile === 100;
  const extraTurn = roll === 6;

  return {
    stepPath,
    finalTile,
    isSnake,
    isLadder,
    snakeTo,
    ladderTo,
    isWin,
    extraTurn,
    overshot: false
  };
}
