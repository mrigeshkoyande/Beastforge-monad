"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CinematicBackground } from "@/components/CinematicBackground";
import { ArenaLobby } from "@/components/ArenaLobby";
import { BattleScreen } from "@/components/BattleScreen";
import { VictoryDefeatModal } from "@/components/VictoryDefeatModal";
import { EvolutionModal } from "@/components/EvolutionModal";
import { LiveSettlementConsole } from "@/components/LiveSettlementConsole";
import { useGame } from "@/context/GameContext";

export default function ArenaPage() {
  const router = useRouter();
  const {
    playerBeast,
    opponentBeast,
    selectedTerritory,
    isFighting,
    startBattle,
    exitBattle,
    handleBattleEnd,
    battleResultData,
    setBattleResultData,
    evolutionData,
    setEvolutionData,
    txProgress,
    isConsoleOpen,
    setIsConsoleOpen,
  } = useGame();

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-[#05070B] text-white">
      <CinematicBackground variant="arena" />

      <div>
        <Navbar />

        <LiveSettlementConsole
          isOpen={isConsoleOpen}
          progress={txProgress}
          onClose={() => setIsConsoleOpen(false)}
        />

        {battleResultData && !isConsoleOpen && (
          <VictoryDefeatModal
            won={battleResultData.won}
            playerBeast={playerBeast}
            opponentBeast={opponentBeast}
            territory={selectedTerritory}
            ratingBefore={battleResultData.ratingBefore}
            ratingAfter={battleResultData.ratingAfter}
            ratingDelta={battleResultData.ratingDelta}
            influenceDelta={battleResultData.influenceDelta}
            crewPoints={battleResultData.crewPoints}
            streak={battleResultData.streak}
            onClaim={() => {
              setBattleResultData(null);
              router.push("/map");
            }}
            onViewLeaderboard={() => {
              setBattleResultData(null);
              router.push("/leaderboards");
            }}
          />
        )}

        {evolutionData && !battleResultData && !isConsoleOpen && (
          <EvolutionModal
            data={evolutionData}
            onClose={() => setEvolutionData(null)}
          />
        )}

        <main className="py-8 max-w-[1600px] mx-auto px-4 sm:px-8">
          {isFighting ? (
            <BattleScreen
              playerBeast={playerBeast}
              opponentBeast={opponentBeast}
              territory={selectedTerritory}
              onBattleEnd={handleBattleEnd}
              onExit={exitBattle}
            />
          ) : (
            <ArenaLobby
              playerBeast={playerBeast}
              opponentBeast={opponentBeast}
              territory={selectedTerritory}
              onChangeBeast={() => router.push("/profile")}
              onChangeTerritory={() => router.push("/map")}
              onStartBattle={startBattle}
            />
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
