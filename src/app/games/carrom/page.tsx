'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameHeader } from '@/components/games/GameHeader';
import { GameResultModal } from '@/components/games/GameResultModal';
import { PlayerSetup, PlayerConfig } from '@/components/games/PlayerSetup';
import { CarromBoard } from '@/games/carrom/Board';
import {
  createInitialCarromState,
  getStrikerInitialPos,
  updateCarromPhysics,
  getBestCarromShot
} from '@/games/carrom/logic';
import { CarromGameState, CarromPiece } from '@/games/carrom/types';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';

export default function CarromPage() {
  const [gameState, setGameState] = useState<CarromGameState>(() =>
    createInitialCarromState(
      { name: 'Player 1', isBot: false },
      { name: 'Bot Alpha 🤖', isBot: true }
    )
  );
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  const animFrameRef = useRef<number | null>(null);
  const botStrikeTimer = useRef<NodeJS.Timeout | null>(null);

  // Load configured players from storage on mount
  useEffect(() => {
    const saved = StorageService.getPlayerConfigs('carrom', [
      { name: 'Player 1', isBot: false },
      { name: 'Bot Alpha 🤖', isBot: true }
    ]);
    if (saved && saved.length >= 2) {
      setGameState(createInitialCarromState(saved[0], saved[1]));
    }
  }, []);

  const activePlayer = gameState.players[gameState.currentTurnIndex];

  // AI Bot Auto-Aim & Strike Loop
  useEffect(() => {
    if (gameState.isStriking || gameState.isGameOver || !activePlayer?.isBot) {
      return;
    }

    botStrikeTimer.current = setTimeout(() => {
      const shot = getBestCarromShot(gameState);
      setGameState(prev => ({
        ...prev,
        strikerPos: shot.strikerPos,
        aimAngle: shot.aimAngle,
        power: shot.power
      }));

      setTimeout(() => {
        handleStrikeWithParams(shot.strikerPos, shot.aimAngle, shot.power);
      }, 400);
    }, 700);

    return () => {
      if (botStrikeTimer.current) clearTimeout(botStrikeTimer.current);
    };
  }, [gameState.currentTurnIndex, gameState.isStriking, gameState.isGameOver, activePlayer?.isBot]);

  const handleStrikeWithParams = (
    strikerPos: number,
    aimAngle: number,
    power: number
  ) => {
    if (gameState.isStriking || gameState.isGameOver) return;

    sounds.playClick();

    const initialPos = getStrikerInitialPos(
      gameState.currentTurnIndex,
      strikerPos
    );
    const rad = (aimAngle * Math.PI) / 180;
    const speed = (power / 100) * 4.2;

    const strikerPiece: CarromPiece = {
      id: 'striker-active',
      type: 'striker',
      x: initialPos.x,
      y: initialPos.y,
      vx: Math.cos(rad) * speed,
      vy: Math.sin(rad) * speed,
      radius: 3.2,
      isPocketed: false
    };

    let curPieces = [...gameState.pieces, strikerPiece];
    setGameState(prev => ({ ...prev, isStriking: true }));

    let pocketedInThisStrike: CarromPiece[] = [];

    const runPhysics = () => {
      const { updatedPieces, pocketedThisTick, allStopped } =
        updateCarromPhysics(curPieces);

      if (pocketedThisTick.length > 0) {
        sounds.playHop();
        pocketedInThisStrike.push(...pocketedThisTick);
      }

      curPieces = updatedPieces;

      if (!allStopped) {
        setGameState(prev => ({ ...prev, pieces: curPieces }));
        animFrameRef.current = requestAnimationFrame(runPhysics);
      } else {
        // Strike finished! Filter out striker and pocketed pieces
        const remainingPieces = curPieces.filter(
          p => p.type !== 'striker' && !p.isPocketed
        );

        // Calculate points gained in this strike
        let pointsGained = 0;

        pocketedInThisStrike.forEach(p => {
          if (p.type === 'queen') {
            pointsGained += 25;
          } else if (p.type === 'white') {
            pointsGained += 10;
          } else if (p.type === 'black') {
            pointsGained += 5;
          }
        });

        const curPlayer = gameState.players[gameState.currentTurnIndex];
        const nextPlayers = gameState.players.map((p, idx) =>
          idx === gameState.currentTurnIndex
            ? {
                ...p,
                score: p.score + pointsGained,
                coinsPocketed: p.coinsPocketed + pocketedInThisStrike.filter(x => x.type !== 'striker').length
              }
            : p
        );

        const isGameOver = remainingPieces.length === 0;
        let winner = null;
        if (isGameOver) {
          const sorted = [...nextPlayers].sort((a, b) => b.score - a.score);
          winner = sorted[0];
          sounds.playVictory();
          StorageService.recordMatch('carrom', winner.name);
          setTimeout(() => setShowResultModal(true), 700);
        }

        const newLog = [...gameState.activityLog];
        if (pointsGained > 0) {
          newLog.unshift(
            `🎯 ${curPlayer.name} pocketed ${pocketedInThisStrike.length} coin(s) (+${pointsGained} pts) and earned a bonus turn!`
          );
        } else {
          newLog.unshift(`${curPlayer.name} completed their strike.`);
        }

        // Bonus turn if scored, otherwise switch
        const nextTurn =
          pointsGained > 0
            ? gameState.currentTurnIndex
            : (gameState.currentTurnIndex + 1) % gameState.players.length;

        // Default aim direction: up for P1 (270°), down for P2 (90°)
        const defaultAim = nextTurn === 0 ? 270 : 90;

        setGameState(prev => ({
          ...prev,
          pieces: remainingPieces,
          isStriking: false,
          players: nextPlayers,
          currentTurnIndex: nextTurn,
          aimAngle: defaultAim,
          isGameOver,
          winner,
          activityLog: newLog.slice(0, 8)
        }));
      }
    };

    animFrameRef.current = requestAnimationFrame(runPhysics);
  };

  const handleStrike = () => {
    handleStrikeWithParams(
      gameState.strikerPos,
      gameState.aimAngle,
      gameState.power
    );
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleRestart = () => {
    setShowResultModal(false);
    setGameState(
      createInitialCarromState(
        { name: gameState.players[0].name, isBot: gameState.players[0].isBot },
        { name: gameState.players[1].name, isBot: gameState.players[1].isBot }
      )
    );
  };

  const handleSetupComplete = (players: PlayerConfig[]) => {
    StorageService.savePlayerConfigs('carrom', players);
    setGameState(createInitialCarromState(players[0], players[1]));
    setIsSetupOpen(false);
  };

  return (
    <div className="py-6 px-4 max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <GameHeader
        title="Carrom"
        icon="🎯"
        subtitle="Indian Tabletop Board • Play with Friends or AI Bots"
        onRestart={handleRestart}
        onOpenSettings={() => setIsSetupOpen(true)}
      />

      {/* Players Scoreboard */}
      <div className="grid grid-cols-2 gap-3">
        {gameState.players.map((p, idx) => {
          const isTurn = idx === gameState.currentTurnIndex && !gameState.isGameOver;

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
                    className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white shadow-md font-bold"
                    style={{ backgroundColor: p.color }}
                  >
                    P{idx + 1}
                  </span>
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
                  <span>{p.isBot ? '🤖 Aiming & Striking...' : '👉 Aim & Strike'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Board */}
      <CarromBoard
        pieces={gameState.pieces}
        currentTurnIndex={gameState.currentTurnIndex}
        players={gameState.players}
        strikerPos={gameState.strikerPos}
        aimAngle={gameState.aimAngle}
        power={gameState.power}
        isStriking={gameState.isStriking}
        onStrikerPosChange={pos => setGameState(prev => ({ ...prev, strikerPos: pos }))}
        onAimAngleChange={angle => setGameState(prev => ({ ...prev, aimAngle: angle }))}
      />

      {/* Strike Controls Panel */}
      {!gameState.isStriking && !gameState.isGameOver && !activePlayer?.isBot && (
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-3.5">
          <div className="grid grid-cols-2 gap-4">
            {/* Aim Angle */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Aim Angle:</span>
                <span className="text-amber-400">{gameState.aimAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={gameState.aimAngle}
                onChange={e =>
                  setGameState(prev => ({ ...prev, aimAngle: Number(e.target.value) }))
                }
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Power Meter */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Power:</span>
                <span className="text-orange-400">{gameState.power}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={gameState.power}
                onChange={e =>
                  setGameState(prev => ({ ...prev, power: Number(e.target.value) }))
                }
                className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* Big Strike Button */}
          <button
            type="button"
            onClick={handleStrike}
            className="w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-slate-950 shadow-lg shadow-orange-500/20 active:scale-95 transition-all select-none cursor-pointer"
          >
            🎯 Strike! ({activePlayer?.name})
          </button>
        </div>
      )}

      {/* Setup Modal */}
      <PlayerSetup
        isOpen={isSetupOpen}
        gameTitle="Carrom"
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
        winnerName={gameState.winner?.name || null}
        message="Mastered the board and conquered the most carrom points!"
        onPlayAgain={handleRestart}
      />
    </div>
  );
}
