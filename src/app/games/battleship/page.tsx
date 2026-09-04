'use client';

import React, { useState, useEffect } from 'react';
import { GameHeader } from '@/components/games/GameHeader';
import { PlayerSetup, PlayerConfig, GameThemeOption } from '@/components/games/PlayerSetup';
import { GameResultModal } from '@/components/games/GameResultModal';
import { createInitialBattleshipState, autoPlaceFleet, fireShot, GRID_SIZE } from '@/games/battleship/logic';
import { BattleshipGameState, BattleshipTheme } from '@/games/battleship/types';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';
import { Shield, Eye, EyeOff, Crosshair } from 'lucide-react';

const THEMES: GameThemeOption[] = [
  { id: 'sonar', name: 'Ocean Radar', icon: '📡', description: 'Deep emerald naval sonar display' },
  { id: 'blueprint', name: 'Naval Blueprint', icon: '📐', description: 'Cyan tactical grid blueprint' },
  { id: 'deepsea', name: 'Deep Sea Abyss', icon: '🌊', description: 'Dark oceanic naval warfare' },
];

const DEFAULT_PLAYERS: PlayerConfig[] = [
  { name: 'Fleet Alpha', isBot: false },
  { name: 'Fleet Bravo 🤖', isBot: true },
];

export default function BattleshipPage() {
  const [gameState, setGameState] = useState<BattleshipGameState>(createInitialBattleshipState);
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>(DEFAULT_PLAYERS);
  const [theme, setTheme] = useState<BattleshipTheme>('sonar');
  const [showPrivacyCurtain, setShowPrivacyCurtain] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  useEffect(() => {
    const savedTheme = StorageService.get<BattleshipTheme>('battleship_theme', 'sonar');
    setTheme(savedTheme);
  }, []);

  const currentPlayer = playerConfigs[gameState.turn];
  const activeRadar = gameState.turn === 0 ? gameState.p1.radar : gameState.p2.radar;
  const activeFleet = gameState.turn === 0 ? gameState.p1.ships : gameState.p2.ships;

  // Auto-setup both fleets initially
  const handleAutoDeployP1 = () => {
    sounds.playMove?.();
    const fleet = autoPlaceFleet();
    setGameState((prev) => ({
      ...prev,
      p1: { ...prev.p1, grid: fleet.grid, ships: fleet.ships },
      phase: playerConfigs[1].isBot ? 'combat' : 'handoff-p2',
      p2: playerConfigs[1].isBot ? { ...prev.p2, ...autoPlaceFleet() } : prev.p2,
      lastLog: playerConfigs[1].isBot ? 'Combat started! Tap coordinates on radar.' : 'Player 1 fleet deployed!',
    }));
  };

  const handleAutoDeployP2 = () => {
    sounds.playMove?.();
    const fleet = autoPlaceFleet();
    setGameState((prev) => ({
      ...prev,
      p2: { ...prev.p2, grid: fleet.grid, ships: fleet.ships },
      phase: 'combat',
      turn: 0,
      lastLog: 'Both fleets ready! Player 1 fires first.',
    }));
    setShowPrivacyCurtain(false);
  };

  const handleFire = (r: number, c: number) => {
    if (gameState.phase !== 'combat' || currentPlayer.isBot) return;

    sounds.playClick?.();
    const nextState = fireShot(gameState, r, c);
    setGameState(nextState);

    if (nextState.winner !== null) {
      sounds.playVictory?.();
      setIsResultOpen(true);
    }
  };

  // Bot firing loop
  useEffect(() => {
    if (gameState.phase !== 'combat' || gameState.winner !== null) return;
    if (!currentPlayer.isBot) return;

    const timer = setTimeout(() => {
      const radar = gameState.turn === 0 ? gameState.p1.radar : gameState.p2.radar;
      const unshotCells: [number, number][] = [];
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (radar[r][c] === 'unknown') unshotCells.push([r, c]);
        }
      }

      if (unshotCells.length > 0) {
        const [r, c] = unshotCells[Math.floor(Math.random() * unshotCells.length)];
        sounds.playClick?.();
        const nextState = fireShot(gameState, r, c);
        setGameState(nextState);

        if (nextState.winner !== null) {
          sounds.playVictory?.();
          setIsResultOpen(true);
        }
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [gameState, currentPlayer]);

  const handleRestart = () => {
    setGameState(createInitialBattleshipState());
    setShowPrivacyCurtain(false);
    setIsResultOpen(false);
  };

  const handleSetupComplete = (players: PlayerConfig[], count: number, selectedTheme?: string) => {
    setPlayerConfigs(players.slice(0, 2));
    if (selectedTheme) {
      setTheme(selectedTheme as BattleshipTheme);
      StorageService.set('battleship_theme', selectedTheme);
    }
    setIsSetupOpen(false);
    handleRestart();
  };

  const winnerName = gameState.winner !== null ? playerConfigs[gameState.winner].name : null;

  return (
    <div className="py-4 px-3 sm:px-4 max-w-xl mx-auto space-y-4 animate-fadeIn">
      <GameHeader
        title="Battleship"
        icon="🚢"
        subtitle="2 Players • Secret Pass & Play Naval Combat"
        onRestart={handleRestart}
        onOpenSettings={() => setIsSetupOpen(true)}
      />

      {/* Phase Status */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-sky-400" />
            <span>{currentPlayer.name}</span>
          </div>
          <div className="text-[10px] text-slate-400">{gameState.lastLog}</div>
        </div>

        {gameState.phase === 'combat' && (
          <div className="flex gap-2 text-xs font-bold text-slate-300">
            {activeFleet.map((s) => (
              <span key={s.id} className={s.isSunk ? 'line-through text-red-500' : 'text-emerald-400'}>
                {s.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Privacy Handoff Curtain Modal */}
      {gameState.phase === 'handoff-p2' && (
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-4 shadow-2xl">
          <Shield className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
          <h2 className="text-xl font-black text-white">Pass Device to {playerConfigs[1].name}</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Keep your screen away from Player 1. Tap below when ready to deploy Player 2 fleet!
          </p>
          <button
            type="button"
            onClick={handleAutoDeployP2}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
          >
            I am Ready &rarr;
          </button>
        </div>
      )}

      {/* Fleet Deployment Controls */}
      {gameState.phase === 'placement-p1' && (
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-4 shadow-2xl">
          <h2 className="text-xl font-black text-white">Deploy Fleet Alpha</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Deploy your 3 naval vessels (Carrier, Cruiser, Submarine) across the 6x6 grid.
          </p>
          <button
            type="button"
            onClick={handleAutoDeployP1}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
          >
            Auto-Deploy Vessels &rarr;
          </button>
        </div>
      )}

      {/* Radar Combat Grid */}
      {gameState.phase === 'combat' && (
        <div className="p-3 sm:p-4 rounded-3xl bg-slate-900 border-4 border-slate-800 shadow-2xl max-w-[440px] w-full mx-auto select-none">
          <div className="grid grid-cols-6 gap-1.5 p-2 rounded-2xl bg-black/40 border border-sky-500/20 aspect-square shadow-inner">
            {activeRadar.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => handleFire(r, c)}
                  disabled={cell !== 'unknown' || currentPlayer.isBot}
                  className={`relative aspect-square rounded-xl flex items-center justify-center font-black transition-all ${
                    cell === 'unknown'
                      ? 'bg-slate-800/80 hover:bg-sky-500/30 border border-slate-700 hover:border-sky-400 cursor-pointer'
                      : cell === 'hit'
                      ? 'bg-red-500/30 border-2 border-red-500 text-red-400 shadow-md shadow-red-500/40'
                      : 'bg-sky-950/40 border border-sky-800/40 text-sky-400'
                  }`}
                >
                  {cell === 'hit' && '💥'}
                  {cell === 'miss' && '🌊'}
                  {cell === 'unknown' && <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Result Modal */}
      <GameResultModal
        isOpen={isResultOpen}
        winner={winnerName ? { name: winnerName, score: 1 } : null}
        onPlayAgain={handleRestart}
        onClose={() => setIsResultOpen(false)}
      />

      {/* Setup Modal */}
      <PlayerSetup
        isOpen={isSetupOpen}
        gameTitle="Battleship"
        minPlayers={2}
        maxPlayers={2}
        initialPlayers={playerConfigs}
        themes={THEMES}
        currentTheme={theme}
        onThemeChange={(t) => setTheme(t as BattleshipTheme)}
        onStart={handleSetupComplete}
        onClose={() => setIsSetupOpen(false)}
      />
    </div>
  );
}
