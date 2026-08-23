'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameHeader } from '@/components/games/GameHeader';
import { GameResultModal } from '@/components/games/GameResultModal';
import { PlayerSetup, PlayerConfig } from '@/components/games/PlayerSetup';
import { DiceRoller } from '@/components/ui/DiceRoller';
import { LudoBoard } from '@/games/ludo/Board';
import {
  createInitialLudoState,
  getLudoValidMoves,
  executeLudoTokenMove,
  passLudoTurn,
  getBestLudoMove
} from '@/games/ludo/logic';
import { LudoGameState } from '@/games/ludo/types';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';

export default function LudoPage() {
  const [gameState, setGameState] = useState<LudoGameState>(() =>
    createInitialLudoState(4, [
      { name: 'Player 1 (Red)', isBot: false },
      { name: 'Bot Alpha (Green) 🤖', isBot: true },
      { name: 'Bot Beta (Yellow) 🤖', isBot: true },
      { name: 'Bot Gamma (Blue) 🤖', isBot: true }
    ])
  );
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  const botActionTimer = useRef<NodeJS.Timeout | null>(null);

  // Load configured players from storage on mount
  useEffect(() => {
    const saved = StorageService.getPlayerConfigs('ludo', [
      { name: 'Player 1 (Red)', isBot: false },
      { name: 'Bot Alpha (Green) 🤖', isBot: true },
      { name: 'Bot Beta (Yellow) 🤖', isBot: true },
      { name: 'Bot Gamma (Blue) 🤖', isBot: true }
    ]);
    if (saved && saved.length >= 2) {
      setGameState(createInitialLudoState(saved.length, saved));
    }
  }, []);

  const activePlayer = gameState.players[gameState.currentTurnIndex];

  // AI Bot Auto-Roll & Auto-Move Loop
  useEffect(() => {
    if (gameState.isGameOver || !activePlayer?.isBot) return;

    // 1. Bot needs to roll dice
    if (!gameState.hasRolled && !gameState.isRolling) {
      botActionTimer.current = setTimeout(() => {
        handleRollDice();
      }, 700);
      return;
    }

    // 2. Bot has rolled and has moves to pick
    if (gameState.hasRolled && !gameState.isRolling && gameState.validMoves.length > 0) {
      botActionTimer.current = setTimeout(() => {
        const best = getBestLudoMove(gameState.validMoves);
        if (best) {
          handleTokenClick(best.tokenId);
        }
      }, 500);
      return;
    }

    return () => {
      if (botActionTimer.current) clearTimeout(botActionTimer.current);
    };
  }, [
    gameState.currentTurnIndex,
    gameState.hasRolled,
    gameState.isRolling,
    gameState.validMoves,
    gameState.isGameOver,
    activePlayer?.isBot
  ]);

  const handleRollDice = () => {
    if (gameState.isRolling || gameState.hasRolled || gameState.isGameOver) return;

    sounds.playDiceRoll();
    const roll = Math.floor(Math.random() * 6) + 1;
    setGameState(prev => ({ ...prev, isRolling: true, diceValue: roll }));

    setTimeout(() => {
      setGameState(prev => {
        const curPlayer = prev.players[prev.currentTurnIndex];
        const validMoves = getLudoValidMoves(curPlayer, roll, prev.players);

        if (validMoves.length === 0) {
          // No valid moves -> Pass turn after brief pause
          const nextState = passLudoTurn({
            ...prev,
            isRolling: false,
            hasRolled: true,
            diceValue: roll,
            validMoves: [],
            activityLog: [
              `${curPlayer.name} rolled a ${roll} but has no moves.`,
              ...prev.activityLog.slice(0, 8)
            ]
          });
          return nextState;
        }

        // Auto move if exactly 1 move available and human player
        if (validMoves.length === 1 && !curPlayer.isBot) {
          setTimeout(() => {
            handleTokenClick(validMoves[0].tokenId);
          }, 350);
        }

        return {
          ...prev,
          isRolling: false,
          hasRolled: true,
          diceValue: roll,
          validMoves
        };
      });
    }, 450);
  };

  const handleTokenClick = (tokenId: number) => {
    const { newState, capturedToken, reachedHome } = executeLudoTokenMove(
      gameState,
      tokenId
    );

    if (capturedToken) {
      sounds.playCapture();
    } else if (reachedHome) {
      sounds.playVictory();
    } else {
      sounds.playHop();
    }

    setGameState(newState);

    if (newState.isGameOver) {
      sounds.playVictory();
      const winner = newState.winnerRankings[0];
      if (winner) {
        StorageService.recordMatch('ludo', winner.name);
      }
      setTimeout(() => setShowResultModal(true), 800);
    }
  };

  const handleRestart = () => {
    setShowResultModal(false);
    setGameState(
      createInitialLudoState(
        gameState.players.length,
        gameState.players.map(p => ({ name: p.name, isBot: p.isBot }))
      )
    );
  };

  const handleSetupComplete = (players: PlayerConfig[], count: number) => {
    StorageService.savePlayerConfigs('ludo', players);
    setGameState(createInitialLudoState(count, players));
    setIsSetupOpen(false);
  };

  return (
    <div className="py-6 px-4 max-w-2xl mx-auto space-y-5 animate-fadeIn">
      {/* Top Header */}
      <GameHeader
        title="Ludo"
        icon="🎲"
        subtitle={`${gameState.players.length} Players • Play with Friends or AI Bots`}
        onRestart={handleRestart}
        onOpenSettings={() => setIsSetupOpen(true)}
      />

      {/* Players Turn Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {gameState.players.map((p, idx) => {
          const isTurn = idx === gameState.currentTurnIndex && !gameState.isGameOver;
          const homeCount = p.tokens.filter(t => t.step === 56).length;

          return (
            <div
              key={p.id}
              className={`p-2.5 rounded-2xl border transition-all ${
                isTurn
                  ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/30 shadow-lg scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full border border-white flex-shrink-0"
                  style={{ backgroundColor: p.colorHex }}
                />
                <div className="truncate">
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
              <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                <span>Home: {homeCount}/4</span>
                {p.hasWon && <span className="text-amber-400 font-bold">Rank #{p.rank}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* 15x15 Ludo Board */}
      <LudoBoard
        players={gameState.players}
        validMoves={gameState.validMoves}
        currentTurnIndex={gameState.currentTurnIndex}
        hasRolled={gameState.hasRolled}
        onTokenClick={handleTokenClick}
      />

      {/* Action Controls: Dice Roller & Status */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5 justify-center sm:justify-start">
            <span>{gameState.isGameOver ? 'Game Over' : `Current Turn: ${activePlayer?.name}`}</span>
            {activePlayer?.isBot && !gameState.isGameOver && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                🤖 AI Moving...
              </span>
            )}
          </div>
          <div className="text-xs text-slate-300">
            {gameState.hasRolled
              ? gameState.validMoves.length > 0
                ? activePlayer?.isBot
                  ? 'AI is selecting the best token move...'
                  : '👉 Tap a bouncing token to move!'
                : 'No moves available. Passing turn...'
              : activePlayer?.isBot
              ? 'Bot is rolling the dice...'
              : 'Tap the dice to roll.'}
          </div>
        </div>

        <DiceRoller
          value={gameState.diceValue}
          isRolling={gameState.isRolling}
          disabled={gameState.hasRolled || gameState.isGameOver || activePlayer?.isBot}
          onRoll={handleRollDice}
          label={activePlayer?.name}
        />
      </div>

      {/* Activity Log */}
      <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
          Recent Activity
        </span>
        <div className="space-y-1 text-xs text-slate-300 max-h-24 overflow-y-auto">
          {gameState.activityLog.map((log, i) => (
            <div key={i} className="text-[11px] text-slate-300">
              &bull; {log}
            </div>
          ))}
        </div>
      </div>

      {/* Setup Modal */}
      <PlayerSetup
        isOpen={isSetupOpen}
        gameTitle="Ludo"
        minPlayers={2}
        maxPlayers={4}
        initialPlayers={gameState.players.map(p => ({
          name: p.name,
          isBot: !!p.isBot
        }))}
        onStart={handleSetupComplete}
        onClose={() => setIsSetupOpen(false)}
      />

      {/* Result Celebration Modal */}
      <GameResultModal
        isOpen={showResultModal}
        winnerName={gameState.winnerRankings[0]?.name || 'Winner'}
        message="Mastered the board and brought all tokens home safely!"
        onPlayAgain={handleRestart}
      />
    </div>
  );
}
