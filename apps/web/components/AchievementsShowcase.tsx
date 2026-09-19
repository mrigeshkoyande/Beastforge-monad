"use client";

import React from "react";
import { AchievementItem } from "@/game/EvolutionSystem";
import {
  Trophy,
  Swords,
  Flame,
  MapPin,
  Crown,
  Lock,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface AchievementsShowcaseProps {
  achievements: AchievementItem[];
  onClaimOnChain?: (achievementId: number) => void;
}

export const AchievementsShowcase: React.FC<AchievementsShowcaseProps> = ({
  achievements,
}) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const renderIcon = (iconName: string, unlocked: boolean) => {
    const className = `w-6 h-6 ${unlocked ? "text-[#F4D35E]" : "text-[#64748B]"}`;
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#101522] text-[#F4D35E] rounded-lg border border-[#1E273D] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F4D35E]" />
            ON-CHAIN ACHIEVEMENTS
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-wider uppercase leading-none">
            HUNTER <span className="text-[#E63946]">BADGES</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0B0F17] rounded-xl border border-[#1E273D] px-4 py-2 flex items-center gap-2 font-mono">
            <span className="text-xs uppercase text-[#64748B] font-bold">UNLOCKED:</span>
            <span className="text-lg font-black text-[#00E676]">
              {unlockedCount} / {achievements.length}
            </span>
          </div>
          <div className="px-3 py-1.5 bg-[#101522] rounded-lg border border-[#1E273D] text-xs font-mono font-bold uppercase text-[#94A3B8]">
            HuntCore.sol
          </div>
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map((ach) => {
          return (
            <div
              key={ach.id}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                ach.unlocked
                  ? "bg-[#0B0F17] border-[#E63946]/50 shadow-[0_0_20px_rgba(230,57,70,0.15)] ring-1 ring-[#E63946]/30"
                  : "bg-[#0A0E17]/60 border-[#1E273D] opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
                      ach.unlocked
                        ? "bg-[#F4D35E]/15 border-[#F4D35E]/40"
                        : "bg-[#101522] border-[#1E273D]"
                    }`}
                  >
                    {ach.unlocked ? (
                      renderIcon(ach.icon, true)
                    ) : (
                      <Lock className="w-5 h-5 text-[#64748B]" />
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      ach.unlocked
                        ? "bg-[#00E676]/15 text-[#00E676] border-[#00E676]/40"
                        : "bg-[#101522] text-[#64748B] border-[#1E273D]"
                    }`}
                  >
                    {ach.unlocked ? "UNLOCKED" : "LOCKED"}
                  </span>
                </div>

                <div className="text-xl font-display font-black text-white tracking-wide uppercase mb-1">
                  {ach.name}
                </div>
                <p className="text-xs font-sans text-[#94A3B8] mb-4">
                  {ach.description}
                </p>
              </div>

              {/* Reward & Proof Footer */}
              <div className="pt-3 border-t border-[#1E273D] mt-auto flex items-center justify-between font-mono">
                <div className="text-xs font-bold text-[#F4D35E]">
                  +{ach.xpReward} Hunter XP
                </div>

                {ach.unlocked && ach.txHash && (
                  <a
                    href={`https://testnet.monadexplorer.com/tx/${ach.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-bold text-[#457B9D] flex items-center gap-1 hover:text-white transition-colors"
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
