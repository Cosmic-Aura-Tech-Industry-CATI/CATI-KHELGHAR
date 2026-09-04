'use client';

import React, { useState, useEffect } from 'react';
import { GameHeader } from '@/components/games/GameHeader';
import { PlayerSetup, PlayerConfig, GameThemeOption } from '@/components/games/PlayerSetup';
import { GameResultModal } from '@/components/games/GameResultModal';
import { AshtaBoardView } from '@/games/ashta-chamma/Board';
import {
  createInitialAshtaState,
  rollCowrieShells,
  getValidAshtaMoves,
  applyAshtaMove,
} from '@/games/ashta-chamma/logic';
import { AshtaGameState, AshtaTheme } from '@/games/ashta-chamma/types';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';

const THEMES: GameThemeOption[] = [
  { id: 'terracotta', name: 'Terracotta Village', icon: '🏺', description: 'Traditional rustic clay pottery' },
  { id: 'haveli', name: 'Royal Haveli', icon: '🏰', description: 'Indigo blue royal courtyard' },
  { id: 'sandalwood', name: 'Sandalwood Temple', icon: '🪵', description: 'Aromatic carved wood board' },
];

const DEFAULT_PLAYERS: PlayerConfig[] = [
  { name: 'Red', isBot: false },
  { name: 'Green 🤖', isBot: true },
];

export default function AshtaChammaPage() {
  const [gameState, setGameState] = useState<AshtaGameState>(() =>
    createInitialAshtaState(DEFAULT_PLAYERS)
  );
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>(DEFAULT_PLAYERS);
  const [theme, setTheme] = useState<AshtaTheme>('terracotta');
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  useEffect(() => {
    const savedTheme = StorageService.get<AshtaTheme>('ashta_theme', 'terracotta');
    setTheme(savedTheme);
  }, []);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  const handleRoll = () => {
    if (gameState.hasRolled || gameState.isRolling || gameState.winners.length > 0) return;

    sounds.playDice?.();
    setGameState((prev) => ({ ...prev, isRolling: true }));

    setTimeout(() => {
      const rollResult = rollCowrieShells();
      setGameState((prev) => {
        const temp = {
          ...prev,
          shells: rollResult.shells,
          rollValue: rollResult.value,
          isRolling: false,
          hasRolled: true,
        };
        const moves = getValidAshtaMoves(temp);

        // Auto pass if no moves
        if (moves.length === 0) {
          const nextIdx = (temp.currentPlayerIndex + 1) % temp.players.length;
          return {
            ...temp,
            validMoves: [],
            hasRolled: false,
            rollValue: null,
            currentPlayerIndex: nextIdx,
            lastLog: `${currentPlayer.name} rolled ${rollResult.value} — no moves available.`,
          };
        }

        return { ...temp, validMoves: moves };
      });
    }, 500);
  };

  const handleTokenClick = (tokenId: string) => {
    const move = gameState.validMoves.find((m) => m.tokenId === tokenId);
    if (!move) return;

    if (move.isCapture) sounds.playCapture?.();
    else sounds.playMove?.();

    const nextState = applyAshtaMove(gameState, move);
    setGameState(nextState);

    if (nextState.winners.length > 0) {
      sounds.playVictory?.();
      setIsResultOpen(true);
    }
  };

  // Bot AI
  useEffect(() => {
    if (gameState.winners.length > 0) return;
    if (!currentPlayer?.isBot) return;

    if (!gameState.hasRolled && !gameState.isRolling) {
      const t = setTimeout(handleRoll, 700);
      return () => clearTimeout(t);
    }

    if (gameState.hasRolled && gameState.validMoves.length > 0) {
      const t = setTimeout(() => {
        // Pick capture > advance
        const move =
          gameState.validMoves.find((m) => m.isCapture) ||
          gameState.validMoves.find((m) => m.isFinished) ||
          gameState.validMoves[0];
        handleTokenClick(move.tokenId);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [gameState, currentPlayer]);

  const handleRestart = () => {
    setGameState(createInitialAshtaState(playerConfigs));
    setIsResultOpen(false);
  };

  const handleSetupComplete = (players: PlayerConfig[], count: number, selectedTheme?: string) => {
    const selected = players.slice(0, count);
    setPlayerConfigs(selected);
    if (selectedTheme) {
      setTheme(selectedTheme as AshtaTheme);
      StorageService.set('ashta_theme', selectedTheme);
    }
    setGameState(createInitialAshtaState(selected));
    setIsSetupOpen(false);
  };

  const winner = gameState.winners.length > 0
    ? gameState.players.find((p) => p.id === gameState.winners[0])
    : null;

  return (
    <div className="py-4 px-3 sm:px-4 max-w-xl mx-auto space-y-4 animate-fadeIn">
      <GameHeader
        title="Ashta Chamma (Chauka Bara)"
        icon="🐚"
        subtitle="2-4 Players • Ancient Indian Cowrie Race"
        onRestart={handleRestart}
        onOpenSettings={() => setIsSetupOpen(true)}
      />

      {/* Roll & Status Bar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <span
              className={`w-3 h-3 rounded-full ${
                currentPlayer?.color === 'red'
                  ? 'bg-red-500'
                  : currentPlayer?.color === 'green'
                  ? 'bg-emerald-500'
                  : currentPlayer?.color === 'yellow'
                  ? 'bg-amber-400'
                  : 'bg-sky-500'
              }`}
            />
            <span>{currentPlayer?.name}&apos;s Turn</span>
          </div>
          <div className="text-[10px] text-slate-400">{gameState.lastLog}</div>
        </div>

        {/* Cowrie Shells & Roll Button */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {gameState.shells.map((s, i) => (
              <span
                key={i}
                className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black shadow-sm ${
                  s === 1
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-amber-800 text-amber-200 border border-amber-950'
                }`}
                title={s === 1 ? 'Open Shell' : 'Closed Shell'}
              >
                {s === 1 ? '🐚' : '●'}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={handleRoll}
            disabled={gameState.hasRolled || gameState.isRolling || currentPlayer?.isBot}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              gameState.hasRolled || gameState.isRolling || currentPlayer?.isBot
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md hover:scale-105 active:scale-95'
            }`}
          >
            {gameState.isRolling ? '...' : gameState.rollValue ? `Rolled ${gameState.rollValue}` : 'Roll Shells'}
          </button>
        </div>
      </div>

      {/* Board */}
      <AshtaBoardView
        gameState={gameState}
        theme={theme}
        onTokenClick={handleTokenClick}
      />

      {/* Yard Tokens Bar */}
      <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-around text-xs">
        {gameState.players.map((p) => {
          const yardTokens = p.tokens.filter((t) => t.stepIndex === -1);
          const finishedTokens = p.tokens.filter((t) => t.stepIndex === 24);
          return (
            <div key={p.id} className="text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 block">{p.name}</span>
              <div className="flex gap-1 justify-center">
                {yardTokens.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTokenClick(t.id)}
                    disabled={!gameState.validMoves.some((m) => m.tokenId === t.id)}
                    className={`w-5 h-5 rounded-full border ${
                      p.color === 'red'
                        ? 'bg-red-500 border-red-300'
                        : p.color === 'green'
                        ? 'bg-emerald-500 border-emerald-300'
                        : p.color === 'yellow'
                        ? 'bg-amber-400 border-amber-200'
                        : 'bg-sky-500 border-sky-300'
                    } ${
                      gameState.validMoves.some((m) => m.tokenId === t.id)
                        ? 'ring-2 ring-amber-300 animate-bounce cursor-pointer'
                        : 'opacity-60'
                    }`}
                  />
                ))}
                {finishedTokens.map((t) => (
                  <span key={t.id} className="text-xs">⭐</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Result Modal */}
      <GameResultModal
        isOpen={isResultOpen}
        winner={winner ? { name: winner.name, score: 1 } : null}
        onPlayAgain={handleRestart}
        onClose={() => setIsResultOpen(false)}
      />

      {/* Setup Modal */}
      <PlayerSetup
        isOpen={isSetupOpen}
        gameTitle="Ashta Chamma"
        minPlayers={2}
        maxPlayers={4}
        initialPlayers={playerConfigs}
        themes={THEMES}
        currentTheme={theme}
        onThemeChange={(t) => setTheme(t as AshtaTheme)}
        onStart={handleSetupComplete}
        onClose={() => setIsSetupOpen(false)}
      />
    </div>
  );
}
