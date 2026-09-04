export type Category =
  | 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes'
  | 'threeOfAKind' | 'fourOfAKind' | 'fullHouse'
  | 'smallStraight' | 'largeStraight' | 'yahtzee' | 'chance';

export type Scoresheet = Partial<Record<Category, number>>;

export interface YahtzeePlayer {
  id: string;
  name: string;
  isBot: boolean;
  score: Scoresheet;
}

export interface YahtzeeGameState {
  players: YahtzeePlayer[];
  currentPlayerIndex: number;
  dice: [number, number, number, number, number];
  held: [boolean, boolean, boolean, boolean, boolean];
  rollsLeft: number;
  isRolling: boolean;
  isGameOver: boolean;
  winner: string | null;
}

export type YahtzeeTheme = 'vegas' | 'tavern' | 'luxe';
