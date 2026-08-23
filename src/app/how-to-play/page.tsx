import React from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { GAMES_REGISTRY } from '@/lib/games';

export default function HowToPlayPage() {
  return (
    <div className="py-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-10 animate-fadeIn">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Rules & Guidelines</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          How to Play CATI KHELGHAR
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          Official pass-and-play game rules for families and friends.
        </p>
      </div>

      {/* Game Rules List */}
      <div className="space-y-6">
        {GAMES_REGISTRY.map(game => (
          <div
            key={game.id}
            className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{game.icon}</span>
                <div>
                  <h2 className="text-xl font-black text-white">{game.name}</h2>
                  <span className="text-xs font-bold text-slate-400">{game.tagline}</span>
                </div>
              </div>
              <Link
                href={game.route}
                className="px-4 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <span>Play</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {game.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/60">
              {game.highlights.map((h, i) => (
                <div
                  key={i}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-950/60 text-slate-300 text-[11px] font-bold border border-slate-800"
                >
                  ✓ {h}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
