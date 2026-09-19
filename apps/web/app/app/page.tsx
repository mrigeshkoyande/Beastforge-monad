"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CommandCenterDashboard } from "@/components/dashboard/CommandCenterDashboard";
import { BeastDetailModal } from "@/components/BeastDetailModal";
import { TerritoryMap } from "@/components/TerritoryMap";
import { ArenaLobby } from "@/components/ArenaLobby";
import { BattleScreen } from "@/components/BattleScreen";
import { VictoryDefeatModal } from "@/components/VictoryDefeatModal";
import { LiveSettlementConsole } from "@/components/LiveSettlementConsole";
import { Leaderboard } from "@/components/Leaderboard";
import { PlayerProfile } from "@/components/PlayerProfile";
import { EvolutionModal } from "@/components/EvolutionModal";
import { SpectatorMode } from "@/components/SpectatorMode";
import {
  MOCK_BEASTS,
  MOCK_LEADERBOARD,
  MOCK_PROFILE,
  Beast,
  LeaderboardEntry,
} from "@/data/mockData";
import { INITIAL_TERRITORY_WAR, INITIAL_ACHIEVEMENTS, CREWS } from "@/data/warData";
import {
  TerritoryWarState,
  AchievementItem,
  EvolutionStage,
  BeastAbility,
  calculatePostBattleProgression,
} from "@/game/EvolutionSystem";
import { soundFX } from "@/game/SoundFX";
import { getWeb3Service, TxProgress, Web3Mode } from "@/lib/web3Service";
import { CombatAction } from "@/game/BattleAction";

function AppDashboardInner() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "dashboard";

  const [currentTab, setCurrentTab] = useState<string>(initialTab);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [monBalance, setMonBalance] = useState<string>("0.00 MON");
  const [userCrewId, setUserCrewId] = useState<number>(1);
  const [hasClaimedStarter, setHasClaimedStarter] = useState<boolean>(false);

  // Active game selections
  const [playerBeast, setPlayerBeast] = useState<Beast>(MOCK_BEASTS[0]);
  const [opponentBeast, setOpponentBeast] = useState<Beast>(MOCK_BEASTS[1]);
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryWarState>(INITIAL_TERRITORY_WAR[2]);

  // Dynamic game state
  const [territories, setTerritories] = useState<TerritoryWarState[]>(INITIAL_TERRITORY_WAR);
  const [achievements, setAchievements] = useState<AchievementItem[]>(INITIAL_ACHIEVEMENTS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);
  const [profile, setProfile] = useState(MOCK_PROFILE);

  // Battle states
  const [isFighting, setIsFighting] = useState<boolean>(false);
  const [battleResultData, setBattleResultData] = useState<{
    won: boolean;
    ratingBefore: number;
    ratingAfter: number;
    ratingDelta: number;
    influenceDelta: number;
    crewPoints: number;
    streak: number;
  } | null>(null);
  const [inspectBeast, setInspectBeast] = useState<Beast | null>(null);

  // Evolution & Level-Up Modal
  const [evolutionData, setEvolutionData] = useState<{
    newLevel: number;
    stage: EvolutionStage;
    unlockedAbility: BeastAbility | null;
  } | null>(null);

  // Web3 Live Settlement Console state
  const [txProgress, setTxProgress] = useState<TxProgress | null>(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setCurrentTab(tabParam === "home" ? "dashboard" : tabParam);
    }
  }, [searchParams]);

  const activeMode: Web3Mode = isDemoMode ? "DEMO" : "REAL";
  const web3Service = getWeb3Service(activeMode);

  const handleConnectWallet = async (connect: boolean) => {
    if (!connect) {
      setWalletConnected(false);
      setWalletAddress("");
      setMonBalance("0.00 MON");
      return;
    }

    try {
      setTxProgress({
        status: "SIGN",
        title: "Connecting to Monad Testnet via MetaMask...",
      });
      setIsConsoleOpen(true);

      const realService = getWeb3Service("REAL");
      const { address, balance } = await realService.connectWallet();
      setWalletConnected(true);
      setWalletAddress(address);
      setMonBalance(balance);
      setIsDemoMode(false);
      setTxProgress({
        status: "SETTLED",
        title: `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
      setTimeout(() => {
        setIsConsoleOpen(false);
        setTxProgress(null);
      }, 1000);
    } catch (err: unknown) {
      const e = err as Error;
      setTxProgress({
        status: "ERROR",
        title: "MetaMask Connection Failed",
        errorMessage: e.message || "Could not connect to wallet.",
      });
    }
  };

  const handleMintStarter = async () => {
    soundFX.playClick();
    setIsConsoleOpen(true);
    try {
      await web3Service.mintStarterBeast(
        walletAddress || "0x71C9347B95F4D3501A39D9eEb5C2D2B095208A2F",
        (p) => setTxProgress(p)
      );
      setHasClaimedStarter(true);
      setTimeout(() => {
        setIsConsoleOpen(false);
        setTxProgress(null);
      }, 1200);
    } catch (err: unknown) {
      const e = err as Error;
      setTxProgress({
        status: "ERROR",
        title: "Starter Mint Failed",
        errorMessage: e.message,
      });
    }
  };

  const handleJoinCrew = async (crewId: number) => {
    soundFX.playClick();
    setIsConsoleOpen(true);
    try {
      await web3Service.joinCrew(crewId, (p) => setTxProgress(p));
      setUserCrewId(crewId);
      setTimeout(() => {
        setIsConsoleOpen(false);
        setTxProgress(null);
      }, 1200);
    } catch (err: unknown) {
      const e = err as Error;
      setTxProgress({
        status: "ERROR",
        title: "Crew Join Failed",
        errorMessage: e.message,
      });
    }
  };

  const handleStartBattle = () => {
    soundFX.playAttack();
    setIsFighting(true);
    setCurrentTab("arena");
  };

  const handleBattleEnd = async (won: boolean, _log: string[], moves: CombatAction[]) => {
    setIsFighting(false);

    const progression = calculatePostBattleProgression(
      playerBeast.level,
      playerBeast.xp,
      won,
      selectedTerritory.winStreak,
      selectedTerritory.rewardMultiplier
    );

    const updatedBeast: Beast = {
      ...playerBeast,
      level: progression.newLevel,
      xp: progression.newXp,
      nextLevelXp: progression.nextLevelXp,
      wins: won ? playerBeast.wins + 1 : playerBeast.wins,
      losses: won ? playerBeast.losses : playerBeast.losses + 1,
    };
    setPlayerBeast(updatedBeast);

    const bId = `battle_${Date.now()}`;
    const ratingDelta = won ? 24 : 14;
    const influenceDelta = won ? 16 : 0;
    const crewPoints = won ? 49 : 0;
    const ratingBefore = 1000;
    const ratingAfter = won ? ratingBefore + ratingDelta : ratingBefore - ratingDelta;

    setIsConsoleOpen(true);
    try {
      setTxProgress({
        status: "SIGN",
        title: "Verifying battle moves & generating EIP-712 signature...",
      });

      const serverRes = await fetch("/api/settle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          battleId: bId,
          playerAddress: walletAddress || "0x71C9347B95F4D3501A39D9eEb5C2D2B095208A2F",
          opponentAddress: "0x0000000000000000000000000000000000000000",
          playerBeastId: playerBeast.id,
          opponentBeastId: opponentBeast.id,
          moves: moves.length > 0 ? moves : ["ATTACK", "SPECIAL"],
          territoryId: selectedTerritory.numericId || 1,
        }),
      });

      const serverData = await serverRes.json();
      if (!serverRes.ok) throw new Error(serverData.error || "Settlement signature error");

      await web3Service.settleBattle(
        serverData.battleResult,
        serverData.signature,
        (p) => setTxProgress(p)
      );

      if (won) {
        setTerritories((prev) =>
          prev.map((t) =>
            t.id === selectedTerritory.id
              ? {
                  ...t,
                  currentOwner: CREWS.find((c) => c.id === userCrewId)?.name || "Neon Vipers",
                  guardian: playerBeast.name,
                  conqueredCount: t.conqueredCount + 1,
                  winStreak: t.winStreak + 1,
                  status: "DEFENDING",
                }
              : t
          )
        );

        setAchievements((prev) =>
          prev.map((a) => {
            if (a.code === "FIRST_BLOOD" && !a.unlocked) {
              return { ...a, unlocked: true, unlockedAt: "Just now" };
            }
            if (a.code === "THREE_PEAT" && progression.newWinStreak >= 3 && !a.unlocked) {
              return { ...a, unlocked: true, unlockedAt: "Just now" };
            }
            return a;
          })
        );
      }

      setBattleResultData({
        won,
        ratingBefore,
        ratingAfter,
        ratingDelta,
        influenceDelta,
        crewPoints,
        streak: progression.newWinStreak,
      });

      if (progression.leveledUp) {
        setEvolutionData({
          newLevel: progression.newLevel,
          stage: progression.newStage,
          unlockedAbility: progression.unlockedAbility,
        });
      }
    } catch (err: unknown) {
      const e = err as Error;
      setTxProgress({
        status: "ERROR",
        title: "Settlement Error",
        errorMessage: e.message || "Failed to settle battle.",
      });
    }
  };

  const handleChallengeTerritory = (terr: TerritoryWarState) => {
    setSelectedTerritory(terr);
    const guardian = MOCK_BEASTS.find((b) => b.name.toLowerCase() === terr.guardian.toLowerCase()) || MOCK_BEASTS[1];
    setOpponentBeast(guardian);
    setCurrentTab("arena");
    setIsFighting(false);
  };

  const handleFortifyTerritory = async (terr: TerritoryWarState) => {
    soundFX.playDefend();
    setIsConsoleOpen(true);
    setTxProgress({
      status: "SIGN",
      title: `Fortifying ${terr.name} (+1 Defense Level)...`,
    });
    await new Promise((r) => setTimeout(r, 1000));
    setTxProgress({
      status: "SETTLED",
      title: `${terr.name} Fortified!`,
    });
    setTerritories((prev) =>
      prev.map((t) =>
        t.id === terr.id ? { ...t, defenseLevel: Math.min(5, t.defenseLevel + 1), status: "DEFENDING" } : t
      )
    );
    setTimeout(() => {
      setIsConsoleOpen(false);
      setTxProgress(null);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-white flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar
          activeTab={currentTab === "dashboard" ? "home" : currentTab}
          onTabChange={(tab) => {
            setIsFighting(false);
            if (tab === "landing") {
              window.location.href = "/";
            } else {
              setCurrentTab(tab);
            }
          }}
          walletConnected={walletConnected}
          walletAddress={walletAddress}
          monBalance={monBalance}
          onConnectWallet={handleConnectWallet}
          isDemoMode={isDemoMode}
          onToggleDemoMode={setIsDemoMode}
        />

        {/* Live Settlement Console */}
        <LiveSettlementConsole
          isOpen={isConsoleOpen}
          progress={txProgress}
          onClose={() => {
            setIsConsoleOpen(false);
            setTxProgress(null);
          }}
        />

        {/* Victory / Defeat Modal */}
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
              setCurrentTab("map");
            }}
            onViewLeaderboard={() => {
              setBattleResultData(null);
              setCurrentTab("leaderboard");
            }}
          />
        )}

        {/* Evolution Modal */}
        {evolutionData && !battleResultData && !isConsoleOpen && (
          <EvolutionModal
            data={evolutionData}
            onClose={() => setEvolutionData(null)}
          />
        )}

        {/* Beast Detail Modal */}
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

        {/* VIEW 1: COMMAND CENTER DASHBOARD */}
        {currentTab === "dashboard" && (
          <CommandCenterDashboard
            playerBeast={playerBeast}
            onSelectPlayerBeast={setPlayerBeast}
            userCrewId={userCrewId}
            onJoinCrew={handleJoinCrew}
            hasClaimedStarter={hasClaimedStarter}
            onMintStarter={handleMintStarter}
            territories={territories}
            onChallengeTerritory={handleChallengeTerritory}
            onNavigateTab={setCurrentTab}
          />
        )}

        {/* VIEW 2: ARENA / BATTLE */}
        {currentTab === "arena" && (
          <div>
            {isFighting ? (
              <BattleScreen
                playerBeast={playerBeast}
                opponentBeast={opponentBeast}
                territory={selectedTerritory}
                onBattleEnd={handleBattleEnd}
                onExit={() => setIsFighting(false)}
              />
            ) : (
              <ArenaLobby
                playerBeast={playerBeast}
                opponentBeast={opponentBeast}
                territory={selectedTerritory}
                onChangeBeast={() => setCurrentTab("profile")}
                onChangeTerritory={() => setCurrentTab("map")}
                onStartBattle={handleStartBattle}
              />
            )}
          </div>
        )}

        {/* VIEW 3: MUMBAI TACTICAL MAP */}
        {currentTab === "map" && (
          <TerritoryMap
            territories={territories}
            playerBeast={playerBeast}
            onChallengeTerritory={handleChallengeTerritory}
            onFortifyTerritory={handleFortifyTerritory}
          />
        )}

        {/* VIEW 4: LEADERBOARDS */}
        {currentTab === "leaderboard" && (
          <Leaderboard entries={leaderboard} userAddress={walletAddress} />
        )}

        {/* VIEW 5: CREWS */}
        {currentTab === "crews" && (
          <div className="max-w-[1600px] mx-auto py-10 px-4 sm:px-8">
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-wide text-white mb-2">
              MUMBAI CREW FACTIONS
            </h2>
            <p className="text-sm font-sans text-[#94A3B8] mb-8 max-w-xl">
              Select your syndicate allegiance. All battle victories directly increase your faction&apos;s seasonal treasury.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CREWS.map((crew) => (
                <div
                  key={crew.id}
                  onClick={() => handleJoinCrew(crew.id)}
                  className={`bg-[#0B0F17] border rounded-xl p-6 cursor-pointer transition-all ${
                    userCrewId === crew.id
                      ? "border-[#E63946] bg-[#E63946]/10 shadow-[0_0_20px_rgba(230,57,70,0.3)]"
                      : "border-[#1E273D] hover:border-[#457B9D]"
                  }`}
                >
                  <div className="text-4xl mb-3">{crew.banner}</div>
                  <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                    {crew.name}
                  </h3>
                  <div className="text-xs font-mono font-bold text-[#F4D35E] mt-1 mb-3">
                    {crew.seasonPoints} SEASON PTS
                  </div>
                  <p className="text-xs text-[#94A3B8] mb-4">{crew.description}</p>
                  <div className="pt-2 border-t border-[#1E273D] flex justify-between text-xs font-mono text-[#64748B]">
                    <span>{crew.wins}W - {crew.losses}L</span>
                    <span className={userCrewId === crew.id ? "text-[#00E676] font-bold" : "text-[#94A3B8]"}>
                      {userCrewId === crew.id ? "ALLEGIANCE ACTIVE" : "JOIN CREW →"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 6: HUNT TV */}
        {currentTab === "tv" && (
          <SpectatorMode />
        )}

        {/* VIEW 7: PROFILE */}
        {currentTab === "profile" && (
          <PlayerProfile
            profile={profile}
            userCrewId={userCrewId}
            onSelectBeast={(b) => setPlayerBeast(b)}
            onEnterArena={() => {
              setCurrentTab("arena");
              setIsFighting(false);
            }}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05070B] flex items-center justify-center font-mono text-[#E63946]">LOADING CITY LEAGUE...</div>}>
      <AppDashboardInner />
    </Suspense>
  );
}
