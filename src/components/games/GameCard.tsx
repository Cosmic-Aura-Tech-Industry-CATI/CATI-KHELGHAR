'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, ArrowRight, Sparkles, Bot } from 'lucide-react';
import { Game } from '@/lib/games';
import { sounds } from '@/lib/sounds';
import { PlayerSetup, PlayerConfig } from './PlayerSetup';
import { StorageService } from '@/lib/storage';

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const router = useRouter();
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);

  const handleOpenSetup = (e: React.MouseEvent) => {
    e.preventDefault();
    sounds.playClick();
    setIsSetupOpen(true);
  };

  const handleStartGame = (players: PlayerConfig[]) => {
    sounds.playClick();
    // Save chosen configuration in storage for this game
    StorageService.set(`players_${game.id}`, players);
    setIsSetupOpen(false);
    router.push(game.route);
  };

  return (
    <>
      <div
        className={`group relative flex flex-col justify-between p-6 rounded-3xl bg-slate-900/90 border border-slate-800 transition-all duration-200 ${
          game.available
            ? 'hover:-translate-y-1.5 hover:border-slate-700 hover:shadow-2xl hover:shadow-slate-950'
            : 'opacity-70'
        }`}
      >
        <div>
          {/* Top Badges */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="text-4xl p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/50 shadow-md">
              {game.icon}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  game.available
                    ? 'bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{game.playersLabel}</span>
              </span>
              {game.available && (
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Bot className="w-3 h-3 text-purple-400" />
                  Bot &amp; Peoples
                </span>
              )}
            </div>
          </div>

          {/* Name & Tagline */}
          <h3 className="text-xl font-black text-white group-hover:text-orange-400 transition-colors">
            {game.name}
          </h3>
          <p className="text-xs font-bold text-orange-400/90 mt-0.5 mb-2">
            {game.tagline}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            {game.description}
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {game.highlights.map((hl, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-lg bg-slate-800/60 text-slate-400 text-[11px] font-medium border border-slate-700/40"
              >
                {hl}
              </span>
            ))}
          </div>
        </div>

        {/* Action CTA: Opens Quick Menu Modal */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          {game.available ? (
            <button
              type="button"
              onClick={handleOpenSetup}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>Play Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 rounded-2xl bg-slate-800 text-slate-500 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Coming Soon</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode & Player Count Setup Menu Modal */}
      {game.available && (
        <PlayerSetup
          isOpen={isSetupOpen}
          gameTitle={game.name}
          minPlayers={game.minPlayers}
          maxPlayers={game.maxPlayers}
          onStart={handleStartGame}
          onClose={() => setIsSetupOpen(false)}
        />
      )}
    </>
  );
};
