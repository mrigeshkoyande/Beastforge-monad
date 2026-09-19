"use client";

import React from "react";
import { soundFX } from "@/game/SoundFX";
import { Compass, Swords, Trophy, ArrowRight } from "lucide-react";

interface HowItWorksProps {
  onStartHunt: () => void;
  onEnterArena: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartHunt, onEnterArena }) => {
  return (
    <section className="py-12 border-b-4 border-arcade-black bg-warm-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-arcade-yellow rounded-lg border-2 border-arcade-black text-[11px] font-black uppercase tracking-wider shadow-arcade-sm mb-2">
              GAMEPLAY LOOP
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-arcade-black tracking-tight leading-none">
              HOW IT <span className="text-arcade-electric">WORKS</span>
            </h2>
          </div>
          <p className="text-base md:text-lg font-bold text-arcade-black/70 max-w-md">
            Three simple steps to build your beast dynasty, capture Mumbai territories, and claim on-chain MON.
          </p>
        </div>

        {/* 3 Large Neo-Brutalist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: HUNT */}
          <div className="arcade-card bg-arcade-mint p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black px-2.5 py-1 bg-white rounded-lg border-2 border-arcade-black shadow-arcade-sm">
                  01 / EXPLORE
                </span>
                <div className="w-12 h-12 bg-white rounded-xl border-3 border-arcade-black flex items-center justify-center shadow-arcade-sm">
                  <Compass className="w-6 h-6 text-arcade-black" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-arcade-black mb-2 tracking-tight">
                🗺️ HUNT
              </h3>
              <p className="text-sm font-bold text-arcade-black/80 leading-relaxed mb-6">
                Discover rare beasts across 5 Mumbai zones. Scout territory guardians, assess elemental matchups, and recruit powerful arena fighters.
              </p>
            </div>
            <button
              onClick={() => {
                soundFX.playClick();
                onStartHunt();
              }}
              className="arcade-btn w-full py-3 bg-white text-arcade-black rounded-xl text-xs flex items-center justify-center gap-2"
            >
              EXPLORE MAP
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: BATTLE */}
          <div className="arcade-card bg-arcade-coral p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black px-2.5 py-1 bg-white rounded-lg border-2 border-arcade-black shadow-arcade-sm">
                  02 / STAKE & FIGHT
                </span>
                <div className="w-12 h-12 bg-white rounded-xl border-3 border-arcade-black flex items-center justify-center shadow-arcade-sm">
                  <Swords className="w-6 h-6 text-arcade-black" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-arcade-black mb-2 tracking-tight">
                ⚔️ BATTLE
              </h3>
              <p className="text-sm font-bold text-arcade-black/80 leading-relaxed mb-6">
                Enter the arena with fixed 0.1 MON entry fee. Battle adaptive on-chain bots trading attacks, dynamic defensive barriers, and finishers.
              </p>
            </div>
            <button
              onClick={() => {
                soundFX.playClick();
                onEnterArena();
              }}
              className="arcade-btn w-full py-3 bg-arcade-electric text-white rounded-xl text-xs flex items-center justify-center gap-2"
            >
              ENTER ARENA
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: CONQUER */}
          <div className="arcade-card bg-arcade-yellow p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black px-2.5 py-1 bg-white rounded-lg border-2 border-arcade-black shadow-arcade-sm">
                  03 / WIN & REPUTATION
                </span>
                <div className="w-12 h-12 bg-white rounded-xl border-3 border-arcade-black flex items-center justify-center shadow-arcade-sm">
                  <Trophy className="w-6 h-6 text-arcade-black" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-arcade-black mb-2 tracking-tight">
                🏆 CONQUER
              </h3>
              <p className="text-sm font-bold text-arcade-black/80 leading-relaxed mb-6">
                Claim on-chain MON rewards, capture territory flags, level up your beast’s combat stats, and climb the Global Hunter rankings.
              </p>
            </div>
            <div className="w-full py-3 px-4 bg-white rounded-xl border-3 border-arcade-black shadow-arcade-sm flex items-center justify-between">
              <span className="text-xs font-black text-arcade-black">REWARDS</span>
              <span className="text-xs font-black text-arcade-electric">MON + XP + TERRITORY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
