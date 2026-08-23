export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';
export type PawnStatus = 'home' | 'active' | 'finished';
export type GameStatus = 'setup' | 'playing' | 'handoff' | 'finished';
export type GamePhase = 'rolling' | 'selecting' | 'animating' | 'handoff';
export type LudoTheme = 'sakura' | 'voxel' | 'classic';

export interface Pawn {
  id: string;       // e.g. 'red-0', 'red-1'
  playerId: string;
  color: PlayerColor;
  status: PawnStatus;
  steps: number;    // -1=home, 0-51=main track, 52-56=home lane, 57=finished
}

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  colorHex: string;
  lightColorHex: string;
  startTrackIndex: number; // which index of MAIN_TRACK this player's start cell is
  homeYardPositions: [number, number][]; // [row, col] for each of 4 yard slots
  homeLanePositions: [number, number][]; // [row, col] for steps 52-56
  pawns: Pawn[];
  isBot: boolean;
  rank?: number;
  hasWon: boolean;
}

export interface ValidMove {
  pawnId: string;
  fromSteps: number;
  toSteps: number;
  isExitHome: boolean;
  isCapture: boolean;
  capturedPawnId?: string;
  capturedPlayerId?: string;
  isFinish: boolean;
  isSafe: boolean;
  trackIndex?: number; // resolved track index for landing cell
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  diceRolling: boolean;
  hasRolled: boolean;
  consecutiveSixes: number;
  phase: GamePhase;
  validMoves: ValidMove[];
  selectedPawnId: string | null;
  animatingPawnId: string | null;
  animationStep: number;
  winnersRanking: string[]; // player IDs in finish order
  gameStatus: GameStatus;
  turnNumber: number;
  lastAction: string;
  activityLog: string[];
}

export type GameAction =
  | { type: 'ROLL_DICE'; value: number }
  | { type: 'DICE_ROLLED'; validMoves: ValidMove[] }
  | { type: 'SELECT_PAWN'; pawnId: string }
  | { type: 'MOVE_COMPLETE'; pawnId: string }
  | { type: 'NEXT_TURN' }
  | { type: 'RESTART'; players: Player[] }
  | { type: 'CONFIRM_HANDOFF' };

export interface LudoRules {
  extraTurnOnSix: boolean;
  extraTurnOnCapture: boolean;
  requireSixToExitHome: boolean;
  exactRollToFinish: boolean;
  maxConsecutiveSixes: number;
  showPassAndPlayScreen: boolean;
}

export interface BoardCell {
  row: number;
  col: number;
  type: 'path' | 'home-area' | 'home-lane' | 'safe' | 'start' | 'center' | 'empty';
  color?: PlayerColor;
  pathIndex?: number; // index in MAIN_TRACK (0-51)
  homeLaneIndex?: number; // 0-4 within a home lane
  isSafe?: boolean;
}
