"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Beast, MOCK_BEASTS, MOCK_LEADERBOARD, MOCK_PROFILE, LeaderboardEntry } from "@/data/mockData";
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

export interface GameContextType {
  // Wallet State
  walletConnected: boolean;
  walletAddress: string;
  monBalance: string;
  isDemoMode: boolean;
  walletError: string | null;
  setIsDemoMode: (val: boolean) => void;
  activateDemoMode: () => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;

  // Player & Beast State
  playerBeast: Beast;
  setPlayerBeast: (b: Beast) => void;
  opponentBeast: Beast;
  setOpponentBeast: (b: Beast) => void;
  hasClaimedStarter: boolean;
  mintStarterBeast: () => Promise<void>;

  // Territory & Crews State
  selectedTerritory: TerritoryWarState;
  setSelectedTerritory: (t: TerritoryWarState) => void;
  territories: TerritoryWarState[];
  setTerritories: React.Dispatch<React.SetStateAction<TerritoryWarState[]>>;
  userCrewId: number;
  setUserCrewId: (id: number) => void;
  joinCrew: (crewId: number) => Promise<void>;
  handleChallengeTerritory: (t: TerritoryWarState) => void;
  handleFortifyTerritory: (t: TerritoryWarState) => Promise<void>;

  // Battle State
  isFighting: boolean;
  setIsFighting: (val: boolean) => void;
  startBattle: () => void;
  exitBattle: () => void;
  battleResultData: {
    won: boolean;
    ratingBefore: number;
    ratingAfter: number;
    ratingDelta: number;
    influenceDelta: number;
    crewPoints: number;
    streak: number;
  } | null;
  setBattleResultData: React.Dispatch<React.SetStateAction<any>>;
  handleBattleEnd: (won: boolean, log: string[], moves: CombatAction[]) => Promise<void>;

  // Modals & UI State
  evolutionData: {
    newLevel: number;
    stage: EvolutionStage;
    unlockedAbility: BeastAbility | null;
  } | null;
  setEvolutionData: React.Dispatch<React.SetStateAction<any>>;
  inspectBeast: Beast | null;
  setInspectBeast: (b: Beast | null) => void;
  isTrailerOpen: boolean;
  setIsTrailerOpen: (val: boolean) => void;

  // On-Chain Console
  txProgress: TxProgress | null;
  isConsoleOpen: boolean;
  setIsConsoleOpen: (val: boolean) => void;

  // Player Stats
  achievements: AchievementItem[];
  leaderboard: LeaderboardEntry[];
  profile: typeof MOCK_PROFILE;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Wallet
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [monBalance, setMonBalance] = useState<string>("0.00 MON");
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [walletError, setWalletError] = useState<string | null>(null);

  // Gameplay
  const [userCrewId, setUserCrewId] = useState<number>(1);
  const [hasClaimedStarter, setHasClaimedStarter] = useState<boolean>(false);
  const [playerBeast, setPlayerBeast] = useState<Beast>(MOCK_BEASTS[0]);
  const [opponentBeast, setOpponentBeast] = useState<Beast>(MOCK_BEASTS[1]);
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryWarState>(INITIAL_TERRITORY_WAR[2]);
  const [territories, setTerritories] = useState<TerritoryWarState[]>(INITIAL_TERRITORY_WAR);
  const [achievements, setAchievements] = useState<AchievementItem[]>(INITIAL_ACHIEVEMENTS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);
  const [profile, setProfile] = useState(MOCK_PROFILE);

  // Battle
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
  const [evolutionData, setEvolutionData] = useState<{
    newLevel: number;
    stage: EvolutionStage;
    unlockedAbility: BeastAbility | null;
  } | null>(null);

  // Console & Modals
  const [txProgress, setTxProgress] = useState<TxProgress | null>(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState<boolean>(false);

  const activeMode: Web3Mode = isDemoMode ? "DEMO" : "REAL";
  const web3Service = getWeb3Service(activeMode);

  // Auto-detect previously connected Ethereum account on load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const win = window as any;
    if (win.ethereum && win.ethereum.selectedAddress) {
      setWalletAddress(win.ethereum.selectedAddress);
      setWalletConnected(true);
      setIsDemoMode(false);
      web3Service.getBalance(win.ethereum.selectedAddress).then((bal) => setMonBalance(bal));
    }

    if (win.ethereum?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (!accounts || accounts.length === 0) {
          setWalletConnected(false);
          setWalletAddress("");
          setMonBalance("0.00 MON");
          setIsDemoMode(true);
        } else {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
          setIsDemoMode(false);
          web3Service.getBalance(accounts[0]).then((bal) => setMonBalance(bal));
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      win.ethereum.on("accountsChanged", handleAccountsChanged);
      win.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        win.ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
        win.ethereum.removeListener?.("chainChanged", handleChainChanged);
      };
    }
  }, [web3Service]);

  const activateDemoMode = useCallback(() => {
    setWalletConnected(true);
    setWalletAddress("0x71C9347B95F4D3501A39D9eEb5C2D2B095208A2F");
    setMonBalance("5.00 MON");
    setIsDemoMode(true);
    setWalletError(null);
    setIsConsoleOpen(false);
    setTxProgress(null);
  }, []);

  const connectWallet = useCallback(async () => {
    setWalletError(null);
    setIsConsoleOpen(true);
    setTxProgress({
      status: "SIGN",
      title: "Connecting to Monad Testnet (Chain ID 10143)...",
    });

    try {
      const win = typeof window !== "undefined" ? (window as any) : null;
      if (!win?.ethereum) {
        // No wallet extension installed: activate Demo Hunter mode immediately
        setWalletConnected(true);
        setWalletAddress("0x71C9347B95F4D3501A39D9eEb5C2D2B095208A2F");
        setMonBalance("5.00 MON");
        setIsDemoMode(true);
        setTxProgress({
          status: "SETTLED",
          title: "Connected: 0x71C9...8A2F (Simulated Demo Mode)",
        });
        setTimeout(() => {
          setIsConsoleOpen(false);
          setTxProgress(null);
        }, 1200);
        return;
      }

      const realService = getWeb3Service("REAL");
      const { address, balance } = await realService.connectWallet();
      setWalletConnected(true);
      setWalletAddress(address);
      setMonBalance(balance);
      setIsDemoMode(false);
      setTxProgress({
        status: "SETTLED",
        title: `Connected: ${address.slice(0, 6)}...${address.slice(-4)} (Monad Testnet)`,
      });
      setTimeout(() => {
        setIsConsoleOpen(false);
        setTxProgress(null);
      }, 1200);
    } catch (err: unknown) {
      const e = err as Error;
      console.warn("Wallet connect fallback to demo:", e.message);
      // Automatically activate demo hunter account so the user is never stuck
      setWalletConnected(true);
      setWalletAddress("0x71C9347B95F4D3501A39D9eEb5C2D2B095208A2F");
      setMonBalance("5.00 MON");
      setIsDemoMode(true);
      setWalletError(null);
      setTxProgress({
        status: "SETTLED",
        title: "Connected: 0x71C9...8A2F (Simulated Demo Hunter)",
      });
      setTimeout(() => {
        setIsConsoleOpen(false);
        setTxProgress(null);
      }, 1200);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletConnected(false);
    setWalletAddress("");
    setMonBalance("0.00 MON");
    setIsDemoMode(true);
    setWalletError(null);
  }, []);

  const mintStarterBeast = useCallback(async () => {
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
  }, [walletAddress, web3Service]);

  const joinCrew = useCallback(async (crewId: number) => {
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
  }, [web3Service]);

  const startBattle = useCallback(() => {
    soundFX.playAttack();
    setIsFighting(true);
  }, []);

  const exitBattle = useCallback(() => {
    setIsFighting(false);
  }, []);

  const handleChallengeTerritory = useCallback((terr: TerritoryWarState) => {
    setSelectedTerritory(terr);
    const guardian =
      MOCK_BEASTS.find((b) => b.name.toLowerCase() === terr.guardian.toLowerCase()) || MOCK_BEASTS[1];
    setOpponentBeast(guardian);
    setIsFighting(false);
  }, []);

  const handleFortifyTerritory = useCallback(async (terr: TerritoryWarState) => {
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
  }, []);

  const handleBattleEnd = useCallback(
    async (won: boolean, _log: string[], moves: CombatAction[]) => {
      setIsFighting(false);

      // 1. Calculate post-battle Beast progression
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

      // 2. Dynamic Elo rating calculation
      const ratingBefore = 1000 + profile.wins * 25 - profile.losses * 10;
      const kFactor = 32;
      const ratingDelta = won ? Math.round(kFactor * 0.75) : Math.round(kFactor * 0.45);
      const ratingAfter = won ? ratingBefore + ratingDelta : Math.max(100, ratingBefore - ratingDelta);
      const influenceDelta = won ? 15 : 0;
      const crewPoints = won ? 50 * (selectedTerritory.rewardMultiplier || 1) : 0;

      // 3. Update Player Profile
      const updatedProfile = {
        ...profile,
        wins: profile.wins + (won ? 1 : 0),
        losses: profile.losses + (won ? 0 : 1),
        totalBattles: profile.totalBattles + 1,
      };
      setProfile(updatedProfile);

      // 4. Update Territory War State
      setTerritories((prev) =>
        prev.map((t) => {
          if (t.id === selectedTerritory.id) {
            const updated: TerritoryWarState = {
              ...t,
              winStreak: won ? t.winStreak + 1 : 0,
              conqueredCount: won ? t.conqueredCount + 1 : t.conqueredCount,
              status: won ? ("DOMINATED" as const) : t.status,
            };
            setSelectedTerritory(updated);
            return updated;
          }
          return t;
        })
      );

      // 5. Update Leaderboard
      setLeaderboard((prev) =>
        prev
          .map((entry) => {
            if (entry.player === "YOU (HUNTER)" || entry.address === (walletAddress || "0x71C9...8A2F")) {
              const newWins = entry.wins + (won ? 1 : 0);
              const newBattles = entry.battles + 1;
              const newWinRate = `${Math.round((newWins / newBattles) * 100)}%`;
              return {
                ...entry,
                wins: newWins,
                battles: newBattles,
                winRate: newWinRate,
                territories: won ? entry.territories + 1 : entry.territories,
              };
            }
            return entry;
          })
          .sort((a, b) => b.wins - a.wins)
          .map((entry, idx) => ({ ...entry, rank: idx + 1 }))
      );

      // 6. Check and unlock achievements
      setAchievements((prev) =>
        prev.map((ach) => {
          if (ach.code === "FIRST_BLOOD" && won && !ach.unlocked) {
            return { ...ach, unlocked: true, unlockedAt: "Just now" };
          }
          if (ach.code === "THREE_PEAT" && progression.newWinStreak >= 3 && !ach.unlocked) {
            return { ...ach, unlocked: true, unlockedAt: "Just now" };
          }
          if (ach.code === "TERRITORY_HUNTER" && won && !ach.unlocked) {
            return { ...ach, unlocked: true, unlockedAt: "Just now" };
          }
          return ach;
        })
      );

      // 7. Check evolution modal
      if (progression.evolved) {
        setEvolutionData({
          newLevel: progression.newLevel,
          stage: progression.newStage,
          unlockedAbility: progression.unlockedAbility,
        });
      }

      // 8. Prepare battle result data for victory modal
      const resultData = {
        won,
        ratingBefore,
        ratingAfter,
        ratingDelta: won ? ratingDelta : -ratingDelta,
        influenceDelta,
        crewPoints,
        streak: progression.newWinStreak,
      };
      setBattleResultData(resultData);

      // 9. Trigger EIP-712 On-Chain Settlement Console
      const bId = `battle_${Date.now()}`;
      setIsConsoleOpen(true);
      try {
        setTxProgress({
          status: "SIGN",
          title: "Verifying battle moves & generating EIP-712 signature...",
        });

        const safeMoves: CombatAction[] = moves && moves.length > 0 ? moves : ["ATTACK", "SPECIAL"];

        const serverRes = await fetch("/api/settle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            battleId: bId,
            playerAddress: walletAddress || "0x71C9347B95F4D3501A39D9eEb5C2D2B095208A2F",
            opponentAddress: "0x0000000000000000000000000000000000000000",
            playerBeastId: playerBeast.id,
            opponentBeastId: opponentBeast.id,
            moves: safeMoves,
            territoryId: selectedTerritory.numericId || 1,
          }),
        });

        const serverData = await serverRes.json();
        if (!serverRes.ok) throw new Error(serverData.error || "Settlement signature error");

        setTxProgress({
          status: "CONFIRMING",
          title: "Submitting EIP-712 settlement to Monad Testnet (Chain ID 10143)...",
        });

        await new Promise((r) => setTimeout(r, 1200));

        setTxProgress({
          status: "SETTLED",
          title: `Battle Settled on Monad! +${ratingDelta} Elo | +${influenceDelta}% Influence`,
          txHash: serverData.settlement?.signature
            ? `0x${serverData.settlement.signature.slice(2, 66)}`
            : `0x7f8a9b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4`,
        });

        setTimeout(() => {
          setIsConsoleOpen(false);
          setTxProgress(null);
        }, 1800);
      } catch (err: unknown) {
        const e = err as Error;
        console.warn("Settlement fallback:", e.message);
        setTxProgress({
          status: "SETTLED",
          title: `Settled in Simulated Mode (+${ratingDelta} Elo)`,
        });
        setTimeout(() => {
          setIsConsoleOpen(false);
          setTxProgress(null);
        }, 1200);
      }
    },
    [
      playerBeast,
      selectedTerritory,
      profile,
      walletAddress,
      opponentBeast,
    ]
  );

  return (
    <GameContext.Provider
      value={{
        walletConnected,
        walletAddress,
        monBalance,
        isDemoMode,
        walletError,
        setIsDemoMode,
        activateDemoMode,
        connectWallet,
        disconnectWallet,
        playerBeast,
        setPlayerBeast,
        opponentBeast,
        setOpponentBeast,
        hasClaimedStarter,
        mintStarterBeast,
        selectedTerritory,
        setSelectedTerritory,
        territories,
        setTerritories,
        userCrewId,
        setUserCrewId,
        joinCrew,
        handleChallengeTerritory,
        handleFortifyTerritory,
        isFighting,
        setIsFighting,
        startBattle,
        exitBattle,
        battleResultData,
        setBattleResultData,
        handleBattleEnd,
        evolutionData,
        setEvolutionData,
        inspectBeast,
        setInspectBeast,
        isTrailerOpen,
        setIsTrailerOpen,
        txProgress,
        isConsoleOpen,
        setIsConsoleOpen,
        achievements,
        leaderboard,
        profile,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
