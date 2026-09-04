'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, HelpCircle, Settings2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { sounds } from '@/lib/sounds';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

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
  const router = useRouter();
  const [showQuitModal, setShowQuitModal] = React.useState(false);

  const handleConfirmQuit = () => {
    sounds.playClick();
    setShowQuitModal(false);
    router.push('/games');
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800">
        {/* Back Button with Confirmation */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setShowQuitModal(true);
          }}
          aria-label="Back to Games directory"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Games</span>
        </button>

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

    {/* Quit Confirmation Dialog */}
    <Modal
      isOpen={showQuitModal}
      onClose={() => setShowQuitModal(false)}
      maxWidth="max-w-sm"
    >
      <div className="text-center space-y-4 py-2">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-lg font-black text-white">Leave Game?</h3>
          <p className="text-xs text-slate-400 mt-1">
            Are you sure you want to quit this match? Your current game progress will be lost.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowQuitModal(false)}
            className="w-full text-xs"
          >
            Stay &amp; Play
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleConfirmQuit}
            className="w-full text-xs"
          >
            Quit Match
          </Button>
        </div>
      </div>
    </Modal>
  </>
  );
};
