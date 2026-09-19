"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Beast, Territory } from "@/data/mockData";
import { BeastSvg } from "./BeastSvg";
import { soundFX } from "@/game/SoundFX";
import { BattleEngine } from "@/game/BattleEngine";
import { CombatAction } from "@/game/BattleAction";
import { Swords, Shield, Zap, Wind, Sparkles, Play, Pause, Flame, Skull } from "lucide-react";

interface BattleScreenProps {
  playerBeast: Beast;
  opponentBeast: Beast;
  territory: any;
  onBattleEnd: (won: boolean, log: string[], moves: CombatAction[]) => void;
  onExit: () => void;
}

interface CombatLogEntry {
  round: number;
  text: string;
  type: "player" | "opponent" | "system" | "crit";
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  playerBeast,
  opponentBeast,
  territory,
  onBattleEnd,
  onExit,
}) => {
  const [recordedMoves, setRecordedMoves] = useState<CombatAction[]>([]);
  const [engine] = useState(() => {
    return new BattleEngine({
      battleId: `battle_${Date.now()}`,
      seed: `seed_mumbai_${territory.numericId || 1}_${playerBeast.tokenId}_${opponentBeast.tokenId}`,
      playerBeast,
      opponentBeast,
      territoryId: territory.id || "1",
      maxRounds: 10,
    });
  });

  const [playerHp, setPlayerHp] = useState(playerBeast.hp);
  const [opponentHp, setOpponentHp] = useState(opponentBeast.hp);
  const [playerEnergy, setPlayerEnergy] = useState(100);
  const [round, setRound] = useState(1);
  const maxRounds = 10;
  const [isAutoBattle, setIsAutoBattle] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [screenShaking, setScreenShaking] = useState(false);
  const [specialFlash, setSpecialFlash] = useState(false);
  const [activeActionBanner, setActiveActionBanner] = useState<string | null>(null);

  const [playerMovement, setPlayerMovement] = useState<"idle" | "lunge" | "hit" | "surge">("idle");
  const [opponentMovement, setOpponentMovement] = useState<"idle" | "lunge" | "hit" | "surge">("idle");
  const [activeBeam, setActiveBeam] = useState<"player" | "opponent" | null>(null);

  const [floatingDamage, setFloatingDamage] = useState<{
    target: "player" | "opponent";
    text: string;
    isCrit?: boolean;
  } | null>(null);

  const [combatLogs, setCombatLogs] = useState<CombatLogEntry[]>([
    {
      round: 1,
      text: `⚔️ PROVING GROUND BATTLE: ${playerBeast.name} vs ${opponentBeast.name} at ${territory.name}!`,
      type: "system",
    },
  ]);

  const triggerScreenShake = () => {
    setScreenShaking(true);
    setTimeout(() => setScreenShaking(false), 400);
  };

  const triggerSpecialFlash = () => {
    setSpecialFlash(true);
    setTimeout(() => setSpecialFlash(false), 600);
  };

  const executeRound = useCallback(
    (action: CombatAction) => {
      if (isProcessing || playerHp <= 0 || opponentHp <= 0) return;
      setIsProcessing(true);
      setRecordedMoves((prev) => [...prev, action]);

      let actionDesc = "";
      if (action === "SPECIAL") {
        setPlayerMovement("surge");
        setActiveBeam("player");
        triggerSpecialFlash();
        triggerScreenShake();
        soundFX.playSpecial();
        actionDesc = `⚡ ${playerBeast.name} CAST ${playerBeast.specialMove}!`;
        setTimeout(() => {
          setPlayerMovement("idle");
          setActiveBeam(null);
        }, 750);
      } else if (action === "ATTACK") {
        setPlayerMovement("lunge");
        soundFX.playAttack();
        actionDesc = `⚔️ ${playerBeast.name} LUNGES & STRIKES!`;
        setTimeout(() => setPlayerMovement("idle"), 550);
      } else if (action === "DEFEND") {
        soundFX.playDefend();
        actionDesc = `🛡️ ${playerBeast.name} BRACED SHIELD!`;
      } else {
        soundFX.playDodge();
        actionDesc = `🏃 ${playerBeast.name} EVADES!`;
      }

      setActiveActionBanner(actionDesc);

      const roundResult = engine.step(action);
      const state = engine.getState();

      if (roundResult.opponentDamageTaken > 0) {
        setOpponentMovement("hit");
        setTimeout(() => setOpponentMovement("idle"), 450);

        setFloatingDamage({
          target: "opponent",
          text: roundResult.playerCrit
            ? `💥 CRIT -${roundResult.opponentDamageTaken}!`
            : `-${roundResult.opponentDamageTaken}`,
          isCrit: roundResult.playerCrit,
        });
        triggerScreenShake();
      } else if (roundResult.opponentDodged) {
        setFloatingDamage({ target: "opponent", text: "DODGED! 💨" });
      }

      setTimeout(() => {
        if (roundResult.playerDamageTaken > 0) {
          setPlayerMovement("hit");
          setTimeout(() => setPlayerMovement("idle"), 450);

          setFloatingDamage({
            target: "player",
            text: roundResult.opponentCrit
              ? `💥 CRIT -${roundResult.playerDamageTaken}!`
              : `-${roundResult.playerDamageTaken}`,
            isCrit: roundResult.opponentCrit,
          });
          triggerScreenShake();
        } else if (roundResult.playerDodged) {
          setFloatingDamage({ target: "player", text: "DODGED! 💨" });
        }

        setPlayerHp(state.player.currentHp);
        setOpponentHp(state.opponent.currentHp);
        setPlayerEnergy(state.player.energy);
        setRound(state.currentRound);

        setCombatLogs((prev) => [
          {
            round: state.currentRound - 1,
            text: `${playerBeast.name} used ${action} (dealt ${roundResult.opponentDamageTaken} dmg) | ${opponentBeast.name} used ${roundResult.opponentAction} (dealt ${roundResult.playerDamageTaken} dmg)`,
            type: roundResult.playerCrit ? "crit" : "player",
          },
          ...prev.slice(0, 8),
        ]);

        setIsProcessing(false);

        if (state.winner) {
          setTimeout(() => {
            const allLogs = combatLogs.map((l) => l.text);
            const moves = [...recordedMoves, action];
            onBattleEnd(state.winner === "PLAYER", allLogs, moves);
          }, 800);
        }
      }, 700);
    },
    [isProcessing, playerHp, opponentHp, engine, playerBeast, opponentBeast, combatLogs, onBattleEnd, recordedMoves]
  );

  // Auto-battle loop
  useEffect(() => {
    if (!isAutoBattle || isProcessing || playerHp <= 0 || opponentHp <= 0) return;
    const timer = setTimeout(() => {
      const actions: CombatAction[] = playerEnergy >= 40 ? ["ATTACK", "SPECIAL", "DEFEND"] : ["ATTACK", "DEFEND", "DODGE"];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      executeRound(randomAction);
    }, 1200);
    return () => clearTimeout(timer);
  }, [isAutoBattle, isProcessing, playerHp, opponentHp, playerEnergy, executeRound]);

  return (
    <div className={`py-6 max-w-6xl mx-auto px-4 select-none ${screenShaking ? "animate-shake" : ""}`}>
      {/* Flash overlay for special power */}
      {specialFlash && (
        <div className="fixed inset-0 bg-mh-primary/30 z-50 pointer-events-none animate-ping" />
      )}

      {/* Top Proving Ground Header */}
      <div className="flex items-center justify-between bg-mh-navy border border-mh-border p-4 rounded-xl mb-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-mh-live/20 border border-mh-live text-mh-live flex items-center justify-center font-bold">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display text-xl font-black uppercase text-white tracking-wider leading-none">
              {territory.name}
            </div>
            <div className="text-[10px] font-mono text-mh-text3 mt-0.5">
              Round {round} of {maxRounds} • 1v1 Monad Proving Grounds
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAutoBattle(!isAutoBattle)}
            className={`mh-btn text-xs py-1.5 px-3.5 ${
              isAutoBattle ? "bg-mh-live border-mh-live" : "mh-btn-secondary"
            }`}
          >
            <span className="flex items-center gap-1.5">
              {isAutoBattle ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isAutoBattle ? "AUTO: ON" : "AUTO: OFF"}
            </span>
          </button>

          <button
            onClick={onExit}
            className="text-xs font-mono text-mh-text3 hover:text-white px-2 py-1"
          >
            FORFEIT
          </button>
        </div>
      </div>

      {/* Arena Stage */}
      <div className="bg-mh-navy border border-mh-border rounded-xl p-6 md:p-8 mb-6 shadow-2xl relative overflow-hidden">
        {/* Background Grid & Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#232B3B_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

        {/* Action Banner */}
        {activeActionBanner && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-mh-card/95 border border-mh-primary px-4 py-1.5 rounded-full shadow-mh-glow animate-bounce">
            <span className="font-display font-black text-xs uppercase text-white tracking-wider">
              {activeActionBanner}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          {/* PLAYER BEAST */}
          <div className="md:col-span-5 bg-mh-card rounded-xl border border-mh-border p-5 text-center shadow-lg relative">
            {floatingDamage?.target === "player" && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-40 text-base font-black font-mono text-mh-live animate-float-dmg">
                {floatingDamage.text}
              </div>
            )}

            <div className="flex justify-between items-center mb-2">
              <span className="mh-badge text-[9px] bg-mh-primary/20 text-mh-primaryGlow border border-mh-primary/40">
                <span>YOU (HUNTER)</span>
              </span>
              <span className="font-mono text-xs text-mh-text3 font-bold">LVL {playerBeast.level}</span>
            </div>

            <div className={`w-36 h-36 mx-auto my-3 flex items-center justify-center transition-all ${
              playerMovement === "lunge" ? "animate-player-lunge" : playerMovement === "hit" ? "animate-shake opacity-80" : ""
            }`}>
              <BeastSvg id={playerBeast.id} className="w-32 h-32" animate={playerHp > 0} />
            </div>

            <div className="font-display text-2xl font-black uppercase text-white tracking-wide">
              {playerBeast.name}
            </div>

            {/* Health Bar */}
            <div className="mt-3">
              <div className="w-full bg-[#07090E] h-3.5 rounded-full border border-mh-border overflow-hidden mb-1">
                <div
                  className="h-full bg-mh-win transition-all duration-300"
                  style={{ width: `${Math.max(0, (playerHp / playerBeast.hp) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-xs font-bold text-mh-text2">
                <span>HP</span>
                <span>{playerHp} / {playerBeast.hp}</span>
              </div>
            </div>

            {/* Energy Bar */}
            <div className="mt-2">
              <div className="w-full bg-[#07090E] h-2 rounded-full border border-mh-border overflow-hidden mb-1">
                <div
                  className="h-full bg-mh-primary transition-all duration-300"
                  style={{ width: `${playerEnergy}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-[10px] text-mh-text3 font-bold">
                <span>ENERGY</span>
                <span>{playerEnergy} / 100</span>
              </div>
            </div>
          </div>

          {/* VS Divider */}
          <div className="md:col-span-2 text-center flex flex-col items-center justify-center">
            <div className="font-display text-4xl font-black text-mh-live tracking-widest my-1">
              VS
            </div>
            <span className="font-mono text-xs text-mh-reward font-bold uppercase">
              TURN ACTIVE
            </span>
          </div>

          {/* OPPONENT BEAST */}
          <div className="md:col-span-5 bg-mh-card rounded-xl border border-mh-border p-5 text-center shadow-lg relative">
            {floatingDamage?.target === "opponent" && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-40 text-base font-black font-mono text-mh-win animate-float-dmg">
                {floatingDamage.text}
              </div>
            )}

            <div className="flex justify-between items-center mb-2">
              <span className="mh-badge text-[9px] bg-mh-live/20 text-mh-live border border-mh-live/40">
                <span>ZONE GUARDIAN</span>
              </span>
              <span className="font-mono text-xs text-mh-text3 font-bold">LVL {opponentBeast.level}</span>
            </div>

            <div className={`w-36 h-36 mx-auto my-3 flex items-center justify-center transition-all ${
              opponentMovement === "lunge" ? "animate-opponent-lunge" : opponentMovement === "hit" ? "animate-shake opacity-80" : ""
            }`}>
              <BeastSvg id={opponentBeast.id} className="w-32 h-32" animate={opponentHp > 0} />
            </div>

            <div className="font-display text-2xl font-black uppercase text-white tracking-wide">
              {opponentBeast.name}
            </div>

            {/* Health Bar */}
            <div className="mt-3">
              <div className="w-full bg-[#07090E] h-3.5 rounded-full border border-mh-border overflow-hidden mb-1">
                <div
                  className="h-full bg-mh-live transition-all duration-300"
                  style={{ width: `${Math.max(0, (opponentHp / opponentBeast.hp) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-xs font-bold text-mh-text2">
                <span>HP</span>
                <span>{opponentHp} / {opponentBeast.hp}</span>
              </div>
            </div>

            {/* Energy */}
            <div className="mt-2">
              <div className="w-full bg-[#07090E] h-2 rounded-full border border-mh-border overflow-hidden mb-1">
                <div
                  className="h-full bg-mh-reward transition-all duration-300"
                  style={{ width: `80%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-[10px] text-mh-text3 font-bold">
                <span>GUARDIAN ENERGY</span>
                <span>80 / 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Combat Action Controls */}
        <div className="mt-8 pt-6 border-t border-mh-border grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => executeRound("ATTACK")}
            disabled={isProcessing || playerHp <= 0 || opponentHp <= 0}
            className="mh-btn py-3 px-2 disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              <Swords className="w-4 h-4" /> ATTACK (FAST)
            </span>
          </button>

          <button
            onClick={() => executeRound("SPECIAL")}
            disabled={isProcessing || playerEnergy < 35 || playerHp <= 0 || opponentHp <= 0}
            className="mh-btn bg-mh-reward border-mh-reward text-black hover:bg-amber-300 disabled:opacity-50 py-3 px-2"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-black" /> {playerBeast.specialMove.toUpperCase()}
            </span>
          </button>

          <button
            onClick={() => executeRound("DEFEND")}
            disabled={isProcessing || playerHp <= 0 || opponentHp <= 0}
            className="mh-btn mh-btn-secondary py-3 px-2 disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> GUARD (+DEF)
            </span>
          </button>

          <button
            onClick={() => executeRound("DODGE")}
            disabled={isProcessing || playerHp <= 0 || opponentHp <= 0}
            className="mh-btn mh-btn-secondary py-3 px-2 disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              <Wind className="w-4 h-4" /> EVADE
            </span>
          </button>
        </div>
      </div>

      {/* Combat Log */}
      <div className="bg-mh-navy border border-mh-border rounded-xl p-4 font-mono text-xs">
        <div className="text-[10px] uppercase text-mh-text3 font-bold mb-2 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-mh-reward" /> ARENA COMBAT TELEMETRY LOG
        </div>
        <div className="space-y-1 text-mh-text2 max-h-[120px] overflow-y-auto pr-1">
          {combatLogs.map((log, index) => (
            <div key={index} className="truncate">
              {log.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
