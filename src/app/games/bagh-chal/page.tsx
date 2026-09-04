'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '@/components/games/GameHeader';
import { PlayerSetup, PlayerConfig, GameThemeOption } from '@/components/games/PlayerSetup';
import { GameResultModal } from '@/components/games/GameResultModal';
import { BaghBoardView } from '@/games/bagh-chal/Board';
import {
  createInitialBaghState,
  getLegalBaghMoves,
  applyBaghMove,
  getBestBaghBotMove,
} from '@/games/bagh-chal/logic';
import { Position, BaghTheme, BaghGameState, BaghMove } from '@/games/bagh-chal/types';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';

const THEMES: GameThemeOption[] = [
  { id: 'himalayan', name: 'Himalayan Slate', icon: '🏔️', description: 'Ancient mountain stone' },
  { id: 'brass', name: 'Brass & Teak', icon: '🪵', description: 'Warm polished Indian wood' },
  { id: 'forest', name: 'Forest Hunt', icon: '🌲', description: 'Deep jungle hunter theme' },
];

const DEFAULT_PLAYERS: PlayerConfig[] = [
  { name: 'Goats (बकरियां)', isBot: false },
  { name: 'Tigers (बाघ) 🤖', isBot: true },
];

export default function BaghChalPage() {
  const [gameState, setGameState] = useState<BaghGameState>(createInitialBaghState);
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>(DEFAULT_PLAYERS);
  const [theme, setTheme] = useState<BaghTheme>('himalayan');
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  useEffect(() => {
    const savedTheme = StorageService.get<BaghTheme>('bagh_theme', 'himalayan');
    setTheme(savedTheme);
  }, []);

  const currentPlayer = gameState.turn === 'goat' ? playerConfigs[0] : playerConfigs[1];

  const validMoves: BaghMove[] =
    gameState.turn === 'goat' && gameState.phase === 'placing'
      ? getLegalBaghMoves(gameState)
      : selectedPos
      ? getLegalBaghMoves(gameState, selectedPos)
      : [];

  const handlePointClick = useCallback(
    (row: number, col: number) => {
      if (gameState.winner || currentPlayer.isBot) return;

      const piece = gameState.board[row][col];

      // Phase 1: Goat placing
      if (gameState.turn === 'goat' && gameState.phase === 'placing') {
        const move = validMoves.find((m) => m.to.row === row && m.to.col === col);
        if (move) {
          sounds.playMove?.();
          const nextState = applyBaghMove(gameState, move);
          setGameState(nextState);
          setSelectedPos(null);
          if (nextState.winner) {
            sounds.playVictory?.();
            setIsResultOpen(true);
          }
        }
        return;
      }

      // Moving: clicked destination
      if (selectedPos) {
        const move = validMoves.find((m) => m.to.row === row && m.to.col === col);
        if (move) {
          if (move.captured) sounds.playCapture?.();
          else sounds.playMove?.();

          const nextState = applyBaghMove(gameState, move);
          setGameState(nextState);
          setSelectedPos(null);

          if (nextState.winner) {
            sounds.playVictory?.();
            setIsResultOpen(true);
          }
          return;
        }
      }

      // Selecting own piece to move
      if (piece === gameState.turn) {
        setSelectedPos({ row, col });
        sounds.playClick?.();
      } else {
        setSelectedPos(null);
      }
    },
    [gameState, selectedPos, validMoves, currentPlayer]
  );

  // Bot move
  useEffect(() => {
    if (gameState.winner) return;
    if (!currentPlayer.isBot) return;

    const timer = setTimeout(() => {
      const bestMove = getBestBaghBotMove(gameState);
      if (bestMove) {
        if (bestMove.captured) sounds.playCapture?.();
        else sounds.playMove?.();

        const nextState = applyBaghMove(gameState, bestMove);
        setGameState(nextState);
        setSelectedPos(null);

        if (nextState.winner) {
          sounds.playVictory?.();
          setIsResultOpen(true);
        }
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [gameState, currentPlayer]);

  const handleRestart = () => {
    setGameState(createInitialBaghState());
    setSelectedPos(null);
    setIsResultOpen(false);
  };

  const handleSetupComplete = (players: PlayerConfig[], count: number, selectedTheme?: string) => {
    setPlayerConfigs(players.slice(0, 2));
    if (selectedTheme) {
      setTheme(selectedTheme as BaghTheme);
      StorageService.set('bagh_theme', selectedTheme);
    }
    setIsSetupOpen(false);
    handleRestart();
  };

  const winnerName =
    gameState.winner === 'goat'
      ? playerConfigs[0].name
      : gameState.winner === 'tiger'
      ? playerConfigs[1].name
      : null;

  return (
    <div className="py-4 px-3 sm:px-4 max-w-xl mx-auto space-y-4 animate-fadeIn">
      <GameHeader
        title="Bagh-Chal (बाघ-चाल)"
        icon="🐅🐐"
        subtitle="2 Players • Asymmetric Tigers vs Goats"
        onRestart={handleRestart}
        onOpenSettings={() => setIsSetupOpen(true)}
      />

      {/* Status Bar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>{currentPlayer.name}&apos;s Turn</span>
            <span className="text-base">{gameState.turn === 'goat' ? '🐐' : '🐅'}</span>
          </div>
          <div className="text-[10px] text-slate-400">{gameState.lastLog}</div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="text-amber-400">
            Goats: {20 - gameState.goatsPlaced} in hand
          </div>
          <div className="text-red-400">
            Captured: {gameState.goatsCaptured}/5
          </div>
        </div>
      </div>

      {/* Board */}
      <BaghBoardView
        board={gameState.board}
        selectedPos={selectedPos}
        validMoves={validMoves}
        theme={theme}
        onPointClick={handlePointClick}
      />

      {/* Result Modal */}
      <GameResultModal
        isOpen={isResultOpen}
        winner={winnerName ? { name: winnerName, score: 1 } : null}
        onPlayAgain={handleRestart}
        onClose={() => setIsResultOpen(false)}
      />

      {/* Setup Modal */}
      <PlayerSetup
        isOpen={isSetupOpen}
        gameTitle="Bagh-Chal"
        minPlayers={2}
        maxPlayers={2}
        initialPlayers={playerConfigs}
        themes={THEMES}
        currentTheme={theme}
        onThemeChange={(t) => setTheme(t as BaghTheme)}
        onStart={handleSetupComplete}
        onClose={() => setIsSetupOpen(false)}
      />
    </div>
  );
}
