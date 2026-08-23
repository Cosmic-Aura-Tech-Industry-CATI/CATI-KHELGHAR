'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, HelpCircle, Settings2 } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface GameHeaderProps {
  title: string;
  icon: string;
  onRestart: () => void;
  onOpenRules?: () => void;
  onOpenSettings?: () => void;
  subtitle?: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  icon,
  onRestart,
  onOpenRules,
  onOpenSettings,
  subtitle
}) => {
  return (
    <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800">
      {/* Back Button */}
      <Link
        href="/games"
        onClick={() => sounds.playClick()}
        aria-label="Back to Games directory"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Games</span>
      </Link>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-lg sm:text-xl font-black text-white flex items-center justify-center gap-2">
          <span>{icon}</span>
          <span>{title}</span>
        </h1>
        {subtitle && (
          <p className="text-[11px] font-bold text-orange-400 -mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5">
        {onOpenSettings && (
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenSettings();
            }}
            aria-label="Match settings"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Settings / Player Names"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        )}

        {onOpenRules && (
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenRules();
            }}
            aria-label="Game rules"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onRestart();
          }}
          aria-label="Restart match"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold transition-colors"
          title="Restart Current Match"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Restart</span>
        </button>
      </div>
    </div>
  );
};
