'use client';

import React, { useState, useEffect } from 'react';
import { GameHeader } from '@/components/games/GameHeader';
import { PlayerSetup, PlayerConfig, GameThemeOption } from '@/components/games/PlayerSetup';
import { GameResultModal } from '@/components/games/GameResultModal';
import { createInitialSOSState, applySOSMove } from '@/games/sos/logic';
import { SOSGameState, SOSTheme } from '@/games/sos/types';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';

const THEMES: GameThemeOption[] = [
  { id: 'notebook', name: 'Notebook Paper', icon: '📝', description: 'Blue ruled lines on paper' },
  { id: 'chalkboard', name: 'Classroom Chalkboard', icon: '🖍️', description: 'Vintage green school board' },
  { id: 'neon', name: 'Neon Grid', icon: '⚡', description: 'Dark glowing cyber grid' },
];

const DEFAULT_PLAYERS: PlayerConfig[] = [
  { name: 'Player 1 (Blue)', isBot: false },
  { name: 'Player 2 (Red) 🤖', isBot: true },
];

export default function SOSPage() {
  const [gameState, setGameState] = useState<SOSGameState>(() => createInitialSOSState(6));
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>(DEFAULT_PLAYERS);
  const [theme, setTheme] = useState<SOSTheme>('notebook');
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  useEffect(() => {
    const savedTheme = StorageService.get<SOSTheme>('sos_theme', 'notebook');
    setTheme(savedTheme);
  }, []);

  const currentPlayer = playerConfigs[gameState.turn];

  const handleCellClick = (r: number, c: number) => {
    if (gameState.grid[r][c] !== null || gameState.isGameOver || currentPlayer.isBot) return;

    sounds.playClick?.();
    const nextState = applySOSMove(gameState, r, c);
    setGameState(nextState);

    if (nextState.isGameOver) {
      sounds.playVictory?.();
      setIsResultOpen(true);
    }
  };

  // Bot AI
  useEffect(() => {
    if (gameState.isGameOver) return;
    if (!currentPlayer.isBot) return;

    const timer = setTimeout(() => {
      const emptyCells: [number, number][] = [];
      for (let r = 0; r < gameState.size; r++) {
        for (let c = 0; c < gameState.size; c++) {
          if (gameState.grid[r][c] === null) emptyCells.push([r, c]);
        }
      }

      if (emptyCells.length > 0) {
        const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        sounds.playClick?.();
        const nextState = applySOSMove(gameState, r, c);
        setGameState(nextState);

        if (nextState.isGameOver) {
          sounds.playVictory?.();
          setIsResultOpen(true);
        }
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [gameState, currentPlayer]);

  const handleRestart = () => {
    setGameState(createInitialSOSState(6));
    setIsResultOpen(false);
  };

  const handleSetupComplete = (players: PlayerConfig[], count: number, selectedTheme?: string) => {
    setPlayerConfigs(players.slice(0, 2));
    if (selectedTheme) {
      setTheme(selectedTheme as SOSTheme);
      StorageService.set('sos_theme', selectedTheme);
    }
    setIsSetupOpen(false);
    handleRestart();
  };

  const winner =
    gameState.winner === 0
      ? { name: playerConfigs[0].name, score: gameState.scores[0] }
      : gameState.winner === 1
      ? { name: playerConfigs[1].name, score: gameState.scores[1] }
      : null;

  return (
    <div className="py-4 px-3 sm:px-4 max-w-xl mx-auto space-y-4 animate-fadeIn">
      <GameHeader
        title="SOS Game"
        icon="✏️"
        subtitle="2 Players • Classic Pen & Paper Duel"
        onRestart={handleRestart}
        onOpenSettings={() => setIsSetupOpen(true)}
      />

      {/* Score & Turn Banner */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              gameState.turn === 0 ? 'bg-sky-400' : 'bg-rose-500'
            }`}
          />
          <div className="text-xs font-bold text-white">{currentPlayer.name}&apos;s Turn</div>
        </div>

        {/* S/O Selector */}
        <div className="flex gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
          {(['S', 'O'] as const).map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => {
                sounds.playClick?.();
                setGameState((prev) => ({ ...prev, selectedLetter: letter }));
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                gameState.selectedLetter === letter
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="flex gap-3 text-xs font-black">
          <span className="text-sky-400">P1: {gameState.scores[0]}</span>
          <span className="text-rose-400">P2: {gameState.scores[1]}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="p-3 sm:p-4 rounded-3xl bg-slate-900 border-4 border-slate-800 shadow-2xl max-w-[420px] w-full mx-auto select-none aspect-square">
        <div className="grid grid-cols-6 grid-rows-6 gap-1.5 w-full h-full p-2 bg-black/40 rounded-2xl border border-slate-700/50 shadow-inner">
          {gameState.grid.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => handleCellClick(r, c)}
                disabled={cell !== null || currentPlayer.isBot}
                className={`relative rounded-xl font-black text-xl sm:text-2xl flex items-center justify-center transition-all ${
                  cell === null
                    ? 'bg-slate-800/80 hover:bg-slate-700 border border-slate-700 cursor-pointer'
                    : 'bg-slate-950 border border-slate-800 text-white shadow-inner'
                }`}
              >
                {cell}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Result Modal */}
      <GameResultModal
        isOpen={isResultOpen}
        winner={winner}
        isDraw={gameState.winner === 'draw'}
        onPlayAgain={handleRestart}
        onClose={() => setIsResultOpen(false)}
      />

      {/* Setup Modal */}
      <PlayerSetup
        isOpen={isSetupOpen}
        gameTitle="SOS Game"
        minPlayers={2}
        maxPlayers={2}
        initialPlayers={playerConfigs}
        themes={THEMES}
        currentTheme={theme}
        onThemeChange={(t) => setTheme(t as SOSTheme)}
        onStart={handleSetupComplete}
        onClose={() => setIsSetupOpen(false)}
      />
    </div>
  );
}
