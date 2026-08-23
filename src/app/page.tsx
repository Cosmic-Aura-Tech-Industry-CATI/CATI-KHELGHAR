import React from 'react';
import Link from 'next/link';
import { Sparkles, Users, WifiOff, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { GAMES_REGISTRY } from '@/lib/games';
import { GameCard } from '@/components/games/GameCard';

export default function HomePage() {
  const availableGames = GAMES_REGISTRY.filter(g => g.available);

  return (
    <div className="space-y-16 py-8 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="relative text-center py-10 sm:py-16 space-y-6 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-orange-500/20 via-red-500/15 to-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500/10 border border-orange-500/30 text-orange-400 select-none">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Play Together. Anywhere.</span>
        </div>

        {/* Headline */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Simple Games for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-amber-400 bg-clip-text text-transparent">
              Family & Friends
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
            Welcome to <strong>CATI KHELGHAR</strong>. No login, no server accounts, no ads. Just pass-and-play board games on the same device — 100% offline ready.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/games"
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>Play Now (6 Games)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/how-to-play"
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition-colors"
          >
            How to Play
          </Link>
        </div>

        {/* 4 Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <WifiOff className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-white">100% Offline</div>
              <div className="text-[11px] text-slate-400">Works without internet</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-white">Pass & Play</div>
              <div className="text-[11px] text-slate-400">2-4 on same screen</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-white">Zero Accounts</div>
              <div className="text-[11px] text-slate-400">No login or signups</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-white">Instant Load</div>
              <div className="text-[11px] text-slate-400">Under 1 second</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Featured Games Collection
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select any game and start playing with friends in seconds.
            </p>
          </div>
          <Link
            href="/games"
            className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All ({availableGames.length}) Games</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Active Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tight">
            How Local Pass & Play Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Designed for living rooms, journeys, parties, picnics, and power cuts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-lg font-black">
              1
            </div>
            <h3 className="text-sm font-bold text-white">Choose a Game</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pick Tic Tac Toe, Ludo, Snake & Ladders, Four in a Row, Dots & Boxes, or Carrom.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg font-black">
              2
            </div>
            <h3 className="text-sm font-bold text-white">Set Players</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select 2, 3, or 4 players and type your family or friends' names.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg font-black">
              3
            </div>
            <h3 className="text-sm font-bold text-white">Pass the Device</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Take turns rolling dice or tapping squares. Enjoy quality time together!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
