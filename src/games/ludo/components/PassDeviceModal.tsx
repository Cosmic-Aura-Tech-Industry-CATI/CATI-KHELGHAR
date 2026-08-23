'use client';
import React from 'react';
import { Player } from '../types';

interface PassDeviceModalProps {
  player: Player;
  onContinue: () => void;
}

export const PassDeviceModal: React.FC<PassDeviceModalProps> = ({ player, onContinue }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative mx-4 max-w-sm w-full rounded-3xl p-8 text-center
        bg-gradient-to-br from-[#FFF7EF] to-[#FDE8F0]
        border-2 border-[#C99A3D] shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
        {/* Sakura decoration */}
        <div className="text-5xl mb-4 select-none">🌸</div>
        <h2 className="text-xl font-black text-[#6B4536] mb-2">Pass the Device</h2>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{ backgroundColor: `${player.colorHex}20`, border: `2px solid ${player.colorHex}` }}
        >
          <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: player.colorHex }} />
          <span className="font-bold text-[#6B4536]">It&apos;s {player.name}&apos;s turn</span>
        </div>
        <p className="text-sm text-[#8B6442] mb-6">
          Please pass the device to <strong>{player.name}</strong>.
          When ready, tap the button below.
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-3.5 rounded-2xl font-black text-white text-base
            bg-gradient-to-r from-[#F58BA8] to-[#D95C83]
            shadow-[0_4px_0_#8B3A5A] active:shadow-none active:translate-y-1
            hover:from-[#f79ab4] hover:to-[#e46a8e]
            transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-pink-300"
        >
          I&apos;m Ready! Let&apos;s Play 🎲
        </button>
      </div>
    </div>
  );
};
