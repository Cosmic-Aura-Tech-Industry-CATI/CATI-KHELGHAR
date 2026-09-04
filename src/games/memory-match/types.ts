export interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface MemoryPlayer {
  id: string;
  name: string;
  score: number;
  isBot: boolean;
}

export interface MemoryGameState {
  cards: Card[];
  players: MemoryPlayer[];
  currentPlayerIndex: number;
  flippedCardIds: number[];
  isLocked: boolean;
  isGameOver: boolean;
  winner: string | null;
}

export type MemoryTheme = 'wildlife' | 'gems' | 'emojis';
