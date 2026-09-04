'use client';

import React, { useState, useEffect } from 'react';
import { GameHeader } from '@/components/games/GameHeader';
import { PlayerSetup, PlayerConfig, GameThemeOption } from '@/components/games/PlayerSetup';
import { GameResultModal } from '@/components/games/GameResultModal';
import { MancalaBoardView } from '@/games/mancala/Board';
import { createInitialMancalaState, applyMancalaMove, getBestMancalaBotMove } from '@/games/mancala/logic';
import { MancalaGameState, MancalaTheme } from '@/games/mancala/types';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';

const THEMES: GameThemeOption[] = [
  { id: 'teak', name: 'African Teak', icon: '🪵', description: 'Carved natural dark teak wood' },
  { id: 'zen', name: 'Zen Stone Pond', icon: '🪨', description: 'Polished slate and glowing pebbles' },
  { id: 'gold', name: 'Golden Temple', icon: '✨', description: 'Rich amber and golden lacquer' },
];

const DEFAULT_PLAYERS: PlayerConfig[] = [
  { name: 'Player 1', isBot: false },
  { name: 'Player 2 🤖', isBot: true },
];

export default function MancalaPage() {
  const [gameState, setGameState] = useState<MancalaGameState>(createInitialMancalaState);
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>(DEFAULT_PLAYERS);
  const [theme, setTheme] = useState<MancalaTheme>('teak');
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  useEffect(() => {
    const savedTheme = StorageService.get<MancalaTheme>('mancala_theme', 'teak');
    setTheme(savedTheme);
  }, []);

  const currentPlayer = playerConfigs[gameState.turn];

  const handlePitClick = (pitIdx: number) => {
    if (gameState.isGameOver || currentPlayer.isBot) return;

    sounds.playMove?.();
    const nextState = applyMancalaMove(gameState, pitIdx);
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
      const bestPit = getBestMancalaBotMove(gameState);
      if (bestPit !== null) {
        sounds.playMove?.();
        const nextState = applyMancalaMove(gameState, bestPit);
        setGameState(nextState);

        if (nextState.isGameOver) {
          sounds.playVictory?.();
          setIsResultOpen(true);
        }
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [gameState, currentPlayer]);

  const handleRestart = () => {
    setGameState(createInitialMancalaState());
    setIsResultOpen(false);
  };

  const handleSetupComplete = (players: PlayerConfig[], count: number, selectedTheme?: string) => {
    setPlayerConfigs(players.slice(0, 2));
    if (selectedTheme) {
      setTheme(selectedTheme as MancalaTheme);
      StorageService.set('mancala_theme', selectedTheme);
    }
    setIsSetupOpen(false);
    handleRestart();
  };

  const winner =
    gameState.winner === 0
      ? { name: playerConfigs[0].name, score: gameState.pits[6] }
      : gameState.winner === 1
      ? { name: playerConfigs[1].name, score: gameState.pits[13] }
      : null;

  return (
    <div className="py-4 px-3 sm:px-4 max-w-xl mx-auto space-y-4 animate-fadeIn">
      <GameHeader
        title="Mancala (Kalah)"
        icon="🪨"
        subtitle="2 Players • Ancient Pit & Pebble Sowing"
        onRestart={handleRestart}
        onOpenSettings={() => setIsSetupOpen(true)}
      />

      {/* Status Banner */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>{currentPlayer.name}&apos;s Turn</span>
            {gameState.extraTurn && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                FREE TURN!
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-400">{gameState.lastLog}</div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="text-amber-400">P1 Seeds: {gameState.pits[6]}</div>
          <div className="text-sky-400">P2 Seeds: {gameState.pits[13]}</div>
        </div>
      </div>

      {/* Board */}
      <MancalaBoardView
        gameState={gameState}
        theme={theme}
        onPitClick={handlePitClick}
      />

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
        gameTitle="Mancala"
        minPlayers={2}
        maxPlayers={2}
        initialPlayers={playerConfigs}
        themes={THEMES}
        currentTheme={theme}
        onThemeChange={(t) => setTheme(t as MancalaTheme)}
        onStart={handleSetupComplete}
        onClose={() => setIsSetupOpen(false)}
      />
    </div>
  );
}
