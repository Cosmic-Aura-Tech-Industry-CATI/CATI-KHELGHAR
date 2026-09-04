'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '@/components/games/GameHeader';
import { PlayerSetup, PlayerConfig, GameThemeOption } from '@/components/games/PlayerSetup';
import { GameResultModal } from '@/components/games/GameResultModal';
import { CheckersBoardView } from '@/games/checkers/Board';
import { createInitialCheckersState, getAllLegalMoves, applyCheckersMove, getBestCheckersBotMove } from '@/games/checkers/logic';
import { CheckersPosition, CheckersMove, CheckersTheme, CheckersGameState } from '@/games/checkers/types';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';

const THEMES: GameThemeOption[] = [
  { id: 'mahogany', name: 'Vintage Mahogany', icon: '🪵', description: 'Traditional carved wooden board' },
  { id: 'emerald', name: 'Emerald Felt', icon: '🌲', description: 'Classic green parlor felt' },
  { id: 'neon', name: 'Neon Grid', icon: '⚡', description: 'Modern dark arcade board' },
];

const DEFAULT_PLAYERS: PlayerConfig[] = [
  { name: 'Red', isBot: false },
  { name: 'Black 🤖', isBot: true },
];

export default function CheckersPage() {
  const [gameState, setGameState] = useState<CheckersGameState>(createInitialCheckersState);
  const [selectedPos, setSelectedPos] = useState<CheckersPosition | null>(null);
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>(DEFAULT_PLAYERS);
  const [theme, setTheme] = useState<CheckersTheme>('mahogany');
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  useEffect(() => {
    const savedTheme = StorageService.get<CheckersTheme>('checkers_theme', 'mahogany');
    setTheme(savedTheme);
    const savedPlayers = StorageService.getPlayerConfigs('checkers', DEFAULT_PLAYERS);
    if (savedPlayers && savedPlayers.length === 2) {
      setPlayerConfigs(savedPlayers);
    }
  }, []);

  const currentPlayer = gameState.turn === 'red' ? playerConfigs[0] : playerConfigs[1];
  const allLegalMoves = getAllLegalMoves(gameState);

  const validMovesForSelected = selectedPos
    ? allLegalMoves.filter((m) => m.from.row === selectedPos.row && m.from.col === selectedPos.col)
    : [];

  const handleSquareClick = useCallback(
    (pos: CheckersPosition) => {
      if (gameState.winner || currentPlayer.isBot) return;

      const piece = gameState.board[pos.row][pos.col];

      // If clicked destination
      if (selectedPos) {
        const move = validMovesForSelected.find((m) => m.to.row === pos.row && m.to.col === pos.col);
        if (move) {
          if (move.captured) sounds.playCapture?.();
          else sounds.playMove?.();

          const nextState = applyCheckersMove(gameState, move);
          setGameState(nextState);

          if (nextState.mustJumpPiece) {
            setSelectedPos(nextState.mustJumpPiece);
          } else {
            setSelectedPos(null);
          }

          if (nextState.winner) {
            sounds.playVictory?.();
            setIsResultOpen(true);
          }
          return;
        }
      }

      // If clicked own piece that has available moves
      if (piece && piece.color === gameState.turn) {
        // If locked to a multi-jump piece, can only select that piece
        if (gameState.mustJumpPiece) {
          if (pos.row === gameState.mustJumpPiece.row && pos.col === gameState.mustJumpPiece.col) {
            setSelectedPos(pos);
          }
          return;
        }

        const hasMoves = allLegalMoves.some((m) => m.from.row === pos.row && m.from.col === pos.col);
        if (hasMoves) {
          setSelectedPos(pos);
          sounds.playClick?.();
        }
      } else {
        if (!gameState.mustJumpPiece) {
          setSelectedPos(null);
        }
      }
    },
    [gameState, selectedPos, validMovesForSelected, currentPlayer, allLegalMoves]
  );

  // Bot AI move
  useEffect(() => {
    if (gameState.winner) return;
    if (!currentPlayer.isBot) return;

    const timer = setTimeout(() => {
      const bestMove = getBestCheckersBotMove(gameState);
      if (bestMove) {
        if (bestMove.captured) sounds.playCapture?.();
        else sounds.playMove?.();

        const nextState = applyCheckersMove(gameState, bestMove);
        setGameState(nextState);

        if (nextState.winner) {
          sounds.playVictory?.();
          setIsResultOpen(true);
        }
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [gameState, currentPlayer]);

  const handleRestart = () => {
    setGameState(createInitialCheckersState());
    setSelectedPos(null);
    setIsResultOpen(false);
  };

  const handleSetupComplete = (players: PlayerConfig[], count: number, selectedTheme?: string) => {
    setPlayerConfigs(players.slice(0, 2));
    if (selectedTheme) {
      setTheme(selectedTheme as CheckersTheme);
      StorageService.set('checkers_theme', selectedTheme);
    }
    StorageService.savePlayerConfigs('checkers', players.slice(0, 2));
    setIsSetupOpen(false);
    handleRestart();
  };

  const winnerName =
    gameState.winner === 'red'
      ? playerConfigs[0].name
      : gameState.winner === 'black'
      ? playerConfigs[1].name
      : null;

  return (
    <div className="py-4 px-3 sm:px-4 max-w-xl mx-auto space-y-4 animate-fadeIn">
      <GameHeader
        title="Checkers (Draughts)"
        icon="🏁"
        subtitle="2 Players • Diagonal Jumping Classic"
        onRestart={handleRestart}
        onOpenSettings={() => setIsSetupOpen(true)}
      />

      {/* Turn Banner */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-4 h-4 rounded-full border-2 ${
              gameState.turn === 'red'
                ? 'bg-red-500 border-red-300 shadow-md shadow-red-500/50'
                : 'bg-slate-800 border-slate-500 shadow-md'
            }`}
          />
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{currentPlayer.name}&apos;s Turn</span>
              {gameState.mustJumpPiece && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                  MULTI-JUMP!
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400">
              {gameState.turn === 'red' ? 'Red Checkers' : 'Black Checkers'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="text-red-400">Captured: {gameState.capturedPieces.black}</div>
          <div className="text-slate-400">Captured: {gameState.capturedPieces.red}</div>
        </div>
      </div>

      {/* Board */}
      <CheckersBoardView
        board={gameState.board}
        selectedPos={selectedPos}
        validMoves={validMovesForSelected}
        theme={theme}
        onSquareClick={handleSquareClick}
      />

      {/* Result Modal */}
      <GameResultModal
        isOpen={isResultOpen}
        winner={winnerName ? { name: winnerName, score: 1 } : null}
        isDraw={gameState.winner === 'draw'}
        onPlayAgain={handleRestart}
        onClose={() => setIsResultOpen(false)}
      />

      {/* Player Setup Modal */}
      <PlayerSetup
        isOpen={isSetupOpen}
        gameTitle="Checkers"
        minPlayers={2}
        maxPlayers={2}
        initialPlayers={playerConfigs}
        themes={THEMES}
        currentTheme={theme}
        onThemeChange={(t) => setTheme(t as CheckersTheme)}
        onStart={handleSetupComplete}
        onClose={() => setIsSetupOpen(false)}
      />
    </div>
  );
}
