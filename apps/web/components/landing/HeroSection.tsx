"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Swords,
  Play,
  Flame,
  Users,
  Trophy,
  Shield,
  Target,
  Crosshair,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Wallet,
} from "lucide-react";
import { soundFX } from "@/game/SoundFX";
import { Beast } from "@/data/mockData";

interface HeroSectionProps {
  onEnterCity: () => void;
  onWatchTrailer: () => void;
  onConnectWallet: () => void;
  onSelectTerritoryZone: (territoryId: string) => void;
  playerBeast?: Beast;
  walletConnected?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onEnterCity,
  onWatchTrailer,
  onConnectWallet,
  onSelectTerritoryZone,
  playerBeast,
  walletConnected = false,
}) => {
  const [activeHoveredZone, setActiveHoveredZone] = useState<string | null>(null);

  const territoryMarkers = [
    {
      id: "andheri",
      name: "ANDHERI",
      status: "CONTESTED",
      color: "#F4D35E",
      glowColor: "rgba(244, 211, 94, 0.6)",
      bg: "rgba(244, 211, 94, 0.18)",
      borderColor: "border-[#F4D35E]",
      textColor: "text-[#F4D35E]",
      icon: Swords,
      top: "32%",
      left: "56%",
    },
    {
      id: "bkc",
      name: "BKC",
      status: "LIVE ARENA",
      color: "#E63946",
      glowColor: "rgba(230, 57, 70, 0.7)",
      bg: "rgba(230, 57, 70, 0.25)",
      borderColor: "border-[#E63946]",
      textColor: "text-[#E63946]",
      icon: Target,
      top: "33%",
      left: "71%",
      isLive: true,
    },
    {
      id: "powai",
      name: "POWAI",
      status: "DOMINATED",
      color: "#00E676",
      glowColor: "rgba(0, 230, 118, 0.6)",
      bg: "rgba(0, 230, 118, 0.18)",
      borderColor: "border-[#00E676]",
      textColor: "text-[#00E676]",
      icon: Shield,
      top: "40%",
      left: "85%",
    },
    {
      id: "bandra",
      name: "BANDRA",
      status: "STABLE",
      color: "#457B9D",
      glowColor: "rgba(69, 123, 157, 0.6)",
      bg: "rgba(69, 123, 157, 0.2)",
      borderColor: "border-[#457B9D]",
      textColor: "text-[#457B9D]",
      icon: Shield,
      top: "48%",
      left: "48%",
    },
    {
      id: "fort",
      name: "FORT",
      status: "UNDER ATTACK",
      color: "#E63946",
      glowColor: "rgba(230, 57, 70, 0.8)",
      bg: "rgba(230, 57, 70, 0.28)",
      borderColor: "border-[#E63946]",
      textColor: "text-[#E63946]",
      icon: Swords,
      top: "58%",
      left: "64%",
      isPulse: true,
    },
    {
      id: "lower-parel",
      name: "LOWER PAREL",
      status: "DEFENDING",
      color: "#457B9D",
      glowColor: "rgba(69, 123, 157, 0.6)",
      bg: "rgba(69, 123, 157, 0.2)",
      borderColor: "border-[#457B9D]",
      textColor: "text-[#457B9D]",
      icon: Shield,
      top: "63%",
      left: "82%",
    },
  ];

  return (
    <section className="relative w-full min-h-[calc(100vh-68px)] flex flex-col justify-between overflow-hidden bg-[#05070B] select-none">
      {/* 1. Cinematic Background Video & Artwork Layers */}
      <div className="absolute inset-0 z-0">
        {/* Subtle Atmospheric Video Layer */}
        <video
          src="/media/trailer.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover opacity-20 filter contrast-125 brightness-75 scale-105"
        />

        {/* Mumbai City & Beast Artwork Layer (Clean High-Res Art) */}
        <div className="absolute inset-0">
          <Image
            src="/assets/hero/mumbai-beast-hero.jpg"
            alt="Futuristic Cyber Mumbai & Cyber Beast"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-75 filter brightness-95 contrast-110"
          />
        </div>

        {/* Smooth Cinematic Dark Gradient Overlay for Maximum Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070B]/95 via-[#05070B]/80 via-40% to-transparent z-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-[#05070B]/60 z-1" />

        {/* Tactical Scanlines & Atmospheric Glows */}
        <div className="absolute inset-0 tactical-scanline opacity-15 z-1 pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#8B1E2D]/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-[#E63946]/15 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#457B9D]/15 blur-[110px] rounded-full pointer-events-none" />
      </div>

      {/* 2. Floating Upper Right Beast HUD Card */}
      <div className="absolute top-6 right-4 sm:right-8 z-20 hidden md:block">
        <div
          onClick={() => {
            soundFX.playClick();
            onEnterCity();
          }}
          className="group flex items-center gap-3 bg-[#0A0F1A]/90 backdrop-blur-md border border-[#1E273D] hover:border-[#E63946] px-4 py-2.5 rounded-lg cursor-pointer transition-all shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(230,57,70,0.3)]"
        >
          <div className="relative w-10 h-10 rounded-md bg-[#161B26] border border-[#232B3B] overflow-hidden flex items-center justify-center">
            <span className="text-xl group-hover:scale-110 transition-transform">🐲</span>
            <span className="absolute bottom-0 inset-x-0 h-1 bg-[#E63946]" />
          </div>
          <div className="text-left font-mono">
            <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider">YOUR BEAST</div>
            <div className="text-xs font-bold text-white uppercase group-hover:text-[#F4D35E] transition-colors">
              {playerBeast ? playerBeast.name : "EMBERWYRM"}
            </div>
            <div className="text-[10px] text-[#E63946] font-semibold">
              Lv. {playerBeast ? playerBeast.level : 36}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-white group-hover:translate-x-0.5 transition-all ml-1" />
        </div>
      </div>

      {/* 3. Interactive Holographic Territory Markers Over Mumbai */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="relative w-full h-full max-w-[1600px] mx-auto">
          {territoryMarkers.map((marker) => {
            const Icon = marker.icon;
            const isHovered = activeHoveredZone === marker.id;

            return (
              <div
                key={marker.id}
                style={{ top: marker.top, left: marker.left }}
                onClick={() => {
                  soundFX.playClick();
                  onSelectTerritoryZone(marker.id);
                }}
                onMouseEnter={() => setActiveHoveredZone(marker.id)}
                onMouseLeave={() => setActiveHoveredZone(null)}
                className="hud-marker pointer-events-auto group hidden lg:flex flex-col items-center"
              >
                {/* Radar pulse for live/attack territories */}
                {(marker.isLive || marker.isPulse) && (
                  <div
                    className="absolute -inset-3 rounded-xl border border-[#E63946] animate-radar-ring pointer-events-none"
                    style={{ borderColor: marker.color }}
                  />
                )}

                {/* Marker Badge */}
                <div
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md border backdrop-blur-md transition-all shadow-lg ${marker.borderColor}`}
                  style={{
                    backgroundColor: marker.bg,
                    boxShadow: isHovered ? `0 0 25px ${marker.glowColor}` : `0 0 12px ${marker.glowColor}`,
                  }}
                >
                  <Icon className={`w-3.5 h-3.5 ${marker.textColor}`} />
                  <div className="text-left font-mono leading-none">
                    <div className="text-[11px] font-bold text-white tracking-wider">{marker.name}</div>
                    <div className={`text-[9px] font-extrabold tracking-widest ${marker.textColor}`}>
                      {marker.status}
                    </div>
                  </div>
                </div>

                {/* Pin Stem */}
                <div
                  className="w-0.5 h-3 mt-0.5"
                  style={{ backgroundColor: marker.color }}
                />
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: marker.color }}
                />
              </div>
            );
          })}

          {/* Bottom Right Tactical Crosshair HUD */}
          <div className="absolute bottom-28 right-8 z-10 hidden lg:flex items-center gap-2 font-mono text-xs text-[#94A3B8]/80 bg-[#05070B]/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-[#1E273D] shadow-lg">
            <Crosshair className="w-4 h-4 text-[#E63946] animate-spin" style={{ animationDuration: "12s" }} />
            <div>
              <div className="font-bold text-white tracking-wider text-[10px]">MUMBAI STRATEGIC GRID</div>
              <div className="text-[9px] text-[#64748B]">YOUR CITY. YOUR TERRITORY.</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Hero Foreground Content (Left-Aligned, Razor-Sharp Interactive HTML) */}
      <div className="relative z-20 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-14 pb-4 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl">
          {/* Official MONAD HUNT Logo Asset with sizes prop */}
          <div className="relative w-72 sm:w-96 h-24 sm:h-32 mb-2 -ml-2">
            <Image
              src="/assets/branding/monad-hunt-logo.jpg"
              alt="MONAD HUNT Official Logo"
              fill
              sizes="(max-width: 640px) 288px, 384px"
              priority
              className="object-contain object-left mix-blend-screen filter contrast-125 brightness-110"
            />
          </div>

          {/* City League Title */}
          <div className="font-display font-black text-2xl sm:text-3xl tracking-widest uppercase text-white mb-2 flex items-center gap-3">
            <span>CITY LEAGUE</span>
            <span className="w-8 h-0.5 bg-[#E63946]" />
            <span className="text-xs font-mono font-bold text-[#F4D35E] tracking-widest px-2.5 py-0.5 bg-[#F4D35E]/10 border border-[#F4D35E]/30 rounded">
              SEASON 01
            </span>
          </div>

          {/* Main Slogan with Red Energy Accents */}
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wide text-white leading-tight mt-1">
            CATCH. STAKE. <span className="text-[#E63946] drop-shadow-[0_0_15px_rgba(230,57,70,0.8)]">BATTLE. CONQUER.</span>
          </h2>

          {/* Supporting Pitch */}
          <p className="text-[#94A3B8] text-sm sm:text-base font-sans mt-4 max-w-xl leading-relaxed">
            A persistent on-chain competitive world where Hunters and their Beasts battle for territory,
            climb the rankings, and fight for seasonal dominance across Mumbai.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            {walletConnected ? (
              <button
                onClick={() => {
                  soundFX.playClick();
                  onEnterCity();
                }}
                className="relative group px-7 py-3.5 rounded font-display font-black text-sm sm:text-base uppercase tracking-wider text-white transition-all bg-gradient-to-r from-[#E63946] via-[#B2182B] to-[#8B1E2D] shadow-[0_0_25px_rgba(230,57,70,0.5)] hover:shadow-[0_0_35px_rgba(230,57,70,0.8)] hover:scale-[1.03] active:scale-[0.98] border border-[#FF4D5B]/60 flex items-center gap-2.5"
              >
                <span>ENTER THE CITY</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => {
                  soundFX.playClick();
                  onConnectWallet();
                }}
                className="relative group px-7 py-3.5 rounded font-display font-black text-sm sm:text-base uppercase tracking-wider text-white transition-all bg-gradient-to-r from-[#E63946] via-[#B2182B] to-[#8B1E2D] shadow-[0_0_25px_rgba(230,57,70,0.5)] hover:shadow-[0_0_35px_rgba(230,57,70,0.8)] hover:scale-[1.03] active:scale-[0.98] border border-[#FF4D5B]/60 flex items-center gap-2.5"
              >
                <Wallet className="w-4 h-4" />
                <span>CONNECT WALLET</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            <button
              onClick={() => {
                soundFX.playClick();
                onWatchTrailer();
              }}
              className="px-6 py-3.5 rounded font-display font-black text-sm sm:text-base uppercase tracking-wider text-white transition-all bg-[#0B0F17]/80 hover:bg-[#161B26] border border-[#1E273D] hover:border-[#E63946]/60 backdrop-blur-md flex items-center gap-2.5"
            >
              <Play className="w-4 h-4 text-[#E63946] fill-[#E63946]" />
              <span>WATCH TRAILER</span>
            </button>
          </div>

          {/* Compact Live Season Stat Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 p-3 sm:p-4 rounded-xl bg-[#0A0E17]/90 border border-[#1E273D] backdrop-blur-md max-w-xl shadow-2xl">
            <div className="text-left font-mono">
              <div className="flex items-center gap-1.5 text-xs text-[#E63946] font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>24 DAYS</span>
              </div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider mt-0.5">
                SEASON REMAINING
              </div>
            </div>

            <div className="text-left font-mono border-l border-[#1E273D] pl-3">
              <div className="flex items-center gap-1.5 text-xs text-white font-bold">
                <Swords className="w-3.5 h-3.5 text-[#E63946]" />
                <span>1,420</span>
              </div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider mt-0.5">
                TOTAL BATTLES
              </div>
            </div>

            <div className="text-left font-mono border-l border-[#1E273D] pl-3">
              <div className="flex items-center gap-1.5 text-xs text-[#00E676] font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>488</span>
              </div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider mt-0.5">
                ACTIVE HUNTERS
              </div>
            </div>

            <div className="text-left font-mono border-l border-[#1E273D] pl-3">
              <div className="flex items-center gap-1.5 text-xs text-[#F4D35E] font-bold">
                <Trophy className="w-3.5 h-3.5" />
                <span>#1</span>
              </div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider mt-0.5">
                TOP CREW
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Feature Strip matching reference image */}
      <div className="relative z-20 w-full bg-[#05070B]/95 border-t border-[#1E273D] backdrop-blur-xl py-3 px-4 sm:px-8">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          <div
            onClick={() => {
              soundFX.playClick();
              onEnterCity();
            }}
            className="flex items-center gap-3 p-2 rounded hover:bg-[#0B0F17] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-[#E63946]/15 border border-[#E63946]/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[#E63946]" />
            </div>
            <div>
              <div className="font-display font-black text-sm uppercase text-white tracking-wide">
                AI BEASTS
              </div>
              <div className="text-[10px] font-mono text-[#94A3B8]">Collect &amp; Evolve</div>
            </div>
          </div>

          <div
            onClick={() => {
              soundFX.playAttack();
              onEnterCity();
            }}
            className="flex items-center gap-3 p-2 rounded hover:bg-[#0B0F17] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-[#E63946]/15 border border-[#E63946]/30 flex items-center justify-center flex-shrink-0">
              <Swords className="w-4 h-4 text-[#E63946]" />
            </div>
            <div>
              <div className="font-display font-black text-sm uppercase text-white tracking-wide">
                LIVE ARENAS
              </div>
              <div className="text-[10px] font-mono text-[#94A3B8]">Real Players. Real Battles.</div>
            </div>
          </div>

          <div
            onClick={() => {
              soundFX.playClick();
              onEnterCity();
            }}
            className="flex items-center gap-3 p-2 rounded hover:bg-[#0B0F17] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-[#457B9D]/15 border border-[#457B9D]/30 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-[#457B9D]" />
            </div>
            <div>
              <div className="font-display font-black text-sm uppercase text-white tracking-wide">
                TERRITORIES
              </div>
              <div className="text-[10px] font-mono text-[#94A3B8]">Fight for Control</div>
            </div>
          </div>

          <div
            onClick={() => {
              soundFX.playClick();
              onEnterCity();
            }}
            className="flex items-center gap-3 p-2 rounded hover:bg-[#0B0F17] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-[#F4D35E]/15 border border-[#F4D35E]/30 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-[#F4D35E]" />
            </div>
            <div>
              <div className="font-display font-black text-sm uppercase text-white tracking-wide">
                CREWS
              </div>
              <div className="text-[10px] font-mono text-[#94A3B8]">Build Together</div>
            </div>
          </div>

          <div
            onClick={() => {
              soundFX.playClick();
              onEnterCity();
            }}
            className="flex items-center gap-3 p-2 rounded hover:bg-[#0B0F17] transition-colors col-span-2 md:col-span-1 cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-[#00E676]/15 border border-[#00E676]/30 flex items-center justify-center flex-shrink-0">
              <Target className="w-4 h-4 text-[#00E676]" />
            </div>
            <div>
              <div className="font-display font-black text-sm uppercase text-white tracking-wide">
                SEASONS
              </div>
              <div className="text-[10px] font-mono text-[#94A3B8]">Compete &amp; Rise</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
