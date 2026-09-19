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
      top: "28%",
      left: "52%",
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
      top: "30%",
      left: "68%",
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
      top: "37%",
      left: "83%",
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
      top: "44%",
      left: "44%",
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
      top: "55%",
      left: "61%",
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
      top: "60%",
      left: "78%",
    },
  ];

  return (
    <section className="relative w-full min-h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-[#05070B] select-none">

      {/* ── 1. Cinematic Background ── */}
      <div className="absolute inset-0 z-0">
        {/* Video atmosphere - very subtle */}
        <video
          src="/media/trailer.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover opacity-10 filter contrast-125 brightness-50 scale-105"
        />

        {/* Full-bleed Mumbai city + Beast background art */}
        <div className="absolute inset-0">
          <Image
            src="/assets/hero/mumbai-beast-hero.jpg"
            alt="Cyberpunk Mumbai with Cyber Beast"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
        </div>

        {/* Left-to-right dark gradient — preserves text readability on left, reveals city/beast on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070B] via-[#05070B]/70 via-40% to-transparent" />
        {/* Top and bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-[#05070B]/40" />
        {/* Ambient red glow top-right (beast area) */}
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-[#E63946]/15 via-[#8B1E2D]/10 to-transparent" />
        {/* Purple glow left (beast) */}
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-[#4B0082]/15 to-transparent" />

        {/* Very subtle scanlines */}
        <div className="absolute inset-0 tactical-scanline opacity-8 pointer-events-none" />
      </div>

      {/* ── 2. Beast HUD card — upper right ── */}
      <div className="absolute top-4 right-4 sm:right-6 lg:right-8 z-20 hidden md:block">
        <div
          onClick={() => { soundFX.playClick(); onEnterCity(); }}
          className="group flex items-center gap-3 bg-[#0A0F1A]/85 backdrop-blur-md border border-[#1E273D] hover:border-[#E63946]/70 px-4 py-2.5 rounded-lg cursor-pointer transition-all shadow-[0_4px_24px_rgba(0,0,0,0.8)] hover:shadow-[0_4px_30px_rgba(230,57,70,0.25)]"
        >
          <div className="relative w-10 h-10 rounded-md bg-[#161B26] border border-[#2A354D] overflow-hidden flex items-center justify-center flex-shrink-0">
            <span className="text-xl group-hover:scale-110 transition-transform">🐲</span>
            <span className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#E63946] to-[#8B1E2D]" />
          </div>
          <div className="text-left font-mono">
            <div className="text-[9px] text-[#64748B] uppercase tracking-[0.2em] font-bold">YOUR BEAST</div>
            <div className="text-xs font-bold text-white uppercase group-hover:text-[#F4D35E] transition-colors tracking-wide">
              {playerBeast ? playerBeast.name : "NEON VIPERS"}
            </div>
            <div className="text-[10px] text-[#E63946] font-bold">
              Lv. {playerBeast ? playerBeast.level : 36}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#455070] group-hover:text-white group-hover:translate-x-0.5 transition-all ml-1" />
        </div>
      </div>

      {/* ── 3. Floating Territory Markers (center-right of the city map) ── */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="relative w-full h-full">
          {territoryMarkers.map((marker) => {
            const Icon = marker.icon;
            const isHovered = activeHoveredZone === marker.id;

            return (
              <div
                key={marker.id}
                style={{ top: marker.top, left: marker.left }}
                onClick={() => { soundFX.playClick(); onSelectTerritoryZone(marker.id); }}
                onMouseEnter={() => setActiveHoveredZone(marker.id)}
                onMouseLeave={() => setActiveHoveredZone(null)}
                className="hud-marker pointer-events-auto hidden lg:flex flex-col items-center"
              >
                {/* Radar pulse ring for live/attack zones */}
                {(marker.isLive || marker.isPulse) && (
                  <div
                    className="absolute -inset-4 rounded-xl border animate-radar-ring pointer-events-none"
                    style={{ borderColor: marker.color }}
                  />
                )}

                {/* Marker Badge */}
                <div
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border backdrop-blur-md transition-all shadow-lg ${marker.borderColor}`}
                  style={{
                    backgroundColor: marker.bg,
                    boxShadow: isHovered
                      ? `0 0 28px ${marker.glowColor}, 0 0 8px ${marker.glowColor}`
                      : `0 0 14px ${marker.glowColor}`,
                  }}
                >
                  <Icon className={`w-3 h-3 ${marker.textColor}`} />
                  <div className="text-left font-mono leading-none">
                    <div className="text-[11px] font-bold text-white tracking-wider">{marker.name}</div>
                    <div className={`text-[9px] font-extrabold tracking-widest uppercase ${marker.textColor}`}>
                      {marker.status}
                    </div>
                  </div>
                </div>

                {/* Pin stem + dot */}
                <div className="w-px h-3 mt-0.5" style={{ backgroundColor: marker.color }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: marker.color }} />
              </div>
            );
          })}

          {/* Bottom-right MUMBAI watermark + crosshair */}
          <div className="absolute bottom-24 right-6 z-10 hidden lg:flex items-center gap-2 font-mono text-right">
            <Crosshair
              className="w-4 h-4 text-[#E63946] animate-spin flex-shrink-0"
              style={{ animationDuration: "14s" }}
            />
            <div>
              <div className="text-xs font-bold text-white/70 tracking-[0.3em] uppercase">MUMBAI</div>
              <div className="text-[9px] text-[#455070] tracking-[0.2em] uppercase">YOUR CITY. YOUR TERRITORY.</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Main Hero Content — left side ── */}
      <div className="relative z-20 flex-1 flex flex-col justify-center max-w-[1600px] mx-auto w-full px-4 sm:px-8 lg:px-12 pt-10 pb-6">
        <div className="max-w-[640px]">

          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] animate-pulse" />
            <span className="font-mono text-xs font-bold text-[#94A3B8] tracking-[0.25em] uppercase">
              SEASON 01 — MUMBAI
            </span>
          </div>

          {/* Giant split-color title — MONAD white, HUNT red italic */}
          <h1 className="font-display font-black leading-none uppercase mb-1 tracking-tight">
            <span
              className="block text-white"
              style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", lineHeight: 0.95 }}
            >
              MONAD
            </span>
            <span
              className="block text-[#E63946] italic drop-shadow-[0_0_30px_rgba(230,57,70,0.7)]"
              style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", lineHeight: 0.95 }}
            >
              HUNT
            </span>
          </h1>

          {/* CITY LEAGUE subtitle */}
          <div className="font-display font-black text-xl sm:text-2xl tracking-[0.3em] uppercase text-white/80 mt-3 mb-5">
            CITY LEAGUE
          </div>

          {/* Italic slogan line */}
          <p
            className="font-display italic text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-wide mb-3"
            style={{ color: "#FFFFFF" }}
          >
            Catch. Stake. Battle.{" "}
            <span className="text-[#E63946] drop-shadow-[0_0_12px_rgba(230,57,70,0.8)]">Conquer.</span>
          </p>

          {/* Description */}
          <p className="text-[#94A3B8] text-sm sm:text-base font-sans leading-relaxed max-w-md mb-8">
            A persistent on-chain competitive world where Hunters and their Beasts battle for territory,
            climb the rankings, and fight for seasonal dominance across Mumbai.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <button
              onClick={() => { soundFX.playClick(); walletConnected ? onEnterCity() : onConnectWallet(); }}
              className="group relative flex items-center gap-2.5 px-7 py-3.5 font-display font-black text-sm sm:text-base uppercase tracking-wider text-white rounded transition-all bg-gradient-to-r from-[#E63946] via-[#C0182A] to-[#8B1E2D] border border-[#FF4D5B]/50 shadow-[0_0_24px_rgba(230,57,70,0.45)] hover:shadow-[0_0_40px_rgba(230,57,70,0.75)] hover:scale-[1.03] active:scale-[0.98]"
            >
              {!walletConnected && <Wallet className="w-4 h-4" />}
              <span>{walletConnected ? "ENTER THE CITY" : "CONNECT WALLET"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => { soundFX.playClick(); onWatchTrailer(); }}
              className="flex items-center gap-2.5 px-6 py-3.5 font-display font-black text-sm sm:text-base uppercase tracking-wider text-white rounded transition-all bg-[#0B0F17]/80 border border-[#2A354D] hover:border-[#E63946]/50 backdrop-blur-md hover:bg-[#131929]"
            >
              <Play className="w-4 h-4 text-[#E63946] fill-[#E63946]" />
              <span>WATCH TRAILER</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="inline-grid grid-cols-2 sm:grid-cols-4 gap-0 rounded-xl overflow-hidden border border-[#1E273D] bg-[#080C14]/85 backdrop-blur-md shadow-2xl">
            {[
              { icon: Flame, value: "24 DAYS", label: "SEASON REMAINING", color: "#E63946" },
              { icon: Swords, value: "1,420", label: "TOTAL BATTLES", color: "#FFFFFF" },
              { icon: Users, value: "488", label: "ACTIVE HUNTERS", color: "#00E676" },
              { icon: Trophy, value: "#1", label: "TOP CREW", color: "#F4D35E" },
            ].map(({ icon: Icon, value, label, color }, i) => (
              <div
                key={label}
                className={`px-4 py-3 font-mono ${i > 0 ? "border-l border-[#1E273D]" : ""}`}
              >
                <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color }}>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{value}</span>
                </div>
                <div className="text-[9px] text-[#455070] uppercase tracking-wider mt-0.5 font-bold">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. Bottom Feature Strip ── */}
      <div className="relative z-20 w-full border-t border-[#1E273D]/80 bg-[#05070B]/95 backdrop-blur-xl py-3 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
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
              className={`flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#0D1220] transition-colors cursor-pointer ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <div
                className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: bg, border: `1px solid ${border}` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <div className="font-display font-black text-sm uppercase text-white tracking-wide leading-none">
                  {label}
                </div>
                <div className="text-[10px] font-mono text-[#64748B] mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
