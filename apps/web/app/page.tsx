"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/HowItWorks";
import { BeastCard } from "@/components/BeastCard";
import { BeastDetailModal } from "@/components/BeastDetailModal";
import { TerritoryMap } from "@/components/TerritoryMap";
import { ArenaLobby } from "@/components/ArenaLobby";
import { BattleScreen } from "@/components/BattleScreen";
import { VictoryDefeatModal } from "@/components/VictoryDefeatModal";
import { LiveSettlementConsole } from "@/components/LiveSettlementConsole";
import { Leaderboard } from "@/components/Leaderboard";
import { PlayerProfile } from "@/components/PlayerProfile";
import { EvolutionModal } from "@/components/EvolutionModal";
import { AchievementsShowcase } from "@/components/AchievementsShowcase";
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
import { Swords, MapPin, Sparkles, ShieldCheck, Zap, Trophy, Flame, Award, Radio, ArrowRight, Shield, Activity } from "lucide-react";
import { CombatAction } from "@/game/BattleAction";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<string>("landing");
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [monBalance, setMonBalance] = useState<string>("0.00 MON");
  const [userCrewId, setUserCrewId] = useState<number>(1);
  const [hasClaimedStarter, setHasClaimedStarter] = useState<boolean>(false);

  // Active game selections
  const [playerBeast, setPlayerBeast] = useState<Beast>(MOCK_BEASTS[0]); // Emberwyrm
  const [opponentBeast, setOpponentBeast] = useState<Beast>(MOCK_BEASTS[1]); // Tidewarden
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryWarState>(INITIAL_TERRITORY_WAR[2]); // Powai Tech Hub

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
      setIsDemoMode(false); // Seamlessly switch to live on connection
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
      const result = await web3Service.mintStarterBeast(
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

    // 1. Calculate progression
    const progression = calculatePostBattleProgression(
      playerBeast.level,
      playerBeast.xp,
      won,
      selectedTerritory.winStreak,
      selectedTerritory.rewardMultiplier
    );

    // Update Player Beast XP
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
      // 2. Request EIP-712 settlement signature from server oracle
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

      // 3. Settle on-chain using web3Service
      const metrics = await web3Service.settleBattle(
        serverData.battleResult,
        serverData.signature,
        (p) => setTxProgress(p)
      );

      // 4. Update local state upon settlement
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
                  recentBattles: [
                    {
                      id: `battle-${Date.now()}`,
                      timestamp: "Just now",
                      attacker: "YOU (HUNTER)",
                      attackerBeast: playerBeast.name,
                      defender: t.guardian,
                      defenderBeast: t.guardian,
                      won: true,
                      rewardEarned: "0.18 MON",
                    },
                    ...t.recentBattles,
                  ],
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
    <div className="min-h-screen bg-mh-bg text-mh-text flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar
          activeTab={currentTab}
          onTabChange={(tab) => {
            setIsFighting(false);
            setCurrentTab(tab);
          }}
          walletConnected={walletConnected}
          walletAddress={walletAddress}
          monBalance={monBalance}
          onConnectWallet={handleConnectWallet}
          isDemoMode={isDemoMode}
          onToggleDemoMode={setIsDemoMode}
        />

        {/* Live Settlement Console (§5) */}
        <LiveSettlementConsole
          isOpen={isConsoleOpen}
          progress={txProgress}
          onClose={() => {
            setIsConsoleOpen(false);
            setTxProgress(null);
          }}
        />

        {/* Victory / Defeat Modal (§6) */}
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

        {/* Beast Level-Up / Evolution Modal */}
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

        {/* --- ROUTE VIEWS --- */}

        {/* 1. LANDING & HERO SECTION */}
        {currentTab === "landing" && (
          <div className="py-8 max-w-7xl mx-auto px-4">
            {/* SEASON 01 HEADER (§6.10) */}
            <div className="bg-mh-navy border border-mh-border rounded-xl p-6 mb-10 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-mh-card rounded border border-mh-border text-xs font-mono font-bold text-mh-reward mb-3">
                    <Flame className="w-3.5 h-3.5 text-mh-reward" />
                    SEASON 01 · MUMBAI CONQUEST
                  </div>
                  <h1 className="font-display text-5xl md:text-6xl font-black text-white uppercase tracking-wider leading-none">
                    MY BATTLE <span className="text-mh-primary">CHANGES THE CITY</span>
                  </h1>
                  <p className="text-mh-text2 text-sm md:text-base mt-2 max-w-2xl">
                    Catch AI Beasts, represent one of 4 Crews, and conquer Mumbai&apos;s 12 territories. Every battle is cryptographically settled on Monad Testnet.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 font-mono text-center">
                  <div className="bg-mh-card p-3 rounded-lg border border-mh-border">
                    <span className="text-[10px] text-mh-text3 block uppercase">DAYS REMAINING</span>
                    <span className="text-xl font-bold text-white">24 DAYS</span>
                  </div>
                  <div className="bg-mh-card p-3 rounded-lg border border-mh-border">
                    <span className="text-[10px] text-mh-text3 block uppercase">TOTAL BATTLES</span>
                    <span className="text-xl font-bold text-mh-reward">1,420</span>
                  </div>
                  <div className="bg-mh-card p-3 rounded-lg border border-mh-border">
                    <span className="text-[10px] text-mh-text3 block uppercase">ACTIVE HUNTERS</span>
                    <span className="text-xl font-bold text-mh-win">488</span>
                  </div>
                </div>
              </div>

              {/* Starter Beast & Crew Quick CTA */}
              <div className="mt-8 pt-6 border-t border-mh-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-mh-text2">
                    Starter Beast: <span className="text-white font-bold">{playerBeast.name}</span> (Level {playerBeast.level})
                  </span>
                  {!hasClaimedStarter && (
                    <button
                      onClick={handleMintStarter}
                      className="mh-btn text-xs py-1 px-3 bg-mh-card border-mh-primary text-mh-primaryGlow"
                    >
                      <span>CLAIM FREE STARTER BEAST</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentTab("arena")}
                    className="mh-btn text-xs py-2.5 px-6 shadow-mh-glow"
                  >
                    <span className="flex items-center gap-1.5">
                      <Swords className="w-4 h-4" /> ENTER ARENA
                    </span>
                  </button>
                  <button
                    onClick={() => setCurrentTab("map")}
                    className="mh-btn mh-btn-secondary text-xs py-2.5 px-5"
                  >
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> MUMBAI MAP
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4 CREWS SELECTOR */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-black text-white uppercase tracking-wide">
                  FACTION CREWS (CHOOSE ALLEGIANCE)
                </h2>
                <span className="text-xs font-mono text-mh-text3">Season 01 Faction War</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {CREWS.map((crew) => (
                  <div
                    key={crew.id}
                    onClick={() => handleJoinCrew(crew.id)}
                    className={`bg-mh-navy border rounded-xl p-5 cursor-pointer transition-all shadow-md ${
                      userCrewId === crew.id
                        ? "border-mh-primary bg-mh-primary/10 shadow-mh-glow"
                        : "border-mh-border hover:border-mh-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{crew.banner}</span>
                      <span className="font-mono text-xs font-bold text-mh-reward">{crew.seasonPoints} PTS</span>
                    </div>

                    <h3 className="font-display text-xl font-black uppercase text-white tracking-wide">
                      {crew.name}
                    </h3>
                    <p className="text-xs text-mh-text2 mt-1 mb-4 line-clamp-2">
                      {crew.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-mh-border/50 text-[10px] font-mono text-mh-text3">
                      <span>{crew.wins}W - {crew.losses}L</span>
                      <span className={userCrewId === crew.id ? "text-mh-win font-bold" : ""}>
                        {userCrewId === crew.id ? "SELECTED CREW" : "JOIN CREW"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Bestiary & Territories Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Beast Preview */}
              <div className="bg-mh-navy border border-mh-border rounded-xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-black uppercase text-white tracking-wide">
                    YOUR BATTLE SQUAD
                  </h3>
                  <button
                    onClick={() => setCurrentTab("profile")}
                    className="text-xs font-mono text-mh-primary hover:underline font-bold"
                  >
                    VIEW ALL →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {MOCK_BEASTS.slice(0, 2).map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setPlayerBeast(b)}
                      className={`bg-mh-card p-3 rounded-lg border cursor-pointer ${
                        playerBeast.id === b.id ? "border-mh-primary" : "border-mh-border"
                      }`}
                    >
                      <div className="text-xs font-mono font-bold text-white mb-1">{b.name}</div>
                      <div className="text-[10px] font-mono text-mh-text3">Level {b.level} • {b.rarity}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Arenas Preview */}
              <div className="bg-mh-navy border border-mh-border rounded-xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-black uppercase text-white tracking-wide">
                    CONTESTED TERRITORIES
                  </h3>
                  <button
                    onClick={() => setCurrentTab("map")}
                    className="text-xs font-mono text-mh-primary hover:underline font-bold"
                  >
                    OPEN MAP →
                  </button>
                </div>
                <div className="space-y-2">
                  {INITIAL_TERRITORY_WAR.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleChallengeTerritory(t)}
                      className="flex items-center justify-between p-2.5 rounded bg-mh-card border border-mh-border text-xs cursor-pointer hover:border-mh-primary"
                    >
                      <div>
                        <span className="font-bold text-white block">{t.name}</span>
                        <span className="text-[10px] text-mh-text3 font-mono">{t.zone} · {t.currentOwner}</span>
                      </div>
                      <span className="mh-badge text-[10px] bg-mh-card text-mh-reward">
                        <span>{t.status}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ARENA TAB */}
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

        {/* 3. MUMBAI TACTICAL MAP */}
        {currentTab === "map" && (
          <TerritoryMap
            territories={territories}
            playerBeast={playerBeast}
            onChallengeTerritory={handleChallengeTerritory}
            onFortifyTerritory={handleFortifyTerritory}
          />
        )}

        {/* 4. LEADERBOARDS */}
        {currentTab === "leaderboard" && (
          <Leaderboard entries={leaderboard} userAddress={walletAddress} />
        )}

        {/* 5. HUNT TV */}
        {currentTab === "tv" && (
          <SpectatorMode />
        )}

        {/* 6. HUNTER PROFILE */}
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
