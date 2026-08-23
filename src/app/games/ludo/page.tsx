'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { GameHeader } from '@/components/games/GameHeader';
import { PlayerSetup, PlayerConfig, GameThemeOption } from '@/components/games/PlayerSetup';
import { useLudoGame, createInitialState, PlayerSetupConfig } from '@/games/ludo/hooks/useLudoGame';
import { LudoBoard } from '@/games/ludo/components/LudoBoard';
import { Dice } from '@/games/ludo/components/Dice';
import { PlayerPanel } from '@/games/ludo/components/PlayerPanel';
import { TurnIndicator } from '@/games/ludo/components/TurnIndicator';
import { PassDeviceModal } from '@/games/ludo/components/PassDeviceModal';
import { WinnerModal } from '@/games/ludo/components/WinnerModal';
import { StorageService } from '@/lib/storage';
import { sounds } from '@/lib/sounds';
import { Player } from '@/games/ludo/types';

const LUDO_THEMES: GameThemeOption[] = [
  { id: 'sakura', name: 'Sakura Garden', icon: '🌸', description: 'Cherry Blossom Japanese theme' },
  { id: 'voxel',  name: 'Block Craft',   icon: '🧱', description: 'Minecraft Voxel theme' },
  { id: 'classic', name: 'Classic Royal', icon: '🪵', description: 'Handcrafted Walnut theme' },
];

const DEFAULT_PLAYER_CONFIGS: PlayerSetupConfig[] = [
  { name: 'Player 1', isBot: false },
  { name: 'Bot Alpha 🤖', isBot: true },
  { name: 'Bot Beta 🤖', isBot: true },
  { name: 'Bot Gamma 🤖', isBot: true },
];

export default function LudoPage() {
  const [playerCount, setPlayerCount] = useState(4);
  const [playerConfigs, setPlayerConfigs] = useState<PlayerSetupConfig[]>(DEFAULT_PLAYER_CONFIGS);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [theme, setTheme] = useState('sakura');

  // Load saved configs on mount
  useEffect(() => {
    const savedTheme = StorageService.get<string>('ludo_theme', 'sakura');
    setTheme(savedTheme);
    const savedPlayers = StorageService.getPlayerConfigs('ludo', DEFAULT_PLAYER_CONFIGS);
    if (savedPlayers && savedPlayers.length >= 2) {
      setPlayerConfigs(savedPlayers);
      setPlayerCount(savedPlayers.length);
    }
  }, []);

  const { state, currentPlayer, rollDice: engineRollDice, selectPawn: engineSelectPawn, confirmHandoff, restart, boardCells } =
    useLudoGame(playerConfigs, playerCount);

  const handleRollDice = useCallback(() => {
    sounds.playDiceRoll?.();
    engineRollDice();
  }, [engineRollDice]);

  const handlePawnClick = useCallback((pawnId: string) => {
    const move = state.validMoves.find(m => m.pawnId === pawnId);
    if (!move) return;
    if (move.isCapture) sounds.playCapture?.();
    else if (move.isFinish) sounds.playVictory?.();
    else sounds.playHop?.();
    engineSelectPawn(pawnId);
  }, [state.validMoves, engineSelectPawn]);

  const handleRestart = useCallback(() => {
    restart(createInitialState(playerConfigs, playerCount).players as Player[]);
  }, [restart, playerConfigs, playerCount]);

  const handleSetupComplete = useCallback((players: PlayerConfig[], count: number, selectedTheme?: string) => {
    const newConfigs: PlayerSetupConfig[] = players.map(p => ({ name: p.name, isBot: !!p.isBot }));
    if (selectedTheme) {
      setTheme(selectedTheme);
      StorageService.set('ludo_theme', selectedTheme);
    }
    StorageService.savePlayerConfigs('ludo', players);
    setPlayerConfigs(newConfigs);
    setPlayerCount(count);
    setIsSetupOpen(false);
    // restart with new config
    restart(createInitialState(newConfigs, count).players);
  }, [restart]);

  const winner = state.winnersRanking.length > 0
    ? state.players.find(p => p.id === state.winnersRanking[0])
    : null;

  const isGameFinished = state.gameStatus === 'finished';
  const isHandoff = state.gameStatus === 'handoff' && !isGameFinished;

  const canRoll = !state.hasRolled && !state.diceRolling && !isGameFinished && !isHandoff && state.phase === 'rolling';
  const isPlayerBot = currentPlayer?.isBot ?? false;

  return (
    <div className="py-4 px-3 sm:px-4 max-w-2xl mx-auto space-y-3 animate-fadeIn">
      {/* Header */}
      <GameHeader
        title="Ludo"
        icon="🎲"
        subtitle={`${playerCount} Players • 🌸 Cherry Blossom`}
        onRestart={handleRestart}
        onOpenSettings={() => setIsSetupOpen(true)}
      />

      {/* Player Status Strip */}
      <PlayerPanel
        players={state.players}
        currentPlayerIndex={state.currentPlayerIndex}
        isGameOver={isGameFinished}
      />

      {/* Turn Indicator */}
      {currentPlayer && !isGameFinished && (
        <TurnIndicator currentPlayer={currentPlayer} gameState={state} />
      )}

      {/* The Board */}
      <LudoBoard
        gameState={state}
        boardCells={boardCells}
        onPawnClick={handlePawnClick}
      />

      {/* Dice + Action Controls */}
      {!isGameFinished && (
        <div className="flex items-center gap-4 p-4 rounded-2xl border"
          style={{ background: `${currentPlayer?.colorHex}0D`, borderColor: `${currentPlayer?.colorHex}30` }}>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-black text-[#6B4536] truncate">
              {isPlayerBot ? `🤖 ${currentPlayer?.name} is thinking...` : `${currentPlayer?.name}'s turn`}
            </div>
            <div className="text-[11px] text-[#8B6442] mt-0.5">
              {state.hasRolled && state.validMoves.length > 0 && !isPlayerBot
                ? '👆 Tap a glowing pawn to move!'
                : state.hasRolled && state.validMoves.length === 0
                ? 'No moves — passing turn...'
                : isPlayerBot ? 'Bot is playing...' : 'Tap the dice to roll 🎲'
              }
            </div>
            {/* Activity log — last action */}
            {state.lastAction && (
              <div className="text-[10px] text-[#a07850] mt-1 italic truncate">
                {state.lastAction}
              </div>
            )}
          </div>

          <Dice
            value={state.diceValue}
            rolling={state.diceRolling}
            disabled={!canRoll || isPlayerBot}
            onRoll={handleRollDice}
          />
        </div>
      )}

      {/* Activity Log */}
      {state.activityLog.length > 1 && (
        <div className="p-3 rounded-xl bg-[#FFF7EF]/80 border border-[#C99A3D]/20">
          <div className="text-[9px] font-black uppercase tracking-widest text-[#C99A3D] mb-1">Recent Activity</div>
          <div className="space-y-0.5 max-h-16 overflow-y-auto">
            {state.activityLog.slice(0, 5).map((log, i) => (
              <div key={i} className="text-[10px] text-[#8B6442]">• {log}</div>
            ))}
          </div>
        </div>
      )}

      {/* Pass & Play Handoff Modal */}
      {isHandoff && currentPlayer && (
        <PassDeviceModal player={currentPlayer} onContinue={confirmHandoff} />
      )}

      {/* Winner Modal */}
      {isGameFinished && winner && (
        <WinnerModal
          winner={winner}
          allPlayers={state.players}
          winnersRanking={state.winnersRanking}
          onPlayAgain={handleRestart}
          onChangeSetup={() => setIsSetupOpen(true)}
        />
      )}

      {/* Player Setup Modal */}
      <PlayerSetup
        isOpen={isSetupOpen}
        gameTitle="Ludo"
        minPlayers={2}
        maxPlayers={4}
        initialPlayers={playerConfigs}
        themes={LUDO_THEMES}
        currentTheme={theme}
        onThemeChange={(t) => { setTheme(t); StorageService.set('ludo_theme', t); }}
        onStart={handleSetupComplete}
        onClose={() => setIsSetupOpen(false)}
      />
    </div>
  );
}
