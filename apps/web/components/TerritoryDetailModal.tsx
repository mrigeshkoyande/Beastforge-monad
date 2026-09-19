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
  ExternalLink,
  ChevronRight,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="arcade-card bg-warm-100 max-w-2xl w-full p-6 shadow-arcade-xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl border-3 border-arcade-black bg-white hover:bg-arcade-coral flex items-center justify-center shadow-arcade-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Territory Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`px-3 py-1 rounded-lg border-2 border-arcade-black text-xs font-black uppercase shadow-arcade-sm ${territory.badgeBg}`}>
            {territory.zone}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border-2 border-arcade-black text-[11px] font-black uppercase text-arcade-black shadow-arcade-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ID #{territory.numericId}</span>
          </div>
          <div className="px-2.5 py-1 bg-arcade-yellow rounded-lg border-2 border-arcade-black text-[11px] font-black uppercase flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{territory.rewardMultiplier}x MULTIPLIER</span>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-arcade-black tracking-tight leading-none mb-2">
          {territory.name}
        </h2>
        <p className="text-xs sm:text-sm font-bold text-arcade-black/75 mb-6">
          {territory.description}
        </p>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b-2 border-arcade-black/20 pb-2">
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab("overview");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase border-2 border-arcade-black transition-all ${
              activeTab === "overview"
                ? "bg-arcade-electric text-white shadow-arcade-sm"
                : "bg-white text-arcade-black hover:bg-warm-50"
            }`}
          >
            Tactical Overview
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab("history");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase border-2 border-arcade-black transition-all flex items-center gap-1.5 ${
              activeTab === "history"
                ? "bg-arcade-electric text-white shadow-arcade-sm"
                : "bg-white text-arcade-black hover:bg-warm-50"
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
              <div className="bg-white rounded-2xl border-3 border-arcade-black p-4 shadow-arcade-sm flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border-2 border-arcade-black bg-warm-100 flex items-center justify-center shrink-0">
                  <BeastSvg id={territory.guardian.toLowerCase().includes("vortex") ? "vortex" : territory.guardian.toLowerCase().includes("titan") ? "titan" : "shadow"} className="w-12 h-12" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-arcade-black/60">ZONE GUARDIAN</span>
                  <div className="text-base font-black text-arcade-black leading-tight flex items-center gap-1.5">
                    <span>{territory.guardian}</span>
                    {territory.guardianStage !== "BASE" && (
                      <span className="px-1.5 py-0.2 bg-arcade-purple text-white text-[9px] rounded font-black">
                        {territory.guardianStage}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-arcade-electric">
                    Level {territory.guardianLevel} • Defending
                  </div>
                </div>
              </div>

              {/* Owner Profile Preview */}
              <div className="bg-white rounded-2xl border-3 border-arcade-black p-4 shadow-arcade-sm flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase text-arcade-black/60">TERRITORY LORD</span>
                <div className="text-base font-black text-arcade-black truncate">
                  {territory.currentOwner}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs font-black">
                  <span className="text-amber-600 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {territory.winStreak} Streak
                  </span>
                  <span className="text-arcade-black/40">•</span>
                  <span className="text-emerald-700">
                    {territory.conqueredCount} Captures
                  </span>
                </div>
              </div>
            </div>

            {/* Defense Level Bar & Reward Breakdown */}
            <div className="bg-white rounded-2xl border-3 border-arcade-black p-5 shadow-arcade-sm space-y-4">
              {/* Defense Bar */}
              <div>
                <div className="flex justify-between items-center text-xs font-black mb-1.5">
                  <span className="flex items-center gap-1 text-arcade-black uppercase">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    Fortification Armor (Level {territory.defenseLevel}/{territory.maxDefenseLevel})
                  </span>
                  <span className="text-emerald-700">{territory.defenseHp} Shield HP</span>
                </div>
                <div className="w-full bg-slate-200 h-3.5 rounded-full border-2 border-arcade-black overflow-hidden flex">
                  {Array.from({ length: territory.maxDefenseLevel }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 border-r border-arcade-black last:border-0 ${
                        i < territory.defenseLevel ? "bg-emerald-500" : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Reward Multiplier Formula */}
              <div className="p-3 bg-warm-50 rounded-xl border-2 border-dashed border-arcade-black/40 text-xs font-bold space-y-1">
                <div className="flex justify-between">
                  <span className="text-arcade-black/70">Base Reward:</span>
                  <span className="font-black text-arcade-black">{territory.baseReward}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-arcade-black/70">Streak & Multiplier Bonus:</span>
                  <span className="font-black text-arcade-electric">+{Math.round((territory.rewardMultiplier - 1) * 100)}% ({territory.rewardMultiplier}x)</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-arcade-black/10">
                  <span className="font-black text-arcade-black">Total Payout to Conqueror:</span>
                  <span className="font-black text-emerald-600 text-sm">
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
                className="arcade-btn py-3.5 px-4 bg-arcade-coral text-arcade-black rounded-xl text-sm font-black flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Swords className="w-4 h-4" />
                ATTACK & CONQUER ({territory.entryFee})
              </button>

              <button
                onClick={() => {
                  soundFX.playDefend();
                  onFortify(territory);
                }}
                className="arcade-btn py-3.5 px-4 bg-arcade-mint text-arcade-black rounded-xl text-sm font-black flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Shield className="w-4 h-4" />
                {isPlayerOwner ? "FORTIFY DEFENSE (+1 LVL)" : "STAKE REINFORCEMENTS"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-arcade-black/60 flex items-center gap-1 mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              Showing recent on-chain verified arena skirmishes at {territory.name}.
            </div>

            {territory.recentBattles.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-xl border-2 border-arcade-black p-3.5 shadow-arcade-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg border-2 border-arcade-black flex items-center justify-center font-black text-xs ${
                      b.won ? "bg-emerald-400 text-arcade-black" : "bg-red-300 text-arcade-black"
                    }`}
                  >
                    {b.won ? "DEF" : "FALL"}
                  </div>
                  <div>
                    <div className="text-xs font-black text-arcade-black">
                      {b.attackerBeast} vs {b.defenderBeast}
                    </div>
                    <div className="text-[10px] font-bold text-arcade-black/60">
                      {b.attacker} challenged {b.defender} • {b.timestamp}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-emerald-700">
                    {b.won ? `+${b.rewardEarned}` : "0 MON"}
                  </div>
                  <span className="text-[9px] font-black uppercase text-arcade-black/40">
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
