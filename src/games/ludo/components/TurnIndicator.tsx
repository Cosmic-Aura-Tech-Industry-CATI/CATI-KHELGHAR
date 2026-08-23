'use client';
import React from 'react';
import { Player, GameState } from '../types';

interface TurnIndicatorProps {
  currentPlayer: Player;
  gameState: GameState;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({ currentPlayer, gameState }) => {
  const { phase, diceValue, hasRolled, validMoves } = gameState;

  let statusText = '';
  if (phase === 'rolling') statusText = currentPlayer.isBot ? '🤖 Bot is rolling...' : 'Roll the dice!';
  else if (phase === 'selecting') {
    statusText = validMoves.length > 0
      ? currentPlayer.isBot ? '🤖 Bot is choosing...' : '👆 Tap a glowing pawn to move'
      : 'No valid moves — passing turn...';
  }
  else if (phase === 'animating') statusText = '🌸 Moving...';
  else if (phase === 'handoff') statusText = 'Pass the device!';

  return (
    <div
      className="flex items-center justify-between p-3 rounded-2xl border transition-all"
      style={{
        background: `${currentPlayer.colorHex}12`,
        borderColor: `${currentPlayer.colorHex}50`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0"
          style={{ backgroundColor: currentPlayer.colorHex }} />
        <div>
          <div className="text-xs font-black text-[#6B4536]">{currentPlayer.name}&apos;s Turn</div>
          <div className="text-[10px] text-[#8B6442]">{statusText}</div>
        </div>
      </div>
      {diceValue !== null && hasRolled && (
        <div
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-sm"
          style={{ background: `${currentPlayer.colorHex}25`, color: currentPlayer.colorHex }}
        >
          <span>🎲</span>
          <span>{diceValue}</span>
        </div>
      )}
    </div>
  );
};
