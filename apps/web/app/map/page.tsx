"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CinematicBackground } from "@/components/CinematicBackground";
import { TerritoryMap } from "@/components/TerritoryMap";
import { LiveSettlementConsole } from "@/components/LiveSettlementConsole";
import { useGame } from "@/context/GameContext";

export default function MapPage() {
  const router = useRouter();
  const {
    territories,
    playerBeast,
    handleChallengeTerritory,
    handleFortifyTerritory,
    txProgress,
    isConsoleOpen,
    setIsConsoleOpen,
  } = useGame();

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-[#05070B] text-white">
      <CinematicBackground variant="map" />

      <div>
        <Navbar />

        <LiveSettlementConsole
          isOpen={isConsoleOpen}
          progress={txProgress}
          onClose={() => setIsConsoleOpen(false)}
        />

        <main className="py-6 max-w-[1600px] mx-auto px-4 sm:px-8">
          <TerritoryMap
            territories={territories}
            playerBeast={playerBeast}
            onChallengeTerritory={(terr) => {
              handleChallengeTerritory(terr);
              router.push("/arena");
            }}
            onFortifyTerritory={handleFortifyTerritory}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
}
