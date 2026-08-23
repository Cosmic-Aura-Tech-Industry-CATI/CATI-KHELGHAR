'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        sounds.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        className={`relative w-full ${maxWidth} bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl shadow-slate-950 overflow-hidden transform transition-all`}
      >
        {title && (
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
            <h3 className="text-lg font-black text-white tracking-tight">{title}</h3>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              aria-label="Close dialog"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};
