'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameHeader } from '@/components/games/GameHeader';
import { GameResultModal } from '@/components/games/GameResultModal';
import { PlayerSetup, PlayerConfig, GameThemeOption } from '@/components/games/PlayerSetup';
import { TTTBoard } from '@/games/tic-tac-toe/Board';
import {
  createInitialTTTState,
  makeTTTMove,
  resetTTTRound,
  resetTTTMatch,
  getBestTTTMove
} from '@/games/tic-tac-toe/logic';
import { TTTGameState, TTTMatchMode, TTTTheme } from '@/games/tic-tac-toe/types';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';

const TTT_THEMES: GameThemeOption[] = [
  {
    id: 'voxel',
    name: 'Block Craft',
    icon: '💎',
    description: 'Minecraft Grass & Diamond Blocks'
  },
  {
    id: 'wood',
    name: 'Classic Wood',
    icon: '🪵',
    description: 'Walnut Wood & Ivory Porcelain'
  },
  {
    id: 'neon',
    name: 'Cyber Neon',
    icon: '⚡',
    description: 'Glowing Cyan & Rose Grid'
  }
];

export default function TicTacToePage() {
  const [theme, setTheme] = useState<TTTTheme>('voxel');

  const [gameState, setGameState] = useState<TTTGameState>(() =>
    createInitialTTTState(
      { name: 'Player 1', isBot: false },
      { name: 'Bot Alpha 🤖', isBot: true },
      'unlimited'
    )
  );
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [mode, setMode] = useState<TTTMatchMode>('unlimited');

  const botTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load configured players & theme from storage on mount
  useEffect(() => {
    const savedTheme = StorageService.get<TTTTheme>('ttt_theme', 'voxel');
    setTheme(savedTheme);

    const saved = StorageService.getPlayerConfigs('tic-tac-toe', [
      { name: 'Player 1', isBot: false },
      { name: 'Bot Alpha 🤖', isBot: true }
    ]);
    if (saved && saved.length >= 2) {
      setGameState(createInitialTTTState(saved[0], saved[1], 'unlimited'));
    }
  }, []);

  const handleThemeChange = (newThemeId: string) => {
    const newTheme = newThemeId as TTTTheme;
    setTheme(newTheme);
    StorageService.set('ttt_theme', newTheme);
  };

  const activePlayer =
    gameState.turn === 'X' ? gameState.players[0] : gameState.players[1];

  // Trigger AI Bot Move when activePlayer is a bot
  useEffect(() => {
    if (gameState.isGameOver || !activePlayer.isBot) return;

    botTimerRef.current = setTimeout(() => {
      const bestMove = getBestTTTMove(gameState.board, activePlayer.symbol);
      if (bestMove !== -1) {
        handleCellClick(bestMove);
      }
    }, 550);

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [gameState.turn, gameState.isGameOver, activePlayer.isBot, gameState.board]);

  const handleCellClick = (idx: number) => {
    if (gameState.board[idx] || gameState.isGameOver) return;

    sounds.playClick();
    const nextState = makeTTTMove(gameState, idx);
    setGameState(nextState);

    if (nextState.isGameOver) {
      if (nextState.winner === 'X' || nextState.winner === 'O') {
        sounds.playVictory();
        const winName =
          nextState.winner === 'X'
            ? nextState.players[0].name
            : nextState.players[1].name;
        StorageService.recordMatch('tic-tac-toe', winName);
      } else {
        sounds.playClick();
        StorageService.recordMatch('tic-tac-toe', 'Draw');
      }
      setTimeout(() => setShowResultModal(true), 600);
    }
  };

  const handleNextRound = () => {
    setShowResultModal(false);
    if (gameState.matchWinner) {
      setGameState(resetTTTMatch(gameState));
    } else {
      setGameState(resetTTTRound(gameState));
    }
  };

  const handleRestartMatch = () => {
    setShowResultModal(false);
    setGameState(resetTTTMatch(gameState));
  };

  const handleSetupComplete = (
    players: PlayerConfig[],
    _count: number,
    selectedTheme?: string
  ) => {
    if (selectedTheme) {
      handleThemeChange(selectedTheme);
    }
    StorageService.savePlayerConfigs('tic-tac-toe', players);
    setGameState(createInitialTTTState(players[0], players[1], mode));
    setIsSetupOpen(false);
  };

  // Helper for piece badges based on theme
  const getPieceBadge = (symbol: 'X' | 'O') => {
    if (theme === 'voxel') {
      return symbol === 'X'
        ? { label: '💎 Diamond X', bg: 'bg-[#1b6460] text-[#70ffff] border-[#4dedea]' }
        : { label: '🧱 Stone O', bg: 'bg-[#3b3b3b] text-[#d6d6d6] border-[#7d7d7d]' };
    }
    if (theme === 'neon') {
      return symbol === 'X'
        ? { label: '⚡ Cyan X', bg: 'bg-cyan-950 text-cyan-300 border-cyan-500' }
        : { label: '🌸 Rose O', bg: 'bg-rose-950 text-rose-300 border-rose-500' };
    }
    return symbol === 'X'
      ? { label: 'Charcoal X', bg: 'bg-[#181b20] text-slate-200 border-slate-700' }
      : { label: 'Terracotta O', bg: 'bg-[#d33420] text-white border-red-400' };
  };

  const activeThemeObj = TTT_THEMES.find(t => t.id === theme) || TTT_THEMES[0];

  return (
    <div className="py-6 px-4 max-w-lg mx-auto space-y-5 animate-fadeIn">
      {/* Top Header */}
      <GameHeader
        title="Tic Tac Toe"
        icon="❌⭕"
        subtitle={`Theme: ${activeThemeObj.icon} ${activeThemeObj.name} • Tap ⚙️ to change`}
        onRestart={handleRestartMatch}
        onOpenSettings={() => setIsSetupOpen(true)}
      />

      {/* Players Scoreboard & Active Turn Badge */}
      <div className="grid grid-cols-2 gap-3">
        {gameState.players.map(p => {
          const isTurn = gameState.turn === p.symbol && !gameState.isGameOver;
          const badge = getPieceBadge(p.symbol);

          return (
            <div
              key={p.id}
              className={`p-3.5 rounded-2xl border transition-all select-none ${
                isTurn
                  ? 'bg-[#2b1b11] border-amber-500 ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/10 scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 opacity-85'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-lg flex items-center justify-center font-black text-xs shadow-md border ${badge.bg}`}
                  >
                    {p.symbol}
                  </span>
                  <div className="truncate max-w-[90px]">
                    <span className="font-bold text-xs text-white block truncate">
                      {p.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold block leading-none truncate">
                      {badge.label}
                    </span>
                  </div>
                </div>
                <span className="text-xl font-black text-amber-400">{p.score}</span>
              </div>
              {isTurn && (
                <div className="text-[10px] font-black text-amber-400 mt-2 flex items-center gap-1">
                  <span>{p.isBot ? '🤖 Thinking...' : '👉 Your Turn'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Themed Game Board */}
      <div className="py-2">
        <TTTBoard
          board={gameState.board}
          winResult={gameState.winResult}
          isGameOver={gameState.isGameOver}
          theme={theme}
          onCellClick={handleCellClick}
        />
      </div>

      {/* Turn Action Status */}
      <div className="text-center bg-slate-900/60 border border-slate-800/80 py-2.5 px-4 rounded-2xl">
        <p className="text-xs font-bold text-slate-300">
          {gameState.isGameOver
            ? gameState.winner === 'Draw'
              ? "🤝 It's a draw! Tap Play Again below."
              : `👑 ${gameState.winner === 'X' ? gameState.players[0].name : gameState.players[1].name} wins this round!`
            : `Turn: ${activePlayer.name} (${getPieceBadge(activePlayer.symbol).label})`}
        </p>
      </div>

      {/* Setup / Settings Modal with Theme Selection */}
      <PlayerSetup
        isOpen={isSetupOpen}
        gameTitle="Tic Tac Toe"
        minPlayers={2}
        maxPlayers={2}
        initialPlayers={gameState.players.map(p => ({
          name: p.name,
          isBot: !!p.isBot
        }))}
        themes={TTT_THEMES}
        currentTheme={theme}
        onThemeChange={handleThemeChange}
        onStart={handleSetupComplete}
        onClose={() => setIsSetupOpen(false)}
      />

      {/* Result Celebration Modal */}
      <GameResultModal
        isOpen={showResultModal}
        winnerName={
          gameState.winner === 'X'
            ? gameState.players[0].name
            : gameState.winner === 'O'
            ? gameState.players[1].name
            : null
        }
        isDraw={gameState.winner === 'Draw'}
        onPlayAgain={handleNextRound}
      />
    </div>
  );
}
