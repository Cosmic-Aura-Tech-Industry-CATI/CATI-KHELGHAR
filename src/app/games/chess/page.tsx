'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '@/components/games/GameHeader';
import { PlayerSetup, PlayerConfig, GameThemeOption } from '@/components/games/PlayerSetup';
import { GameResultModal } from '@/components/games/GameResultModal';
import { ChessBoard } from '@/games/chess/Board';
import { createInitialState, getLegalMoves, applyMove, getBestBotMove } from '@/games/chess/logic';
import { Position, Move, ChessTheme, ChessGameState } from '@/games/chess/types';
import { ChessPieceIcon } from '@/games/chess/PieceIcon';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';
import { RotateCcw } from 'lucide-react';

const THEMES: GameThemeOption[] = [
  { id: 'walnut', name: 'Royal Walnut', icon: '🪵', description: 'Handcrafted rich mahogany wood' },
  { id: 'cyberpunk', name: 'Cyberpunk Slate', icon: '⚡', description: 'Dark futuristic neon matrix' },
  { id: 'sakura', name: 'Sakura Blossom', icon: '🌸', description: 'Pastel Japanese cherry aesthetic' },
];

const DEFAULT_PLAYERS: PlayerConfig[] = [
  { name: 'White', isBot: false },
  { name: 'Black 🤖', isBot: true },
];

export default function ChessPage() {
  const [gameState, setGameState] = useState<ChessGameState>(createInitialState);
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>(DEFAULT_PLAYERS);
  const [theme, setTheme] = useState<ChessTheme>('walnut');
  const [flipped, setFlipped] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  useEffect(() => {
    const savedTheme = StorageService.get<ChessTheme>('chess_theme', 'walnut');
    setTheme(savedTheme);
    const savedPlayers = StorageService.getPlayerConfigs('chess', DEFAULT_PLAYERS);
    if (savedPlayers && savedPlayers.length === 2) {
      setPlayerConfigs(savedPlayers);
    }
  }, []);

  const currentPlayer = gameState.turn === 'w' ? playerConfigs[0] : playerConfigs[1];

  const handleSquareClick = useCallback(
    (pos: Position) => {
      if (gameState.isCheckmate || gameState.isStalemate || currentPlayer.isBot) return;

      const piece = gameState.board[pos.row][pos.col];

      // If clicked a valid move destination
      if (selectedPos) {
        const move = validMoves.find((m) => m.to.row === pos.row && m.to.col === pos.col);
        if (move) {
          if (move.captured) sounds.playCapture?.();
          else sounds.playMove?.();

          const nextState = applyMove(gameState, move);
          setGameState(nextState);
          setSelectedPos(null);
          setValidMoves([]);

          if (nextState.isCheckmate) {
            sounds.playVictory?.();
            setIsResultOpen(true);
          }
          return;
        }
      }

      // If clicked own piece
      if (piece && piece.color === gameState.turn) {
        setSelectedPos(pos);
        const legal = getLegalMoves(gameState, pos);
        setValidMoves(legal);
        sounds.playClick?.();
      } else {
        setSelectedPos(null);
        setValidMoves([]);
      }
    },
    [gameState, selectedPos, validMoves, currentPlayer]
  );

  // Bot move trigger
  useEffect(() => {
    if (gameState.isCheckmate || gameState.isStalemate) return;
    if (!currentPlayer.isBot) return;

    const timer = setTimeout(() => {
      const bestMove = getBestBotMove(gameState);
      if (bestMove) {
        if (bestMove.captured) sounds.playCapture?.();
        else sounds.playMove?.();

        const nextState = applyMove(gameState, bestMove);
        setGameState(nextState);
        if (nextState.isCheckmate) {
          sounds.playVictory?.();
          setIsResultOpen(true);
        }
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [gameState, currentPlayer]);

  const handleRestart = () => {
    setGameState(createInitialState());
    setSelectedPos(null);
    setValidMoves([]);
    setIsResultOpen(false);
  };

  const handleSetupComplete = (players: PlayerConfig[], count: number, selectedTheme?: string) => {
    setPlayerConfigs(players.slice(0, 2));
    if (selectedTheme) {
      setTheme(selectedTheme as ChessTheme);
      StorageService.set('chess_theme', selectedTheme);
    }
    StorageService.savePlayerConfigs('chess', players.slice(0, 2));
    setIsSetupOpen(false);
    handleRestart();
  };

  const winnerName = gameState.isCheckmate
    ? gameState.turn === 'w'
      ? playerConfigs[1].name
      : playerConfigs[0].name
    : null;

  return (
    <div className="py-4 px-3 sm:px-4 max-w-xl mx-auto space-y-4 animate-fadeIn">
      <GameHeader
        title="Chess (शतरंज)"
        icon="♟️"
        subtitle="2 Players • Tactical Tabletop"
        onRestart={handleRestart}
        onOpenSettings={() => setIsSetupOpen(true)}
      />

      {/* Turn & Status Banner */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-4 h-4 rounded-full border-2 transition-colors ${
              gameState.turn === 'w'
                ? theme === 'cyberpunk'
                  ? 'bg-cyan-300 border-cyan-400 shadow-[0_0_8px_#22d3ee]'
                  : 'bg-white border-slate-400 shadow-sm'
                : theme === 'cyberpunk'
                ? 'bg-fuchsia-400 border-fuchsia-300 shadow-[0_0_8px_#e879f9]'
                : 'bg-slate-900 border-slate-600 shadow-sm'
            }`}
          />
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{currentPlayer.name}&apos;s Turn</span>
              {gameState.isCheck && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                  CHECK!
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400">
              {gameState.turn === 'w' ? 'White pieces' : 'Black pieces'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFlipped(!flipped)}
          aria-label="Flip board"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          title="Flip board orientation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Board */}
      <ChessBoard
        board={gameState.board}
        selectedPos={selectedPos}
        validMoves={validMoves}
        lastMove={gameState.moveHistory[gameState.moveHistory.length - 1] || null}
        isCheck={gameState.isCheck}
        turn={gameState.turn}
        theme={theme}
        flipped={flipped}
        onSquareClick={handleSquareClick}
      />

      {/* Captured Pieces Bar */}
      <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            White Captured
          </span>
          <div className="flex flex-wrap gap-1.5 min-h-[32px] items-center">
            {gameState.capturedPieces.b.map((p, i) => (
              <div key={i} className="w-6 h-6 flex items-center justify-center">
                <ChessPieceIcon
                  type={p.type}
                  color="b"
                  theme={theme}
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Black Captured
          </span>
          <div className="flex flex-wrap gap-1.5 min-h-[32px] items-center">
            {gameState.capturedPieces.w.map((p, i) => (
              <div key={i} className="w-6 h-6 flex items-center justify-center">
                <ChessPieceIcon
                  type={p.type}
                  color="w"
                  theme={theme}
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <GameResultModal
        isOpen={isResultOpen}
        winner={winnerName ? { name: winnerName, score: 1 } : null}
        isDraw={gameState.isStalemate}
        onPlayAgain={handleRestart}
        onClose={() => setIsResultOpen(false)}
      />

      {/* Player Setup Modal */}
      <PlayerSetup
        isOpen={isSetupOpen}
        gameTitle="Chess"
        minPlayers={2}
        maxPlayers={2}
        initialPlayers={playerConfigs}
        themes={THEMES}
        currentTheme={theme}
        onThemeChange={(t) => setTheme(t as ChessTheme)}
        onStart={handleSetupComplete}
        onClose={() => setIsSetupOpen(false)}
      />
    </div>
  );
}
