"use client";

import React from "react";
import Image from "next/image";
import {
  Flame,
  Swords,
  MapPin,
  Sparkles,
  Users,
  Trophy,
  Shield,
  ArrowRight,
  Target,
  Zap,
  Radio,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Beast } from "@/data/mockData";
import { CREWS, INITIAL_TERRITORY_WAR } from "@/data/warData";
import { TerritoryWarState } from "@/game/EvolutionSystem";
import { soundFX } from "@/game/SoundFX";

interface CommandCenterDashboardProps {
  playerBeast: Beast;
  onSelectPlayerBeast: (beast: Beast) => void;
  userCrewId: number;
  onJoinCrew: (crewId: number) => void;
  hasClaimedStarter: boolean;
  onMintStarter: () => void;
  territories: TerritoryWarState[];
  onChallengeTerritory: (terr: TerritoryWarState) => void;
  onNavigateTab: (tab: string) => void;
}

export const CommandCenterDashboard: React.FC<CommandCenterDashboardProps> = ({
  playerBeast,
  onSelectPlayerBeast,
  userCrewId,
  onJoinCrew,
  hasClaimedStarter,
  onMintStarter,
  territories,
  onChallengeTerritory,
  onNavigateTab,
}) => {
  return (
    <div className="py-8 px-4 sm:px-8 max-w-[1600px] mx-auto space-y-10 animate-fade-in text-white">
      {/* 1. Immersive Command-Center Header (§25) */}
      <div className="relative rounded-2xl border border-[#1E273D] bg-[#0A0F1A] overflow-hidden shadow-2xl p-6 sm:p-10">
        {/* Subtle City/Beast Background with Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/hero/mumbai-beast-hero.jpg"
            alt="Command Center Mumbai Background"
            fill
            priority
            className="object-cover object-right opacity-30 filter contrast-125 brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1A] via-[#0A0F1A]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] via-transparent to-transparent" />
          {/* Tactical scanlines */}
          <div className="absolute inset-0 tactical-scanline opacity-40 pointer-events-none" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E63946]/15 border border-[#E63946]/40 rounded text-xs font-mono font-bold text-[#E63946] mb-3">
              <Flame className="w-3.5 h-3.5" />
              <span>SEASON 01 — MUMBAI CONQUEST</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-wider text-white leading-none">
              MY BATTLE <span className="text-[#E63946] drop-shadow-[0_0_15px_rgba(230,57,70,0.8)]">CHANGES THE CITY</span>
            </h1>

            <p className="text-[#94A3B8] text-sm sm:text-base font-sans mt-3 max-w-2xl leading-relaxed">
              Command your AI Beast, lead your Crew into territorial battlegrounds, and claim seasonal dominance across Mumbai on Monad Testnet.
            </p>

            {/* Quick Actions & Starter Beast */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  soundFX.playAttack();
                  onNavigateTab("arena");
                }}
                className="px-6 py-3 rounded font-display font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-[#E63946] to-[#8B1E2D] shadow-[0_0_20px_rgba(230,57,70,0.5)] hover:scale-105 transition-all flex items-center gap-2 border border-[#FF4D5B]/50"
              >
                <Swords className="w-4 h-4" />
                <span>ENTER ARENA</span>
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  onNavigateTab("map");
                }}
                className="px-6 py-3 rounded font-display font-black text-sm uppercase tracking-wider text-white bg-[#101522] border border-[#1E273D] hover:border-[#457B9D] transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-[#457B9D]" />
                <span>MUMBAI MAP</span>
              </button>

              {!hasClaimedStarter && (
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onMintStarter();
                  }}
                  className="px-5 py-3 rounded font-mono font-bold text-xs uppercase tracking-wider text-[#F4D35E] bg-[#F4D35E]/10 border border-[#F4D35E]/40 hover:bg-[#F4D35E]/20 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>CLAIM FREE STARTER BEAST</span>
                </button>
              )}
            </div>
          </div>

          {/* Real Live Stat HUD Counters */}
          <div className="grid grid-cols-3 gap-3 font-mono text-center w-full lg:w-auto">
            <div className="bg-[#05070B]/80 border border-[#1E273D] p-4 rounded-xl backdrop-blur-md">
              <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">DAYS REMAINING</span>
              <span className="text-2xl font-black text-white mt-1 block">24 DAYS</span>
              <span className="text-[9px] text-[#00E676] mt-1 block">Season Active</span>
            </div>

            <div className="bg-[#05070B]/80 border border-[#1E273D] p-4 rounded-xl backdrop-blur-md">
              <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">TOTAL BATTLES</span>
              <span className="text-2xl font-black text-[#F4D35E] mt-1 block">1,420</span>
              <span className="text-[9px] text-[#64748B] mt-1 block">EIP-712 Settled</span>
            </div>

            <div className="bg-[#05070B]/80 border border-[#1E273D] p-4 rounded-xl backdrop-blur-md">
              <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">ACTIVE HUNTERS</span>
              <span className="text-2xl font-black text-[#00E676] mt-1 block">488</span>
              <span className="text-[9px] text-[#64748B] mt-1 block">Online on Chain</span>
            </div>
          </div>
        </div>

        {/* Tactical Sub-Bar: Active Squad Status */}
        <div className="mt-8 pt-6 border-t border-[#1E273D]/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#94A3B8]">
          <div className="flex items-center gap-3">
            <span>ACTIVE VANGUARD:</span>
            <span className="text-white font-bold bg-[#161B26] px-3 py-1 rounded border border-[#232B3B] flex items-center gap-2">
              <span className="text-[#E63946]">🐲</span>
              <span>{playerBeast.name} (LV. {playerBeast.level})</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>FACTION: <strong className="text-[#F4D35E]">{CREWS.find((c) => c.id === userCrewId)?.name || "Neon Vipers"}</strong></span>
            <span>·</span>
            <span>RATING: <strong className="text-white">1,024</strong></span>
            <span>·</span>
            <span>WIN STREAK: <strong className="text-[#00E676]">2</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Faction Crews Allegiance Selector (§20) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-black text-2xl uppercase tracking-wider text-white">
              FACTION CREWS (CHOOSE ALLEGIANCE)
            </h2>
            <div className="text-xs font-mono text-[#94A3B8]">Represent your syndicate in the seasonal turf wars</div>
          </div>
          <button
            onClick={() => onNavigateTab("crews")}
            className="text-xs font-mono font-bold text-[#E63946] hover:underline"
          >
            VIEW FULL CREW STANDINGS →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CREWS.map((crew) => {
            const isSelected = userCrewId === crew.id;
            return (
              <div
                key={crew.id}
                onClick={() => {
                  soundFX.playClick();
                  onJoinCrew(crew.id);
                }}
                className={`group relative bg-[#0B0F17] border rounded-xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-md ${
                  isSelected
                    ? "border-[#E63946] bg-[#E63946]/10 shadow-[0_0_20px_rgba(230,57,70,0.3)]"
                    : "border-[#1E273D] hover:border-[#457B9D]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{crew.banner}</span>
                  <span className="font-mono text-xs font-bold text-[#F4D35E] bg-[#F4D35E]/10 px-2.5 py-0.5 rounded border border-[#F4D35E]/30">
                    {crew.seasonPoints} PTS
                  </span>
                </div>

                <h3 className="font-display font-black text-xl uppercase tracking-wider text-white group-hover:text-[#F4D35E] transition-colors">
                  {crew.name}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1 mb-4 line-clamp-2">
                  {crew.description}
                </p>

                <div className="pt-2 border-t border-[#1E273D] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                  <span>{crew.wins}W - {crew.losses}L</span>
                  <span className={isSelected ? "text-[#00E676] font-bold" : "text-[#94A3B8]"}>
                    {isSelected ? "ACTIVE ALLEGIANCE" : "JOIN CREW"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Quick Battle Squad & Live Contested Territories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vanguard Beasts */}
        <div className="bg-[#0B0F17] border border-[#1E273D] rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-black text-xl uppercase tracking-wider text-white">
              YOUR BATTLE SQUAD
            </h3>
            <button
              onClick={() => onNavigateTab("profile")}
              className="text-xs font-mono text-[#E63946] hover:underline font-bold"
            >
              VIEW ALL BEASTS →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[playerBeast, ...INITIAL_TERRITORY_WAR.slice(0, 1).map(() => playerBeast)].slice(0, 2).map((b, i) => (
              <div
                key={`${b.id}-${i}`}
                className="bg-[#101522] p-4 rounded-lg border border-[#1E273D] hover:border-[#E63946] transition-all cursor-pointer"
                onClick={() => onNavigateTab("profile")}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🐲</span>
                  <span className="text-[10px] font-mono text-[#00E676] font-bold">READY</span>
                </div>
                <div className="font-display font-black text-lg text-white uppercase">{b.name}</div>
                <div className="text-xs font-mono text-[#94A3B8]">LV. {b.level} · {b.element}</div>
                <div className="mt-3 text-[10px] font-mono text-[#64748B] flex justify-between">
                  <span>WINS: {b.wins}</span>
                  <span>LOSSES: {b.losses}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contested Territories Fast Dispatch */}
        <div className="bg-[#0B0F17] border border-[#1E273D] rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-black text-xl uppercase tracking-wider text-white">
              HOTTEST CONTESTED ZONES
            </h3>
            <button
              onClick={() => onNavigateTab("map")}
              className="text-xs font-mono text-[#E63946] hover:underline font-bold"
            >
              OPEN MUMBAI MAP →
            </button>
          </div>

          <div className="space-y-2.5">
            {territories.slice(0, 3).map((t) => (
              <div
                key={t.id}
                onClick={() => onChallengeTerritory(t)}
                className="flex items-center justify-between p-3 rounded-lg bg-[#101522] border border-[#1E273D] hover:border-[#E63946] transition-all cursor-pointer"
              >
                <div>
                  <div className="font-display font-black text-base text-white uppercase">{t.name}</div>
                  <div className="text-[10px] font-mono text-[#94A3B8]">
                    Zone #{t.numericId} · Guardian: {t.guardian}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold text-[#F4D35E] bg-[#F4D35E]/10 px-2 py-0.5 rounded border border-[#F4D35E]/30">
                    {t.status}
                  </span>
                  <span className="text-xs font-mono text-[#E63946] font-bold flex items-center gap-1">
                    CHALLENGE →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
