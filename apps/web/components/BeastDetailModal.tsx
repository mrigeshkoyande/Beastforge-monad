"use client";

import React from "react";
import { Beast } from "@/data/mockData";
import { BeastSvg } from "./BeastSvg";
import { soundFX } from "@/game/SoundFX";
import { X, Swords, Zap, Shield, Flame, BrainCircuit } from "lucide-react";

interface BeastDetailModalProps {
  beast: Beast | null;
  onClose: () => void;
  onSelect?: (beast: Beast) => void;
  onSelectForArena?: (beast: Beast) => void;
}

export const BeastDetailModal: React.FC<BeastDetailModalProps> = ({
  beast,
  onClose,
  onSelect,
  onSelectForArena,
}) => {
  if (!beast) return null;

  const handleSelect = () => {
    soundFX.playAttack();
    if (onSelect) onSelect(beast);
    if (onSelectForArena) onSelectForArena(beast);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-mh-navy border border-mh-border max-w-lg w-full p-6 relative rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 bg-mh-card rounded-lg border border-mh-border flex items-center justify-center text-mh-text2 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-xs font-bold px-2.5 py-1 bg-mh-card rounded border border-mh-border text-mh-text2">
            NFT #{String(beast.tokenId).padStart(3, "0")}
          </span>
          <span className="mh-badge bg-mh-card text-mh-reward border border-mh-border text-[10px]">
            <span>{beast.rarity}</span>
          </span>
          <span className="mh-badge bg-mh-live/20 text-mh-live border border-mh-live/40 text-[10px]">
            <span>{beast.element}</span>
          </span>
        </div>

        {/* Visual Box */}
        <div className="bg-mh-card rounded-xl border border-mh-border p-6 flex flex-col items-center justify-center mb-5 shadow-inner">
          <BeastSvg id={beast.id} className="w-36 h-36 mb-2" animate={true} />
          <h2 className="font-display text-3xl font-black text-white uppercase tracking-wide">{beast.name}</h2>
          <p className="text-xs font-mono text-mh-text3">{beast.title}</p>
        </div>

        {/* Level & XP Progression */}
        <div className="bg-mh-card rounded-lg border border-mh-border p-4 mb-4">
          <div className="flex justify-between items-center mb-1.5 text-xs font-mono">
            <span className="text-white font-bold">LEVEL {beast.level}</span>
            <span className="text-mh-primary font-bold">
              {beast.xp} / {beast.nextLevelXp} XP
            </span>
          </div>
          <div className="h-2 bg-[#07090E] rounded-full border border-mh-border overflow-hidden">
            <div
              className="h-full bg-mh-primary rounded-full transition-all"
              style={{ width: `${(beast.xp / beast.nextLevelXp) * 100}%` }}
            />
          </div>
        </div>

        {/* Combat Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
          <div className="bg-mh-card p-3 rounded-lg border border-mh-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-mh-text2">
              <Swords className="w-4 h-4 text-mh-live" />
              <span>ATTACK</span>
            </div>
            <span className="text-base font-bold text-white">{beast.attack}</span>
          </div>

          <div className="bg-mh-card p-3 rounded-lg border border-mh-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-mh-text2">
              <Shield className="w-4 h-4 text-mh-defend" />
              <span>DEFENSE</span>
            </div>
            <span className="text-base font-bold text-white">{beast.defense}</span>
          </div>

          <div className="bg-mh-card p-3 rounded-lg border border-mh-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-mh-text2">
              <Zap className="w-4 h-4 text-mh-reward" />
              <span>SPEED</span>
            </div>
            <span className="text-base font-bold text-white">{beast.speed}</span>
          </div>

          <div className="bg-mh-card p-3 rounded-lg border border-mh-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-mh-text2">
              <BrainCircuit className="w-4 h-4 text-mh-primary" />
              <span>STYLE</span>
            </div>
            <span className="text-xs font-bold text-mh-primary uppercase">{beast.personality}</span>
          </div>
        </div>

        {/* Special Ability Box */}
        <div className="bg-[#07090E] border border-mh-border rounded-lg p-3.5 mb-5 font-mono text-xs">
          <div className="flex items-center gap-1.5 font-bold text-mh-reward mb-1">
            <Zap className="w-3.5 h-3.5" />
            SIGNATURE: {beast.specialMove}
          </div>
          <p className="text-mh-text2">{beast.specialDesc}</p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleSelect}
          className="mh-btn w-full py-3 text-xs text-center"
        >
          <span className="flex items-center justify-center gap-2">
            <Swords className="w-4 h-4" /> SELECT FOR PROVING GROUND
          </span>
        </button>
      </div>
    </div>
  );
};
