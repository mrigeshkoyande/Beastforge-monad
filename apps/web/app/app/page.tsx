"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CinematicBackground } from "@/components/CinematicBackground";
import { CommandCenterDashboard } from "@/components/dashboard/CommandCenterDashboard";
import { BeastDetailModal } from "@/components/BeastDetailModal";
import { VictoryDefeatModal } from "@/components/VictoryDefeatModal";
import { EvolutionModal } from "@/components/EvolutionModal";
import { LiveSettlementConsole } from "@/components/LiveSettlementConsole";
import { useGame } from "@/context/GameContext";

function AppDashboardInner() {
  const router = useRouter();
  const {
    playerBeast,
    setPlayerBeast,
    userCrewId,
    joinCrew,
    hasClaimedStarter,
    mintStarterBeast,
    territories,
    handleChallengeTerritory,
    battleResultData,
    setBattleResultData,
    evolutionData,
    setEvolutionData,
    inspectBeast,
    setInspectBeast,
    txProgress,
    isConsoleOpen,
    setIsConsoleOpen,
    opponentBeast,
    selectedTerritory,
  } = useGame();

  return (
    <div className="min-h-screen bg-[#05070B] text-white flex flex-col justify-between relative">
      <CinematicBackground variant="default" />

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

        {inspectBeast && (
          <BeastDetailModal
            beast={inspectBeast}
            onClose={() => setInspectBeast(null)}
            onSelect={(b) => {
              setPlayerBeast(b);
              setInspectBeast(null);
            }}
          />
        )}

        <CommandCenterDashboard
          playerBeast={playerBeast}
          onSelectPlayerBeast={setPlayerBeast}
          userCrewId={userCrewId}
          onJoinCrew={joinCrew}
          hasClaimedStarter={hasClaimedStarter}
          onMintStarter={mintStarterBeast}
          territories={territories}
          onChallengeTerritory={(terr) => {
            handleChallengeTerritory(terr);
            router.push("/arena");
          }}
          onNavigateTab={(tab) => {
            if (tab === "arena") router.push("/arena");
            else if (tab === "map") router.push("/map");
            else if (tab === "crews") router.push("/crews");
            else if (tab === "profile") router.push("/profile");
            else if (tab === "leaderboard") router.push("/leaderboards");
            else if (tab === "tv") router.push("/hunt-tv");
          }}
        />
      </div>

      <Footer />
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#05070B] flex items-center justify-center font-mono text-[#E63946]">
          LOADING CITY LEAGUE COMMAND CENTER...
        </div>
      }
    >
      <AppDashboardInner />
    </Suspense>
  );
}
