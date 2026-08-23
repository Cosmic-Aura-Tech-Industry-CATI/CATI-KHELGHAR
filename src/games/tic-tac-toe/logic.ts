import { CellValue, TTTGameState, TTTMatchMode, TTTPlayer, TTTWinResult } from './types';

export const WINNING_COMBINATIONS: [number, number, number][] = [
  [0, 1, 2], // Rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // Columns
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // Diagonals
  [2, 4, 6]
];

export function checkWin(board: CellValue[]): TTTWinResult | null {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a]!,
        line: combo
      };
    }
  }

  // Check draw
  if (board.every(cell => cell !== null)) {
    return {
      winner: 'Draw',
      line: [-1, -1, -1] as any
    };
  }

  return null;
}

export function createInitialTTTState(
  p1: { name: string; isBot?: boolean } | string = 'Player 1',
  p2: { name: string; isBot?: boolean } | string = 'Bot Alpha 🤖',
  mode: TTTMatchMode = 'unlimited'
): TTTGameState {
  const p1Name = typeof p1 === 'string' ? p1 : p1.name;
  const p1Bot = typeof p1 === 'string' ? false : !!p1.isBot;

  const p2Name = typeof p2 === 'string' ? p2 : p2.name;
  const p2Bot = typeof p2 === 'string' ? p2Name.toLowerCase().includes('bot') : !!p2.isBot;

  return {
    board: Array(9).fill(null),
    players: [
      { id: 1, name: p1Name, symbol: 'X', score: 0, isBot: p1Bot },
      { id: 2, name: p2Name, symbol: 'O', score: 0, isBot: p2Bot }
    ],
    turn: 'X',
    isGameOver: false,
    winner: null,
    winResult: null,
    mode,
    matchWinner: null
  };
}

/**
 * Intelligent AI Bot move calculator
 */
export function getBestTTTMove(board: CellValue[], botSymbol: 'X' | 'O'): number {
  const humanSymbol: 'X' | 'O' = botSymbol === 'X' ? 'O' : 'X';
  const availableMoves = board
    .map((val, idx) => (val === null ? idx : null))
    .filter((v): v is number => v !== null);

  if (availableMoves.length === 0) return -1;

  // 1. Can bot win in 1 move?
  for (const idx of availableMoves) {
    const clone = [...board];
    clone[idx] = botSymbol;
    if (checkWin(clone)?.winner === botSymbol) {
      return idx;
    }
  }

  // 2. Can human win in 1 move? Block them!
  for (const idx of availableMoves) {
    const clone = [...board];
    clone[idx] = humanSymbol;
    if (checkWin(clone)?.winner === humanSymbol) {
      return idx;
    }
  }

  // 3. Take center (4) if available
  if (board[4] === null) return 4;

  // 4. Take corners (0, 2, 6, 8)
  const corners = [0, 2, 6, 8].filter(c => board[c] === null);
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // 5. Random available edge
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

export function makeTTTMove(state: TTTGameState, cellIndex: number): TTTGameState {
  if (state.board[cellIndex] || state.isGameOver) return state;

  const newBoard = [...state.board];
  newBoard[cellIndex] = state.turn;

  const winResult = checkWin(newBoard);
  let nextPlayers = state.players;
  let isGameOver = false;
  let winner: 'X' | 'O' | 'Draw' | null = null;
  let matchWinner: TTTPlayer | null = null;

  if (winResult) {
    isGameOver = true;
    winner = winResult.winner;

    if (winner !== 'Draw') {
      nextPlayers = [
        winner === 'X'
          ? { ...state.players[0], score: state.players[0].score + 1 }
          : state.players[0],
        winner === 'O'
          ? { ...state.players[1], score: state.players[1].score + 1 }
          : state.players[1]
      ];

      // Check Best of 3 mode
      if (state.mode === 'bo3') {
        const winThreshold = 2;
        if (nextPlayers[0].score >= winThreshold) {
          matchWinner = nextPlayers[0];
        } else if (nextPlayers[1].score >= winThreshold) {
          matchWinner = nextPlayers[1];
        }
      }
    }
  }

  return {
    ...state,
    board: newBoard,
    players: nextPlayers,
    turn: state.turn === 'X' ? 'O' : 'X',
    isGameOver,
    winner,
    winResult,
    matchWinner
  };
}

export function resetTTTRound(state: TTTGameState): TTTGameState {
  return {
    ...state,
    board: Array(9).fill(null),
    turn: 'X',
    isGameOver: false,
    winner: null,
    winResult: null,
    matchWinner: null
  };
}

export function resetTTTMatch(state: TTTGameState): TTTGameState {
  return {
    ...createInitialTTTState(
      { name: state.players[0].name, isBot: state.players[0].isBot },
      { name: state.players[1].name, isBot: state.players[1].isBot },
      state.mode
    )
  };
}
