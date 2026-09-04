import { YahtzeeGameState, YahtzeePlayer, Category, Scoresheet } from './types';

export function createInitialYahtzeeState(players: { name: string; isBot: boolean }[]): YahtzeeGameState {
  const count = Math.min(Math.max(players.length, 2), 4);
  const pList: YahtzeePlayer[] = players.slice(0, count).map((p, idx) => ({
    id: `p-${idx}`,
    name: p.name || `Player ${idx + 1}`,
    isBot: p.isBot || false,
    score: {},
  }));

  return {
    players: pList,
    currentPlayerIndex: 0,
    dice: [1, 2, 3, 4, 5],
    held: [false, false, false, false, false],
    rollsLeft: 3,
    isRolling: false,
    isGameOver: false,
    winner: null,
  };
}

export function rollDice(state: YahtzeeGameState): [number, number, number, number, number] {
  return state.dice.map((d, i) => (state.held[i] ? d : Math.floor(Math.random() * 6) + 1)) as [
    number, number, number, number, number
  ];
}

export function calculatePotentialScore(category: Category, dice: number[]): number {
  const sum = dice.reduce((a, b) => a + b, 0);
  const counts: Record<number, number> = {};
  for (const d of dice) counts[d] = (counts[d] || 0) + 1;
  const countValues = Object.values(counts);

  switch (category) {
    case 'ones': return dice.filter((d) => d === 1).length * 1;
    case 'twos': return dice.filter((d) => d === 2).length * 2;
    case 'threes': return dice.filter((d) => d === 3).length * 3;
    case 'fours': return dice.filter((d) => d === 4).length * 4;
    case 'fives': return dice.filter((d) => d === 5).length * 5;
    case 'sixes': return dice.filter((d) => d === 6).length * 6;

    case 'threeOfAKind': return countValues.some((c) => c >= 3) ? sum : 0;
    case 'fourOfAKind': return countValues.some((c) => c >= 4) ? sum : 0;
    case 'fullHouse':
      return (countValues.includes(3) && countValues.includes(2)) || countValues.includes(5) ? 25 : 0;

    case 'smallStraight': {
      const u = Array.from(new Set(dice)).sort();
      const s = u.join('');
      return s.includes('1234') || s.includes('2345') || s.includes('3456') ? 30 : 0;
    }
    case 'largeStraight': {
      const u = Array.from(new Set(dice)).sort();
      const s = u.join('');
      return s.includes('12345') || s.includes('23456') ? 40 : 0;
    }
    case 'yahtzee': return countValues.includes(5) ? 50 : 0;
    case 'chance': return sum;
  }
}

export function getTotalScore(score: Scoresheet): { upper: number; bonus: number; lower: number; total: number } {
  const upper =
    (score.ones || 0) +
    (score.twos || 0) +
    (score.threes || 0) +
    (score.fours || 0) +
    (score.fives || 0) +
    (score.sixes || 0);

  const bonus = upper >= 63 ? 35 : 0;

  const lower =
    (score.threeOfAKind || 0) +
    (score.fourOfAKind || 0) +
    (score.fullHouse || 0) +
    (score.smallStraight || 0) +
    (score.largeStraight || 0) +
    (score.yahtzee || 0) +
    (score.chance || 0);

  return { upper, bonus, lower, total: upper + bonus + lower };
}
