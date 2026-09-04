'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Volume2, VolumeX, Menu, X, Gamepad2, Info, HelpCircle, Users } from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { OfflineBadge } from '../ui/OfflineBadge';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    setSoundOn(sounds.isEnabled());
  }, []);

  const handleSoundToggle = () => {
    const newState = sounds.toggle();
    setSoundOn(newState);
  };

  const navLinks = [
    { href: '/games', label: 'Games', icon: Gamepad2 },
    { href: '/how-to-play', label: 'How to Play', icon: HelpCircle },
    { href: '/team', label: 'Team', icon: Users },
    { href: '/about', label: 'About', icon: Info }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo with Favicon Image */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-xl p-0.5 sm:p-1 min-w-0 flex-shrink"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.svg"
            alt="CATI KHELGHAR Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-lg shadow-orange-500/25 border border-orange-500/30 group-hover:scale-105 transition-transform object-contain flex-shrink-0"
          />
          <div className="min-w-0">
            <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1 sm:gap-1.5 leading-none truncate">
              CATI <span className="text-orange-500">KHELGHAR</span>
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 block font-medium mt-0.5 truncate hidden xs:block">
              Play Together. Offline.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Controls: Offline Status + Sound Toggle + Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <OfflineBadge />

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleSoundToggle}
            aria-label={soundOn ? 'Mute sound effects' : 'Unmute sound effects'}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          >
            {soundOn ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 p-4 space-y-2 animate-fadeIn">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
