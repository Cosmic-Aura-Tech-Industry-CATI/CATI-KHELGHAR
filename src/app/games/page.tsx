'use client';

import React, { useState } from 'react';
import { GAMES_REGISTRY, Game } from '@/lib/games';
import { GameCard } from '@/components/games/GameCard';
import { Sparkles, Filter } from 'lucide-react';

export default function GamesPage() {
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Games' },
    { id: 'classic', label: 'Classic Board' },
    { id: 'quick', label: 'Quick 2-Player' },
    { id: 'strategy', label: 'Strategy' }
  ];

  const filteredGames = GAMES_REGISTRY.filter(g => {
    if (filter === 'all') return true;
    return g.category === filter;
  });

  return (
    <div className="py-8 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-orange-400">
          Game Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Choose Your Game
        </h1>
        <p className="text-sm text-slate-400">
          All games are 100% offline, local pass-and-play, and require zero setup.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setFilter(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              filter === cat.id
                ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredGames.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
