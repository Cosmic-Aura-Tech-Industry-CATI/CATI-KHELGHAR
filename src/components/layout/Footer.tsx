'use client';

import React from 'react';
import Link from 'next/link';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';
import { OfflineModal } from '../ui/OfflineModal';

export const Footer: React.FC = () => {
  const handleResetData = () => {
    if (typeof window !== 'undefined') {
      const confirmReset = window.confirm(
        'Are you sure you want to reset all stored local game stats and player names?'
      );
      if (confirmReset) {
        sounds.playClick();
        StorageService.resetAllData();
        window.location.reload();
      }
    }
  };

  const [offlineModalOpen, setOfflineModalOpen] = React.useState<boolean>(false);

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 sm:px-6 mt-12 space-y-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        {/* Brand identity with Favicon Logo */}
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.svg"
            alt="CATI KHELGHAR Logo"
            className="w-7 h-7 rounded-lg shadow-sm border border-orange-500/20 object-contain"
          />
          <span className="font-bold text-white tracking-wide">CATI KHELGHAR</span>
          <span>&bull; Pure local games for family and friends. No login, no servers.</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => setOfflineModalOpen(true)}
            className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>📥</span> Save Offline
          </button>
          <Link href="/how-to-play" className="hover:text-orange-400 transition-colors">
            How to Play
          </Link>
          <Link href="/team" className="hover:text-orange-400 transition-colors">
            Team
          </Link>
          <Link href="/about" className="hover:text-orange-400 transition-colors">
            About
          </Link>
          <Link href="/privacy" className="hover:text-orange-400 transition-colors">
            Privacy (100% Offline)
          </Link>
          <button
            type="button"
            onClick={handleResetData}
            className="text-red-400/80 hover:text-red-400 transition-colors underline cursor-pointer"
          >
            Reset Local Data
          </button>
        </div>
      </div>

      {/* Attribution Row: Explicit link to Shikhar Dixit and DIMISI Technologies */}
      <div className="max-w-6xl mx-auto pt-4 border-t border-slate-900/90 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-400 text-center">
        <span>Conceived &amp; Developed by</span>
        <Link
          href="/team/shikhar-dixit"
          className="text-orange-400 hover:text-orange-300 font-bold underline underline-offset-2 transition-colors"
        >
          Shikhar Dixit
        </Link>
        <span>(Founder &amp; CEO) &middot;</span>
        <a
          href="https://dimisi.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity inline-flex items-center gap-1.5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/dimisi-logo.png"
            alt="DIMISI Technologies Logo"
            className="h-4 w-auto object-contain opacity-80"
          />
          <span className="font-bold text-white">DIMISI Technologies Pvt Ltd</span>
        </a>
      </div>

      <OfflineModal
        isOpen={offlineModalOpen}
        onClose={() => setOfflineModalOpen(false)}
      />
    </footer>
  );
};
