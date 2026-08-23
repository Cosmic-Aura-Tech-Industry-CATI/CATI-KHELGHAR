'use client';

import React, { useState } from 'react';
import { Users, Play, Bot, User, ChevronDown, ChevronUp, Palette } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export type GamePlayMode = 'bot' | 'peoples';

export interface PlayerConfig {
  name: string;
  isBot: boolean;
}

export interface GameThemeOption {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

interface PlayerSetupProps {
  isOpen: boolean;
  gameTitle: string;
  minPlayers: number;
  maxPlayers: number;
  initialPlayers?: PlayerConfig[];
  initialNames?: string[];
  themes?: GameThemeOption[];
  currentTheme?: string;
  onThemeChange?: (themeId: string) => void;
  onStart: (players: PlayerConfig[], count: number, selectedTheme?: string) => void;
  onClose: () => void;
}

export const PlayerSetup: React.FC<PlayerSetupProps> = ({
  isOpen,
  gameTitle,
  minPlayers,
  maxPlayers,
  initialPlayers,
  initialNames,
  themes,
  currentTheme,
  onThemeChange,
  onStart,
  onClose
}) => {
  // Determine default mode based on initial players
  const hasInitialBot = initialPlayers?.some(p => p.isBot) ?? true;
  const [playMode, setPlayMode] = useState<GamePlayMode>(hasInitialBot ? 'bot' : 'peoples');

  const [selectedTheme, setSelectedTheme] = useState<string>(
    currentTheme || (themes && themes.length > 0 ? themes[0].id : '')
  );

  const [playerCount, setPlayerCount] = useState<number>(() => {
    if (initialPlayers && initialPlayers.length >= minPlayers) return initialPlayers.length;
    if (initialNames && initialNames.length >= minPlayers) return initialNames.length;
    return minPlayers === maxPlayers ? minPlayers : 2;
  });

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Helper to generate player list based on Mode and Count
  const generatePlayers = (mode: GamePlayMode, count: number): PlayerConfig[] => {
    const botNames = ['Bot Alpha 🤖', 'Bot Beta 🤖', 'Bot Gamma 🤖', 'Bot Delta 🤖'];
    const configs: PlayerConfig[] = [];

    for (let i = 0; i < count; i++) {
      if (mode === 'bot') {
        if (i === 0) {
          configs.push({ name: 'Player 1', isBot: false });
        } else {
          configs.push({
            name: botNames[(i - 1) % botNames.length],
            isBot: true
          });
        }
      } else {
        configs.push({
          name: `Player ${i + 1}`,
          isBot: false
        });
      }
    }
    return configs;
  };

  const [players, setPlayers] = useState<PlayerConfig[]>(() =>
    generatePlayers(hasInitialBot ? 'bot' : 'peoples', playerCount)
  );

  const handleModeChange = (mode: GamePlayMode) => {
    setPlayMode(mode);
    setPlayers(generatePlayers(mode, playerCount));
  };

  const handleCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayers(generatePlayers(playMode, count));
  };

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    if (onThemeChange) {
      onThemeChange(themeId);
    }
  };

  const handleNameChange = (idx: number, val: string) => {
    const updated = [...players];
    updated[idx] = { ...updated[idx], name: val };
    setPlayers(updated);
  };

  const handleToggleBot = (idx: number) => {
    const updated = [...players];
    const isNowBot = !updated[idx].isBot;
    const botNames = ['Bot Alpha 🤖', 'Bot Beta 🤖', 'Bot Gamma 🤖', 'Bot Delta 🤖'];

    updated[idx] = {
      ...updated[idx],
      isBot: isNowBot,
      name: isNowBot
        ? botNames[idx % botNames.length]
        : `Player ${idx + 1}`
    };
    setPlayers(updated);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalConfigs = players.slice(0, playerCount).map((p, i) => ({
      name: p.name.trim() || (p.isBot ? `Bot ${i + 1} 🤖` : `Player ${i + 1}`),
      isBot: p.isBot
    }));
    onStart(finalConfigs, playerCount, selectedTheme);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${gameTitle} • Settings & Setup`}>
      <form onSubmit={handleFormSubmit} className="space-y-5">
        {/* Step 1: Mode Selection (Play with Bot vs Peoples) */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
            1. Select Game Mode:
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Play with Bot */}
            <button
              type="button"
              onClick={() => handleModeChange('bot')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 select-none ${
                playMode === 'bot'
                  ? 'bg-purple-950/70 border-purple-500 ring-2 ring-purple-500/40 shadow-lg shadow-purple-500/20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Bot className="w-5 h-5" />
                </span>
                {playMode === 'bot' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500 text-white font-black">
                    SELECTED
                  </span>
                )}
              </div>
              <div>
                <div className="text-sm font-black text-white">Play with Bot</div>
                <div className="text-[11px] text-slate-400">Single player vs smart AI</div>
              </div>
            </button>

            {/* Play with Peoples */}
            <button
              type="button"
              onClick={() => handleModeChange('peoples')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 select-none ${
                playMode === 'peoples'
                  ? 'bg-orange-950/70 border-orange-500 ring-2 ring-orange-500/40 shadow-lg shadow-orange-500/20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
                  <Users className="w-5 h-5" />
                </span>
                {playMode === 'peoples' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500 text-slate-950 font-black">
                    SELECTED
                  </span>
                )}
              </div>
              <div>
                <div className="text-sm font-black text-white">Play with Peoples</div>
                <div className="text-[11px] text-slate-400">Pass & play with friends</div>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Theme Selector (If game has themes) */}
        {themes && themes.length > 0 && (
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Select Board Theme:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {themes.map(t => {
                const isThemeActive = selectedTheme === t.id;

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleThemeSelect(t.id)}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 select-none ${
                      isThemeActive
                        ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/40 shadow-md scale-[1.02]'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <span className="text-xl">{t.icon}</span>
                    <span className={`text-xs font-black ${isThemeActive ? 'text-amber-400' : 'text-white'}`}>
                      {t.name}
                    </span>
                    {t.description && (
                      <span className="text-[9px] text-slate-400 font-medium leading-tight">
                        {t.description}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Player Count Selector (if min < max, e.g. 2 to 4 players) */}
        {minPlayers < maxPlayers && (
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
              {themes && themes.length > 0 ? '3.' : '2.'} Select Number of Players:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: maxPlayers - minPlayers + 1 }).map((_, i) => {
                const count = minPlayers + i;
                const isSelected = playerCount === count;

                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => handleCountChange(count)}
                    className={`py-2.5 px-3 rounded-2xl border font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 border-orange-400 shadow-md shadow-orange-500/20 scale-[1.02]'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <span className="text-sm">👥 {count} Players</span>
                    <span className="text-[10px] font-bold opacity-80">
                      {playMode === 'bot'
                        ? `1 Human + ${count - 1} Bot${count - 1 > 1 ? 's' : ''}`
                        : `${count} Humans`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Customize Names (Collapsible) */}
        <div className="border-t border-slate-800 pt-3">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
          >
            <span className="flex items-center gap-1.5">
              <span>⚙️ Customize Player Names &amp; Slots</span>
              <span className="text-[10px] text-slate-400 font-medium">({playerCount} active)</span>
            </span>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showAdvanced && (
            <div className="space-y-2 mt-3 animate-fadeIn">
              {Array.from({ length: playerCount }).map((_, i) => {
                const p = players[i] || { name: `Player ${i + 1}`, isBot: false };

                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800"
                  >
                    <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-400 flex items-center justify-center flex-shrink-0 ml-1">
                      {i + 1}
                    </span>

                    {/* Name Input */}
                    <input
                      type="text"
                      maxLength={16}
                      value={p.name || ''}
                      onChange={e => handleNameChange(i, e.target.value)}
                      placeholder={p.isBot ? `Bot ${i + 1} 🤖` : `Player ${i + 1}`}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                    {/* Human / Bot Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleBot(i)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 transition-all select-none cursor-pointer border ${
                        p.isBot
                          ? 'bg-purple-600/30 text-purple-300 border-purple-500/50 shadow-sm'
                          : 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-600/30'
                      }`}
                      title={p.isBot ? 'Switch to Human' : 'Switch to Bot'}
                    >
                      {p.isBot ? (
                        <>
                          <Bot className="w-3.5 h-3.5 text-purple-400" />
                          <span>Bot</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Human</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit Play Button */}
        <Button
          variant="primary"
          size="lg"
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3.5 text-sm uppercase tracking-wider font-black shadow-xl shadow-orange-500/25 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>
            Start Game ({playMode === 'bot' ? 'vs Bot' : 'Pass & Play'} &bull; {playerCount} Players)
          </span>
        </Button>
      </form>
    </Modal>
  );
};
