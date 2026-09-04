'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, CheckCircle2, HardDrive, Smartphone, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export const OfflineModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isCaching, setIsCaching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cacheComplete, setCacheComplete] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if ('caches' in window) {
      caches.keys().then((keys) => {
        if (keys.some((k) => k.includes('catikhelghar'))) {
          setCacheComplete(true);
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleDownloadOffline = async () => {
    if (!('caches' in window)) {
      alert('Offline storage is not supported by your browser.');
      return;
    }

    setIsCaching(true);
    setProgress(10);

    const CACHE_NAME = 'catikhelghar-v11';
    const urlsToCache = [
      '/',
      '/games',
      '/games/tic-tac-toe',
      '/games/ludo',
      '/games/snake-and-ladders',
      '/games/connect-four',
      '/games/dots-and-boxes',
      '/games/carrom',
      '/games/chess',
      '/games/checkers',
      '/games/reversi',
      '/games/ashta-chamma',
      '/games/bagh-chal',
      '/games/mancala',
      '/games/battleship',
      '/games/yahtzee',
      '/games/sos',
      '/games/memory-match',
      '/how-to-play',
      '/about',
      '/team',
      '/team/shikhar-dixit',
      '/team/swatantra-singh',
      '/team/nishkarsh-mishra',
      '/privacy',
      '/offline',
      '/manifest.json',
      '/icon.svg',
      '/dimisi-logo.png',
      '/team/shikhar-dixit.png',
      '/team/swatantra-singh.png',
      '/team/nishkarsh-mishra.png'
    ];

    try {
      const cache = await caches.open(CACHE_NAME);
      let loaded = 0;

      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (e) {
          // Continue if already cached
        }
        loaded++;
        setProgress(Math.round((loaded / urlsToCache.length) * 100));
      }

      setCacheComplete(true);
    } catch (err) {
      console.error('Offline download failed:', err);
    } finally {
      setIsCaching(false);
    }
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      alert(
        'To install CATI KHELGHAR on your device:\n\n• On Chrome / Edge: Click the \"Install\" or \"Add to Home Screen\" icon in your browser address bar.\n• On iOS Safari: Tap the Share button (square with arrow) and select \"Add to Home Screen\".'
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="space-y-5 py-2">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Offline Play &amp; App Setup</h2>
              <p className="text-xs text-slate-400">Play all 16 games with zero internet</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close offline dialog"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 bg-slate-800/40 border border-slate-700/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Network Status Card */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {isOnline ? 'Internet Connected' : 'Offline Mode Active'}
              </div>
              <div className="text-xs text-slate-400">
                {isOnline ? 'Ready to sync or save games' : 'Playing from device storage'}
              </div>
            </div>
          </div>
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
              isOnline
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
            }`}
          >
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Offline Cache Download Action */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Make Site Available Offline
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stores all 16 games, boards, rules, sounds, and team pages in your local browser cache. Once saved, CATI KHELGHAR works on planes, trains, or with Wi-Fi switched off.
              </p>
            </div>
          </div>

          {isCaching ? (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-400" />
                  Caching 16 Games...
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : cacheComplete ? (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                All 16 Games Saved for Offline!
              </span>
              <Button size="sm" variant="ghost" onClick={handleDownloadOffline}>
                Re-sync
              </Button>
            </div>
          ) : (
            <Button
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold"
              size="sm"
              onClick={handleDownloadOffline}
            >
              <Download className="w-4 h-4 mr-2" />
              Download All Games for Offline Use
            </Button>
          )}
        </div>

        {/* Install as Native App Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Install on Home Screen / Desktop</div>
              <div className="text-[11px] text-slate-400">Launch like a native app with full screen</div>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleInstallApp}
            className="flex-shrink-0 text-xs border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
          >
            {isInstalled ? 'Installed' : 'Install'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
