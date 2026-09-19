"use client";

import React, { useState } from "react";
import { TerritoryWarState } from "@/game/EvolutionSystem";
import { Beast } from "@/data/mockData";
import { BeastSvg } from "./BeastSvg";
import { soundFX } from "@/game/SoundFX";
import {
  MapPin,
  Swords,
  Shield,
  Trophy,
  Crown,
  Sparkles,
  Filter,
  Flame,
  TrendingUp,
  Activity,
  ChevronRight,
  Compass,
  Navigation,
} from "lucide-react";
import { TerritoryDetailModal } from "./TerritoryDetailModal";

interface TerritoryMapProps {
  territories: TerritoryWarState[];
  playerBeast: Beast;
  onChallengeTerritory: (territory: TerritoryWarState) => void;
  onFortifyTerritory: (territory: TerritoryWarState) => void;
}

export const TerritoryMap: React.FC<TerritoryMapProps> = ({
  territories,
  playerBeast,
  onChallengeTerritory,
  onFortifyTerritory,
}) => {
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryWarState | null>(null);
  const [hoveredTerritory, setHoveredTerritory] = useState<TerritoryWarState | null>(null);
  const [viewMode, setViewMode] = useState<"MAP" | "LIST">("MAP");
  const [zoneFilter, setZoneFilter] = useState<string>("ALL");

  const filteredTerritories =
    zoneFilter === "ALL"
      ? territories
      : territories.filter((t) => t.zone.toLowerCase().includes(zoneFilter.toLowerCase()));

  return (
    <div className="py-8 max-w-7xl mx-auto px-4">
      {/* Detail Modal */}
      {selectedTerritory && (
        <TerritoryDetailModal
          territory={selectedTerritory}
          playerBeast={playerBeast}
          onClose={() => setSelectedTerritory(null)}
          onAttack={(t) => {
            setSelectedTerritory(null);
            onChallengeTerritory(t);
          }}
          onFortify={(t) => {
            onFortifyTerritory(t);
          }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-arcade-coral rounded-lg border-2 border-arcade-black text-[11px] font-black uppercase tracking-wider shadow-arcade-sm mb-2">
            <Flame className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
            REAL-WORLD MUMBAI CONQUEST
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-arcade-black tracking-tight leading-none">
            MUMBAI <span className="text-arcade-electric">TERRITORY WAR</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          {/* Toggle Map View vs List View */}
          <div className="flex items-center bg-white p-1 rounded-xl border-3 border-arcade-black shadow-arcade-sm">
            <button
              onClick={() => {
                soundFX.playClick();
                setViewMode("MAP");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 transition-all ${
                viewMode === "MAP"
                  ? "bg-arcade-electric text-white shadow-arcade-sm"
                  : "text-arcade-black hover:bg-slate-100"
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              LIVE MUMBAI MAP
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setViewMode("LIST");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 transition-all ${
                viewMode === "LIST"
                  ? "bg-arcade-electric text-white shadow-arcade-sm"
                  : "text-arcade-black hover:bg-slate-100"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              GRID VIEW
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg border-2 border-arcade-black text-[11px] font-black uppercase text-arcade-black shadow-arcade-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ON-CHAIN: Territory.sol</span>
          </div>
        </div>
      </div>

      {/* Real-World Interactive Mumbai Radar Canvas */}
      {viewMode === "MAP" && (
        <div className="arcade-card bg-slate-900 border-4 border-arcade-black p-4 md:p-6 mb-8 relative overflow-hidden shadow-arcade-xl">
          {/* Top Canvas Bar */}
          <div className="flex items-center justify-between text-white mb-4 z-10 relative">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-500 text-black text-[10px] font-black rounded uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                GPS SATELLITE RADAR
              </span>
              <span className="text-xs font-bold text-slate-300">
                19.0760° N, 72.8777° E • Greater Mumbai Metropolitan Area
              </span>
            </div>

            <div className="text-xs font-black text-amber-400">
              CLICK ANY PIN TO CHALLENGE & CONQUER
            </div>
          </div>

          {/* Map Vector Stage with Coastline & Arabian Sea */}
          <div className="relative w-full h-[420px] md:h-[500px] bg-[#0A192F] rounded-2xl border-3 border-white/20 overflow-hidden relative select-none">
            {/* Arabian Sea Shimmer Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(#1E3A8A_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

            {/* Stylized Mumbai Coastline Shape (SVG) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
            >
              {/* Landmass silhouette */}
              <path
                d="M300,0 C350,120 400,200 480,260 C520,320 460,400 400,480 C360,540 320,580 280,600 L1000,600 L1000,0 Z"
                fill="#1E293B"
                stroke="#38BDF8"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
              {/* Bandra-Worli Sea Link Bridge Path */}
              <path
                d="M260,310 Q280,360 300,400"
                stroke="#FACC15"
                strokeWidth="4"
                strokeDasharray="4 2"
              />
            </svg>

            {/* Water label */}
            <div className="absolute bottom-6 left-6 text-slate-500 font-mono text-xs font-black tracking-widest uppercase">
              🌊 Arabian Sea Coastline
            </div>

            {/* Sea Link Tag */}
            <div className="absolute top-[52%] left-[16%] text-[10px] font-black text-yellow-400/80 bg-black/60 px-2 py-0.5 rounded border border-yellow-400/40">
              🌉 Bandra-Worli Sea Link
            </div>

            {/* Real-World Territory Pins */}
            {territories.map((territory) => {
              const isSelected = selectedTerritory?.id === territory.id;
              const isHovered = hoveredTerritory?.id === territory.id;
              const isUserOwner =
                territory.currentOwner.includes("YOU") || territory.currentOwner.includes("0x71C9");

              return (
                <div
                  key={territory.id}
                  style={{
                    left: `${territory.mapCoordinates.x}%`,
                    top: `${territory.mapCoordinates.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedTerritory(territory);
                  }}
                  onMouseEnter={() => setHoveredTerritory(territory)}
                  onMouseLeave={() => setHoveredTerritory(null)}
                >
                  {/* Outer Pulsing Beacon */}
                  <div
                    className={`absolute -inset-3 rounded-full opacity-75 animate-ping pointer-events-none ${
                      isUserOwner ? "bg-emerald-400" : "bg-arcade-coral"
                    }`}
                  />

                  {/* Pin Node */}
                  <div
                    className={`relative w-12 h-12 md:w-14 md:h-14 rounded-2xl border-3 border-arcade-black flex flex-col items-center justify-center shadow-arcade transition-all group-hover:scale-125 group-hover:z-30 ${
                      isUserOwner
                        ? "bg-emerald-400 text-black ring-4 ring-emerald-300"
                        : isSelected
                        ? "bg-arcade-yellow text-black ring-4 ring-white"
                        : "bg-white text-black"
                    }`}
                  >
                    <BeastSvg id={territory.guardian} className="w-8 h-8 pointer-events-none" />
                    <span className="text-[8px] font-black uppercase tracking-tighter leading-none mt-0.5">
                      Lv {territory.guardianLevel}
                    </span>
                  </div>

                  {/* Pin Title Tooltip Tag */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2.5 py-1 rounded-lg border-2 border-arcade-black text-[10px] font-black uppercase whitespace-nowrap shadow-arcade-sm pointer-events-none transition-all ${
                      isUserOwner
                        ? "bg-emerald-300 text-black"
                        : "bg-arcade-yellow text-black"
                    }`}
                  >
                    <div className="leading-tight">{territory.name}</div>
                    <div className="text-[8px] text-black/70 flex items-center gap-1 font-bold">
                      <span>{territory.landmark}</span>
                      <span>•</span>
                      <span className="text-red-600 font-black">{territory.rewardMultiplier}x</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid View / Territory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTerritories.map((territory) => {
          const isUserOwner =
            territory.currentOwner.includes("YOU") || territory.currentOwner.includes("0x71C9");

          return (
            <div
              key={territory.id}
              className={`arcade-card p-5 relative overflow-hidden transition-all flex flex-col justify-between ${
                isUserOwner
                  ? "bg-arcade-mint/25 border-emerald-600 ring-2 ring-emerald-500"
                  : territory.status === "CONTESTED"
                  ? "bg-warm-50 border-arcade-coral"
                  : "bg-white"
              }`}
            >
              {/* Status Header Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md border-2 border-arcade-black text-[10px] font-black uppercase ${territory.badgeBg}`}>
                    {territory.zone}
                  </span>
                  <span className="text-[11px] font-black text-arcade-black/60">
                    ID #{territory.numericId}
                  </span>
                </div>

                <div className="flex items-center gap-1 px-2 py-0.5 bg-arcade-yellow rounded border-2 border-arcade-black text-[10px] font-black uppercase">
                  <TrendingUp className="w-3 h-3" />
                  {territory.rewardMultiplier}x REWARD
                </div>
              </div>

              {/* Territory Name & Real-World Landmark */}
              <div className="mb-3">
                <div className="text-xl font-black text-arcade-black tracking-tight leading-none mb-1">
                  {territory.name}
                </div>
                <div className="text-xs font-bold text-arcade-electric flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                  <span>{territory.landmark}</span>
                </div>
                <div className="text-xs font-bold text-arcade-black/60 line-clamp-1">
                  {territory.description}
                </div>
              </div>

              {/* Tactical Stats Matrix */}
              <div className="bg-warm-100 rounded-xl border-2 border-arcade-black p-3 mb-4 space-y-2 text-xs font-bold">
                <div className="flex items-center justify-between">
                  <span className="text-arcade-black/60">Zone Guardian:</span>
                  <span className="font-black text-arcade-black flex items-center gap-1">
                    {territory.guardian}
                    <span className="text-[10px] text-arcade-electric">(Lv {territory.guardianLevel})</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-arcade-black/60">Territory Lord:</span>
                  <span className="font-black text-arcade-black truncate max-w-[140px]">
                    {isUserOwner ? "👑 YOU (Defending)" : territory.currentOwner.split(" ")[0]}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-arcade-black/60">Fortification Armor:</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-2.5 h-2.5 rounded-sm border border-arcade-black ${
                          i < territory.defenseLevel ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      />
                    ))}
                    <span className="text-[10px] font-black text-emerald-800 ml-1">
                      Lv {territory.defenseLevel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-arcade-black/15">
                  <span className="text-arcade-black/60">Win Streak:</span>
                  <span className="font-black text-amber-600 flex items-center gap-0.5">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    {territory.winStreak} Streak
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-auto">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedTerritory(territory);
                  }}
                  className="arcade-btn py-2 px-3 bg-white text-arcade-black rounded-xl text-xs font-black flex items-center justify-center gap-1"
                >
                  DETAILS <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    soundFX.playAttack();
                    onChallengeTerritory(territory);
                  }}
                  className="arcade-btn py-2 px-3 bg-arcade-coral text-arcade-black rounded-xl text-xs font-black flex items-center justify-center gap-1 hover:scale-105"
                >
                  <Swords className="w-3.5 h-3.5" />
                  ATTACK ({territory.entryFee})
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
