export interface Game {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  minPlayers: number;
  maxPlayers: number;
  playersLabel: string;
  route: string;
  available: boolean;
  category: 'classic' | 'strategy' | 'party' | 'quick';
  themeColor: {
    primary: string;
    light: string;
    border: string;
    badge: string;
  };
  highlights: string[];
}

export const GAMES_REGISTRY: Game[] = [
  {
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    tagline: 'Classic 2-Player Strategy',
    description: 'Take turns placing X and O. Align 3 in a row horizontally, vertically, or diagonally to win!',
    icon: '❌⭕',
    minPlayers: 2,
    maxPlayers: 2,
    playersLabel: '2 Players',
    route: '/games/tic-tac-toe',
    available: true,
    category: 'quick',
    themeColor: {
      primary: '#0284c7', // Sky Blue
      light: '#e0f2fe',
      border: '#bae6fd',
      badge: 'bg-sky-100 text-sky-800'
    },
    highlights: ['Single Match & Series', 'Custom Player Names', 'Winning Line Strike', 'Running Scoreboard']
  },
  {
    id: 'ludo',
    name: 'Ludo',
    tagline: 'Roll. Move. Conquer.',
    description: 'The beloved Indian classic! Roll 6 to deploy tokens, capture rivals, land on safe stars, and guide all 4 tokens home.',
    icon: '🎲',
    minPlayers: 2,
    maxPlayers: 4,
    playersLabel: '2 - 4 Players',
    route: '/games/ludo',
    available: true,
    category: 'classic',
    themeColor: {
      primary: '#dc2626', // Crimson Red
      light: '#fee2e2',
      border: '#fca5a5',
      badge: 'bg-red-100 text-red-800'
    },
    highlights: ['2, 3, or 4 Players', 'Safe Star Spots', 'Token Captures & Bonus Rolls', 'Authentic 15x15 Board']
  },
  {
    id: 'snake-and-ladders',
    name: 'Snake & Ladders',
    tagline: 'Climb High. Don\'t Get Bitten.',
    description: 'Race along the 100-cell board! Climb towering ladders to leap forward and beware of slippery snakes.',
    icon: '🐍',
    minPlayers: 2,
    maxPlayers: 4,
    playersLabel: '2 - 4 Players',
    route: '/games/snake-and-ladders',
    available: true,
    category: 'classic',
    themeColor: {
      primary: '#16a34a', // Emerald Green
      light: '#dcfce7',
      border: '#86efac',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    highlights: ['Animated Token Jumps', '100-Cell Zigzag Board', 'Exact 100 Win Rule', 'Interactive Dice Roller']
  },
  {
    id: 'connect-four',
    name: 'Four in a Row',
    tagline: 'Connect 4 Discs to Win',
    description: 'Drop colored tokens into the vertical grid. Connect four of your color in a row horizontally, vertically, or diagonally.',
    icon: '🔴🟡',
    minPlayers: 2,
    maxPlayers: 2,
    playersLabel: '2 Players',
    route: '/games/connect-four',
    available: true,
    category: 'strategy',
    themeColor: {
      primary: '#9333ea',
      light: '#f3e8ff',
      border: '#d8b4fe',
      badge: 'bg-purple-100 text-purple-800'
    },
    highlights: ['Gravity Drop Physics', 'Winning 4-in-a-row Glow', '2-Player Strategy', 'Running Match Score']
  },
  {
    id: 'dots-and-boxes',
    name: 'Dots & Boxes',
    tagline: 'Capture the Most Boxes',
    description: 'Take turns drawing lines between dots. Complete a 1x1 box to claim it and earn a bonus turn!',
    icon: '📦',
    minPlayers: 2,
    maxPlayers: 4,
    playersLabel: '2 - 4 Players',
    route: '/games/dots-and-boxes',
    available: true,
    category: 'strategy',
    themeColor: {
      primary: '#ea580c',
      light: '#ffedd5',
      border: '#fed7aa',
      badge: 'bg-orange-100 text-orange-800'
    },
    highlights: ['3x3 & 4x4 Grid Modes', 'Territory Conquering', 'Bonus Turn on Capture', 'Pen & Paper Tabletop']
  },
  {
    id: 'carrom',
    name: 'Carrom',
    tagline: 'Strike & Pocket the Queen',
    description: 'The quintessential Indian board game of carrom men, strikers, and the golden queen with realistic disc bouncing physics.',
    icon: '🎯',
    minPlayers: 2,
    maxPlayers: 2,
    playersLabel: '2 Players',
    route: '/games/carrom',
    available: true,
    category: 'classic',
    themeColor: {
      primary: '#d97706',
      light: '#fef3c7',
      border: '#fde68a',
      badge: 'bg-amber-100 text-amber-800'
    },
    highlights: ['Interactive Striker Aiming', '2D Disc Elastic Physics', 'Queen + White/Black Scoring', 'Pass & Play Tabletop']
  }
];

export function getAvailableGames(): Game[] {
  return GAMES_REGISTRY.filter(g => g.available);
}

export function getGameById(id: string): Game | undefined {
  return GAMES_REGISTRY.find(g => g.id === id);
}
