"use client";

import React, { useState } from "react";
import { AchievementItem } from "@/game/EvolutionSystem";
import { soundFX } from "@/game/SoundFX";
import {
  Trophy,
  Swords,
  Flame,
  MapPin,
  Crown,
  Lock,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface AchievementsShowcaseProps {
  achievements: AchievementItem[];
  onClaimOnChain?: (achievementId: number) => void;
}

export const AchievementsShowcase: React.FC<AchievementsShowcaseProps> = ({
  achievements,
  onClaimOnChain,
}) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const renderIcon = (iconName: string, unlocked: boolean) => {
    const className = `w-6 h-6 ${unlocked ? "text-arcade-black" : "text-arcade-black/40"}`;
    switch (iconName) {
      case "Trophy":
        return <Trophy className={className} />;
      case "Swords":
        return <Swords className={className} />;
      case "Flame":
        return <Flame className={className} />;
      case "MapPin":
        return <MapPin className={className} />;
      case "Crown":
        return <Crown className={className} />;
      default:
        return <Trophy className={className} />;
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-arcade-purple text-white rounded-lg border-2 border-arcade-black text-[11px] font-black uppercase tracking-wider shadow-arcade-sm mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            PHASE 10 • ON-CHAIN ACHIEVEMENTS
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-arcade-black tracking-tight leading-none">
            HUNTER <span className="text-arcade-electric">BADGES</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white rounded-2xl border-3 border-arcade-black px-4 py-2 shadow-arcade-sm flex items-center gap-2">
            <span className="text-xs font-black uppercase text-arcade-black/60">UNLOCKED:</span>
            <span className="text-lg font-black text-emerald-600">
              {unlockedCount} / {achievements.length}
            </span>
          </div>
          <div className="px-3 py-1.5 bg-arcade-yellow rounded-xl border-2 border-arcade-black text-xs font-black uppercase">
            Achievements.sol
          </div>
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map((ach) => {
          return (
            <div
              key={ach.id}
              className={`arcade-card p-5 relative overflow-hidden transition-all flex flex-col justify-between ${
                ach.unlocked
                  ? "bg-white border-arcade-black shadow-arcade-md ring-2 ring-arcade-electric/30"
                  : "bg-slate-100/80 border-slate-300 opacity-75"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl border-3 border-arcade-black flex items-center justify-center shadow-arcade-sm ${
                      ach.unlocked ? "bg-arcade-yellow" : "bg-slate-200 border-slate-400"
                    }`}
                  >
                    {ach.unlocked ? (
                      renderIcon(ach.icon, true)
                    ) : (
                      <Lock className="w-5 h-5 text-slate-500" />
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      ach.unlocked
                        ? "bg-emerald-100 text-emerald-800 border-emerald-500"
                        : "bg-slate-200 text-slate-600 border-slate-400"
                    }`}
                  >
                    {ach.unlocked ? "UNLOCKED" : "LOCKED"}
                  </span>
                </div>

                <div className="text-xl font-black text-arcade-black tracking-tight mb-1">
                  {ach.name}
                </div>
                <p className="text-xs font-bold text-arcade-black/70 mb-4">
                  {ach.description}
                </p>
              </div>

              {/* Reward & Proof Footer */}
              <div className="pt-3 border-t-2 border-arcade-black/10 mt-auto flex items-center justify-between">
                <div className="text-xs font-black text-amber-600">
                  +{ach.xpReward} Hunter XP
                </div>

                {ach.unlocked && ach.txHash && (
                  <a
                    href={`https://testnet.monadexplorer.com/tx/${ach.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-black text-arcade-electric flex items-center gap-1 hover:underline"
                  >
                    <span>Monad Proof</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
