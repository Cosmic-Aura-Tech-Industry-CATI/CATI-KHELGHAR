'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameHeader } from '@/components/games/GameHeader';
import { GameResultModal } from '@/components/games/GameResultModal';
import { PlayerSetup, PlayerConfig } from '@/components/games/PlayerSetup';
import { GameBoard } from './GameBoard';
import { GameControls } from './GameControls';
import {
  createInitialSnakeGameState,
  planMoveSequence
} from '../logic';
import { SnakeGameState, SnakePlayer } from '../types';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';

export const SnakeLadderGame: React.FC = () => {
  const [gameState, setGameState] = useState<SnakeGameState>(() =>
    createInitialSnakeGameState(2, [
      { name: 'Player 1', isBot: false },
      { name: 'Bot Alpha 🤖', isBot: true }
    ])
  );
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  const botRollTimer = useRef<NodeJS.Timeout | null>(null);

  // Load configured players from storage on mount
  useEffect(() => {
    const saved = StorageService.getPlayerConfigs('snake-and-ladders', [
      { name: 'Player 1', isBot: false },
      { name: 'Bot Alpha 🤖', isBot: true }
    ]);
    if (saved && saved.length >= 2) {
      setGameState(createInitialSnakeGameState(saved.length, saved));
    }
  }, []);

  const curPlayer = gameState.players[gameState.currentTurnIndex];

  // AI Bot Auto-Roll Loop
  useEffect(() => {
    if (
      gameState.winner ||
      gameState.isRolling ||
      gameState.isMoving ||
      !curPlayer?.isBot
    ) {
      return;
    }

    botRollTimer.current = setTimeout(() => {
      handleRollDice();
    }, 750);

    return () => {
      if (botRollTimer.current) clearTimeout(botRollTimer.current);
    };
  }, [
    gameState.currentTurnIndex,
    gameState.isRolling,
    gameState.isMoving,
    gameState.winner,
    curPlayer?.isBot
  ]);

  const handleRollDice = () => {
    if (gameState.isRolling || gameState.isMoving || gameState.winner) return;

    sounds.playDiceRoll();
    const roll = Math.floor(Math.random() * 6) + 1;
    setGameState(prev => ({ ...prev, isRolling: true, diceValue: roll }));

    // 1. Roll animation completes
    setTimeout(() => {
      setGameState(prev => ({ ...prev, isRolling: false, isMoving: true }));
      executeMoveAnimation(roll);
    }, 450);
  };

  // Step-by-step movement animation
  const executeMoveAnimation = (roll: number) => {
    const active = gameState.players[gameState.currentTurnIndex];
    const plan = planMoveSequence(active.position, roll);

    if (plan.overshot) {
      // Overshot tile 100
      setGameState(prev => ({
        ...prev,
        isMoving: false,
        activityLog: [
          `${active.name} rolled ${roll} but needs exactly ${100 - active.position} to reach 100!`,
          ...prev.activityLog.slice(0, 8)
        ],
        currentTurnIndex: (prev.currentTurnIndex + 1) % prev.players.length
      }));
      return;
    }

    // Animate hopping step by step
    let stepIndex = 0;
    const hopInterval = setInterval(() => {
      if (stepIndex < plan.stepPath.length) {
        const stepTile = plan.stepPath[stepIndex];
        sounds.playHop();

        setGameState(prev => ({
          ...prev,
          players: prev.players.map(p =>
            p.id === active.id ? { ...p, position: stepTile } : p
          )
        }));
        stepIndex++;
      } else {
        clearInterval(hopInterval);

        // After step path finishes, check snake or ladder
        setTimeout(() => {
          if (plan.isLadder) {
            sounds.playLadder();
            setGameState(prev => ({
              ...prev,
              players: prev.players.map(p =>
                p.id === active.id ? { ...p, position: plan.ladderTo! } : p
              ),
              activityLog: [
                `🪜 ${active.name} climbed ladder from ${active.position + roll} to ${plan.ladderTo}!`,
                ...prev.activityLog.slice(0, 8)
              ]
            }));
          } else if (plan.isSnake) {
            sounds.playSnake();
            setGameState(prev => ({
              ...prev,
              players: prev.players.map(p =>
                p.id === active.id ? { ...p, position: plan.snakeTo! } : p
              ),
              activityLog: [
                `🐍 ${active.name} bitten by snake at ${active.position + roll}, slid to ${plan.snakeTo}!`,
                ...prev.activityLog.slice(0, 8)
              ]
            }));
          } else {
            setGameState(prev => ({
              ...prev,
              activityLog: [
                `${active.name} rolled ${roll}, advanced to tile ${plan.finalTile}.`,
                ...prev.activityLog.slice(0, 8)
              ]
            }));
          }

          // Check win condition
          if (plan.isWin) {
            sounds.playVictory();
            const winPlayer: SnakePlayer = {
              ...active,
              position: 100,
              hasWon: true
            };
            StorageService.recordMatch('snake-and-ladders', active.name);

            setGameState(prev => ({
              ...prev,
              isMoving: false,
              winner: winPlayer,
              players: prev.players.map(p =>
                p.id === active.id ? { ...p, position: 100, hasWon: true } : p
              )
            }));
            setTimeout(() => setShowResultModal(true), 800);
            return;
          }

          // Advance turn
          setGameState(prev => ({
            ...prev,
            isMoving: false,
            currentTurnIndex: plan.extraTurn
              ? prev.currentTurnIndex
              : (prev.currentTurnIndex + 1) % prev.players.length
          }));
        }, 300);
      }
    }, 200);
  };

  const handleRestart = () => {
    setShowResultModal(false);
    setGameState(
      createInitialSnakeGameState(
        gameState.players.length,
        gameState.players.map(p => ({ name: p.name, isBot: p.isBot }))
      )
    );
  };

  const handleSetupComplete = (players: PlayerConfig[], count: number) => {
    StorageService.savePlayerConfigs('snake-and-ladders', players);
    setGameState(createInitialSnakeGameState(count, players));
    setIsSetupOpen(false);
  };

  return (
    <div className="py-6 px-4 max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header */}
      <GameHeader
        title="Snake & Ladders"
        icon="🐍"
        subtitle={`${gameState.players.length} Players • Play with Friends or AI Bots`}
        onRestart={handleRestart}
        onOpenSettings={() => setIsSetupOpen(true)}
      />

      {/* Main Game Layout: Desktop 2-Column (Board on Left, Controls on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Board Column */}
        <div className="lg:col-span-7 flex justify-center w-full">
          <GameBoard
            players={gameState.players}
            currentTurnIndex={gameState.currentTurnIndex}
          />
        </div>

        {/* Controls Column */}
        <div className="lg:col-span-5 w-full">
          <GameControls
            players={gameState.players}
            currentTurnIndex={gameState.currentTurnIndex}
            diceValue={gameState.diceValue}
            isRolling={gameState.isRolling}
            isMoving={gameState.isMoving}
            winner={gameState.winner}
            activityLog={gameState.activityLog}
            onRollDice={handleRollDice}
          />
        </div>
      </div>

      {/* Setup Modal */}
      <PlayerSetup
        isOpen={isSetupOpen}
        gameTitle="Snake & Ladders"
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
        winnerName={gameState.winner?.name || 'Winner'}
        message="Mastered the board and reached tile 100 first!"
        onPlayAgain={handleRestart}
      />
    </div>
  );
};
