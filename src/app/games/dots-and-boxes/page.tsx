'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameHeader } from '@/components/games/GameHeader';
import { GameResultModal } from '@/components/games/GameResultModal';
import { PlayerSetup, PlayerConfig } from '@/components/games/PlayerSetup';
import { DotsBoard } from '@/games/dots-and-boxes/Board';
import {
  createInitialDotsState,
  claimLine,
  getBestDotsMove
} from '@/games/dots-and-boxes/logic';
import { DotsGameState } from '@/games/dots-and-boxes/types';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';

export default function DotsAndBoxesPage() {
  const [gridSize, setGridSize] = useState<number>(3);
  const [gameState, setGameState] = useState<DotsGameState>(() =>
    createInitialDotsState(2, 3, [
      { name: 'Player 1', isBot: false },
      { name: 'Bot Alpha 🤖', isBot: true }
    ])
  );
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  const botActionTimer = useRef<NodeJS.Timeout | null>(null);

  // Load configured players from storage on mount
  useEffect(() => {
    const saved = StorageService.getPlayerConfigs('dots-and-boxes', [
      { name: 'Player 1', isBot: false },
      { name: 'Bot Alpha 🤖', isBot: true }
    ]);
    if (saved && saved.length >= 2) {
      setGameState(createInitialDotsState(saved.length, gridSize, saved));
    }
  }, [gridSize]);

  const activePlayer = gameState.players[gameState.currentTurnIndex];

  // AI Bot Auto-Draw Loop
  useEffect(() => {
    if (gameState.isGameOver || !activePlayer?.isBot) return;

    botActionTimer.current = setTimeout(() => {
      const bestLine = getBestDotsMove(gameState);
      if (bestLine) {
        handleLineClick(bestLine);
      }
    }, 600);

    return () => {
      if (botActionTimer.current) clearTimeout(botActionTimer.current);
    };
  }, [gameState.currentTurnIndex, gameState.isGameOver, activePlayer?.isBot, gameState.claimedLines]);

  const handleLineClick = (lineKey: string) => {
    if (gameState.isGameOver) return;

    const { nextState, boxesCaptured } = claimLine(gameState, lineKey);
    if (boxesCaptured > 0) {
      sounds.playCapture();
    } else {
      sounds.playClick();
    }

    setGameState(nextState);

    if (nextState.isGameOver) {
      if (nextState.winner) {
        sounds.playVictory();
        StorageService.recordMatch('dots-and-boxes', nextState.winner.name);
      } else {
        sounds.playClick();
        StorageService.recordMatch('dots-and-boxes', 'Draw');
      }
      setTimeout(() => setShowResultModal(true), 700);
    }
  };

  const handleRestart = () => {
    setShowResultModal(false);
    setGameState(
      createInitialDotsState(
        gameState.players.length,
        gridSize,
        gameState.players.map(p => ({ name: p.name, isBot: p.isBot }))
      )
    );
  };

  const handleGridSizeChange = (size: number) => {
    setGridSize(size);
    setGameState(
      createInitialDotsState(
        gameState.players.length,
        size,
        gameState.players.map(p => ({ name: p.name, isBot: p.isBot }))
      )
    );
  };

  const handleSetupComplete = (players: PlayerConfig[], count: number) => {
    StorageService.savePlayerConfigs('dots-and-boxes', players);
    setGameState(createInitialDotsState(count, gridSize, players));
    setIsSetupOpen(false);
  };

  return (
    <div className="py-6 px-4 max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <GameHeader
        title="Dots & Boxes"
        icon="✏️📦"
        subtitle={`${gameState.players.length} Players • Complete Boxes to Score • Play with Friends or AI`}
        onRestart={handleRestart}
        onOpenSettings={() => setIsSetupOpen(true)}
      />

      {/* Grid Size Switcher */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-xs font-bold text-slate-400">Board Grid:</span>
        <div className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-1">
          <button
            type="button"
            onClick={() => handleGridSizeChange(3)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              gridSize === 3
                ? 'bg-orange-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3x3 (Fast)
          </button>
          <button
            type="button"
            onClick={() => handleGridSizeChange(4)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              gridSize === 4
                ? 'bg-orange-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            4x4 (Tactical)
          </button>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {gameState.players.map((p, idx) => {
          const isTurn = idx === gameState.currentTurnIndex && !gameState.isGameOver;

          return (
            <div
              key={p.id}
              className={`p-3 rounded-2xl border transition-all select-none ${
                isTurn
                  ? 'bg-slate-800/90 border-amber-400 ring-2 ring-amber-400/30 shadow-lg scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-sm">{p.avatar}</span>
                  <div className="truncate max-w-[80px]">
                    <span className="text-xs font-bold text-white block truncate">
                      {p.name}
                    </span>
                    {p.isBot && (
                      <span className="text-[9px] text-purple-400 font-bold block leading-none">
                        AI Bot
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-lg font-black text-amber-400">{p.score}</span>
              </div>
              {isTurn && (
                <div className="text-[10px] font-black text-amber-400 mt-1.5 flex items-center gap-1">
                  <span>{p.isBot ? '🤖 Thinking...' : '👉 Drawing'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dots Board */}
      <DotsBoard
        gridSize={gameState.gridSize}
        players={gameState.players}
        claimedLines={gameState.claimedLines}
        claimedBoxes={gameState.claimedBoxes}
        currentTurnIndex={gameState.currentTurnIndex}
        isGameOver={gameState.isGameOver}
        onLineClick={handleLineClick}
      />

      {/* Activity Status */}
      <div className="text-center bg-slate-900/60 border border-slate-800/80 py-2.5 px-4 rounded-2xl">
        <p className="text-xs font-bold text-slate-300">
          {gameState.isGameOver
            ? gameState.isDraw
              ? "🤝 It's a tie match!"
              : `👑 ${gameState.winner?.name} captured the most boxes and won!`
            : `Turn: ${activePlayer?.name} (${activePlayer?.isBot ? 'AI Bot is picking a line...' : 'Tap any glowing dashed line to draw'})`}
        </p>
      </div>

      {/* Setup Modal */}
      <PlayerSetup
        isOpen={isSetupOpen}
        gameTitle="Dots & Boxes"
        minPlayers={2}
        maxPlayers={4}
        initialPlayers={gameState.players.map(p => ({
          name: p.name,
          isBot: !!p.isBot
        }))}
        onStart={handleSetupComplete}
        onClose={() => setIsSetupOpen(false)}
      />

      {/* Result Modal */}
      <GameResultModal
        isOpen={showResultModal}
        winnerName={gameState.winner?.name || null}
        isDraw={gameState.isDraw}
        message="Mastered the board by capturing the highest number of boxes!"
        onPlayAgain={handleRestart}
      />
    </div>
  );
}
