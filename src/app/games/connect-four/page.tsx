'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameHeader } from '@/components/games/GameHeader';
import { GameResultModal } from '@/components/games/GameResultModal';
import { PlayerSetup, PlayerConfig } from '@/components/games/PlayerSetup';
import { ConnectFourBoard } from '@/games/connect-four/Board';
import {
  createInitialConnectFourState,
  dropDisc,
  resetConnectFourRound,
  resetConnectFourMatch,
  getBestConnectFourMove
} from '@/games/connect-four/logic';
import { ConnectFourState } from '@/games/connect-four/types';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';

export default function ConnectFourPage() {
  const [gameState, setGameState] = useState<ConnectFourState>(() =>
    createInitialConnectFourState(
      { name: 'Player 1', isBot: false },
      { name: 'Bot Alpha 🤖', isBot: true }
    )
  );
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  const botTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load configured players from storage on mount
  useEffect(() => {
    const saved = StorageService.getPlayerConfigs('connect-four', [
      { name: 'Player 1', isBot: false },
      { name: 'Bot Alpha 🤖', isBot: true }
    ]);
    if (saved && saved.length >= 2) {
      setGameState(createInitialConnectFourState(saved[0], saved[1]));
    }
  }, []);

  const activePlayer =
    gameState.currentTurn === 'R' ? gameState.players[0] : gameState.players[1];

  // Auto-move for Bot Player
  useEffect(() => {
    if (gameState.isGameOver || !activePlayer.isBot) return;

    botTimerRef.current = setTimeout(() => {
      const bestCol = getBestConnectFourMove(
        gameState.board,
        activePlayer.symbol
      );
      if (bestCol !== -1) {
        handleDrop(bestCol);
      }
    }, 600);

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [gameState.currentTurn, gameState.isGameOver, activePlayer.isBot, gameState.board]);

  const handleDrop = (col: number) => {
    if (gameState.isGameOver) return;

    sounds.playHop();
    const { nextState, droppedRow } = dropDisc(gameState, col);
    if (droppedRow === null) return;

    setGameState(nextState);

    if (nextState.isGameOver) {
      if (nextState.winResult?.winner === 'R' || nextState.winResult?.winner === 'Y') {
        sounds.playVictory();
        const winName =
          nextState.winResult.winner === 'R'
            ? nextState.players[0].name
            : nextState.players[1].name;
        StorageService.recordMatch('connect-four', winName);
      } else {
        sounds.playClick();
        StorageService.recordMatch('connect-four', 'Draw');
      }
      setTimeout(() => setShowResultModal(true), 600);
    }
  };

  const handleNextRound = () => {
    setShowResultModal(false);
    setGameState(resetConnectFourRound(gameState));
  };

  const handleRestartMatch = () => {
    setShowResultModal(false);
    setGameState(resetConnectFourMatch(gameState));
  };

  const handleSetupComplete = (players: PlayerConfig[]) => {
    StorageService.savePlayerConfigs('connect-four', players);
    setGameState(createInitialConnectFourState(players[0], players[1]));
    setIsSetupOpen(false);
  };

  return (
    <div className="py-6 px-4 max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <GameHeader
        title="Four in a Row"
        icon="🔴🟡"
        subtitle="2 Players • Connect 4 to Win • Play with Friends or AI"
        onRestart={handleRestartMatch}
        onOpenSettings={() => setIsSetupOpen(true)}
      />

      {/* Players Scoreboard & Turn Badges */}
      <div className="grid grid-cols-2 gap-3">
        {gameState.players.map(p => {
          const isTurn = gameState.currentTurn === p.symbol && !gameState.isGameOver;
          const isRed = p.symbol === 'R';

          return (
            <div
              key={p.id}
              className={`p-3.5 rounded-2xl border transition-all select-none ${
                isTurn
                  ? 'bg-[#2b1b11] border-amber-500 ring-2 ring-amber-500/40 shadow-xl scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 opacity-85'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full border-2 border-white shadow-md ${
                      isRed ? 'bg-red-600' : 'bg-amber-400'
                    }`}
                  />
                  <div className="truncate max-w-[110px]">
                    <span className="font-bold text-xs sm:text-sm text-white block truncate">
                      {p.name}
                    </span>
                    {p.isBot && (
                      <span className="text-[9px] text-purple-400 font-bold block leading-none">
                        AI Bot
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xl font-black text-amber-400">{p.score}</span>
              </div>
              {isTurn && (
                <div className="text-[10px] font-black text-amber-400 mt-2 flex items-center gap-1">
                  <span>{p.isBot ? '🤖 Bot thinking...' : '👉 Your Turn to Drop'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Game Board */}
      <ConnectFourBoard
        board={gameState.board}
        currentTurn={gameState.currentTurn}
        isGameOver={gameState.isGameOver}
        winResult={gameState.winResult}
        onDrop={handleDrop}
      />

      {/* Turn Action Status */}
      <div className="text-center bg-slate-900/60 border border-slate-800/80 py-2.5 px-4 rounded-2xl">
        <p className="text-xs font-bold text-slate-300">
          {gameState.isGameOver
            ? gameState.winResult?.winner === 'Draw'
              ? "🤝 Full board! It's a draw."
              : `👑 ${gameState.winResult?.winner === 'R' ? gameState.players[0].name : gameState.players[1].name} connected four in a row!`
            : `Turn: ${activePlayer.name} (Tap any column to drop ${activePlayer.symbol === 'R' ? 'Red 🔴' : 'Yellow 🟡'})`}
        </p>
      </div>

      {/* Setup Modal */}
      <PlayerSetup
        isOpen={isSetupOpen}
        gameTitle="Four in a Row"
        minPlayers={2}
        maxPlayers={2}
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
        winnerName={
          gameState.winResult?.winner === 'R'
            ? gameState.players[0].name
            : gameState.winResult?.winner === 'Y'
            ? gameState.players[1].name
            : null
        }
        isDraw={gameState.winResult?.winner === 'Draw'}
        message="Connected four discs in a row to claim victory!"
        onPlayAgain={handleNextRound}
      />
    </div>
  );
}
