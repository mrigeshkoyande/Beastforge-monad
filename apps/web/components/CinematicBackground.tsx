"use client";

import React from "react";

export type BackgroundVariant =
  | "landing"
  | "arena"
  | "map"
  | "leaderboard"
  | "crews"
  | "hunt-tv"
  | "profile"
  | "default";

interface CinematicBackgroundProps {
  variant?: BackgroundVariant;
  showVideo?: boolean;
}

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({
  variant = "default",
  showVideo = false,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* 1. Base Dark Cosmic Gradient */}
      <div className="absolute inset-0 bg-[#05070B]" />

      {/* 2. Optional Hero Video Atmosphere Layer (Optimized, Muted, Low Opacity) */}
      {showVideo && (
        <div className="absolute inset-0 overflow-hidden">
          <video
            src="/media/trailer.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover opacity-25 filter contrast-125 brightness-75 scale-105"
          />
          {/* Deep dark gradient overlay above video to keep content legible */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070B] via-[#05070B]/80 to-[#05070B]/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-[#05070B]/80" />
        </div>
      )}

      {/* 3. Subtle Cybernetic Tactical Grid */}
      <div className="absolute inset-0 tactical-grid opacity-30" />

      {/* 4. CRT Scanlines for Authentic Retro-Cyber Touch */}
      <div className="absolute inset-0 tactical-scanline opacity-20" />

      {/* 5. Variant-Specific Atmospheric Lighting & Particle Flares */}
      {variant === "landing" && (
        <>
          {/* Red & Maroon Atmospheric Energy Orbs */}
          <div className="absolute top-[10%] left-[60%] w-[550px] h-[550px] bg-[#E63946]/10 rounded-full blur-[140px] animate-pulse-live" />
          <div className="absolute top-[45%] right-[5%] w-[450px] h-[450px] bg-[#8B1E2D]/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] bg-[#457B9D]/10 rounded-full blur-[100px]" />
        </>
      )}

      {variant === "arena" && (
        <>
          {/* Intense Combat Dual Flare: Crimson vs Steel */}
          <div className="absolute top-[20%] left-[15%] w-[450px] h-[450px] bg-[#E63946]/15 rounded-full blur-[130px] animate-pulse-live" />
          <div className="absolute top-[20%] right-[15%] w-[450px] h-[450px] bg-[#457B9D]/15 rounded-full blur-[130px]" />
          {/* Center Arena Battle Spotlight */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#F4D35E]/5 rounded-full blur-[100px]" />
          {/* Arena Ring lines */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] rounded-full border border-[#E63946]/10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] rounded-full border border-[#457B9D]/10 pointer-events-none" />
        </>
      )}

      {variant === "map" && (
        <>
          {/* Tactical Holographic Radar & Coordinate Rings */}
          <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[700px] h-[700px] rounded-full border border-[#457B9D]/15" />
          <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[1000px] h-[1000px] rounded-full border border-[#457B9D]/10" />
          <div className="absolute top-[20%] left-[25%] w-[400px] h-[400px] bg-[#457B9D]/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] right-[25%] w-[450px] h-[450px] bg-[#E63946]/12 rounded-full blur-[130px]" />
        </>
      )}

      {variant === "leaderboard" && (
        <>
          {/* Esports Trophy Solar Gold Flares */}
          <div className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[650px] h-[350px] bg-[#F4D35E]/10 rounded-full blur-[130px]" />
          <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-[#8B1E2D]/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[#00E676]/10 rounded-full blur-[120px]" />
        </>
      )}

      {variant === "crews" && (
        <>
          {/* 4-Faction Elemental Aura Corner Flares */}
          <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] bg-[#E63946]/12 rounded-full blur-[110px]" />
          <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] bg-[#457B9D]/12 rounded-full blur-[110px]" />
          <div className="absolute bottom-[10%] left-[10%] w-[350px] h-[350px] bg-[#F4D35E]/10 rounded-full blur-[110px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-[#836EF9]/10 rounded-full blur-[110px]" />
        </>
      )}

      {variant === "hunt-tv" && (
        <>
          {/* Broadcast Studio Moving Light Beams */}
          <div className="absolute top-0 left-1/4 w-[2px] h-full bg-gradient-to-b from-transparent via-[#E63946]/20 to-transparent" />
          <div className="absolute top-0 right-1/4 w-[2px] h-full bg-gradient-to-b from-transparent via-[#457B9D]/20 to-transparent" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#E63946]/10 rounded-full blur-[130px]" />
        </>
      )}

      {variant === "profile" && (
        <>
          {/* Beast Evolution Chamber Glow */}
          <div className="absolute top-[25%] left-[50%] -translate-x-1/2 w-[550px] h-[550px] bg-[#F4D35E]/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[15%] left-[30%] w-[400px] h-[400px] bg-[#E63946]/12 rounded-full blur-[120px]" />
        </>
      )}

      {variant === "default" && (
        <>
          <div className="absolute top-[20%] right-[20%] w-[500px] h-[500px] bg-[#E63946]/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[20%] left-[20%] w-[450px] h-[450px] bg-[#457B9D]/10 rounded-full blur-[130px]" />
        </>
      )}

      {/* 6. Subtle Technical HUD Accent Lines */}
      <div className="absolute top-6 left-8 text-[9px] font-mono text-[#64748B]/30 tracking-widest uppercase hidden lg:block">
        GRID LAT 19.0760° N · LON 72.8777° E · MONAD CHAIN ID 10143
      </div>
      <div className="absolute bottom-6 right-8 text-[9px] font-mono text-[#64748B]/30 tracking-widest uppercase hidden lg:block">
        MONAD HUNT PROTOCOL V2.4 · EIP-712 SETTLED
      </div>
    </div>
  );
};
