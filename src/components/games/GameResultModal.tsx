'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, RotateCcw, Home, Grid } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface GameResultModalProps {
  isOpen: boolean;
  winnerName: string | null;
  isDraw?: boolean;
  message?: string;
  onPlayAgain: () => void;
  onClose?: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  isOpen,
  winnerName,
  isDraw = false,
  message,
  onPlayAgain
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onPlayAgain} maxWidth="max-w-sm">
      <div className="text-center space-y-4 py-2">
        {/* Celebration Icon */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-3xl shadow-xl shadow-orange-500/30 animate-bounce">
          {isDraw ? '🤝' : '👑'}
        </div>

        {/* Headline */}
        <div>
          <h2 className="text-2xl font-black text-white">
            {isDraw ? "It's a Draw!" : `${winnerName} Wins!`}
          </h2>
          <p className="text-xs font-medium text-slate-400 mt-1">
            {message || (isDraw ? 'That was a close contest! Ready for a rematch?' : 'Victory is yours! Conquered the board with skill.')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={onPlayAgain}
            className="w-full flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/games"
              className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>All Games</span>
            </Link>

            <Link
              href="/"
              className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};
