"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Beast } from "@/data/mockData";
import { BeastSvg } from "./BeastSvg";
import { soundFX } from "@/game/SoundFX";
import { Sparkles, Zap, ArrowRight, ShieldCheck, Flame } from "lucide-react";
import { EvolutionStage, BeastAbility } from "@/game/EvolutionSystem";

interface EvolutionModalProps {
  beast: Beast;
  newLevel: number;
  stage: EvolutionStage;
  unlockedAbility: BeastAbility | null;
  onClose: () => void;
}

export const EvolutionModal: React.FC<EvolutionModalProps> = ({
  beast,
  newLevel,
  stage,
  unlockedAbility,
  onClose,
}) => {
  useEffect(() => {
    soundFX.playVictory();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="arcade-card bg-warm-100 max-w-md w-full p-6 text-center shadow-arcade-xl relative border-4 border-arcade-black animate-scale-up">
        {/* Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border-3 border-arcade-black text-xs font-black uppercase tracking-wider shadow-arcade-sm mb-4 bg-arcade-yellow text-arcade-black animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-700" />
          GENOMIC ASCENSION & LEVEL UP!
        </div>

        {/* Big Title */}
        <h2 className="text-3xl sm:text-4xl font-black text-arcade-black tracking-tight mb-1 leading-none">
          {beast.name} <span className="text-arcade-electric">ASCENDED!</span>
        </h2>
        <p className="text-xs font-bold text-arcade-black/70 mb-5">
          Your beast absorbed battlefield Monad ether and evolved to a higher tier of power!
        </p>

        {/* Evolving Visual Showcase */}
        <div className="bg-white rounded-2xl border-4 border-arcade-black p-6 mb-5 shadow-arcade-sm flex flex-col items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-arcade-mint/30 to-transparent pointer-events-none" />
          
          <div className="relative">
            <BeastSvg id={beast.id} className="w-32 h-32 mb-2 animate-bounce" animate={true} />
            {stage !== "BASE" && (
              <span className="absolute -top-1 -right-2 px-2 py-0.5 bg-arcade-purple text-white border-2 border-arcade-black text-[10px] font-black rounded-lg shadow-arcade-sm">
                {stage} FORM
              </span>
            )}
          </div>

          <div className="text-2xl font-black text-arcade-black flex items-center gap-2">
            <span>{beast.name}</span>
            <span className="text-xs px-2 py-0.5 bg-arcade-coral rounded-md border border-arcade-black font-black">
              LEVEL {newLevel}
            </span>
          </div>

          <div className="text-xs font-bold text-emerald-700 mt-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            +20% Combat Attributes & Max HP Boosted!
          </div>
        </div>

        {/* New Ability Unlocked Alert */}
        {unlockedAbility && (
          <div className="bg-arcade-mint/60 border-3 border-arcade-black rounded-2xl p-4 mb-5 shadow-arcade-sm text-left">
            <div className="text-[10px] font-black uppercase text-arcade-black/60 flex items-center gap-1 mb-1">
              <Zap className="w-3.5 h-3.5 text-arcade-electric fill-arcade-electric" />
              NEW SIGNATURE ABILITY UNLOCKED!
            </div>
            <div className="text-base font-black text-arcade-black flex items-center justify-between">
              <span>{unlockedAbility.name}</span>
              <span className="text-xs font-bold text-arcade-electric">{unlockedAbility.energyCost} Energy</span>
            </div>
            <div className="text-xs font-bold text-arcade-black/80 mt-0.5">
              {unlockedAbility.description}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="arcade-btn w-full py-4 bg-arcade-electric text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 hover:scale-[1.02]"
        >
          CLAIM ASCENSION & CONTINUE <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
