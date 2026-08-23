import {
  ConnectFourCell,
  ConnectFourState,
  ConnectFourWinResult
} from './types';

export const ROWS = 6;
export const COLS = 7;

export function createEmptyBoard(): ConnectFourCell[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

export function createInitialConnectFourState(
  p1: { name: string; isBot?: boolean } | string = 'Player 1',
  p2: { name: string; isBot?: boolean } | string = 'Bot Alpha 🤖'
): ConnectFourState {
  const p1Name = typeof p1 === 'string' ? p1 : p1.name;
  const p1Bot = typeof p1 === 'string' ? false : !!p1.isBot;

  const p2Name = typeof p2 === 'string' ? p2 : p2.name;
  const p2Bot = typeof p2 === 'string' ? p2Name.toLowerCase().includes('bot') : !!p2.isBot;

  return {
    board: createEmptyBoard(),
    players: [
      { id: 1, name: p1Name, symbol: 'R', color: '#dc2626', score: 0, isBot: p1Bot },
      { id: 2, name: p2Name, symbol: 'Y', color: '#f59e0b', score: 0, isBot: p2Bot }
    ],
    currentTurn: 'R',
    isGameOver: false,
    winResult: null,
    activityLog: ['Match started! Drop a disc into any column.']
  };
}

export function checkWin(board: ConnectFourCell[][]): ConnectFourWinResult | null {
  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const cell = board[r][c];
      if (
        cell &&
        cell === board[r][c + 1] &&
        cell === board[r][c + 2] &&
        cell === board[r][c + 3]
      ) {
        return {
          winner: cell,
          winningCoords: [
            [r, c],
            [r, c + 1],
            [r, c + 2],
            [r, c + 3]
          ]
        };
      }
    }
  }

  // Vertical
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      if (
        cell &&
        cell === board[r + 1][c] &&
        cell === board[r + 2][c] &&
        cell === board[r + 3][c]
      ) {
        return {
          winner: cell,
          winningCoords: [
            [r, c],
            [r + 1, c],
            [r + 2, c],
            [r + 3, c]
          ]
        };
      }
    }
  }

  // Diagonal /
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const cell = board[r][c];
      if (
        cell &&
        cell === board[r - 1][c + 1] &&
        cell === board[r - 2][c + 2] &&
        cell === board[r - 3][c + 3]
      ) {
        return {
          winner: cell,
          winningCoords: [
            [r, c],
            [r - 1, c + 1],
            [r - 2, c + 2],
            [r - 3, c + 3]
          ]
        };
      }
    }
  }

  // Diagonal \
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const cell = board[r][c];
      if (
        cell &&
        cell === board[r + 1][c + 1] &&
        cell === board[r + 2][c + 2] &&
        cell === board[r + 3][c + 3]
      ) {
        return {
          winner: cell,
          winningCoords: [
            [r, c],
            [r + 1, c + 1],
            [r + 2, c + 2],
            [r + 3, c + 3]
          ]
        };
      }
    }
  }

  // Check Draw
  const isFull = board[0].every(cell => cell !== null);
  if (isFull) {
    return {
      winner: 'Draw',
      winningCoords: []
    };
  }

  return null;
}

/**
 * Intelligent Connect Four Bot Move Calculator
 */
export function getBestConnectFourMove(
  board: ConnectFourCell[][],
  botSymbol: 'R' | 'Y'
): number {
  const opponentSymbol: 'R' | 'Y' = botSymbol === 'R' ? 'Y' : 'R';

  // Get lowest row available for each column
  const getLowestRow = (col: number, b: ConnectFourCell[][]): number => {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (b[r][col] === null) return r;
    }
    return -1;
  };

  const validCols: number[] = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === null) validCols.push(c);
  }

  if (validCols.length === 0) return -1;

  // 1. Can Bot win in 1 move?
  for (const c of validCols) {
    const r = getLowestRow(c, board);
    if (r !== -1) {
      const clone = board.map(row => [...row]);
      clone[r][c] = botSymbol;
      if (checkWin(clone)?.winner === botSymbol) {
        return c;
      }
    }
  }

  // 2. Can Opponent win in 1 move? Block them!
  for (const c of validCols) {
    const r = getLowestRow(c, board);
    if (r !== -1) {
      const clone = board.map(row => [...row]);
      clone[r][c] = opponentSymbol;
      if (checkWin(clone)?.winner === opponentSymbol) {
        return c;
      }
    }
  }

  // 3. Prioritize center columns: 3 > 2,4 > 1,5 > 0,6
  const preference = [3, 2, 4, 1, 5, 0, 6];
  for (const c of preference) {
    if (validCols.includes(c)) {
      // Make sure dropping here doesn't give opponent an immediate win on top
      const r = getLowestRow(c, board);
      if (r > 0) {
        const clone = board.map(row => [...row]);
        clone[r][c] = botSymbol;
        clone[r - 1][c] = opponentSymbol;
        if (checkWin(clone)?.winner === opponentSymbol) {
          continue; // Avoid this column if it helps opponent
        }
      }
      return c;
    }
  }

  return validCols[Math.floor(Math.random() * validCols.length)];
}

export function dropDisc(
  state: ConnectFourState,
  col: number
): { nextState: ConnectFourState; droppedRow: number | null } {
  if (state.isGameOver || col < 0 || col >= COLS) {
    return { nextState: state, droppedRow: null };
  }

  let targetRow = -1;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (state.board[r][col] === null) {
      targetRow = r;
      break;
    }
  }

  if (targetRow === -1) {
    return { nextState: state, droppedRow: null };
  }

  const newBoard = state.board.map(row => [...row]);
  newBoard[targetRow][col] = state.currentTurn;

  const winResult = checkWin(newBoard);
  const curPlayer = state.currentTurn === 'R' ? state.players[0] : state.players[1];

  let nextPlayers = state.players;
  let isGameOver = false;
  const newActivity = [...state.activityLog];

  if (winResult) {
    isGameOver = true;
    if (winResult.winner !== 'Draw') {
      nextPlayers = [
        winResult.winner === 'R'
          ? { ...state.players[0], score: state.players[0].score + 1 }
          : state.players[0],
        winResult.winner === 'Y'
          ? { ...state.players[1], score: state.players[1].score + 1 }
          : state.players[1]
      ];
      newActivity.unshift(`🏆 ${curPlayer.name} connected four in a row and won!`);
    } else {
      newActivity.unshift("🤝 Board is full - It's a draw!");
    }
  } else {
    newActivity.unshift(`${curPlayer.name} dropped a disc in column ${col + 1}.`);
  }

  return {
    droppedRow: targetRow,
    nextState: {
      ...state,
      board: newBoard,
      players: nextPlayers,
      currentTurn: state.currentTurn === 'R' ? 'Y' : 'R',
      isGameOver,
      winResult,
      activityLog: newActivity.slice(0, 8)
    }
  };
}

export function resetConnectFourRound(state: ConnectFourState): ConnectFourState {
  return {
    ...state,
    board: createEmptyBoard(),
    isGameOver: false,
    winResult: null,
    activityLog: ['New round started! First player to move: ' + state.players[0].name]
  };
}

export function resetConnectFourMatch(state: ConnectFourState): ConnectFourState {
  return {
    ...createInitialConnectFourState(
      { name: state.players[0].name, isBot: state.players[0].isBot },
      { name: state.players[1].name, isBot: state.players[1].isBot }
    ),
    players: [
      { ...state.players[0], score: 0 },
      { ...state.players[1], score: 0 }
    ]
  };
}
