"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CinematicBackground } from "@/components/CinematicBackground";
import { LiveSettlementConsole } from "@/components/LiveSettlementConsole";
import { useGame } from "@/context/GameContext";
import { CREWS } from "@/data/warData";
import { Users, Trophy, Shield, Flame } from "lucide-react";

export default function CrewsPage() {
  const {
    userCrewId,
    joinCrew,
    txProgress,
    isConsoleOpen,
    setIsConsoleOpen,
  } = useGame();

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-[#05070B] text-white">
      <CinematicBackground variant="crews" />

      <div>
        <Navbar />

        <LiveSettlementConsole
          isOpen={isConsoleOpen}
          progress={txProgress}
          onClose={() => setIsConsoleOpen(false)}
        />

        <main className="py-10 max-w-[1600px] mx-auto px-4 sm:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E63946]/15 border border-[#E63946]/40 rounded text-xs font-mono font-bold text-[#E63946] mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>SEASON 01 FACTION SYNDICATES</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-wider text-white">
              MUMBAI CREW FACTIONS
            </h1>
            <p className="text-sm font-sans text-[#94A3B8] mt-2 max-w-2xl leading-relaxed">
              Declare your allegiance to one of four cyber syndicates. Every territory conquest and arena victory feeds into your faction&apos;s seasonal treasury on Monad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CREWS.map((crew) => {
              const isSelected = userCrewId === crew.id;

              return (
                <div
                  key={crew.id}
                  onClick={() => joinCrew(crew.id)}
                  className={`relative bg-[#0B0F17]/90 border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between ${
                    isSelected
                      ? "border-[#E63946] bg-[#E63946]/10 shadow-[0_0_30px_rgba(230,57,70,0.3)]"
                      : "border-[#1E273D] hover:border-[#457B9D]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-5xl">{crew.banner}</span>
                      <span className="font-mono text-xs font-bold text-[#F4D35E] bg-[#F4D35E]/10 px-3 py-1 rounded-full border border-[#F4D35E]/30">
                        {crew.seasonPoints} PTS
                      </span>
                    </div>

                    <h2 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                      {crew.name}
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-2 mb-6 leading-relaxed">
                      {crew.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1E273D] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#64748B]">{crew.wins}W - {crew.losses}L</span>
                    <span className={isSelected ? "text-[#00E676] font-bold" : "text-[#94A3B8] group-hover:text-white"}>
                      {isSelected ? "ALLEGIANCE ACTIVE" : "JOIN CREW →"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
