"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Swords,
  Shield,
  Trophy,
  Users,
  Flame,
  Zap,
  ArrowRight,
  Radio,
  Tv,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Target,
  Layers,
} from "lucide-react";
import { soundFX } from "@/game/SoundFX";
import { MOCK_BEASTS, Beast } from "@/data/mockData";
import { CREWS, INITIAL_TERRITORY_WAR } from "@/data/warData";

interface LandingSectionsProps {
  onEnterCity: () => void;
  onSelectTab: (tab: string) => void;
  onSelectBeast: (beast: Beast) => void;
}

export const LandingSections: React.FC<LandingSectionsProps> = ({
  onEnterCity,
  onSelectTab,
  onSelectBeast,
}) => {
  const [selectedCrew, setSelectedCrew] = useState<number>(1);
  const [hoveredBeastId, setHoveredBeastId] = useState<string>(MOCK_BEASTS[0].id);

  const workflowSteps = [
    {
      num: "01",
      title: "CHOOSE YOUR BEAST",
      desc: "Mint or command an elemental cyber-creature with distinct combat attributes and signature abilities.",
      icon: Sparkles,
      accent: "#E63946",
    },
    {
      num: "02",
      title: "ENTER THE ARENA",
      desc: "Step onto high-speed turn combat arenas powered by Monad Testnet with zero friction and sub-second execution.",
      icon: Swords,
      accent: "#F4D35E",
    },
    {
      num: "03",
      title: "WIN BATTLES",
      desc: "Execute attacks, shields, and tactical dodges to outsmart AI opponents and rival Hunters in real time.",
      icon: Trophy,
      accent: "#00E676",
    },
    {
      num: "04",
      title: "CLAIM INFLUENCE",
      desc: "Earn cryptographic EIP-712 settlement proofs that update on-chain ratings, levels, and battle loot.",
      icon: Award,
      accent: "#457B9D",
    },
    {
      num: "05",
      title: "FIGHT FOR YOUR CREW",
      desc: "Anchor your faction's dominance over Mumbai's 12 territories and claim seasonal treasury rewards.",
      icon: Users,
      accent: "#E63946",
    },
  ];

  return (
    <div className="relative z-20 space-y-28 py-20 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto text-white">
      {/* ========================================================================= */}
      {/* SECTION 2: HOW THE CITY LEAGUE WORKS                                     */}
      {/* ========================================================================= */}
      <section className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-[#1E273D] pb-6">
          <div>
            <div className="text-xs font-mono font-bold text-[#E63946] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E63946] animate-pulse" />
              TACTICAL PROTOCOL
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-wide text-white mt-1">
              HOW THE CITY LEAGUE WORKS
            </h2>
          </div>
          <p className="text-sm font-sans text-[#94A3B8] max-w-md">
            From lone Hunter to faction vanguard. Every action is cryptographically proven and irreversibly settles on Monad.
          </p>
        </div>

        {/* 5-Step Horizontal Progression Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="group relative bg-[#0B0F17]/90 border border-[#1E273D] hover:border-[#E63946]/70 p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(230,57,70,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display font-black text-3xl text-white/20 group-hover:text-[#E63946] transition-colors">
                      {step.num}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-[#161B26] border border-[#232B3B] flex items-center justify-center group-hover:border-[#E63946]/50">
                      <Icon className="w-4 h-4 text-[#E63946]" />
                    </div>
                  </div>

                  <h3 className="font-display font-black text-lg uppercase tracking-wider text-white mb-2 group-hover:text-[#F4D35E] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#1E273D]/60 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                  <span>PHASE {idx + 1}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: THE CITY IS THE BATTLEFIELD (MUMBAI TERRITORIES)              */}
      {/* ========================================================================= */}
      <section className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-[#1E273D] pb-6">
          <div>
            <div className="text-xs font-mono font-bold text-[#457B9D] uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" />
              12 STRATEGIC ZONES
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-wide text-white mt-1">
              THE CITY IS THE BATTLEFIELD
            </h2>
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              onSelectTab("map");
            }}
            className="flex items-center gap-2 text-xs font-mono font-bold text-[#E63946] hover:text-white uppercase tracking-wider transition-colors"
          >
            <span>LAUNCH FULL MAP MATRIX</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Territory Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INITIAL_TERRITORY_WAR.slice(0, 8).map((terr) => {
            const isLive = terr.status === "UNDER ATTACK" || terr.status === "CONTESTED";
            const isDefending = terr.status === "DEFENDING";
            const isStable = terr.status === "STABLE";

            return (
              <div
                key={terr.id}
                onClick={() => {
                  soundFX.playClick();
                  onSelectTab("map");
                }}
                className={`group relative bg-[#0B0F17]/90 border rounded-xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-md ${
                  isLive
                    ? "border-[#E63946] shadow-[0_0_20px_rgba(230,57,70,0.25)]"
                    : "border-[#1E273D] hover:border-[#457B9D]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]">
                    ZONE #{terr.numericId}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded border ${
                      isLive
                        ? "bg-[#E63946]/20 border-[#E63946] text-[#E63946] animate-pulse"
                        : isStable
                        ? "bg-[#457B9D]/20 border-[#457B9D] text-[#457B9D]"
                        : "bg-[#F4D35E]/20 border-[#F4D35E] text-[#F4D35E]"
                    }`}
                  >
                    {terr.status}
                  </span>
                </div>

                <h3 className="font-display font-black text-xl uppercase tracking-wider text-white group-hover:text-[#F4D35E] transition-colors">
                  {terr.name}
                </h3>
                <div className="text-xs font-mono text-[#94A3B8] mt-0.5">
                  Guardian: <span className="text-white font-bold">{terr.guardian}</span>
                </div>

                {/* Control Progress Bar */}
                <div className="mt-4 pt-3 border-t border-[#1E273D]">
                  <div className="flex justify-between text-[10px] font-mono text-[#94A3B8] mb-1">
                    <span>FACTION CONTROL</span>
                    <span className="font-bold text-white">
                      {terr.conqueredCount * 12 + 42}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#161B26] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#8B1E2D] via-[#E63946] to-[#F4D35E] rounded-full"
                      style={{ width: `${Math.min(100, terr.conqueredCount * 12 + 42)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-[#64748B]">
                  <span>Controlled by: <strong className="text-white">{terr.currentOwner}</strong></span>
                  <span className="text-[#E63946] group-hover:translate-x-0.5 transition-transform">ATTACK →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: LIVE ARENAS (ESPORTS MATCHUPS)                                 */}
      {/* ========================================================================= */}
      <section className="relative">
        <div className="bg-gradient-to-r from-[#101522] via-[#0B0F17] to-[#101522] border border-[#E63946]/40 rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-[0_0_40px_rgba(230,57,70,0.15)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#E63946]/10 blur-[100px] pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E63946]/20 border border-[#E63946] rounded text-xs font-mono font-bold text-[#E63946] mb-3">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>ESPORTS LIVE ARENAS</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-wide text-white">
                POWAI TECH HUB ARENA
              </h2>
              <p className="text-sm font-sans text-[#94A3B8] mt-1 max-w-xl">
                High-stakes territorial contention. Watch top Hunters duel in live synchronized combat verified on-chain.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-[#05070B] border border-[#1E273D] px-4 py-2.5 rounded-lg text-center font-mono">
                <div className="text-[10px] text-[#64748B] uppercase">MATCH CLOCK</div>
                <div className="text-xl font-bold text-[#F4D35E]">18:42</div>
              </div>
              <div className="bg-[#05070B] border border-[#1E273D] px-4 py-2.5 rounded-lg text-center font-mono">
                <div className="text-[10px] text-[#64748B] uppercase">HUNTERS PRESENT</div>
                <div className="text-xl font-bold text-[#00E676]">24 ACTIVE</div>
              </div>
            </div>
          </div>

          {/* Versus Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 bg-[#05070B]/80 border border-[#1E273D] rounded-xl p-6">
            {/* Squad 1 */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#161B26] border border-[#232B3B] flex items-center justify-center text-3xl flex-shrink-0">
                🐉
              </div>
              <div>
                <div className="text-[10px] font-mono text-[#E63946] font-bold">CHALLENGER SQUAD</div>
                <div className="font-display font-black text-xl sm:text-2xl text-white uppercase">
                  POWAI RAIDERS
                </div>
                <div className="text-xs font-mono text-[#94A3B8]">Lead: Emberwyrm · Lv. 42</div>
              </div>
            </div>

            {/* VS Emblem */}
            <div className="text-center my-2 md:my-0">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E63946] font-display font-black text-xl text-white shadow-[0_0_20px_#E63946] border border-white/30">
                VS
              </div>
              <div className="text-[10px] font-mono text-[#F4D35E] mt-1 font-bold">BO3 ELIMINATION</div>
            </div>

            {/* Squad 2 */}
            <div className="flex items-center justify-start md:justify-end gap-4 text-left md:text-right">
              <div className="order-2 md:order-1">
                <div className="text-[10px] font-mono text-[#457B9D] font-bold">DEFENDER SQUAD</div>
                <div className="font-display font-black text-xl sm:text-2xl text-white uppercase">
                  ANDHERI WOLVES
                </div>
                <div className="text-xs font-mono text-[#94A3B8]">Lead: Tidewarden · Lv. 39</div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-[#161B26] border border-[#232B3B] flex items-center justify-center text-3xl flex-shrink-0 order-1 md:order-2">
                🐺
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
              <Flame className="w-4 h-4 text-[#E63946]" />
              <span>Winner gains +180 Territory Influence &amp; 0.5 MON reward</span>
            </div>

            <button
              onClick={() => {
                soundFX.playAttack();
                onSelectTab("arena");
              }}
              className="w-full sm:w-auto px-8 py-3 rounded font-display font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-[#E63946] to-[#8B1E2D] shadow-[0_0_20px_rgba(230,57,70,0.6)] hover:scale-105 transition-all border border-[#FF4D5B]/50"
            >
              ENTER ARENA NOW →
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: CHOOSE YOUR BEAST                                              */}
      {/* ========================================================================= */}
      <section className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-[#1E273D] pb-6">
          <div>
            <div className="text-xs font-mono font-bold text-[#F4D35E] uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              CYBERNETIC BESTIARY
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-wide text-white mt-1">
              CHOOSE YOUR BEAST
            </h2>
          </div>
          <p className="text-sm font-sans text-[#94A3B8] max-w-md">
            Four primal elementals engineered for cyber warfare. Level up, unlock devastating abilities, and evolve.
          </p>
        </div>

        {/* 4 Beast Showcase Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_BEASTS.map((beast) => {
            const isHovered = hoveredBeastId === beast.id;

            return (
              <div
                key={beast.id}
                onMouseEnter={() => setHoveredBeastId(beast.id)}
                onClick={() => {
                  soundFX.playClick();
                  onSelectBeast(beast);
                  onSelectTab("arena");
                }}
                className={`group relative bg-[#0B0F17] border rounded-xl overflow-hidden p-5 cursor-pointer transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between ${
                  isHovered
                    ? "border-[#E63946] shadow-[0_12px_35px_rgba(230,57,70,0.3)]"
                    : "border-[#1E273D] hover:border-[#2A3752]"
                }`}
              >
                {/* Header Info */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#161B26] border border-[#232B3B] text-[#94A3B8]">
                      {beast.element}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#F4D35E]">
                      {beast.rarity}
                    </span>
                  </div>

                  {/* Beast Avatar Artwork Box */}
                  <div className="relative w-full h-44 rounded-lg bg-gradient-to-b from-[#161B26] to-[#0A0D14] border border-[#1E273D] flex items-center justify-center overflow-hidden mb-4 group-hover:border-[#E63946]/40 transition-colors">
                    <div className="text-7xl group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(230,57,70,0.3)]">
                      {beast.element === "Fire" ? "🐉" : beast.element === "Water" ? "🐺" : beast.element === "Electric" ? "⚡" : "🦅"}
                    </div>
                    <div className="absolute bottom-2 left-2 font-mono text-[10px] text-[#94A3B8] bg-black/60 px-2 py-0.5 rounded border border-white/10">
                      LV. {beast.level}
                    </div>
                  </div>

                  <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white group-hover:text-[#F4D35E] transition-colors">
                    {beast.name}
                  </h3>
                  <div className="text-xs font-mono text-[#94A3B8] mt-1">
                    Special: <strong className="text-white">{beast.specialMove}</strong>
                  </div>

                  {/* Stats Breakdown */}
                  <div className="mt-4 space-y-2 border-t border-[#1E273D] pt-3 text-[11px] font-mono">
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>ATTACK POWER</span>
                      <span className="text-white font-bold">{beast.attack}</span>
                    </div>
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>DEFENSE SHIELD</span>
                      <span className="text-white font-bold">{beast.defense}</span>
                    </div>
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>SPEED VELOCITY</span>
                      <span className="text-white font-bold">{beast.speed}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#1E273D] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#64748B]">{beast.wins}W / {beast.losses}L</span>
                  <span className="text-[#E63946] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    SELECT BEAST →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: CHOOSE YOUR CREW (4 FACTIONS)                                 */}
      {/* ========================================================================= */}
      <section className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-[#1E273D] pb-6">
          <div>
            <div className="text-xs font-mono font-bold text-[#E63946] uppercase tracking-widest flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              FACTION ALLEGIANCE
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-wide text-white mt-1">
              CHOOSE YOUR CREW
            </h2>
          </div>
          <p className="text-sm font-sans text-[#94A3B8] max-w-md">
            Join one of four cyber syndicates fighting for regional control. Crew members share conquest bonuses and seasonal treasury payouts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CREWS.map((crew) => {
            const isSelected = selectedCrew === crew.id;

            return (
              <div
                key={crew.id}
                onClick={() => {
                  soundFX.playClick();
                  setSelectedCrew(crew.id);
                }}
                className={`relative bg-[#0B0F17] border rounded-xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg ${
                  isSelected
                    ? "border-[#E63946] bg-[#E63946]/10 shadow-[0_0_25px_rgba(230,57,70,0.3)]"
                    : "border-[#1E273D] hover:border-[#457B9D]"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{crew.banner}</span>
                  <span className="font-mono text-xs font-bold text-[#F4D35E] bg-[#F4D35E]/10 px-2.5 py-1 rounded border border-[#F4D35E]/30">
                    {crew.seasonPoints} PTS
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                  {crew.name}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-2 mb-4 leading-relaxed line-clamp-3">
                  {crew.description}
                </p>

                <div className="pt-3 border-t border-[#1E273D] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#64748B]">{crew.wins}W - {crew.losses}L</span>
                  <span className={isSelected ? "text-[#00E676] font-bold" : "text-[#94A3B8]"}>
                    {isSelected ? "ALLEGIANCE ACTIVE" : "JOIN CREW →"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: SEASON 01 — MUMBAI CONQUEST                                   */}
      {/* ========================================================================= */}
      <section className="relative">
        <div className="bg-[#0A0E17] border border-[#1E273D] rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4D35E]/10 border border-[#F4D35E]/30 rounded text-xs font-mono font-bold text-[#F4D35E] mb-3">
                <Flame className="w-3.5 h-3.5" />
                <span>SEASON 01 — MUMBAI CONQUEST</span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-wide text-white leading-tight">
                COMPETE &amp; CLAIM SEASON DOMINANCE
              </h2>
              <p className="text-[#94A3B8] text-sm mt-4 leading-relaxed max-w-xl">
                Season 01 features 12 contested Mumbai territories, 4 faction syndicates, and weekly rewards paid out via Monad smart contracts.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onEnterCity();
                  }}
                  className="px-7 py-3.5 rounded font-display font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-[#E63946] to-[#8B1E2D] shadow-[0_0_20px_rgba(230,57,70,0.6)] hover:scale-105 transition-all border border-[#FF4D5B]/50"
                >
                  ENTER SEASON 01 →
                </button>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onSelectTab("leaderboard");
                  }}
                  className="px-6 py-3.5 rounded font-display font-black text-sm uppercase tracking-wider text-white bg-[#101522] border border-[#1E273D] hover:border-[#457B9D] transition-colors"
                >
                  VIEW LEADERBOARD
                </button>
              </div>
            </div>

            {/* Stat Matrix */}
            <div className="grid grid-cols-2 gap-4 font-mono">
              <div className="bg-[#101522] border border-[#1E273D] p-5 rounded-xl text-center">
                <div className="text-xs text-[#64748B] uppercase">TIME REMAINING</div>
                <div className="text-3xl font-black text-[#E63946] mt-1">24 DAYS</div>
                <div className="text-[10px] text-[#94A3B8] mt-1">Season Closes Oct 2026</div>
              </div>

              <div className="bg-[#101522] border border-[#1E273D] p-5 rounded-xl text-center">
                <div className="text-xs text-[#64748B] uppercase">TOTAL BATTLES</div>
                <div className="text-3xl font-black text-[#F4D35E] mt-1">1,420</div>
                <div className="text-[10px] text-[#94A3B8] mt-1">Settled on Monad</div>
              </div>

              <div className="bg-[#101522] border border-[#1E273D] p-5 rounded-xl text-center">
                <div className="text-xs text-[#64748B] uppercase">ACTIVE HUNTERS</div>
                <div className="text-3xl font-black text-[#00E676] mt-1">488</div>
                <div className="text-[10px] text-[#94A3B8] mt-1">Registered Wallets</div>
              </div>

              <div className="bg-[#101522] border border-[#1E273D] p-5 rounded-xl text-center">
                <div className="text-xs text-[#64748B] uppercase">TERRITORIES</div>
                <div className="text-3xl font-black text-[#457B9D] mt-1">12 ZONES</div>
                <div className="text-[10px] text-[#94A3B8] mt-1">100% Contestable</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: HUNT TV (BATTLE HIGHLIGHTS)                                    */}
      {/* ========================================================================= */}
      <section className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-[#1E273D] pb-6">
          <div>
            <div className="text-xs font-mono font-bold text-[#E63946] uppercase tracking-widest flex items-center gap-2">
              <Tv className="w-3.5 h-3.5" />
              ESPORTS BROADCAST
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-wide text-white mt-1">
              HUNT TV · BATTLE HIGHLIGHTS
            </h2>
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              onSelectTab("tv");
            }}
            className="text-xs font-mono font-bold text-[#E63946] hover:text-white uppercase tracking-wider flex items-center gap-1.5"
          >
            <span>WATCH LIVE STREAM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#0B0F17] border border-[#1E273D] hover:border-[#E63946] rounded-xl p-5 transition-all shadow-md">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-3">
              <span className="flex items-center gap-1.5 text-[#00E676]">
                <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                VERIFIED ON-CHAIN
              </span>
              <span>2m ago</span>
            </div>
            <div className="font-display font-black text-xl text-white uppercase">
              MRIGESH (OMEGA BEAST) VS ANISH (PRIME BEAST)
            </div>
            <div className="text-xs font-mono text-[#F4D35E] mt-2 flex items-center gap-2">
              <span>VICTORY</span>
              <span>·</span>
              <span>+124 RATING</span>
              <span>·</span>
              <span>+18 INFLUENCE</span>
            </div>
          </div>

          <div className="bg-[#0B0F17] border border-[#1E273D] hover:border-[#E63946] rounded-xl p-5 transition-all shadow-md">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-3">
              <span className="text-[#E63946]">TERRITORY WAR</span>
              <span>14m ago</span>
            </div>
            <div className="font-display font-black text-xl text-white uppercase">
              FORT CITADEL CONQUERED BY SOLAR TITANS
            </div>
            <div className="text-xs font-mono text-[#00E676] mt-2 flex items-center gap-2">
              <span>NEW GUARDIAN: VOLTCLAW</span>
              <span>·</span>
              <span>+350 CREW PTS</span>
            </div>
          </div>

          <div className="bg-[#0B0F17] border border-[#1E273D] hover:border-[#E63946] rounded-xl p-5 transition-all shadow-md">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-3">
              <span className="text-[#457B9D]">RATING CLIMBER</span>
              <span>42m ago</span>
            </div>
            <div className="font-display font-black text-xl text-white uppercase">
              SHADOW_HUNTER REACHES GRANDMASTER (1,940)
            </div>
            <div className="text-xs font-mono text-[#F4D35E] mt-2 flex items-center gap-2">
              <span>STREAK: 7 WINS</span>
              <span>·</span>
              <span>BEAST: VOIDSTALKER</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: FINAL CALL TO ACTION                                           */}
      {/* ========================================================================= */}
      <section className="relative rounded-2xl overflow-hidden border border-[#E63946]/50 bg-gradient-to-b from-[#101522] via-[#0B0F17] to-[#05070B] p-8 sm:p-16 text-center shadow-[0_0_50px_rgba(230,57,70,0.2)]">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold text-[#E63946] uppercase tracking-widest mb-3">
            YOUR LEGACY AWAITS
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-wider text-white">
            THE CITY IS WAITING.
          </h2>
          <div className="font-display font-bold text-xl sm:text-2xl uppercase tracking-widest text-[#F4D35E] mt-3">
            YOUR BEAST. YOUR CREW. YOUR TERRITORY.
          </div>
          <p className="text-sm font-sans text-[#94A3B8] mt-4 max-w-xl mx-auto leading-relaxed">
            Connect your wallet to claim your starter AI Beast and begin fighting for Mumbai&apos;s 12 territories.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                soundFX.playClick();
                onEnterCity();
              }}
              className="w-full sm:w-auto px-8 py-4 rounded font-display font-black text-base uppercase tracking-wider text-white bg-gradient-to-r from-[#E63946] via-[#B2182B] to-[#8B1E2D] shadow-[0_0_25px_rgba(230,57,70,0.6)] hover:shadow-[0_0_35px_rgba(230,57,70,0.9)] hover:scale-105 transition-all border border-[#FF4D5B]/60"
            >
              ENTER THE CITY →
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                onSelectTab("leaderboard");
              }}
              className="w-full sm:w-auto px-8 py-4 rounded font-display font-black text-base uppercase tracking-wider text-white bg-[#0B0F17] border border-[#1E273D] hover:border-[#457B9D] transition-colors"
            >
              VIEW LEADERBOARDS
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
