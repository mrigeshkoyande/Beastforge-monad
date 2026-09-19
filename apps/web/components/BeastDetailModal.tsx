"use client";

import React from "react";
import { Beast } from "@/data/mockData";
import { BeastSvg } from "./BeastSvg";
import { soundFX } from "@/game/SoundFX";
import { X, Swords, Zap, Shield, Trophy, Flame, BrainCircuit } from "lucide-react";

interface BeastDetailModalProps {
  beast: Beast | null;
  onClose: () => void;
  onSelectForArena: (beast: Beast) => void;
}

export const BeastDetailModal: React.FC<BeastDetailModalProps> = ({
  beast,
  onClose,
  onSelectForArena,
}) => {
  if (!beast) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="arcade-card bg-warm-100 max-w-lg w-full p-6 relative shadow-arcade-xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 bg-warm-200 rounded-xl border-3 border-arcade-black flex items-center justify-center shadow-arcade-sm hover:bg-arcade-coral transition-colors"
        >
          <X className="w-5 h-5 text-arcade-black" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-xs font-black px-2.5 py-1 bg-warm-300 rounded-md border-2 border-arcade-black">
            NFT #{String(beast.tokenId).padStart(3, "0")}
          </span>
          <span className="text-xs font-black px-3 py-1 bg-arcade-coral rounded-md border-2 border-arcade-black uppercase shadow-arcade-sm">
            {beast.rarity}
          </span>
          <span className="text-xs font-black px-3 py-1 bg-arcade-yellow rounded-md border-2 border-arcade-black uppercase flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            {beast.element}
          </span>
        </div>

        {/* Visual Box */}
        <div className="bg-white rounded-2xl border-4 border-arcade-black p-6 flex flex-col items-center justify-center mb-6 shadow-arcade-sm">
          <BeastSvg id={beast.id} className="w-44 h-44 mb-2" animate={true} />
          <h2 className="text-3xl font-black text-arcade-black tracking-tight">{beast.name}</h2>
          <p className="text-xs font-bold text-arcade-black/70">{beast.title}</p>
        </div>

        {/* Level & XP Progression */}
        <div className="bg-white rounded-xl border-3 border-arcade-black p-4 mb-4 shadow-arcade-sm">
          <div className="flex justify-between items-center mb-1 text-xs font-black">
            <span>LEVEL {beast.level}</span>
            <span className="text-arcade-electric font-mono">
              {beast.xp} / {beast.nextLevelXp} XP
            </span>
          </div>
          <div className="h-3 bg-warm-200 rounded-full border-2 border-arcade-black overflow-hidden">
            <div
              className="h-full bg-arcade-electric rounded-full transition-all"
              style={{ width: `${(beast.xp / beast.nextLevelXp) * 100}%` }}
            />
          </div>
        </div>

        {/* Combat Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white p-3 rounded-xl border-3 border-arcade-black shadow-arcade-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-100 border border-arcade-black flex items-center justify-center">
                <Swords className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-xs font-black">ATTACK</span>
            </div>
            <span className="text-lg font-black">{beast.attack}</span>
          </div>

          <div className="bg-white p-3 rounded-xl border-3 border-arcade-black shadow-arcade-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-arcade-black flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-black">DEFENSE</span>
            </div>
            <span className="text-lg font-black">{beast.defense}</span>
          </div>

          <div className="bg-white p-3 rounded-xl border-3 border-arcade-black shadow-arcade-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 border border-arcade-black flex items-center justify-center">
                <Zap className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-xs font-black">SPEED</span>
            </div>
            <span className="text-lg font-black">{beast.speed}</span>
          </div>

          <div className="bg-white p-3 rounded-xl border-3 border-arcade-black shadow-arcade-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 border border-arcade-black flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-xs font-black">AI STYLE</span>
            </div>
            <span className="text-xs font-black text-purple-700 uppercase">{beast.personality}</span>
          </div>
        </div>

        {/* Special Ability Box */}
        <div className="bg-arcade-yellow/60 border-3 border-arcade-black rounded-xl p-4 mb-5 shadow-arcade-sm">
          <div className="flex items-center gap-1.5 text-xs font-black text-arcade-black mb-1">
            <Zap className="w-4 h-4 text-amber-600" />
            SIGNATURE SPECIAL: {beast.specialMove}
          </div>
          <p className="text-xs font-bold text-arcade-black/80">{beast.specialDesc}</p>
        </div>

        {/* Battle Record */}
        <div className="flex items-center justify-between px-4 py-2 bg-white rounded-xl border-2 border-arcade-black mb-6 text-xs font-black">
          <span>CAREER RECORD</span>
          <span className="text-arcade-black font-mono">
            {beast.wins} W - {beast.losses} L ({beast.winRate}% Win Rate)
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => {
            soundFX.playAttack();
            onSelectForArena(beast);
            onClose();
          }}
          className="arcade-btn w-full py-3.5 bg-arcade-electric text-white rounded-xl text-sm flex items-center justify-center gap-2"
        >
          <Swords className="w-4 h-4" />
          FIGHT WITH {beast.name} IN ARENA
        </button>
      </div>
    </div>
  );
};
