import React from 'react';
import Link from 'next/link';
import { WifiOff } from 'lucide-react';
import { GAMES_REGISTRY } from '@/lib/games';

export default function OfflinePage() {
  const availableGames = GAMES_REGISTRY.filter(g => g.available);

  return (
    <div className="py-16 px-4 sm:px-6 max-w-2xl mx-auto text-center space-y-8 animate-fadeIn">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
        <WifiOff className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">You Are Offline</h1>
        <p className="text-sm text-slate-400">
          No internet connection? No problem! CATI KHELGHAR is built to work 100% offline.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {availableGames.map(game => (
          <Link
            key={game.id}
            href={game.route}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 transition-colors flex items-center gap-3"
          >
            <span className="text-2xl">{game.icon}</span>
            <div>
              <div className="text-sm font-bold text-white">{game.name}</div>
              <div className="text-xs text-slate-400">{game.playersLabel}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
