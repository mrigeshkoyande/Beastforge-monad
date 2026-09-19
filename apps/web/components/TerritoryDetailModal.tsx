"use client";

import React, { useState } from "react";
import { TerritoryWarState } from "@/game/EvolutionSystem";
import { Beast } from "@/data/mockData";
import { soundFX } from "@/game/SoundFX";
import { BeastSvg } from "./BeastSvg";
import {
  Shield,
  Swords,
  Flame,
  Trophy,
  History,
  X,
  TrendingUp,
  AlertCircle,
  Zap,
} from "lucide-react";

interface TerritoryDetailModalProps {
  territory: TerritoryWarState;
  playerBeast: Beast;
  onClose: () => void;
  onAttack: (territory: TerritoryWarState) => void;
  onFortify: (territory: TerritoryWarState) => void;
}

export const TerritoryDetailModal: React.FC<TerritoryDetailModalProps> = ({
  territory,
  playerBeast,
  onClose,
  onAttack,
  onFortify,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");
  const isPlayerOwner = territory.currentOwner.includes("YOU") || territory.currentOwner.includes("0x71C9");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0A0E17] border border-[#1E273D] rounded-2xl max-w-2xl w-full p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative max-h-[92vh] overflow-y-auto text-white">
        {/* Close Button */}
        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl border border-[#1E273D] bg-[#101522] hover:bg-[#E63946] text-[#94A3B8] hover:text-white flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Territory Header */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
          <div className="px-3 py-1 rounded-lg border border-[#1E273D] bg-[#101522] text-xs font-mono font-bold uppercase text-[#F4D35E]">
            {territory.zone}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#101522] rounded-lg border border-[#1E273D] text-[11px] font-mono font-bold uppercase text-[#94A3B8]">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
            <span>ID #{territory.numericId}</span>
          </div>
          <div className="px-2.5 py-1 bg-[#E63946]/15 rounded-lg border border-[#E63946]/40 text-[11px] font-mono font-bold uppercase text-[#E63946] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{territory.rewardMultiplier}x MULTIPLIER</span>
          </div>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-wider leading-none mb-2">
          {territory.name}
        </h2>
        <p className="text-xs sm:text-sm font-sans text-[#94A3B8] mb-6 leading-relaxed">
          {territory.description}
        </p>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#1E273D] pb-3">
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab("overview");
            }}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase border transition-all ${
              activeTab === "overview"
                ? "bg-[#E63946] text-white border-[#FF4D5B] shadow-[0_0_15px_rgba(230,57,70,0.5)]"
                : "bg-[#101522] text-[#94A3B8] border-[#1E273D] hover:text-white"
            }`}
          >
            Tactical Overview
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab("history");
            }}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase border transition-all flex items-center gap-1.5 ${
              activeTab === "history"
                ? "bg-[#E63946] text-white border-[#FF4D5B] shadow-[0_0_15px_rgba(230,57,70,0.5)]"
                : "bg-[#101522] text-[#94A3B8] border-[#1E273D] hover:text-white"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Battle Logs ({territory.recentBattles.length})
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Guardian & Owner Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Guardian Card */}
              <div className="bg-[#0B0F17] rounded-xl border border-[#1E273D] p-4 flex items-center gap-4 shadow-lg">
                <div className="w-16 h-16 rounded-xl border border-[#1E273D] bg-[#101522] flex items-center justify-center shrink-0">
                  <BeastSvg id={territory.guardian.toLowerCase().includes("vortex") ? "vortex" : territory.guardian.toLowerCase().includes("titan") ? "titan" : "shadow"} className="w-12 h-12" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#64748B] font-bold">ZONE GUARDIAN</span>
                  <div className="text-base font-display font-black text-white leading-tight flex items-center gap-1.5 uppercase">
                    <span>{territory.guardian}</span>
                    {territory.guardianStage !== "BASE" && (
                      <span className="px-1.5 py-0.5 bg-[#836EF9]/20 border border-[#836EF9]/50 text-[#836EF9] text-[9px] rounded font-mono font-bold">
                        {territory.guardianStage}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono font-bold text-[#457B9D] mt-0.5">
                    Level {territory.guardianLevel} • Defending
                  </div>
                </div>
              </div>

              {/* Owner Profile Preview */}
              <div className="bg-[#0B0F17] rounded-xl border border-[#1E273D] p-4 flex flex-col justify-center shadow-lg">
                <span className="text-[10px] font-mono uppercase text-[#64748B] font-bold">TERRITORY LORD</span>
                <div className="text-base font-display font-black text-white uppercase truncate">
                  {territory.currentOwner}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs font-mono font-bold">
                  <span className="text-[#F4D35E] flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-[#F4D35E] text-[#F4D35E]" />
                    {territory.winStreak} Streak
                  </span>
                  <span className="text-[#1E273D]">•</span>
                  <span className="text-[#00E676]">
                    {territory.conqueredCount} Captures
                  </span>
                </div>
              </div>
            </div>

            {/* Defense Level Bar & Reward Breakdown */}
            <div className="bg-[#0B0F17] rounded-xl border border-[#1E273D] p-5 shadow-lg space-y-4">
              {/* Defense Bar */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono font-bold mb-2">
                  <span className="flex items-center gap-1.5 text-white uppercase">
                    <Shield className="w-4 h-4 text-[#00E676]" />
                    Fortification Armor (Level {territory.defenseLevel}/{territory.maxDefenseLevel})
                  </span>
                  <span className="text-[#00E676]">{territory.defenseHp} Shield HP</span>
                </div>
                <div className="w-full bg-[#05070B] h-3.5 rounded-full border border-[#1E273D] overflow-hidden flex">
                  {Array.from({ length: territory.maxDefenseLevel }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 border-r border-[#1E273D] last:border-0 ${
                        i < territory.defenseLevel ? "bg-[#00E676]" : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Reward Multiplier Formula */}
              <div className="p-3.5 bg-[#07090E] rounded-xl border border-[#1E273D] text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Base Reward:</span>
                  <span className="font-bold text-white">{territory.baseReward}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Streak & Multiplier Bonus:</span>
                  <span className="font-bold text-[#F4D35E]">+{Math.round((territory.rewardMultiplier - 1) * 100)}% ({territory.rewardMultiplier}x)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#1E273D]">
                  <span className="font-bold text-white">Total Payout to Conqueror:</span>
                  <span className="font-black text-[#00E676] text-sm">
                    {(parseFloat(territory.baseReward) * territory.rewardMultiplier).toFixed(2)} MON
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  soundFX.playAttack();
                  onAttack(territory);
                }}
                className="relative group py-3.5 px-4 rounded-xl font-display font-black text-sm uppercase tracking-wider text-white transition-all bg-gradient-to-r from-[#E63946] via-[#B2182B] to-[#8B1E2D] shadow-[0_0_20px_rgba(230,57,70,0.4)] hover:shadow-[0_0_30px_rgba(230,57,70,0.8)] hover:scale-[1.02] border border-[#FF4D5B]/60 flex items-center justify-center gap-2"
              >
                <Swords className="w-4 h-4" />
                <span>ATTACK &amp; CONQUER ({territory.entryFee})</span>
              </button>

              <button
                onClick={() => {
                  soundFX.playDefend();
                  onFortify(territory);
                }}
                className="py-3.5 px-4 rounded-xl font-display font-black text-sm uppercase tracking-wider text-white transition-all bg-[#101522] hover:bg-[#171E30] border border-[#1E273D] hover:border-[#457B9D] flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-[#457B9D]" />
                <span>{isPlayerOwner ? "FORTIFY DEFENSE (+1 LVL)" : "STAKE REINFORCEMENTS"}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-3">
            <div className="text-[11px] font-mono text-[#94A3B8] flex items-center gap-1.5 mb-3">
              <AlertCircle className="w-3.5 h-3.5 text-[#F4D35E]" />
              <span>Showing recent on-chain verified arena skirmishes at {territory.name}.</span>
            </div>

            {territory.recentBattles.map((b) => (
              <div
                key={b.id}
                className="bg-[#0B0F17] rounded-xl border border-[#1E273D] p-3.5 shadow-md flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center font-mono font-black text-xs ${
                      b.won
                        ? "bg-[#00E676]/20 border-[#00E676]/50 text-[#00E676]"
                        : "bg-[#E63946]/20 border-[#E63946]/50 text-[#E63946]"
                    }`}
                  >
                    {b.won ? "DEF" : "FALL"}
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-white">
                      {b.attackerBeast} vs {b.defenderBeast}
                    </div>
                    <div className="text-[10px] font-mono text-[#64748B]">
                      {b.attacker} challenged {b.defender} • {b.timestamp}
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-[#00E676]">
                    {b.won ? `+${b.rewardEarned}` : "0 MON"}
                  </div>
                  <span className="text-[9px] uppercase text-[#64748B]">
                    {b.won ? "Defended" : "Captured"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
