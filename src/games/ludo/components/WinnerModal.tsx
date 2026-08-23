'use client';
import React from 'react';
import { Player } from '../types';

interface WinnerModalProps {
  winner: Player;
  allPlayers: Player[];
  winnersRanking: string[];
  onPlayAgain: () => void;
  onChangeSetup: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({ winner, allPlayers, winnersRanking, onPlayAgain, onChangeSetup }) => {
  const rankedPlayers = [
    ...winnersRanking.map(id => allPlayers.find(p => p.id === id)).filter((p): p is Player => !!p),
    ...allPlayers.filter(p => !winnersRanking.includes(p.id)),
  ];

  const medals = ['🥇', '🥈', '🥉', '4️⃣'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="mx-4 max-w-sm w-full rounded-3xl p-6
        bg-gradient-to-br from-[#FFF7EF] to-[#FDE8F0]
        border-2 border-[#C99A3D] shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
        <div className="text-center mb-4">
          <div className="text-5xl mb-2 select-none">🏆</div>
          <h2 className="text-2xl font-black text-[#6B4536]">Game Over!</h2>
          <p className="text-sm text-[#8B6442] mt-1">
            <span className="font-bold" style={{ color: winner.colorHex }}>{winner.name}</span> wins!
          </p>
        </div>

        {/* Rankings */}
        <div className="space-y-2 mb-6">
          {rankedPlayers.map((player, i) => (
            <div
              key={player.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                ${player.id === winner.id ? 'border-[#C99A3D] bg-amber-50 shadow-md' : 'border-[#e5d5c0] bg-white/60'}`}
            >
              <span className="text-xl select-none">{medals[i] ?? '🏅'}</span>
              <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: player.colorHex }} />
              <div className="flex-1">
                <span className="font-bold text-sm text-[#6B4536]">{player.name}</span>
                <span className="text-xs text-[#8B6442] block">{player.isBot ? '🤖 AI Bot' : '👤 Human'}</span>
              </div>
              <span className="text-xs font-bold text-[#C99A3D]">Rank #{i + 1}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onChangeSetup}
            className="py-3 rounded-2xl font-bold text-sm text-[#6B4536]
              bg-[#F8D0DA] border border-[#D95C83]/40
              hover:bg-[#F0C0CE] transition-colors
              focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            Change Players
          </button>
          <button
            type="button"
            onClick={onPlayAgain}
            className="py-3 rounded-2xl font-black text-white text-sm
              bg-gradient-to-r from-[#F58BA8] to-[#D95C83]
              shadow-[0_3px_0_#8B3A5A] active:shadow-none active:translate-y-0.5
              hover:from-[#f79ab4] hover:to-[#e46a8e]
              transition-all duration-150
              focus:outline-none focus:ring-4 focus:ring-pink-300"
          >
            Play Again 🌸
          </button>
        </div>
      </div>
    </div>
  );
};
