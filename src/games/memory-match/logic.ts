import { Card, MemoryGameState, MemoryPlayer, MemoryTheme } from './types';

const SYMBOL_SETS: Record<MemoryTheme, string[]> = {
  wildlife: ['🐅', '🐘', '🦚', '🐒', '🐆', '🦌', '🦜', '🐊'],
  gems: ['💎', '🔮', '✨', '👑', '💍', '🪙', '🌟', '🧿'],
  emojis: ['🚀', '🍕', '🎨', '🎸', '⚽', '🍦', '🛸', '🎯'],
};

export function createInitialMemoryState(
  playerConfigs: { name: string; isBot: boolean }[],
  theme: MemoryTheme = 'wildlife'
): MemoryGameState {
  const symbols = SYMBOL_SETS[theme] || SYMBOL_SETS.wildlife;
  const deck: Card[] = [];

  let id = 1;
  for (const sym of symbols) {
    deck.push({ id: id++, symbol: sym, isFlipped: false, isMatched: false });
    deck.push({ id: id++, symbol: sym, isFlipped: false, isMatched: false });
  }

  // Shuffle deck
  deck.sort(() => Math.random() - 0.5);

  const count = Math.min(Math.max(playerConfigs.length, 2), 4);
  const players: MemoryPlayer[] = playerConfigs.slice(0, count).map((p, idx) => ({
    id: `p-${idx}`,
    name: p.name || `Player ${idx + 1}`,
    score: 0,
    isBot: p.isBot || false,
  }));

  return {
    cards: deck,
    players,
    currentPlayerIndex: 0,
    flippedCardIds: [],
    isLocked: false,
    isGameOver: false,
    winner: null,
  };
}
