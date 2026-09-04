'use client';

import React, { useState, useEffect } from 'react';
import { GameHeader } from '@/components/games/GameHeader';
import { PlayerSetup, PlayerConfig, GameThemeOption } from '@/components/games/PlayerSetup';
import { GameResultModal } from '@/components/games/GameResultModal';
import { createInitialYahtzeeState, rollDice, calculatePotentialScore, getTotalScore } from '@/games/yahtzee/logic';
import { YahtzeeGameState, YahtzeeTheme, Category } from '@/games/yahtzee/types';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';

const THEMES: GameThemeOption[] = [
  { id: 'vegas', name: 'Vegas Velvet', icon: '🎰', description: 'Red casino velvet and golden dice' },
  { id: 'tavern', name: 'Tavern Wood', icon: '🪵', description: 'Rustic wooden pub tabletop' },
  { id: 'luxe', name: 'Golden Luxe', icon: '✨', description: 'High-roller polished black and gold' },
];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'ones', label: 'Ones' },
  { id: 'twos', label: 'Twos' },
  { id: 'threes', label: 'Threes' },
  { id: 'fours', label: 'Fours' },
  { id: 'fives', label: 'Fives' },
  { id: 'sixes', label: 'Sixes' },
  { id: 'threeOfAKind', label: '3 of a Kind' },
  { id: 'fourOfAKind', label: '4 of a Kind' },
  { id: 'fullHouse', label: 'Full House (25)' },
  { id: 'smallStraight', label: 'Small Straight (30)' },
  { id: 'largeStraight', label: 'Large Straight (40)' },
  { id: 'yahtzee', label: 'YAHTZEE (50)' },
  { id: 'chance', label: 'Chance' },
];

const DEFAULT_PLAYERS: PlayerConfig[] = [
  { name: 'Player 1', isBot: false },
  { name: 'Player 2 🤖', isBot: true },
];

export default function YahtzeePage() {
  const [gameState, setGameState] = useState<YahtzeeGameState>(() =>
    createInitialYahtzeeState(DEFAULT_PLAYERS)
  );
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>(DEFAULT_PLAYERS);
  const [theme, setTheme] = useState<YahtzeeTheme>('vegas');
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  useEffect(() => {
    const savedTheme = StorageService.get<YahtzeeTheme>('yahtzee_theme', 'vegas');
    setTheme(savedTheme);
  }, []);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  const handleRoll = () => {
    if (gameState.rollsLeft <= 0 || gameState.isRolling || gameState.isGameOver) return;

    sounds.playDice?.();
    setGameState((prev) => ({ ...prev, isRolling: true }));

    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        dice: rollDice(prev),
        rollsLeft: prev.rollsLeft - 1,
        isRolling: false,
      }));
    }, 400);
  };

  const handleToggleHold = (index: number) => {
    if (gameState.rollsLeft === 3 || gameState.isRolling) return;
    sounds.playClick?.();
    setGameState((prev) => {
      const nextHeld = [...prev.held] as [boolean, boolean, boolean, boolean, boolean];
      nextHeld[index] = !nextHeld[index];
      return { ...prev, held: nextHeld };
    });
  };

  const handleScoreCategory = (cat: Category) => {
    if (gameState.rollsLeft === 3) return; // must roll at least once
    if (currentPlayer.score[cat] !== undefined) return; // already scored

    sounds.playMove?.();
    const points = calculatePotentialScore(cat, gameState.dice);

    const nextPlayers = gameState.players.map((p, idx) =>
      idx === gameState.currentPlayerIndex
        ? { ...p, score: { ...p.score, [cat]: points } }
        : p
    );

    // Check game over (all players scored all 13 categories)
    const isGameOver = nextPlayers.every((p) => Object.keys(p.score).length >= 13);

    let winnerName: string | null = null;
    if (isGameOver) {
      const totals = nextPlayers.map((p) => ({ name: p.name, total: getTotalScore(p.score).total }));
      totals.sort((a, b) => b.total - a.total);
      winnerName = totals[0].name;
      sounds.playVictory?.();
      setIsResultOpen(true);
    }

    const nextIdx = (gameState.currentPlayerIndex + 1) % nextPlayers.length;

    setGameState({
      players: nextPlayers,
      currentPlayerIndex: nextIdx,
      dice: [1, 2, 3, 4, 5],
      held: [false, false, false, false, false],
      rollsLeft: 3,
      isRolling: false,
      isGameOver,
      winner: winnerName,
    });
  };

  // Bot play
  useEffect(() => {
    if (gameState.isGameOver) return;
    if (!currentPlayer?.isBot) return;

    if (gameState.rollsLeft > 0 && Math.random() < 0.7) {
      const timer = setTimeout(handleRoll, 600);
      return () => clearTimeout(timer);
    } else if (gameState.rollsLeft < 3) {
      const timer = setTimeout(() => {
        // Pick best available category
        const available = CATEGORIES.filter((c) => currentPlayer.score[c.id] === undefined);
        const scored = available.map((c) => ({
          cat: c.id,
          pts: calculatePotentialScore(c.id, gameState.dice),
        }));
        scored.sort((a, b) => b.pts - a.pts);
        if (scored.length > 0) {
          handleScoreCategory(scored[0].cat);
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [gameState, currentPlayer]);

  const handleRestart = () => {
    setGameState(createInitialYahtzeeState(playerConfigs));
    setIsResultOpen(false);
  };

  const handleSetupComplete = (players: PlayerConfig[], count: number, selectedTheme?: string) => {
    const selected = players.slice(0, count);
    setPlayerConfigs(selected);
    if (selectedTheme) {
      setTheme(selectedTheme as YahtzeeTheme);
      StorageService.set('yahtzee_theme', selectedTheme);
    }
    setGameState(createInitialYahtzeeState(selected));
    setIsSetupOpen(false);
  };

  return (
    <div className="py-4 px-3 sm:px-4 max-w-xl mx-auto space-y-4 animate-fadeIn">
      <GameHeader
        title="Yahtzee (Dice Poker)"
        icon="🎲✨"
        subtitle="2-4 Players • Classic 5-Dice Strategy"
        onRestart={handleRestart}
        onOpenSettings={() => setIsSetupOpen(true)}
      />

      {/* Turn & Roll Banner */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="text-xs font-bold text-white">{currentPlayer?.name}&apos;s Turn</div>
          <div className="text-[10px] text-slate-400">Rolls left: {gameState.rollsLeft} / 3</div>
        </div>

        <button
          type="button"
          onClick={handleRoll}
          disabled={gameState.rollsLeft <= 0 || gameState.isRolling || currentPlayer?.isBot}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            gameState.rollsLeft <= 0 || gameState.isRolling || currentPlayer?.isBot
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 shadow-md hover:scale-105 active:scale-95'
          }`}
        >
          {gameState.isRolling ? 'Rolling...' : gameState.rollsLeft === 3 ? 'Roll Dice' : 'Reroll'}
        </button>
      </div>

      {/* 5 Dice Rack */}
      <div className="flex justify-center gap-2 sm:gap-3 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        {gameState.dice.map((d, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleToggleHold(i)}
            className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center font-black text-2xl transition-all shadow-lg ${
              gameState.held[i]
                ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-95'
                : 'bg-white text-slate-900 border-2 border-slate-200 hover:scale-105'
            }`}
          >
            <span>{d}</span>
            {gameState.held[i] && (
              <span className="text-[9px] uppercase font-black tracking-widest text-slate-900">
                HOLD
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Scorecard Categories Table */}
      <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1 max-h-72 overflow-y-auto">
        {CATEGORIES.map((c) => {
          const scoredPts = currentPlayer?.score[c.id];
          const potential = gameState.rollsLeft < 3 ? calculatePotentialScore(c.id, gameState.dice) : 0;
          const isScored = scoredPts !== undefined;

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleScoreCategory(c.id)}
              disabled={isScored || gameState.rollsLeft === 3 || currentPlayer?.isBot}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                isScored
                  ? 'bg-slate-800/40 text-slate-400 cursor-default'
                  : gameState.rollsLeft < 3
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-white cursor-pointer'
                  : 'bg-slate-900/40 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span className="font-bold">{c.label}</span>
              <span className="font-black text-sm">
                {isScored ? scoredPts : gameState.rollsLeft < 3 ? `+${potential}` : '-'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Result Modal */}
      <GameResultModal
        isOpen={isResultOpen}
        winner={gameState.winner ? { name: gameState.winner, score: 1 } : null}
        onPlayAgain={handleRestart}
        onClose={() => setIsResultOpen(false)}
      />

      {/* Setup Modal */}
      <PlayerSetup
        isOpen={isSetupOpen}
        gameTitle="Yahtzee"
        minPlayers={2}
        maxPlayers={4}
        initialPlayers={playerConfigs}
        themes={THEMES}
        currentTheme={theme}
        onThemeChange={(t) => setTheme(t as YahtzeeTheme)}
        onStart={handleSetupComplete}
        onClose={() => setIsSetupOpen(false)}
      />
    </div>
  );
}
