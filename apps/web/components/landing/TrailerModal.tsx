"use client";

import React from "react";
import Image from "next/image";
import { X, Play, Volume2, Shield, Flame, Swords, ExternalLink } from "lucide-react";
import { soundFX } from "@/game/SoundFX";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnterCity: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  onEnterCity,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#0B0F17] border border-[#E63946]/50 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(230,57,70,0.3)]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E273D] bg-[#05070B]/80">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E63946] animate-pulse" />
            <span className="font-display font-black text-lg uppercase tracking-wider text-white">
              CINEMATIC TEASER · MONAD HUNT: CITY LEAGUE
            </span>
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#161B26] text-[#94A3B8] hover:text-white hover:bg-[#E63946]/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Animated Presentation Area */}
        <div className="relative aspect-video w-full bg-[#05070B] flex items-center justify-center overflow-hidden group">
          <Image
            src="/assets/hero/mumbai-beast-hero.jpg"
            alt="Monad Hunt Cinematic Teaser"
            fill
            className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-black/60" />

          {/* Central Play Pulse Indicator */}
          <div className="relative z-10 text-center p-6 max-w-lg">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#E63946]/90 flex items-center justify-center shadow-[0_0_40px_rgba(230,57,70,0.8)] border border-white/30 cursor-pointer hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
            <h3 className="font-display font-black text-3xl sm:text-4xl uppercase text-white mt-6 tracking-wide drop-shadow-lg">
              THE WAR FOR MUMBAI HAS BEGUN
            </h3>
            <p className="text-[#94A3B8] text-xs sm:text-sm mt-2 font-mono">
              Catch AI Beasts. Stake your claims. Battle for territorial control on Monad Testnet at 10,000 TPS.
            </p>
          </div>

          {/* HUD Accents */}
          <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-[#F4D35E] bg-black/60 px-3 py-1 rounded border border-[#F4D35E]/40">
            RECORDED ON MONAD TESTNET
          </div>
          <div className="absolute bottom-4 left-4 z-10 font-mono text-xs text-white bg-black/60 px-3 py-1.5 rounded border border-white/10 flex items-center gap-2">
            <Swords className="w-4 h-4 text-[#E63946]" />
            <span>SEASON 01 · 12 TERRITORIES · 4 CREWS</span>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-[#0B0F17] border-t border-[#1E273D]">
          <div className="flex items-center gap-3 text-xs font-mono text-[#94A3B8]">
            <Flame className="w-4 h-4 text-[#E63946]" />
            <span>Over 1,420 battles settled with cryptographic EIP-712 proofs.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded text-xs font-mono font-bold text-[#94A3B8] hover:text-white bg-[#161B26] border border-[#1E273D]"
            >
              CLOSE
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
                onEnterCity();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded font-display font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-[#E63946] to-[#8B1E2D] shadow-[0_0_20px_rgba(230,57,70,0.5)] hover:shadow-[0_0_30px_rgba(230,57,70,0.8)] border border-[#FF4D5B]/50"
            >
              ENTER THE CITY →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
