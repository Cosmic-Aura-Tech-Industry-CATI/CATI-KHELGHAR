'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download } from 'lucide-react';
import { OfflineModal } from './OfflineModal';

export const OfflineBadge: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs font-bold border transition-all select-none cursor-pointer group hover:scale-105 flex-shrink-0 ${
          isOnline
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
        }`}
        title="Click to manage offline availability & install app"
      >
        {isOnline ? (
          <>
            <Wifi className="w-3.5 h-3.5 group-hover:hidden" />
            <Download className="w-3.5 h-3.5 hidden group-hover:inline text-emerald-300" />
            <span className="hidden sm:inline">Offline Ready</span>
            <span className="text-[10px] bg-emerald-500/20 px-1 rounded text-emerald-300 hidden md:inline">Save</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Offline Mode</span>
            <span className="text-[10px] sm:hidden">Offline</span>
          </>
        )}
      </button>

      <OfflineModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
