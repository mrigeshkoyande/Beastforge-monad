"use client";

import React, { useState } from "react";
import { TerritoryWarState } from "@/game/EvolutionSystem";
import { Beast } from "@/data/mockData";
import { soundFX } from "@/game/SoundFX";
import {
  MapPin,
  Swords,
  Shield,
  Trophy,
  Filter,
  Flame,
  Radio,
  Navigation,
  ExternalLink,
  ChevronRight,
  Zap,
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "LIVE ARENA":
        return "bg-mh-live/20 border-mh-live text-mh-live animate-pulse";
      case "UNDER ATTACK":
        return "bg-mh-live/20 border-mh-live text-mh-live";
      case "CONTESTED":
        return "bg-mh-reward/20 border-mh-reward text-mh-reward";
      case "DEFENDING":
        return "bg-mh-defend/20 border-mh-defend text-mh-defend";
      case "DOMINATED":
        return "bg-mh-primary/20 border-mh-primary text-mh-primaryGlow";
      case "STABLE":
      default:
        return "bg-mh-card border-mh-border text-mh-silver";
    }
  };

  return (
    <div className="py-6 max-w-7xl mx-auto px-4">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-mh-card rounded border border-mh-border text-xs font-mono font-bold text-mh-reward mb-2">
            <Flame className="w-3.5 h-3.5 text-mh-reward" />
            12 MUMBAI TERRITORIES · SEASON 01
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white uppercase tracking-wider leading-none">
            MUMBAI <span className="text-mh-primary">TACTICAL MAP</span>
          </h2>
          <p className="text-mh-text2 text-sm mt-1 max-w-xl">
            Every arena battle shifts territorial influence in real time. Defend strongholds or conquer rival zones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Map vs List View Switch */}
          <div className="flex items-center bg-mh-navy p-1 rounded-lg border border-mh-border">
            <button
              onClick={() => {
                soundFX.playClick();
                setViewMode("MAP");
              }}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase transition-all ${
                viewMode === "MAP"
                  ? "bg-mh-primary text-white"
                  : "text-mh-text2 hover:text-white"
              }`}
            >
              <Navigation className="w-3.5 h-3.5 inline mr-1" />
              SATELLITE MAP
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setViewMode("LIST");
              }}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase transition-all ${
                viewMode === "LIST"
                  ? "bg-mh-primary text-white"
                  : "text-mh-text2 hover:text-white"
              }`}
            >
              <Filter className="w-3.5 h-3.5 inline mr-1" />
              TACTICAL LIST
            </button>
          </div>
        </div>
      </div>

      {/* Satellite Map View */}
      {viewMode === "MAP" && (
        <div className="bg-mh-navy border border-mh-border rounded-xl p-4 md:p-6 mb-8 relative overflow-hidden shadow-2xl">
          {/* Map Top Bar */}
          <div className="flex items-center justify-between text-white mb-4 z-10 relative">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-mh-live/20 border border-mh-live/40 text-mh-live text-[10px] font-mono font-bold rounded uppercase flex items-center gap-1.5 animate-pulse">
                <Radio className="w-3 h-3" /> LIVE RADAR
              </span>
              <span className="text-xs font-mono text-mh-text2 hidden sm:inline">
                19.0760° N, 72.8777° E • Greater Mumbai Peninsula
              </span>
            </div>

            <div className="text-xs font-mono text-mh-reward font-bold">
              CLICK PIN TO SELECT TERRITORY
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-[480px] md:h-[540px] bg-[#07090E] rounded-xl border border-mh-border overflow-hidden select-none">
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#232B3B_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

            {/* Stylized Mumbai Peninsula SVG */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
            >
              <path
                d="M 150,0 Q 250,80 320,160 T 360,320 T 310,460 T 260,560 L 320,600 L 400,600 Q 420,480 440,360 T 480,200 T 520,0 Z"
                fill="#161B26"
                stroke="#836EF9"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d="M 460,180 Q 560,240 680,280 T 780,420 T 740,600 L 850,600 L 850,0 Z"
                fill="#10141D"
                stroke="#232B3B"
                strokeWidth="1.5"
              />
            </svg>

            {/* Territory Interactive Hotspots */}
            {filteredTerritories.map((t) => {
              const isHovered = hoveredTerritory?.id === t.id;
              const isLive = t.status === "LIVE ARENA" || t.status === "UNDER ATTACK";

              return (
                <div
                  key={t.id}
                  style={{
                    left: `${t.mapCoordinates.x}%`,
                    top: `${t.mapCoordinates.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedTerritory(t);
                  }}
                  onMouseEnter={() => setHoveredTerritory(t)}
                  onMouseLeave={() => setHoveredTerritory(null)}
                >
                  {/* Ping Animation for Live Arenas */}
                  {isLive && (
                    <div className="absolute -inset-2 bg-mh-live rounded-full animate-ping opacity-75 pointer-events-none" />
                  )}

                  {/* Pin Shape */}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center border-2 transition-all transform group-hover:scale-125 shadow-lg ${
                      isLive
                        ? "bg-mh-live border-white text-white"
                        : t.status === "CONTESTED"
                        ? "bg-mh-reward border-black text-black"
                        : "bg-mh-card border-mh-primary text-mh-primaryGlow"
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>

                  {/* Tooltip Label */}
                  <div className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap bg-mh-navy/95 border border-mh-border px-2.5 py-1 rounded shadow-xl text-center pointer-events-none transition-all group-hover:opacity-100 z-30">
                    <div className="font-display font-black text-xs uppercase text-white tracking-wide">
                      {t.name}
                    </div>
                    <div className="text-[10px] font-mono text-mh-reward">
                      {t.status} · {t.currentOwner}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tactical List View (Great for Mobile & Quick Glance) */}
      {viewMode === "LIST" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredTerritories.map((t) => (
            <div
              key={t.id}
              onClick={() => {
                soundFX.playClick();
                setSelectedTerritory(t);
              }}
              className="mh-card p-5 cursor-pointer hover:border-mh-primary/60 transition-all shadow-md group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono text-mh-text3 uppercase block">
                    {t.zone} · {t.district}
                  </span>
                  <h3 className="font-display text-xl font-black uppercase text-white group-hover:text-mh-primary transition-colors">
                    {t.name}
                  </h3>
                </div>
                <span className={`mh-badge text-[10px] ${getStatusBadge(t.status)}`}>
                  <span>{t.status}</span>
                </span>
              </div>

              <p className="text-xs text-mh-text2 mb-4 line-clamp-2">
                {t.description}
              </p>

              <div className="bg-[#07090E] p-2.5 rounded border border-mh-border text-xs font-mono space-y-1.5 mb-4">
                <div className="flex justify-between text-mh-text2">
                  <span>CONTROLLING CREW</span>
                  <span className="text-white font-bold">{t.currentOwner}</span>
                </div>
                <div className="flex justify-between text-mh-text2">
                  <span>GUARDIAN BEAST</span>
                  <span className="text-mh-primary font-bold">{t.guardian} (LVL {t.guardianLevel})</span>
                </div>
                <div className="flex justify-between text-mh-text2">
                  <span>WIN STREAK</span>
                  <span className="text-mh-reward font-bold">{t.winStreak} STREAK ({t.rewardMultiplier}x)</span>
                </div>
              </div>

              <button className="mh-btn w-full text-xs py-2">
                <span className="flex items-center justify-center gap-1.5">
                  <Swords className="w-3.5 h-3.5" /> ENTER PROVING GROUNDS
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
