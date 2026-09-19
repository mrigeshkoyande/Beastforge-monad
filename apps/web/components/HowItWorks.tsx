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
    <section className="py-12 border-b border-[#1E273D] bg-[#05070B]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-[#101522] rounded-lg border border-[#1E273D] text-[11px] font-mono font-bold uppercase tracking-wider text-[#F4D35E] mb-2">
              GAMEPLAY LOOP
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-wider uppercase leading-none">
              HOW IT <span className="text-[#E63946]">WORKS</span>
            </h2>
          </div>
          <p className="text-sm md:text-base font-sans text-[#94A3B8] max-w-md">
            Three simple steps to build your beast dynasty, capture Mumbai territories, and claim on-chain MON.
          </p>
        </div>

        {/* 3 Large Dark Cyber Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: HUNT */}
          <div className="bg-[#0B0F17] border border-[#1E273D] hover:border-[#457B9D] p-6 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-[#101522] text-[#457B9D] rounded-lg border border-[#1E273D]">
                  01 / EXPLORE
                </span>
                <div className="w-12 h-12 bg-[#101522] rounded-xl border border-[#1E273D] flex items-center justify-center">
                  <Compass className="w-6 h-6 text-[#457B9D]" />
                </div>
              </div>
              <h3 className="text-2xl font-display font-black text-white mb-2 uppercase tracking-wide">
                🗺️ HUNT
              </h3>
              <p className="text-xs font-sans text-[#94A3B8] leading-relaxed mb-6">
                Discover rare beasts across 12 Mumbai zones. Scout territory guardians, assess elemental matchups, and recruit powerful arena fighters.
              </p>
            </div>
            <button
              onClick={() => {
                soundFX.playClick();
                onStartHunt();
              }}
              className="py-3 bg-[#101522] hover:bg-[#171E30] text-white border border-[#1E273D] hover:border-[#457B9D] rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all"
            >
              EXPLORE MAP
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: BATTLE */}
          <div className="bg-[#0B0F17] border border-[#1E273D] hover:border-[#E63946] p-6 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-[#101522] text-[#E63946] rounded-lg border border-[#1E273D]">
                  02 / STAKE &amp; FIGHT
                </span>
                <div className="w-12 h-12 bg-[#101522] rounded-xl border border-[#1E273D] flex items-center justify-center">
                  <Swords className="w-6 h-6 text-[#E63946]" />
                </div>
              </div>
              <h3 className="text-2xl font-display font-black text-white mb-2 uppercase tracking-wide">
                ⚔️ BATTLE
              </h3>
              <p className="text-xs font-sans text-[#94A3B8] leading-relaxed mb-6">
                Enter the arena with fixed entry fee. Battle adaptive on-chain opponents trading attacks, dynamic defensive barriers, and special finishers.
              </p>
            </div>
            <button
              onClick={() => {
                soundFX.playClick();
                onEnterArena();
              }}
              className="py-3 bg-gradient-to-r from-[#E63946] to-[#8B1E2D] hover:brightness-110 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(230,57,70,0.4)] transition-all"
            >
              ENTER ARENA
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: CONQUER */}
          <div className="bg-[#0B0F17] border border-[#1E273D] hover:border-[#F4D35E] p-6 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-[#101522] text-[#F4D35E] rounded-lg border border-[#1E273D]">
                  03 / WIN &amp; REPUTATION
                </span>
                <div className="w-12 h-12 bg-[#101522] rounded-xl border border-[#1E273D] flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-[#F4D35E]" />
                </div>
              </div>
              <h3 className="text-2xl font-display font-black text-white mb-2 uppercase tracking-wide">
                🏆 CONQUER
              </h3>
              <p className="text-xs font-sans text-[#94A3B8] leading-relaxed mb-6">
                Claim on-chain MON rewards, capture territory flags, level up your beast’s combat stats, and climb the Global Hunter rankings.
              </p>
            </div>
            <div className="w-full py-3 px-4 bg-[#101522] rounded-xl border border-[#1E273D] flex items-center justify-between font-mono">
              <span className="text-xs text-[#94A3B8]">REWARDS</span>
              <span className="text-xs font-bold text-[#F4D35E]">MON + XP + TERRITORY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
