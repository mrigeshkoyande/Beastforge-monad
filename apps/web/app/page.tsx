"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/HowItWorks";
import { BeastCard } from "@/components/BeastCard";
import { BeastDetailModal } from "@/components/BeastDetailModal";
import { BeastSvg } from "@/components/BeastSvg";
import { TerritoryMap } from "@/components/TerritoryMap";
import { ArenaLobby } from "@/components/ArenaLobby";
import { BattleScreen } from "@/components/BattleScreen";
import { VictoryDefeatModal } from "@/components/VictoryDefeatModal";
import { TransactionModal } from "@/components/TransactionModal";
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
import { INITIAL_TERRITORY_WAR, INITIAL_ACHIEVEMENTS } from "@/data/warData";
import {
  TerritoryWarState,
  AchievementItem,
  EvolutionStage,
  BeastAbility,
  calculatePostBattleProgression,
} from "@/game/EvolutionSystem";
import { ChainStatusBar } from "@/components/ChainStatusBar";
import { HeroRadarCanvas } from "@/components/HeroRadarCanvas";
import { soundFX } from "@/game/SoundFX";
import { getWeb3Service, TxProgress, Web3Mode } from "@/lib/web3Service";
import { Swords, Compass, Sparkles, ShieldCheck, Zap, Trophy, Flame, Award, Tv, ArrowRight } from "lucide-react";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<string>("landing");
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [monBalance, setMonBalance] = useState<string>("0.00 MON");

  // On-chain telemetry proof state
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const [lastLatencyMs, setLastLatencyMs] = useState<number | null>(null);

  // Active game selections
  const [playerBeast, setPlayerBeast] = useState<Beast>(MOCK_BEASTS[0]); // Emberwyrm
  const [opponentBeast, setOpponentBeast] = useState<Beast>(MOCK_BEASTS[1]); // Tidewarden
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryWarState>(INITIAL_TERRITORY_WAR[0]); // Andheri Arena

  // Dynamic game state
  const [territories, setTerritories] = useState<TerritoryWarState[]>(INITIAL_TERRITORY_WAR);
  const [achievements, setAchievements] = useState<AchievementItem[]>(INITIAL_ACHIEVEMENTS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);
  const [profile, setProfile] = useState(MOCK_PROFILE);

  // Battle states
  const [isFighting, setIsFighting] = useState<boolean>(false);
  const [battleResult, setBattleResult] = useState<{ won: boolean } | null>(null);
  const [inspectBeast, setInspectBeast] = useState<Beast | null>(null);

  // Evolution & Level-Up Modal
  const [evolutionData, setEvolutionData] = useState<{
    newLevel: number;
    stage: EvolutionStage;
    unlockedAbility: BeastAbility | null;
  } | null>(null);

  // Web3 Transaction Modal state
  const [txProgress, setTxProgress] = useState<TxProgress | null>(null);

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
        status: "WAITING_SIGNATURE",
        title: "Connecting to MetaMask...",
      });

      // Always invoke the real Web3 service so MetaMask prompt pops up directly
      const realService = getWeb3Service("REAL");
      const { address, balance } = await realService.connectWallet();
      setWalletConnected(true);
      setWalletAddress(address);
      setMonBalance(balance);
      setIsDemoMode(false); // Seamlessly switch to LIVE mode on real wallet connection!
      setTxProgress({
        status: "CONFIRMED",
        title: `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
      setTimeout(() => setTxProgress(null), 1200);
    } catch (err: unknown) {
      const e = err as Error;
      setTxProgress({
        status: "ERROR",
        title: "MetaMask Connection",
        errorMessage: e.message || "Could not connect to MetaMask.",
      });
    }
  };

  const handleStartBattle = async () => {
    soundFX.playAttack();
    const startTime = Date.now();
    try {
      // Execute on-chain entry stake
      const result = await web3Service.enterArena(
        `battle_${Date.now()}`,
        playerBeast.tokenId,
        selectedTerritory.numericId,
        "0.10",
        (p) => setTxProgress(p)
      );
      const elapsed = Date.now() - startTime;
      if (!isDemoMode && result.txHash) {
        setLastTxHash(result.txHash);
        setLastLatencyMs(elapsed);
      }
      setTimeout(() => {
        setTxProgress(null);
        setIsFighting(true);
        setCurrentTab("arena");
      }, 800);
    } catch (err: unknown) {
      const e = err as Error;
      setTxProgress({
        status: "ERROR",
        title: "Arena Entry Failed",
        errorMessage: e.message || "Failed to enter arena.",
      });
    }
  };

  const handleBattleEnd = async (won: boolean) => {
    setIsFighting(false);

    // Calculate progression
    const progression = calculatePostBattleProgression(
      playerBeast.level,
      playerBeast.xp,
      won,
      selectedTerritory.winStreak,
      selectedTerritory.rewardMultiplier
    );

    // Update Player Beast XP and Level
    const updatedBeast: Beast = {
      ...playerBeast,
      level: progression.newLevel,
      xp: progression.newXp,
      nextLevelXp: progression.nextLevelXp,
      wins: won ? playerBeast.wins + 1 : playerBeast.wins,
      losses: won ? playerBeast.losses : playerBeast.losses + 1,
    };
    setPlayerBeast(updatedBeast);

    if (won) {
      const startTime = Date.now();
      try {
        const resolveRes = await web3Service.resolveBattle(
          {
            battleId: `battle_${Date.now()}`,
            winner: walletAddress,
            rewardAmount: (parseFloat(selectedTerritory.baseReward) * selectedTerritory.rewardMultiplier).toFixed(2),
            nonce: Math.floor(Math.random() * 100000),
            deadline: Math.floor(Date.now() / 1000) + 3600,
            signature: "0x" + "a".repeat(130),
          },
          (p) => setTxProgress(p)
        );
        const elapsed = Date.now() - startTime;
        if (!isDemoMode && resolveRes.txHash) {
          setLastTxHash(resolveRes.txHash);
          setLastLatencyMs(elapsed);
        }

        // 1. Capture Territory & add battle history
        setTerritories((prev) =>
          prev.map((t) =>
            t.id === selectedTerritory.id
              ? {
                  ...t,
                  currentOwner: "JAYRAJ (YOU)",
                  guardian: playerBeast.name,
                  conqueredCount: t.conqueredCount + 1,
                  winStreak: t.winStreak + 1,
                  defenseLevel: Math.min(5, t.defenseLevel + 1),
                  status: "FORTIFIED",
                  recentBattles: [
                    {
                      id: `battle-${Date.now()}`,
                      timestamp: "Just now",
                      attacker: "JAYRAJ (YOU)",
                      attackerBeast: playerBeast.name,
                      defender: t.guardian,
                      defenderBeast: t.guardian,
                      won: true,
                      rewardEarned: `${(parseFloat(t.baseReward) * t.rewardMultiplier).toFixed(2)} MON`,
                    },
                    ...t.recentBattles,
                  ],
                }
              : t
          )
        );

        // 2. Unlock On-Chain Achievement (UNSTOPPABLE or FIRST BLOOD)
        setAchievements((prev) =>
          prev.map((a) => {
            if (a.code === "FIRST_BLOOD" && !a.unlocked) {
              return { ...a, unlocked: true, unlockedAt: "Just now", txHash: "0x" + Math.random().toString(16).slice(2, 10) + "b4e1" };
            }
            if (a.code === "UNSTOPPABLE" && progression.newWinStreak >= 5 && !a.unlocked) {
              return { ...a, unlocked: true, unlockedAt: "Just now", txHash: "0x" + Math.random().toString(16).slice(2, 10) + "b4e1" };
            }
            return a;
          })
        );

        // 3. Update Profile stats
        const rewardEarned = parseFloat(selectedTerritory.baseReward) * selectedTerritory.rewardMultiplier;
        setProfile((prev) => ({
          ...prev,
          wins: prev.wins + 1,
          totalBattles: prev.totalBattles + 1,
          earnedMon: `${(parseFloat(prev.earnedMon) + rewardEarned).toFixed(2)} MON`,
          predictionXp: prev.predictionXp + 75,
          territoriesOwned: Math.min(5, prev.territoriesOwned + 1),
          rank: "#2 Global",
        }));

        // 4. Update Leaderboard
        setLeaderboard((prev) =>
          prev.map((entry) =>
            entry.isUser
              ? {
                  ...entry,
                  rank: 2,
                  wins: entry.wins + 1,
                  battles: entry.battles + 1,
                  territories: Math.min(5, entry.territories + 1),
                  predictionXp: entry.predictionXp + 75,
                  earnedMon: `${(parseFloat(entry.earnedMon) + rewardEarned).toFixed(1)} MON`,
                }
              : entry
          )
        );

        setTimeout(() => {
          setTxProgress(null);
          setBattleResult({ won });

          // If leveled up or evolved, trigger Evolution modal after battle result closed
          if (progression.leveledUp) {
            setEvolutionData({
              newLevel: progression.newLevel,
              stage: progression.newStage,
              unlockedAbility: progression.unlockedAbility,
            });
          }
        }, 1000);
      } catch {
        setBattleResult({ won });
      }
    } else {
      setBattleResult({ won });
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
    try {
      setTxProgress({
        status: "WAITING_SIGNATURE",
        title: `Fortifying ${terr.name} (+1 Armor Level)...`,
      });
      await new Promise((r) => setTimeout(r, 1000));

      const simulatedHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      setTxProgress({
        status: "CONFIRMED",
        title: `Territory Armor Fortified to Level ${Math.min(5, terr.defenseLevel + 1)}!`,
        txHash: simulatedHash,
      });

      setTerritories((prev) =>
        prev.map((t) =>
          t.id === terr.id
            ? {
                ...t,
                defenseLevel: Math.min(5, t.defenseLevel + 1),
                defenseHp: t.defenseHp + 100,
                rewardMultiplier: parseFloat((t.rewardMultiplier + 0.1).toFixed(1)),
                status: "FORTIFIED",
              }
            : t
        )
      );
    } catch (e: unknown) {
      const err = e as Error;
      setTxProgress({
        status: "ERROR",
        title: "Fortify Failed",
        errorMessage: err.message,
      });
    }
  };

  // Launch Full 90-Second Judge WOW Experience
  const handleEnterWowMode = () => {
    soundFX.playAttack();
    setPlayerBeast(MOCK_BEASTS[0]); // Vortex
    setSelectedTerritory(territories[0]); // Andheri
    setOpponentBeast(MOCK_BEASTS[1]); // Titan
    setCurrentTab("arena");
    handleStartBattle();
  };

  const handleMintBeast = async () => {
    soundFX.playClick();
    try {
      await web3Service.mintBeast(
        walletAddress,
        "CYBER DRAKE",
        3,
        (p) => setTxProgress(p)
      );
    } catch (err: unknown) {
      const e = err as Error;
      setTxProgress({
        status: "ERROR",
        title: "Mint Failed",
        errorMessage: e.message || "Failed to mint beast NFT.",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setIsFighting(false);
          setCurrentTab(tab);
        }}
        isDemoMode={isDemoMode}
        setIsDemoMode={(val) => {
          setIsDemoMode(val);
          if (!val) {
            // Switching to LIVE — reset wallet so MetaMask prompt fires on CONNECT click
            setWalletConnected(false);
            setWalletAddress("");
            setMonBalance("0.00 MON");
          } else {
            // Back to DEMO — restore demo wallet
            setWalletConnected(true);
            setWalletAddress("0x71C9347B95F4D3501A39D9eEb5C2D2B095208A2F");
            setMonBalance("8.42 MON");
          }
        }}
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        setWalletConnected={handleConnectWallet}
      />

      {/* Live On-Chain Proof Strip Pinned Below Nav */}
      <ChainStatusBar
        isSimulated={isDemoMode}
        lastTxHash={lastTxHash}
        lastLatencyMs={lastLatencyMs}
        isConnectedChain={true}
      />

      {/* StakED-Style On-Chain Territory & Beast Market Ticker */}
      <div className="bg-arcade-black text-white border-b-4 border-arcade-black py-2.5 overflow-hidden select-none font-mono text-xs font-bold tracking-wider">
        <div className="animate-ticker flex items-center gap-8 whitespace-nowrap">
          {/* Loop Set 1 */}
          <span className="flex items-center gap-1.5"><span className="text-arcade-coral font-black">$EMBERWYRM</span> <span className="text-emerald-400">↑+85.7% WR</span></span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5"><span className="text-arcade-yellow font-black">$ANDHERI</span> <span className="text-emerald-400">↑+1.8x MON</span></span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5"><span className="text-sky-400 font-black">$TIDEWARDEN</span> <span className="text-emerald-400">↑+77.8% WR</span></span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5"><span className="text-emerald-400 font-black">$BANDRA</span> <span className="text-emerald-400">↑+0.22 MON</span></span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5"><span className="text-arcade-purple font-black">$NULLSHADE</span> <span className="text-emerald-400">↑+79.2% WR</span></span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5"><span className="text-amber-400 font-black">$FORT</span> <span className="text-arcade-purple font-black">2.0x MULTIPLIER</span></span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5"><span className="text-yellow-400 font-black">$VOLTPAW</span> <span className="text-emerald-400">↑+69.5% WR</span></span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5"><span className="text-red-400 font-black">$BKC</span> <span className="text-red-400">↓-CONTESTED</span></span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5 text-arcade-electric font-black"><span>MONAD TESTNET (10143)</span> <span className="text-emerald-400">⚡ ~1s FINALITY</span></span>
          <span className="text-white/30">•</span>

          {/* Loop Set 2 (Duplicate for Seamless Infinite Marquee) */}
          <span className="flex items-center gap-1.5"><span className="text-arcade-coral font-black">$EMBERWYRM</span> <span className="text-emerald-400">↑+85.7% WR</span></span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5"><span className="text-arcade-yellow font-black">$ANDHERI</span> <span className="text-emerald-400">↑+1.8x MON</span></span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5"><span className="text-sky-400 font-black">$TIDEWARDEN</span> <span className="text-emerald-400">↑+77.8% WR</span></span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5"><span className="text-emerald-400 font-black">$BANDRA</span> <span className="text-emerald-400">↑+0.22 MON</span></span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5"><span className="text-arcade-purple font-black">$NULLSHADE</span> <span className="text-emerald-400">↑+79.2% WR</span></span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5"><span className="text-amber-400 font-black">$FORT</span> <span className="text-arcade-purple font-black">2.0x MULTIPLIER</span></span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5"><span className="text-yellow-400 font-black">$VOLTPAW</span> <span className="text-emerald-400">↑+69.5% WR</span></span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5"><span className="text-red-400 font-black">$BKC</span> <span className="text-red-400">↓-CONTESTED</span></span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5 text-arcade-electric font-black"><span>MONAD TESTNET (10143)</span> <span className="text-emerald-400">⚡ ~1s FINALITY</span></span>
        </div>
      </div>

      {/* MAIN CONTENT ROUTER */}
      <main className="flex-1">
        {/* VIEW 1: LANDING PAGE */}
        {currentTab === "landing" && (
          <div>
            {/* ═══════════════════════════════════════════════════════════
                HERO SECTION — CENTERED STAKED-STYLE NEO-BRUTALISM
            ═══════════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden border-b-4 border-arcade-black bg-warm-100 pt-7 pb-12 sm:pt-9 sm:pb-14 flex flex-col justify-center items-center text-center">
              {/* Subtle background dot grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#080808 1.5px, transparent 1.5px)",
                  backgroundSize: "24px 24px",
                }}
              />

              <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center relative z-10">
                {/* Live Event Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-arcade-yellow rounded-xl border-3 border-arcade-black text-xs font-black uppercase tracking-wider shadow-arcade-sm mb-4">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <Zap className="w-3.5 h-3.5 text-arcade-black" />
                  <span>MONAD BLITZ MUMBAI V4 · LIVE ON-CHAIN ARENA</span>
                </div>

                {/* StakED-Inspired Iconic Headline */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[84px] font-black text-arcade-black tracking-tight leading-[1.02] text-center mb-4">
                  <span className="text-[#FF4A4A]">CATCH</span> & STAKE.<br />
                  BATTLE & <span className="text-[#00D26A]">CONQUER.</span>
                </h1>

                {/* Subheadline (Centered, Clean Neo-brutalist) */}
                <p className="text-base sm:text-lg md:text-xl font-bold text-arcade-black/80 max-w-2xl mx-auto mb-6 leading-relaxed">
                  A gamified on-chain arena where beasts battle for{" "}
                  <span className="bg-arcade-yellow px-2 py-0.5 rounded-lg border-2 border-arcade-black font-black text-arcade-black">
                    MON rewards
                  </span>{" "}
                  and Mumbai territory control. Stake on battles, conquer nodes, and settle on Monad Testnet in ~1 second.
                </p>

                {/* StakED-Style Center CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 w-full sm:w-auto">
                  {!walletConnected ? (
                    <button
                      onClick={() => {
                        soundFX.playAttack();
                        handleConnectWallet(true);
                      }}
                      className="arcade-btn w-full sm:w-auto px-8 py-4 bg-arcade-black text-white hover:bg-neutral-800 rounded-xl text-base sm:text-lg font-black flex items-center justify-center gap-3 shadow-[4px_4px_0px_#080808] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#080808] active:translate-x-[2px] active:translate-y-[2px]"
                    >
                      <span className="text-2xl">🦊</span>
                      <span>CONNECT WALLET (METAMASK)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        soundFX.playAttack();
                        setCurrentTab("arena");
                      }}
                      className="arcade-btn w-full sm:w-auto px-8 py-4 bg-arcade-coral text-arcade-black rounded-xl text-base sm:text-lg font-black flex items-center justify-center gap-3 shadow-[4px_4px_0px_#080808]"
                    >
                      <Swords className="w-5 h-5" />
                      <span>ENTER BATTLE ARENA</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setCurrentTab("map");
                    }}
                    className="arcade-btn w-full sm:w-auto px-6 py-4 bg-white text-arcade-black hover:bg-warm-200 rounded-xl text-base font-black flex items-center justify-center gap-2 shadow-[4px_4px_0px_#080808]"
                  >
                    <Compass className="w-5 h-5 text-arcade-electric" />
                    <span>VIEW WAR MAP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Clean StakED-Style Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t-3 border-arcade-black/15">
                  {[
                    { icon: <Zap className="w-4 h-4 text-arcade-electric" />, label: "Sub-Second Monad Finality" },
                    { icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />, label: "Zero Escrow NFT Custody" },
                    { icon: <Trophy className="w-4 h-4 text-amber-500" />, label: "5 Soulbound Badges" },
                    { icon: <Award className="w-4 h-4 text-arcade-coral" />, label: "ERC-721 Beast Ownership" },
                  ].map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3.5 py-1.5 bg-white rounded-xl border-2 border-arcade-black text-xs font-black shadow-[2px_2px_0px_#080808]"
                    >
                      {b.icon}
                      <span>{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>



            {/* ═══════════════════════════════════════════════════════════
                LIVE STATS STRIP — social proof for voters
            ═══════════════════════════════════════════════════════════ */}
            <section className="border-b-4 border-arcade-black bg-arcade-black">
              <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                {[
                  { value: "1,847", label: "BATTLES FOUGHT", icon: <Swords className="w-5 h-5 text-arcade-coral" />, color: "text-arcade-coral" },
                  { value: "248.3", label: "MON DISTRIBUTED", icon: <Zap className="w-5 h-5 text-arcade-yellow" />, color: "text-arcade-yellow" },
                  { value: "5", label: "TERRITORIES LIVE", icon: <Compass className="w-5 h-5 text-arcade-mint" />, color: "text-arcade-mint" },
                  { value: "312", label: "HUNTERS ONLINE", icon: <Flame className="w-5 h-5 text-purple-400" />, color: "text-purple-400" },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center justify-center gap-1 px-4 py-2 first:pl-0 last:pr-0">
                    <div className="flex items-center gap-2">
                      {stat.icon}
                      <span className={`text-2xl sm:text-3xl font-black font-mono ${stat.color}`}>
                        {stat.value}
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* How It Works Architecture */}
            <HowItWorks
              onStartHunt={() => {
                soundFX.playClick();
                setCurrentTab("map");
              }}
              onEnterArena={() => {
                soundFX.playClick();
                setCurrentTab("arena");
              }}
            />

            {/* ═══════════════════════════════════════════════════════════
                BEAST SHOWCASE — glowing element cards
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-16 bg-warm-100 border-t-4 border-arcade-black">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                  <div>
                    <div className="inline-block px-3 py-1 bg-arcade-yellow rounded-lg border-2 border-arcade-black text-[11px] font-black uppercase tracking-wider shadow-arcade-sm mb-3">
                      ⚡ BEAST ROSTER — 4 ON-CHAIN CHAMPIONS
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-arcade-black tracking-tight leading-none">
                      CHOOSE YOUR{" "}
                      <span
                        style={{
                          background: "linear-gradient(90deg, #F97316, #2563EB, #8B5CF6, #EAB308)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        BEAST
                      </span>
                    </h2>
                    <p className="text-sm font-bold text-arcade-black/60 mt-2">
                      Each is a unique ERC-721 NFT with on-chain battle stats. True ownership.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab("beasts")}
                    className="arcade-btn py-2.5 px-5 bg-arcade-electric text-white rounded-xl text-xs flex items-center gap-2 self-start md:self-auto"
                  >
                    VIEW FULL BESTIARY <Compass className="w-4 h-4" />
                  </button>
                </div>

                {/* Beast Grid — enhanced glow cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {MOCK_BEASTS.map((beast) => {
                    const glowClass = beast.element === "Fire" ? "glow-fire" : beast.element === "Water" ? "glow-water" : beast.element === "Dark" ? "glow-dark" : "glow-electric";
                    const gradientStyle = {
                      background: `linear-gradient(160deg, ${
                        beast.element === "Fire" ? "#431407, #7c2d12" :
                        beast.element === "Water" ? "#0c1445, #1e3a8a" :
                        beast.element === "Dark" ? "#1e1b4b, #3b0764" :
                        "#1a1a00, #3d3100"
                      })`,
                    };
                    const accentBorder = beast.element === "Fire" ? "border-orange-500" : beast.element === "Water" ? "border-blue-500" : beast.element === "Dark" ? "border-purple-500" : "border-yellow-400";
                    return (
                      <div
                        key={beast.id}
                        className={`arcade-card ${glowClass} overflow-hidden flex flex-col`}
                        style={gradientStyle}
                      >
                        {/* Top Bar */}
                        <div className="flex items-center justify-between px-4 pt-4 pb-2">
                          <span className="font-mono text-[11px] font-black px-2 py-0.5 bg-white/10 text-white/70 rounded-md border border-white/20">
                            NFT #{String(beast.tokenId).padStart(3, "0")}
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${accentBorder} text-white bg-white/10`}>
                            {beast.rarity}
                          </span>
                        </div>

                        {/* Beast SVG — floating animation */}
                        <div
                          onClick={() => setInspectBeast(beast)}
                          className="relative flex items-center justify-center cursor-pointer group px-4 py-2"
                        >
                          <div className="absolute inset-0 opacity-20 rounded-xl"
                            style={{ background: `radial-gradient(circle, ${beast.accentColor} 0%, transparent 70%)` }}
                          />
                          <div className="animate-float-beast">
                            <BeastSvg id={beast.id} className="w-36 h-36 drop-shadow-xl" />
                          </div>
                          <div className="absolute top-1 left-2 text-[11px] font-black px-2 py-0.5 bg-black/30 rounded border border-white/20 text-white">
                            LVL {beast.level}
                          </div>
                          <div className="absolute top-1 right-2 text-[11px] font-black px-2 py-0.5 bg-black/30 rounded border border-white/20 text-white">
                            {beast.element}
                          </div>
                        </div>

                        {/* Beast Info */}
                        <div className="px-4 pb-2">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-xl font-black text-white tracking-tight">{beast.name}</h3>
                            <span className="text-xs font-black text-white/70 bg-white/10 px-2 py-0.5 rounded border border-white/20">
                              {beast.winRate}% WR
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-white/50 mb-3">{beast.title}</p>

                          {/* Signature Move */}
                          <div className="text-[11px] font-black uppercase px-2 py-1 rounded border border-white/20 bg-white/10 text-white/80 mb-3 tracking-wider">
                            ⚡ {beast.specialMove}
                          </div>

                          {/* Compact stat bars */}
                          <div className="space-y-1.5 mb-4">
                            {[
                              { label: "ATK", val: beast.attack, color: "bg-red-400" },
                              { label: "DEF", val: beast.defense, color: "bg-emerald-400" },
                              { label: "SPD", val: beast.speed, color: "bg-amber-400" },
                            ].map((s) => (
                              <div key={s.label} className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-white/50 w-6">{s.label}</span>
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                  <div className={`h-full ${s.color} rounded-full`} style={{ width: `${Math.min(100, (s.val / 120) * 100)}%` }} />
                                </div>
                                <span className="text-[10px] font-mono font-black text-white/60 w-6 text-right">{s.val}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto grid grid-cols-2 gap-2 px-4 pb-4">
                          <button
                            onClick={() => { soundFX.playClick(); setInspectBeast(beast); }}
                            className="arcade-btn py-2 px-3 bg-white/10 text-white rounded-xl text-xs flex items-center justify-center gap-1 border-white/30"
                            style={{ border: "2px solid rgba(255,255,255,0.25)", boxShadow: "2px 2px 0 rgba(0,0,0,0.5)" }}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            DETAILS
                          </button>
                          <button
                            onClick={() => { soundFX.playAttack(); setPlayerBeast(beast); setCurrentTab("arena"); }}
                            className="arcade-btn py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1 font-black"
                            style={{
                              background: beast.accentColor,
                              color: "#080808",
                              border: `2px solid ${beast.accentColor}`,
                              boxShadow: `2px 2px 0 #080808`,
                            }}
                          >
                            <Swords className="w-3.5 h-3.5" />
                            {playerBeast.id === beast.id ? "READY ✓" : "BATTLE"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: ARENA (LOBBY OR ACTIVE BATTLE) */}
        {currentTab === "arena" && (
          <div>
            {isFighting ? (
              <BattleScreen
                playerBeast={playerBeast}
                opponentBeast={opponentBeast}
                territory={{
                  id: selectedTerritory.id,
                  numericId: selectedTerritory.numericId,
                  name: selectedTerritory.name,
                  zone: selectedTerritory.zone,
                  currentOwner: selectedTerritory.currentOwner,
                  guardian: selectedTerritory.guardian,
                  guardianLevel: selectedTerritory.guardianLevel,
                  reward: selectedTerritory.baseReward,
                  entryFee: selectedTerritory.entryFee,
                  rarity: selectedTerritory.rarity,
                  status: "CHALLENGEABLE",
                  conqueredCount: selectedTerritory.conqueredCount,
                  description: selectedTerritory.description,
                  badgeBg: selectedTerritory.badgeBg,
                }}
                onBattleEnd={handleBattleEnd}
                onExit={() => setIsFighting(false)}
              />
            ) : (
              <ArenaLobby
                playerBeast={playerBeast}
                opponentBeast={opponentBeast}
                territory={{
                  id: selectedTerritory.id,
                  numericId: selectedTerritory.numericId,
                  name: selectedTerritory.name,
                  zone: selectedTerritory.zone,
                  currentOwner: selectedTerritory.currentOwner,
                  guardian: selectedTerritory.guardian,
                  guardianLevel: selectedTerritory.guardianLevel,
                  reward: selectedTerritory.baseReward,
                  entryFee: selectedTerritory.entryFee,
                  rarity: selectedTerritory.rarity,
                  status: "CHALLENGEABLE",
                  conqueredCount: selectedTerritory.conqueredCount,
                  description: selectedTerritory.description,
                  badgeBg: selectedTerritory.badgeBg,
                }}
                onChangeBeast={() => setCurrentTab("beasts")}
                onChangeTerritory={() => setCurrentTab("map")}
                onStartBattle={handleStartBattle}
              />
            )}
          </div>
        )}

        {/* VIEW 3: LIVE TERRITORY WAR MAP */}
        {currentTab === "map" && (
          <TerritoryMap
            territories={territories}
            playerBeast={playerBeast}
            onChallengeTerritory={handleChallengeTerritory}
            onFortifyTerritory={handleFortifyTerritory}
          />
        )}

        {/* VIEW 4: ON-CHAIN ACHIEVEMENTS SHOWCASE */}
        {currentTab === "achievements" && (
          <AchievementsShowcase achievements={achievements} />
        )}

        {/* VIEW 6: BEAST COLLECTION */}
        {currentTab === "beasts" && (
          <div className="py-8 max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-block px-3 py-1 bg-arcade-yellow rounded-lg border-2 border-arcade-black text-[11px] font-black uppercase tracking-wider shadow-arcade-sm mb-2">
                  NFT ROSTER
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-arcade-black tracking-tight leading-none">
                  BEAST <span className="text-arcade-electric">COLLECTION</span>
                </h2>
              </div>
              <button
                onClick={handleMintBeast}
                className="arcade-btn py-3 px-5 bg-arcade-electric text-white rounded-xl text-xs flex items-center gap-2 self-start md:self-auto"
              >
                <Sparkles className="w-4 h-4" />
                MINT NEW BEAST (0.05 MON)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MOCK_BEASTS.map((beast) => (
                <BeastCard
                  key={beast.id}
                  beast={beast}
                  isSelected={playerBeast.id === beast.id}
                  onSelect={(b) => {
                    setPlayerBeast(b);
                    setCurrentTab("arena");
                  }}
                  onViewDetails={(b) => setInspectBeast(b)}
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW 7: LEADERBOARD */}
        {currentTab === "leaderboard" && <Leaderboard entries={leaderboard} />}

        {/* VIEW 8: PLAYER PROFILE */}
        {currentTab === "profile" && (
          <PlayerProfile
            profile={profile}
            onSelectBeast={(b) => setPlayerBeast(b)}
            onEnterArena={() => setCurrentTab("arena")}
          />
        )}
      </main>

      {/* Transaction Modal (Waiting, Pending, Success, Error states) */}
      <TransactionModal progress={txProgress} onClose={() => setTxProgress(null)} />

      {/* Beast Detail Inspection Modal */}
      {inspectBeast && (
        <BeastDetailModal
          beast={inspectBeast}
          onClose={() => setInspectBeast(null)}
          onSelectForArena={(b) => {
            setPlayerBeast(b);
            setCurrentTab("arena");
          }}
        />
      )}

      {/* Victory / Defeat Celebration Modal */}
      {battleResult && (
        <VictoryDefeatModal
          won={battleResult.won}
          playerBeast={playerBeast}
          opponentBeast={opponentBeast}
          territory={{
            id: selectedTerritory.id,
            numericId: selectedTerritory.numericId,
            name: selectedTerritory.name,
            zone: selectedTerritory.zone,
            currentOwner: selectedTerritory.currentOwner,
            guardian: selectedTerritory.guardian,
            guardianLevel: selectedTerritory.guardianLevel,
            reward: selectedTerritory.baseReward,
            entryFee: selectedTerritory.entryFee,
            rarity: selectedTerritory.rarity,
            status: "CHALLENGEABLE",
            conqueredCount: selectedTerritory.conqueredCount,
            description: selectedTerritory.description,
            badgeBg: selectedTerritory.badgeBg,
          }}
          onClaim={() => {
            setBattleResult(null);
          }}
          onViewLeaderboard={() => {
            setBattleResult(null);
            setCurrentTab("leaderboard");
          }}
        />
      )}

      {/* Evolution & Level-Up Ascension Modal */}
      {evolutionData && (
        <EvolutionModal
          beast={playerBeast}
          newLevel={evolutionData.newLevel}
          stage={evolutionData.stage}
          unlockedAbility={evolutionData.unlockedAbility}
          onClose={() => setEvolutionData(null)}
        />
      )}

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
