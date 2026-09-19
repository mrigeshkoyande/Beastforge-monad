"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { soundFX } from "@/game/SoundFX";
import { Sparkles, Zap, ArrowRight, Flame } from "lucide-react";
import { EvolutionStage, BeastAbility } from "@/game/EvolutionSystem";

interface EvolutionModalProps {
  data: {
    newLevel: number;
    stage: EvolutionStage;
    unlockedAbility: BeastAbility | null;
  };
  onClose: () => void;
}

export const EvolutionModal: React.FC<EvolutionModalProps> = ({
  data,
  onClose,
}) => {
  useEffect(() => {
    soundFX.playVictory();
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.55 },
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-mh-navy border border-mh-border max-w-md w-full p-6 text-center shadow-2xl rounded-xl relative">
        {/* Banner */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider mb-4 bg-mh-reward/20 border border-mh-reward text-mh-reward">
          <Sparkles className="w-4 h-4 text-mh-reward" />
          GENOMIC ASCENSION & LEVEL UP!
        </div>

        {/* Big Title */}
        <h2 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-wide mb-1 leading-none">
          BEAST <span className="text-mh-primary">ASCENDED!</span>
        </h2>
        <p className="text-xs text-mh-text2 mb-5">
          Your beast absorbed proving ground combat data and advanced to a higher power tier on Monad!
        </p>

        {/* Level Stats */}
        <div className="bg-mh-card rounded-xl border border-mh-border p-6 mb-5 shadow-inner flex flex-col items-center">
          <div className="font-display text-4xl font-black text-mh-reward">
            LEVEL {data.newLevel}
          </div>
          <span className="mh-badge bg-mh-primary/20 text-mh-primaryGlow border border-mh-primary mt-2 text-[10px]">
            <span>{data.stage} FORM</span>
          </span>
          <div className="text-xs font-mono text-mh-win mt-3 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-mh-win" />
            +Combat Power & HP attributes increased
          </div>
        </div>

        {/* New Ability Unlocked */}
        {data.unlockedAbility && (
          <div className="bg-[#07090E] border border-mh-border rounded-lg p-3.5 mb-5 text-left font-mono text-xs">
            <div className="text-[10px] uppercase text-mh-reward flex items-center gap-1 mb-1 font-bold">
              <Zap className="w-3.5 h-3.5 text-mh-reward" />
              NEW SIGNATURE ABILITY UNLOCKED!
            </div>
            <div className="text-sm font-bold text-white flex items-center justify-between">
              <span>{data.unlockedAbility.name}</span>
              <span className="text-xs text-mh-primary">{data.unlockedAbility.energyCost} Energy</span>
            </div>
            <div className="text-xs text-mh-text3 mt-1">
              {data.unlockedAbility.description}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="mh-btn w-full py-3 text-xs text-center"
        >
          <span className="flex items-center justify-center gap-1.5">
            CLAIM ASCENSION & CONTINUE <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </div>
    </div>
  );
};
