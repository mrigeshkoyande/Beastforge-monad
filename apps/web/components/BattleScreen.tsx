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
  territory: Territory;
  onBattleEnd: (won: boolean, log: string[]) => void;
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
  // Deterministic engine instance
  const [engine] = useState(() => {
    return new BattleEngine({
      battleId: `battle_${Date.now()}`,
      seed: `seed_mumbai_${territory.numericId}_${playerBeast.tokenId}_${opponentBeast.tokenId}`,
      playerBeast,
      opponentBeast,
      territoryId: territory.id,
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

  // Dynamic Movement & Power Attack FX
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
      text: `⚔️ BATTLE COMMENCED: ${playerBeast.name} vs ${opponentBeast.name} at ${territory.name}!`,
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

  // Perform round action via deterministic engine
  const executeRound = useCallback(
    (action: CombatAction) => {
      if (isProcessing || playerHp <= 0 || opponentHp <= 0) return;
      setIsProcessing(true);

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

      // Step the deterministic engine
      const roundResult = engine.step(action);
      const state = engine.getState();

      // Show damage & physical hit reaction on opponent
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

      // Opponent counter-attack and movement after a brief pause
      setTimeout(() => {
        if (roundResult.playerDamageTaken > 0) {
          if (roundResult.opponentCrit) {
            setOpponentMovement("surge");
            setActiveBeam("opponent");
            soundFX.playSpecial();
            triggerSpecialFlash();
            setActiveActionBanner(`💥 ${opponentBeast.name} CAST ${opponentBeast.specialMove}!`);
            setTimeout(() => {
              setOpponentMovement("idle");
              setActiveBeam(null);
            }, 750);
          } else {
            setOpponentMovement("lunge");
            soundFX.playAttack();
            setActiveActionBanner(`⚔️ ${opponentBeast.name} COUNTER-LUNGES!`);
            setTimeout(() => setOpponentMovement("idle"), 550);
          }

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
          soundFX.playDodge();
          setFloatingDamage({ target: "player", text: "EVADED! 💨" });
        }

        // Update visual gauges
        setPlayerHp(state.player.currentHp);
        setOpponentHp(state.opponent.currentHp);
        setPlayerEnergy(state.player.energy);
        setRound(state.currentRound);

        // Update logs
        const newLogs: CombatLogEntry[] = roundResult.commentary.map((c) => ({
          round: roundResult.round,
          text: c,
          type: c.includes("CRITICAL") || c.includes("⚡") ? "crit" : "player",
        }));
        setCombatLogs((prev) => [...prev, ...newLogs]);

        // Check completion
        if (state.status === "RESOLVED") {
          const won = state.winner === "PLAYER";
          setActiveActionBanner(won ? `🏆 ${playerBeast.name} VICTORIOUS!` : `💀 ${opponentBeast.name} WINS!`);
          setTimeout(() => {
            if (won) soundFX.playVictory();
            onBattleEnd(won, combatLogs.map((l) => l.text));
          }, 1200);
          return;
        }

        setIsProcessing(false);
      }, 550);
    },
    [engine, isProcessing, playerHp, opponentHp, combatLogs, onBattleEnd, playerBeast, opponentBeast]
  );

  // Auto battle effect loop
  useEffect(() => {
    if (!isAutoBattle || isProcessing || playerHp <= 0 || opponentHp <= 0) return;
    const timer = setTimeout(() => {
      if (playerEnergy >= 35 && Math.random() < 0.5) {
        executeRound("SPECIAL");
      } else if (playerHp < 35 && Math.random() < 0.45) {
        executeRound("DEFEND");
      } else {
        executeRound("ATTACK");
      }
    }, 1100);
    return () => clearTimeout(timer);
  }, [isAutoBattle, isProcessing, round, playerHp, opponentHp, playerEnergy, executeRound]);

  const playerHpPct = Math.max(0, (playerHp / playerBeast.maxHp) * 100);
  const oppHpPct = Math.max(0, (opponentHp / opponentBeast.maxHp) * 100);
  const isFinisherReady = opponentHp > 0 && opponentHp <= opponentBeast.maxHp * 0.25;

  return (
    <div className={`py-6 max-w-6xl mx-auto px-4 ${screenShaking ? "animate-shake" : ""}`}>
      {/* Special Attack Screen Flash */}
      {specialFlash && (
        <div className="fixed inset-0 z-50 pointer-events-none bg-amber-400/25 animate-pulse-glow" />
      )}

      {/* Top Banner: Arena Name, Round Indicator & Controls */}
      <div className="flex items-center justify-between bg-arcade-black text-white p-4 rounded-2xl border-4 border-arcade-black mb-6 shadow-arcade">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚔️</span>
          <div>
            <div className="text-xs font-bold text-arcade-yellow uppercase tracking-widest flex items-center gap-1.5">
              <span>MONAD ARENA</span>
              <span>•</span>
              <span>{territory.name}</span>
            </div>
            <div className="text-xl font-black tracking-tight">
              {playerBeast.name} vs {opponentBeast.name}
            </div>
          </div>
        </div>

        {/* Round Badge & Auto Battle Toggle */}
        <div className="flex items-center gap-3">
          <div className="text-center px-4 py-1.5 bg-warm-100 text-arcade-black rounded-xl border-2 border-white font-mono font-black text-sm">
            ROUND {String(round).padStart(2, "0")} / {maxRounds}
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              setIsAutoBattle(!isAutoBattle);
            }}
            className={`arcade-btn px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 ${
              isAutoBattle ? "bg-arcade-yellow text-arcade-black font-black" : "bg-white/20 text-white"
            }`}
          >
            {isAutoBattle ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isAutoBattle ? "AUTO: ON" : "AUTO BATTLE"}
          </button>
        </div>
      </div>

      {/* Finisher Alert Banner when Opponent is Critical */}
      {isFinisherReady && (
        <div className="bg-red-500 text-white py-2 px-4 rounded-xl border-3 border-arcade-black text-center font-black text-xs uppercase tracking-wider mb-4 shadow-arcade animate-pulse flex items-center justify-center gap-2">
          <Flame className="w-4 h-4 text-yellow-300" />
          ⚡ FINISHER STRIKE AVAILABLE! {opponentBeast.name} REELING AT {opponentHp} HP!
        </div>
      )}

      {/* Main Stadium Arena */}
      <div className="arcade-card bg-warm-50 p-6 md:p-8 mb-6 relative overflow-hidden">
        {/* Floating Action Banner */}
        {activeActionBanner && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 bg-arcade-black text-white rounded-xl border-2 border-arcade-yellow text-xs font-black uppercase tracking-wider shadow-arcade animate-in fade-in zoom-in-95">
            {activeActionBanner}
          </div>
        )}

        {/* Floating Damage Indicators */}
        {floatingDamage && (
          <div
            className={`absolute z-30 font-black text-2xl md:text-4xl animate-float-dmg ${
              floatingDamage.isCrit ? "text-red-600 scale-125 drop-shadow-md" : "text-amber-600"
            } ${
              floatingDamage.target === "player" ? "top-1/4 left-1/4" : "top-1/4 right-1/4"
            }`}
          >
            {floatingDamage.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Player Beast Column */}
          <div className="flex flex-col items-center bg-white p-5 rounded-2xl border-4 border-arcade-black shadow-arcade-sm relative">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-black px-2 py-0.5 bg-arcade-mint rounded border border-arcade-black uppercase">
                YOU ({playerBeast.name})
              </span>
              <span className="font-mono text-xs font-black text-arcade-black">
                {playerHp} / {playerBeast.maxHp} HP
              </span>
            </div>

            {/* HP Bar */}
            <div className="w-full h-4 bg-warm-200 rounded-full border-2 border-arcade-black overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-300 ${
                  playerHpPct > 50
                    ? "bg-emerald-500"
                    : playerHpPct > 25
                    ? "bg-amber-500"
                    : "bg-red-500 animate-pulse"
                }`}
                style={{ width: `${playerHpPct}%` }}
              />
            </div>

            {/* Energy Bar */}
            <div className="w-full flex items-center justify-between text-[10px] font-bold text-arcade-black/60 mb-1">
              <span>SPECIAL ENERGY</span>
              <span>{playerEnergy}%</span>
            </div>
            <div className="w-full h-2 bg-warm-200 rounded-full border border-arcade-black overflow-hidden mb-4">
              <div
                className="h-full bg-arcade-electric transition-all"
                style={{ width: `${playerEnergy}%` }}
              />
            </div>

            {/* Beast Visual with Elemental Aura & Dynamic Movement */}
            <div
              className={`relative my-2 p-3 rounded-2xl bg-gradient-to-b from-amber-200/40 to-orange-400/20 border border-arcade-black/20 transition-all ${
                playerMovement === "lunge"
                  ? "animate-player-lunge z-20"
                  : playerMovement === "hit"
                  ? "animate-beast-hit"
                  : playerMovement === "surge"
                  ? "animate-power-surge"
                  : ""
              }`}
            >
              <BeastSvg id={playerBeast.id} className="w-44 h-44" animate={true} />
              {playerMovement === "surge" && (
                <div className="absolute inset-0 rounded-2xl bg-amber-400/30 animate-ping pointer-events-none" />
              )}
            </div>
          </div>

          {/* Center Power Projectile Beam Layer */}
          {activeBeam && (
            <div className="hidden md:block absolute left-1/3 right-1/3 top-1/2 -translate-y-1/2 z-40 h-8 pointer-events-none">
              <div
                className={`h-full rounded-full animate-power-beam ${
                  activeBeam === "player"
                    ? "bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 shadow-[0_0_25px_#F59E0B]"
                    : "bg-gradient-to-l from-emerald-400 via-teal-500 to-purple-600 shadow-[0_0_25px_#10B981]"
                }`}
              />
            </div>
          )}

          {/* Right: Opponent Beast Column */}
          <div className="flex flex-col items-center bg-warm-100 p-5 rounded-2xl border-4 border-arcade-black shadow-arcade-sm relative">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-black px-2 py-0.5 bg-arcade-coral rounded border border-arcade-black uppercase">
                ZONE GUARDIAN ({opponentBeast.name})
              </span>
              <span className="font-mono text-xs font-black text-arcade-black">
                {opponentHp} / {opponentBeast.maxHp} HP
              </span>
            </div>

            {/* HP Bar */}
            <div className="w-full h-4 bg-warm-200 rounded-full border-2 border-arcade-black overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-300 ${
                  oppHpPct > 50
                    ? "bg-emerald-500"
                    : oppHpPct > 25
                    ? "bg-amber-500"
                    : "bg-red-500 animate-pulse"
                }`}
                style={{ width: `${oppHpPct}%` }}
              />
            </div>

            <div className="w-full flex items-center justify-between text-[10px] font-bold text-arcade-black/60 mb-1">
              <span>ADAPTIVE BOT PROFILE</span>
              <span className="font-black text-arcade-black uppercase">{opponentBeast.personality}</span>
            </div>
            <div className="w-full h-2 bg-warm-200 rounded-full border border-arcade-black overflow-hidden mb-4">
              <div className="h-full bg-purple-500" style={{ width: "85%" }} />
            </div>

            {/* Opponent Beast Visual with Aura & Dynamic Movement */}
            <div
              className={`relative my-2 p-3 rounded-2xl bg-gradient-to-b from-emerald-200/40 to-teal-400/20 border border-arcade-black/20 transition-all ${
                opponentMovement === "lunge"
                  ? "animate-opponent-lunge z-20"
                  : opponentMovement === "hit"
                  ? "animate-beast-hit"
                  : opponentMovement === "surge"
                  ? "animate-power-surge"
                  : ""
              }`}
            >
              <BeastSvg id={opponentBeast.id} className="w-44 h-44" />
              {opponentMovement === "surge" && (
                <div className="absolute inset-0 rounded-2xl bg-purple-500/30 animate-ping pointer-events-none" />
              )}
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="mt-8 border-t-4 border-arcade-black pt-6">
          <div className="text-xs font-black uppercase text-arcade-black/70 mb-3 tracking-wider text-center">
            CHOOSE YOUR ACTION FOR ROUND {round}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <button
              disabled={isProcessing}
              onClick={() => executeRound("ATTACK")}
              className="arcade-btn py-3.5 px-4 bg-red-500 text-white rounded-2xl text-xs md:text-sm flex flex-col items-center justify-center gap-0.5 disabled:opacity-50 hover:scale-105"
            >
              <div className="flex items-center gap-1.5 font-black">
                <Swords className="w-4 h-4" />
                <span>QUICK STRIKE</span>
              </div>
              <span className="text-[10px] font-bold opacity-80">Physical Damage • 100% Acc</span>
            </button>

            <button
              disabled={isProcessing}
              onClick={() => executeRound("DEFEND")}
              className="arcade-btn py-3.5 px-4 bg-emerald-500 text-white rounded-2xl text-xs md:text-sm flex flex-col items-center justify-center gap-0.5 disabled:opacity-50 hover:scale-105"
            >
              <div className="flex items-center gap-1.5 font-black">
                <Shield className="w-4 h-4" />
                <span>PROTECT / SHIELD</span>
              </div>
              <span className="text-[10px] font-bold opacity-80">+20 Energy • 50% Def</span>
            </button>

            <button
              disabled={isProcessing || playerEnergy < 35}
              onClick={() => executeRound("SPECIAL")}
              className={`arcade-btn py-3.5 px-4 rounded-2xl text-xs md:text-sm flex flex-col items-center justify-center gap-0.5 disabled:opacity-50 hover:scale-105 ${
                isFinisherReady ? "bg-amber-400 text-arcade-black font-black animate-bounce" : "bg-arcade-electric text-white"
              }`}
            >
              <div className="flex items-center gap-1.5 font-black">
                <Zap className="w-4 h-4" />
                <span>{playerBeast.specialMove}</span>
              </div>
              <span className="text-[10px] font-bold opacity-80">
                {isFinisherReady ? "⚡ FINISHER CRIT!" : "35 Energy • Signature"}
              </span>
            </button>

            <button
              disabled={isProcessing}
              onClick={() => executeRound("DODGE")}
              className="arcade-btn py-3.5 px-4 bg-amber-400 text-arcade-black rounded-2xl text-xs md:text-sm flex flex-col items-center justify-center gap-0.5 disabled:opacity-50 hover:scale-105"
            >
              <div className="flex items-center gap-1.5 font-black">
                <Wind className="w-4 h-4" />
                <span>AGILITY / DODGE</span>
              </div>
              <span className="text-[10px] font-bold opacity-80">Evade Counter • Speed</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Combat Commentary Log */}
      <div className="arcade-card bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase text-arcade-black flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-arcade-electric" />
            LIVE BATTLE ENGINE LOG (DETERMINISTIC)
          </span>
          <span className="text-[10px] font-mono font-bold text-arcade-black/60">
            {combatLogs.length} ROUND EVENTS
          </span>
        </div>

        <div className="bg-warm-100 rounded-xl border-3 border-arcade-black p-3.5 max-h-36 overflow-y-auto space-y-1.5 font-mono text-xs">
          {combatLogs.slice().reverse().map((log, i) => (
            <div
              key={i}
              className={`p-1.5 rounded ${
                log.type === "crit"
                  ? "bg-red-100 text-red-700 font-bold border border-red-300"
                  : log.type === "player"
                  ? "text-arcade-electric font-semibold"
                  : log.type === "opponent"
                  ? "text-purple-700 font-semibold"
                  : "text-arcade-black/70"
              }`}
            >
              [R{log.round}] {log.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
