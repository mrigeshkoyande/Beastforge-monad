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
      glowColor: "rgba(244,211,94,0.6)",
      bg: "rgba(244,211,94,0.18)",
      border: "#F4D35E",
      textColor: "#F4D35E",
      icon: Swords,
      top: "26%",
      left: "50%",
    },
    {
      id: "bkc",
      name: "BKC",
      status: "LIVE ARENA",
      color: "#E63946",
      glowColor: "rgba(230,57,70,0.8)",
      bg: "rgba(230,57,70,0.25)",
      border: "#E63946",
      textColor: "#E63946",
      icon: Target,
      top: "29%",
      left: "65%",
      isLive: true,
    },
    {
      id: "powai",
      name: "POWAI",
      status: "DOMINATED",
      color: "#00E676",
      glowColor: "rgba(0,230,118,0.6)",
      bg: "rgba(0,230,118,0.18)",
      border: "#00E676",
      textColor: "#00E676",
      icon: Shield,
      top: "35%",
      left: "80%",
    },
    {
      id: "bandra",
      name: "BANDRA",
      status: "STABLE",
      color: "#457B9D",
      glowColor: "rgba(69,123,157,0.6)",
      bg: "rgba(69,123,157,0.2)",
      border: "#457B9D",
      textColor: "#457B9D",
      icon: Shield,
      top: "42%",
      left: "43%",
    },
    {
      id: "fort",
      name: "FORT",
      status: "UNDER ATTACK",
      color: "#E63946",
      glowColor: "rgba(230,57,70,0.8)",
      bg: "rgba(230,57,70,0.28)",
      border: "#E63946",
      textColor: "#E63946",
      icon: Swords,
      top: "53%",
      left: "59%",
      isPulse: true,
    },
    {
      id: "lower-parel",
      name: "LOWER PAREL",
      status: "DEFENDING",
      color: "#457B9D",
      glowColor: "rgba(69,123,157,0.6)",
      bg: "rgba(69,123,157,0.2)",
      border: "#457B9D",
      textColor: "#457B9D",
      icon: Shield,
      top: "57%",
      left: "76%",
    },
  ];

  return (
    <section className="relative w-full min-h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-[#05070B]">

      {/* ── BACKGROUND LAYERS ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Main cyberpunk Mumbai + Beast artwork */}
        <Image
          src="/assets/hero/mumbai-beast-hero.jpg"
          alt="Cyberpunk Mumbai with Beast"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
        {/* Left dark overlay so left-side text is legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070B] from-0% via-[#05070B]/75 via-35% to-transparent to-65%" />
        {/* Top fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070B]/60 via-transparent to-[#05070B]" />
        {/* Red atmospheric glow top-left (beast origin) */}
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-[#E63946]/10 to-transparent pointer-events-none" />
      </div>

      {/* ── BEAST HUD — top right ── */}
      <div className="absolute top-4 right-4 sm:right-6 z-20 hidden sm:block">
        <button
          onClick={() => { soundFX.playClick(); onEnterCity(); }}
          className="group flex items-center gap-3 bg-[#080C14]/90 backdrop-blur-md border border-[#1E273D] hover:border-[#E63946]/60 px-4 py-2.5 rounded-lg transition-all shadow-xl"
        >
          <div className="relative w-10 h-10 rounded bg-[#131A28] border border-[#232D3F] overflow-hidden flex items-center justify-center flex-shrink-0">
            <span className="text-xl group-hover:scale-110 transition-transform">🐲</span>
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-[#E63946]" />
          </div>
          <div className="text-left font-mono">
            <div className="text-[9px] text-[#455070] uppercase tracking-[0.2em] font-bold">YOUR BEAST</div>
            <div className="text-xs font-bold text-white uppercase group-hover:text-[#F4D35E] transition-colors">
              {playerBeast?.name ?? "NEON VIPERS"}
            </div>
            <div className="text-[10px] text-[#E63946] font-bold">Lv. {playerBeast?.level ?? 36}</div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#3A4A60] group-hover:text-white group-hover:translate-x-0.5 transition-all ml-1" />
        </button>
      </div>

      {/* ── FLOATING TERRITORY MARKERS ── */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="relative w-full h-full">
          {territoryMarkers.map((m) => {
            const Icon = m.icon;
            const isHovered = activeHoveredZone === m.id;
            return (
              <div
                key={m.id}
                style={{ top: m.top, left: m.left }}
                onClick={() => { soundFX.playClick(); onSelectTerritoryZone(m.id); }}
                onMouseEnter={() => setActiveHoveredZone(m.id)}
                onMouseLeave={() => setActiveHoveredZone(null)}
                className="hud-marker pointer-events-auto hidden lg:flex flex-col items-center"
              >
                {/* Radar ring for live / attack zones */}
                {(m.isLive || m.isPulse) && (
                  <div
                    className="absolute -inset-4 rounded-xl border animate-radar-ring pointer-events-none"
                    style={{ borderColor: m.color }}
                  />
                )}
                {/* Badge */}
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border backdrop-blur-sm transition-all"
                  style={{
                    backgroundColor: m.bg,
                    borderColor: m.border,
                    boxShadow: isHovered
                      ? `0 0 28px ${m.glowColor}`
                      : `0 0 12px ${m.glowColor}`,
                  }}
                >
                  <Icon className="w-3 h-3" style={{ color: m.textColor }} />
                  <div className="font-mono leading-none">
                    <div className="text-[11px] font-bold text-white tracking-wider">{m.name}</div>
                    <div className="text-[9px] font-extrabold tracking-widest" style={{ color: m.textColor }}>
                      {m.status}
                    </div>
                  </div>
                </div>
                {/* Pin stem */}
                <div className="w-px h-3 mt-0.5" style={{ backgroundColor: m.color }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
              </div>
            );
          })}

          {/* Mumbai watermark bottom-right */}
          <div className="absolute bottom-24 right-6 hidden lg:flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-[#E63946] animate-spin" style={{ animationDuration: "14s" }} />
            <div className="text-right font-mono">
              <div className="text-xs font-bold text-white/60 tracking-[0.35em] uppercase">MUMBAI</div>
              <div className="text-[9px] text-[#334060] tracking-[0.2em] uppercase">YOUR CITY. YOUR TERRITORY.</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN HERO CONTENT (left side) ── */}
      <div className="relative z-20 flex-1 flex flex-col justify-center max-w-[1600px] mx-auto w-full px-4 sm:px-8 lg:px-12 pt-8 lg:pt-12 pb-4">
        <div className="max-w-[580px]">

          {/* Logo row: M-mark + MONAD HUNT brand */}
          <div className="flex items-center gap-4 mb-2">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 drop-shadow-[0_0_20px_rgba(230,57,70,0.5)]">
              <Image
                src="/assets/branding/monad-m-mark.jpg"
                alt="Monad Hunt M Logo"
                fill
                sizes="80px"
                priority
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="font-display font-black uppercase leading-none tracking-tight">
                <span
                  className="text-white"
                  style={{ fontSize: "clamp(2.8rem, 6.5vw, 5.5rem)", display: "block", lineHeight: 1 }}
                >
                  MONAD
                </span>
                <span
                  className="text-[#E63946] italic drop-shadow-[0_0_20px_rgba(230,57,70,0.7)]"
                  style={{ fontSize: "clamp(2.8rem, 6.5vw, 5.5rem)", display: "block", lineHeight: 0.95 }}
                >
                  HUNT
                </span>
              </h1>
            </div>
          </div>

          {/* CITY LEAGUE subtitle */}
          <div className="font-display font-black text-base sm:text-xl tracking-[0.45em] uppercase text-white/70 mb-4 ml-1">
            CITY LEAGUE
          </div>

          {/* Slogan */}
          <p className="font-display italic font-bold text-lg sm:text-2xl lg:text-3xl uppercase tracking-wide text-white mb-3">
            Catch. Stake. Battle.{" "}
            <span className="text-[#E63946] drop-shadow-[0_0_10px_rgba(230,57,70,0.8)]">Conquer.</span>
          </p>

          {/* Description */}
          <p className="text-[#8FA3B8] text-sm sm:text-base font-sans leading-relaxed max-w-sm mb-8">
            A persistent on-chain competitive world where Hunters and their Beasts battle for territory,
            climb the rankings, and fight for seasonal dominance across Mumbai.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {walletConnected ? (
              <button
                onClick={() => { soundFX.playClick(); onEnterCity(); }}
                className="group flex items-center gap-2.5 px-7 py-3.5 font-display font-black text-sm sm:text-base uppercase tracking-wider text-white rounded transition-all bg-gradient-to-r from-[#E63946] via-[#C0182A] to-[#8B1E2D] border border-[#FF4D5B]/40 shadow-[0_0_24px_rgba(230,57,70,0.4)] hover:shadow-[0_0_40px_rgba(230,57,70,0.7)] hover:scale-[1.03] active:scale-[0.97]"
              >
                <span>ENTER THE CITY</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => { soundFX.playClick(); onConnectWallet(); }}
                className="group flex items-center gap-2.5 px-7 py-3.5 font-display font-black text-sm sm:text-base uppercase tracking-wider text-white rounded transition-all bg-gradient-to-r from-[#E63946] via-[#C0182A] to-[#8B1E2D] border border-[#FF4D5B]/40 shadow-[0_0_24px_rgba(230,57,70,0.4)] hover:shadow-[0_0_40px_rgba(230,57,70,0.7)] hover:scale-[1.03] active:scale-[0.97]"
              >
                <Wallet className="w-4 h-4" />
                <span>CONNECT WALLET</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            <button
              onClick={() => { soundFX.playClick(); onWatchTrailer(); }}
              className="flex items-center gap-2.5 px-6 py-3.5 font-display font-black text-sm sm:text-base uppercase tracking-wider text-white rounded transition-all bg-[#0C1118]/80 border border-[#1E2D40] hover:border-[#E63946]/50 backdrop-blur-md hover:bg-[#111B28]"
            >
              <Play className="w-4 h-4 text-[#E63946] fill-[#E63946]" />
              <span>WATCH TRAILER</span>
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex items-stretch divide-x divide-[#1E273D] border border-[#1E273D] rounded-xl overflow-hidden bg-[#06090F]/85 backdrop-blur-md w-fit shadow-xl">
            {[
              { icon: Flame, value: "24 DAYS", label: "SEASON REMAINING", color: "#E63946" },
              { icon: Swords, value: "1,420", label: "TOTAL BATTLES", color: "#FFFFFF" },
              { icon: Users, value: "488", label: "ACTIVE HUNTERS", color: "#00E676" },
              { icon: Trophy, value: "#1", label: "TOP CREW", color: "#F4D35E" },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="px-4 py-3 font-mono">
                <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color }}>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{value}</span>
                </div>
                <div className="text-[9px] text-[#3D5070] uppercase tracking-wider mt-0.5 font-bold whitespace-nowrap">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM FEATURE STRIP ── */}
      <div className="relative z-20 w-full border-t border-[#1A2438] bg-[#040608]/95 backdrop-blur-xl py-3 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {[
            { icon: Sparkles, label: "AI BEASTS", sub: "Collect & Evolve", color: "#E63946", bg: "rgba(230,57,70,0.12)", border: "rgba(230,57,70,0.3)" },
            { icon: Swords, label: "LIVE ARENAS", sub: "Real Players. Real Battles.", color: "#E63946", bg: "rgba(230,57,70,0.12)", border: "rgba(230,57,70,0.3)" },
            { icon: Shield, label: "TERRITORIES", sub: "Fight for Control", color: "#457B9D", bg: "rgba(69,123,157,0.12)", border: "rgba(69,123,157,0.3)" },
            { icon: Users, label: "CREWS", sub: "Build Together", color: "#F4D35E", bg: "rgba(244,211,94,0.12)", border: "rgba(244,211,94,0.3)" },
            { icon: Target, label: "SEASONS", sub: "Compete & Rise", color: "#00E676", bg: "rgba(0,230,118,0.12)", border: "rgba(0,230,118,0.3)" },
          ].map(({ icon: Icon, label, sub, color, bg, border }, i) => (
            <div
              key={label}
              onClick={() => { soundFX.playClick(); onEnterCity(); }}
              className={`flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#0D1220] transition-colors cursor-pointer ${i === 4 ? "col-span-2 md:col-span-1" : ""}`}
            >
              <div
                className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: bg, border: `1px solid ${border}` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <div className="font-display font-black text-xs sm:text-sm uppercase text-white tracking-wide leading-none">
                  {label}
                </div>
                <div className="text-[9px] sm:text-[10px] font-mono text-[#455070] mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
