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

  const connectWallet = useCallback(async () => {
    setWalletError(null);
    setIsConsoleOpen(true);
    setTxProgress({
      status: "SIGN",
      title: "Connecting to Monad Testnet via MetaMask...",
    });

    try {
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
      setWalletError(e.message || "Failed to connect wallet.");
      setTxProgress({
        status: "ERROR",
        title: "Connection Failed",
        errorMessage: e.message || "Could not connect to wallet.",
      });
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
    },
    [playerBeast, selectedTerritory, userCrewId, walletAddress, web3Service]
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
