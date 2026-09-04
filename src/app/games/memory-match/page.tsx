'use client';

import React, { useState, useEffect } from 'react';
import { GameHeader } from '@/components/games/GameHeader';
import { PlayerSetup, PlayerConfig, GameThemeOption } from '@/components/games/PlayerSetup';
import { GameResultModal } from '@/components/games/GameResultModal';
import { createInitialMemoryState } from '@/games/memory-match/logic';
import { MemoryGameState, MemoryTheme } from '@/games/memory-match/types';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';

const THEMES: GameThemeOption[] = [
  { id: 'wildlife', name: 'Indian Wildlife', icon: '🐅', description: 'Tigers, peacocks & elephants' },
  { id: 'gems', name: 'Royal Gems', icon: '💎', description: 'Sparkling treasures and amulets' },
  { id: 'emojis', name: 'Pop Emojis', icon: '🚀', description: 'Fun colorful pop culture icons' },
];

const DEFAULT_PLAYERS: PlayerConfig[] = [
  { name: 'Player 1', isBot: false },
  { name: 'Player 2 🤖', isBot: true },
];

export default function MemoryMatchPage() {
  const [gameState, setGameState] = useState<MemoryGameState>(() =>
    createInitialMemoryState(DEFAULT_PLAYERS, 'wildlife')
  );
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>(DEFAULT_PLAYERS);
  const [theme, setTheme] = useState<MemoryTheme>('wildlife');
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  useEffect(() => {
    const savedTheme = StorageService.get<MemoryTheme>('memory_theme', 'wildlife');
    setTheme(savedTheme);
  }, []);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  const handleCardClick = (cardId: number) => {
    if (gameState.isLocked || gameState.isGameOver) return;

    const card = gameState.cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    sounds.playClick?.();

    const nextCards = gameState.cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    const nextFlipped = [...gameState.flippedCardIds, cardId];

    if (nextFlipped.length === 2) {
      const [id1, id2] = nextFlipped;
      const c1 = nextCards.find((c) => c.id === id1)!;
      const c2 = nextCards.find((c) => c.id === id2)!;

      if (c1.symbol === c2.symbol) {
        // MATCH!
        sounds.playCapture?.();
        const matchedCards = nextCards.map((c) =>
          c.id === id1 || c.id === id2 ? { ...c, isMatched: true } : c
        );
        const nextPlayers = gameState.players.map((p, idx) =>
          idx === gameState.currentPlayerIndex ? { ...p, score: p.score + 1 } : p
        );

        const allMatched = matchedCards.every((c) => c.isMatched);
        let winnerName: string | null = null;
        if (allMatched) {
          const sorted = [...nextPlayers].sort((a, b) => b.score - a.score);
          winnerName = sorted[0].name;
          sounds.playVictory?.();
          setIsResultOpen(true);
        }

        setGameState({
          ...gameState,
          cards: matchedCards,
          players: nextPlayers,
          flippedCardIds: [],
          isGameOver: allMatched,
          winner: winnerName,
        });
      } else {
        // MISMATCH
        setGameState({
          ...gameState,
          cards: nextCards,
          flippedCardIds: nextFlipped,
          isLocked: true,
        });

        setTimeout(() => {
          setGameState((prev) => ({
            ...prev,
            cards: prev.cards.map((c) =>
              c.id === id1 || c.id === id2 ? { ...c, isFlipped: false } : c
            ),
            flippedCardIds: [],
            isLocked: false,
            currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
          }));
        }, 900);
      }
    } else {
      setGameState({
        ...gameState,
        cards: nextCards,
        flippedCardIds: nextFlipped,
      });
    }
  };

  // Bot AI
  useEffect(() => {
    if (gameState.isGameOver || gameState.isLocked) return;
    if (!currentPlayer?.isBot) return;

    const timer = setTimeout(() => {
      const unflipped = gameState.cards.filter((c) => !c.isFlipped && !c.isMatched);
      if (unflipped.length > 0) {
        const randomCard = unflipped[Math.floor(Math.random() * unflipped.length)];
        handleCardClick(randomCard.id);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [gameState, currentPlayer]);

  const handleRestart = () => {
    setGameState(createInitialMemoryState(playerConfigs, theme));
    setIsResultOpen(false);
  };

  const handleSetupComplete = (players: PlayerConfig[], count: number, selectedTheme?: string) => {
    const selected = players.slice(0, count);
    const chosenTheme = (selectedTheme as MemoryTheme) || theme;
    setPlayerConfigs(selected);
    if (selectedTheme) {
      setTheme(chosenTheme);
      StorageService.set('memory_theme', chosenTheme);
    }
    setGameState(createInitialMemoryState(selected, chosenTheme));
    setIsSetupOpen(false);
  };

  return (
    <div className="py-4 px-3 sm:px-4 max-w-xl mx-auto space-y-4 animate-fadeIn">
      <GameHeader
        title="Memory Match"
        icon="🃏"
        subtitle="2-4 Players • Flip & Pair Family Fun"
        onRestart={handleRestart}
        onOpenSettings={() => setIsSetupOpen(true)}
      />

      {/* Turn & Score Banner */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="text-xs font-bold text-white">{currentPlayer?.name}&apos;s Turn</div>
        <div className="flex gap-3 text-xs font-black text-amber-400">
          {gameState.players.map((p) => (
            <span key={p.id}>
              {p.name}: {p.score}
            </span>
          ))}
        </div>
      </div>

      {/* 4x4 Grid of 16 Cards */}
      <div className="p-3 sm:p-4 rounded-3xl bg-slate-900 border-4 border-slate-800 shadow-2xl max-w-[420px] w-full mx-auto select-none aspect-square">
        <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full">
          {gameState.cards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || card.isMatched || gameState.isLocked || currentPlayer?.isBot}
              className={`relative rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl transition-all duration-300 shadow-md ${
                card.isFlipped || card.isMatched
                  ? 'bg-slate-800 border-2 border-amber-400 text-white scale-95'
                  : 'bg-gradient-to-br from-cyan-600 to-blue-700 border-2 border-cyan-400 text-transparent hover:scale-105 cursor-pointer shadow-cyan-950/50'
              } ${card.isMatched ? 'opacity-40 border-emerald-500' : ''}`}
            >
              {card.isFlipped || card.isMatched ? card.symbol : '❓'}
            </button>
          ))}
        </div>
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
        gameTitle="Memory Match"
        minPlayers={2}
        maxPlayers={4}
        initialPlayers={playerConfigs}
        themes={THEMES}
        currentTheme={theme}
        onThemeChange={(t) => setTheme(t as MemoryTheme)}
        onStart={handleSetupComplete}
        onClose={() => setIsSetupOpen(false)}
      />
    </div>
  );
}
