'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '@/components/games/GameHeader';
import { PlayerSetup, PlayerConfig, GameThemeOption } from '@/components/games/PlayerSetup';
import { GameResultModal } from '@/components/games/GameResultModal';
import { ReversiBoardView } from '@/games/reversi/Board';
import { createInitialReversiState, applyReversiMove, getBestReversiBotMove } from '@/games/reversi/logic';
import { ReversiTheme, ReversiGameState } from '@/games/reversi/types';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';

const THEMES: GameThemeOption[] = [
  { id: 'green', name: 'Emerald Felt', icon: '🌲', description: 'Classic tournament parlor green' },
  { id: 'midnight', name: 'Midnight Pearl', icon: '🌌', description: 'Dark high-contrast slate' },
  { id: 'marble', name: 'Marble Slate', icon: '🏛️', description: 'Polished gray stone texture' },
];

const DEFAULT_PLAYERS: PlayerConfig[] = [
  { name: 'Black', isBot: false },
  { name: 'White 🤖', isBot: true },
];

export default function ReversiPage() {
  const [gameState, setGameState] = useState<ReversiGameState>(createInitialReversiState);
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>(DEFAULT_PLAYERS);
  const [theme, setTheme] = useState<ReversiTheme>('green');
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  useEffect(() => {
    const savedTheme = StorageService.get<ReversiTheme>('reversi_theme', 'green');
    setTheme(savedTheme);
    const savedPlayers = StorageService.getPlayerConfigs('reversi', DEFAULT_PLAYERS);
    if (savedPlayers && savedPlayers.length === 2) {
      setPlayerConfigs(savedPlayers);
    }
  }, []);

  const currentPlayer = gameState.turn === 'black' ? playerConfigs[0] : playerConfigs[1];

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      if (gameState.isGameOver || currentPlayer.isBot) return;

      const move = gameState.validMoves.find((m) => m.row === row && m.col === col);
      if (!move) return;

      sounds.playMove?.();
      const nextState = applyReversiMove(gameState, move);
      setGameState(nextState);

      if (nextState.isGameOver) {
        sounds.playVictory?.();
        setIsResultOpen(true);
      }
    },
    [gameState, currentPlayer]
  );

  // Bot AI move
  useEffect(() => {
    if (gameState.isGameOver) return;
    if (!currentPlayer.isBot) return;

    const timer = setTimeout(() => {
      const bestMove = getBestReversiBotMove(gameState);
      if (bestMove) {
        sounds.playMove?.();
        const nextState = applyReversiMove(gameState, bestMove);
        setGameState(nextState);

        if (nextState.isGameOver) {
          sounds.playVictory?.();
          setIsResultOpen(true);
        }
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [gameState, currentPlayer]);

  const handleRestart = () => {
    setGameState(createInitialReversiState());
    setIsResultOpen(false);
  };

  const handleSetupComplete = (players: PlayerConfig[], count: number, selectedTheme?: string) => {
    setPlayerConfigs(players.slice(0, 2));
    if (selectedTheme) {
      setTheme(selectedTheme as ReversiTheme);
      StorageService.set('reversi_theme', selectedTheme);
    }
    StorageService.savePlayerConfigs('reversi', players.slice(0, 2));
    setIsSetupOpen(false);
    handleRestart();
  };

  const winnerName =
    gameState.winner === 'black'
      ? playerConfigs[0].name
      : gameState.winner === 'white'
      ? playerConfigs[1].name
      : null;

  return (
    <div className="py-4 px-3 sm:px-4 max-w-xl mx-auto space-y-4 animate-fadeIn">
      <GameHeader
        title="Reversi (Othello)"
        icon="⚪⚫"
        subtitle="2 Players • Tactical Disk Flipping"
        onRestart={handleRestart}
        onOpenSettings={() => setIsSetupOpen(true)}
      />

      {/* Score & Turn Banner */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        {/* Black Player */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-5 h-5 rounded-full border-2 bg-slate-950 border-slate-600 shadow-md ${
              gameState.turn === 'black' ? 'ring-2 ring-amber-400' : 'opacity-60'
            }`}
          />
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{playerConfigs[0].name}</span>
              {gameState.turn === 'black' && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-bold">
              Disks: {gameState.scores.black}
            </div>
          </div>
        </div>

        <div className="text-xs font-black text-slate-500">VS</div>

        {/* White Player */}
        <div className="flex items-center gap-2.5 flex-row-reverse text-right">
          <div
            className={`w-5 h-5 rounded-full border-2 bg-white border-slate-300 shadow-md ${
              gameState.turn === 'white' ? 'ring-2 ring-amber-400' : 'opacity-60'
            }`}
          />
          <div>
            <div className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
              {gameState.turn === 'white' && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
              <span>{playerConfigs[1].name}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-bold">
              Disks: {gameState.scores.white}
            </div>
          </div>
        </div>
      </div>

      {/* Board */}
      <ReversiBoardView
        board={gameState.board}
        validMoves={gameState.validMoves}
        lastMove={gameState.lastMove}
        recentlyFlipped={gameState.recentlyFlipped}
        theme={theme}
        onSquareClick={handleSquareClick}
      />

      {/* Result Modal */}
      <GameResultModal
        isOpen={isResultOpen}
        winner={winnerName ? { name: winnerName, score: Math.max(gameState.scores.black, gameState.scores.white) } : null}
        isDraw={gameState.winner === 'draw'}
        onPlayAgain={handleRestart}
        onClose={() => setIsResultOpen(false)}
      />

      {/* Player Setup Modal */}
      <PlayerSetup
        isOpen={isSetupOpen}
        gameTitle="Reversi"
        minPlayers={2}
        maxPlayers={2}
        initialPlayers={playerConfigs}
        themes={THEMES}
        currentTheme={theme}
        onThemeChange={(t) => setTheme(t as ReversiTheme)}
        onStart={handleSetupComplete}
        onClose={() => setIsSetupOpen(false)}
      />
    </div>
  );
}
