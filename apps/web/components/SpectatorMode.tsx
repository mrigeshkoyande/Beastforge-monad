"use client";

import React, { useState, useEffect } from "react";
import { Beast, MOCK_BEASTS } from "@/data/mockData";
import { BeastSvg } from "./BeastSvg";
import { soundFX } from "@/game/SoundFX";
import { BattleEngine } from "@/game/BattleEngine";
import { CombatAction } from "@/game/BattleAction";
import {
  Tv,
  Users,
  Flame,
  Swords,
  Play,
  RotateCcw,
  Zap,
  TrendingUp,
  Award,
  Radio,
} from "lucide-react";

export const SpectatorMode: React.FC = () => {
  const [beast1, setBeast1] = useState<Beast>(MOCK_BEASTS[0]); // Vortex
  const [beast2, setBeast2] = useState<Beast>(MOCK_BEASTS[1]); // Titan
  const [beast1Hp, setBeast1Hp] = useState<number>(100);
  const [beast2Hp, setBeast2Hp] = useState<number>(120);
  const [round, setRound] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [spectatorCount, setSpectatorCount] = useState<number>(248);
  const [combatFeed, setCombatFeed] = useState<string[]>([
    "⚔️ Exhibition Skirmish initiated between VORTEX and TITAN.",
    "🛡️ TITAN prepared granite defense posture.",
  ]);
  const [winnerMessage, setWinnerMessage] = useState<string | null>(null);

  // Periodic simulated spectator fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setSpectatorCount((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Autonomous Battle Loop
  useEffect(() => {
    if (!isAutoPlaying || winnerMessage) return;

    const roundInterval = setInterval(() => {
      // Simulate deterministic AI step
      const actions: CombatAction[] = ["ATTACK", "DEFEND", "SPECIAL"];
      const b1Act = actions[Math.floor(Math.random() * actions.length)];
      const b2Act = actions[Math.floor(Math.random() * actions.length)];

      const b1Dmg = b1Act === "SPECIAL" ? 34 : b1Act === "ATTACK" ? 22 : 8;
      const b2Dmg = b2Act === "SPECIAL" ? 28 : b2Act === "ATTACK" ? 18 : 6;

      setBeast2Hp((prev) => {
        const next = Math.max(0, prev - b1Dmg);
        if (next <= 0) {
          setWinnerMessage(`${beast1.name} DOMINATES THE SPECTATOR ARENA! 🏆`);
          soundFX.playVictory();
        }
        return next;
      });

      setBeast1Hp((prev) => {
        const next = Math.max(0, prev - b2Dmg);
        if (next <= 0 && !winnerMessage) {
          setWinnerMessage(`${beast2.name} PREVAILS! 🏆`);
        }
        return next;
      });

      soundFX.playAttack();
      setRound((r) => r + 1);
      setCombatFeed((prev) => [
        `Round ${round}: ${beast1.name} (${b1Act}) dealt ${b1Dmg} dmg | ${beast2.name} countered with ${b2Act} (${b2Dmg} dmg)`,
        ...prev.slice(0, 5),
      ]);
    }, 2400);

    return () => clearInterval(roundInterval);
  }, [isAutoPlaying, winnerMessage, round, beast1.name, beast2.name]);

  const restartExhibition = () => {
    setBeast1Hp(beast1.maxHp);
    setBeast2Hp(beast2.maxHp);
    setRound(1);
    setWinnerMessage(null);
    setCombatFeed(["⚔️ New autonomous battle launched."]);
  };

  return (
    <div className="py-6 max-w-7xl mx-auto px-4">
      {/* Top Banner */}
      <div className="bg-arcade-black text-white rounded-2xl border-4 border-arcade-black p-4 mb-6 shadow-arcade-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-red-600 text-white font-black text-xs rounded-lg uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            LIVE ARENA BROADCAST
          </div>
          <span className="text-sm font-bold text-slate-300">
            No wallet required • Autonomous Exhibition
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-black text-amber-400 bg-warm-900/60 px-3 py-1.5 rounded-xl border border-white/20">
            <Users className="w-4 h-4 text-amber-400" />
            <span>{spectatorCount} SPECTATORS WATCHING</span>
          </div>

          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase border border-white flex items-center gap-1.5 ${
              isAutoPlaying ? "bg-amber-500 text-black" : "bg-emerald-500 text-black"
            }`}
          >
            {isAutoPlaying ? "PAUSE FEED" : "RESUME AUTO-PLAY"}
          </button>
        </div>
      </div>

      {/* Main Coliseum Screen */}
      <div className="arcade-card bg-warm-100 p-6 md:p-8 mb-6 border-4 border-arcade-black shadow-arcade-xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Beast 1 */}
          <div className="lg:col-span-5 bg-white rounded-3xl border-4 border-arcade-black p-6 text-center shadow-arcade-md relative">
            <span className="absolute top-4 left-4 px-2.5 py-0.5 bg-arcade-coral text-arcade-black text-[10px] font-black uppercase rounded-lg border border-arcade-black">
              FIGHTER 1
            </span>
            <div className="w-36 h-36 mx-auto mb-3 flex items-center justify-center">
              <BeastSvg id={beast1.id} className="w-32 h-32" animate={true} />
            </div>
            <div className="text-2xl font-black text-arcade-black">{beast1.name}</div>
            <div className="text-xs font-bold text-arcade-black/60 mb-4">Level {beast1.level} • {beast1.element} Drake</div>

            {/* HP Bar */}
            <div className="w-full bg-slate-200 h-4 rounded-full border-2 border-arcade-black overflow-hidden mb-2">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(beast1Hp / beast1.maxHp) * 100}%` }}
              />
            </div>
            <div className="text-xs font-black text-arcade-black flex justify-between">
              <span>HP</span>
              <span>{beast1Hp} / {beast1.maxHp}</span>
            </div>
          </div>

          {/* VS Center Pillar */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-arcade-yellow border-3 border-arcade-black flex items-center justify-center font-black text-xl shadow-arcade-md rotate-3">
              VS
            </div>
            <div className="text-xs font-black uppercase bg-white px-3 py-1 rounded-xl border-2 border-arcade-black shadow-arcade-sm">
              ROUND {round}
            </div>
          </div>

          {/* Beast 2 */}
          <div className="lg:col-span-5 bg-white rounded-3xl border-4 border-arcade-black p-6 text-center shadow-arcade-md relative">
            <span className="absolute top-4 right-4 px-2.5 py-0.5 bg-arcade-mint text-arcade-black text-[10px] font-black uppercase rounded-lg border border-arcade-black">
              FIGHTER 2
            </span>
            <div className="w-36 h-36 mx-auto mb-3 flex items-center justify-center">
              <BeastSvg id={beast2.id} className="w-32 h-32" animate={true} />
            </div>
            <div className="text-2xl font-black text-arcade-black">{beast2.name}</div>
            <div className="text-xs font-bold text-arcade-black/60 mb-4">Level {beast2.level} • {beast2.element} Titan</div>

            {/* HP Bar */}
            <div className="w-full bg-slate-200 h-4 rounded-full border-2 border-arcade-black overflow-hidden mb-2">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(beast2Hp / beast2.maxHp) * 100}%` }}
              />
            </div>
            <div className="text-xs font-black text-arcade-black flex justify-between">
              <span>HP</span>
              <span>{beast2Hp} / {beast2.maxHp}</span>
            </div>
          </div>
        </div>

        {/* Winner Banner or Action Feedback */}
        {winnerMessage ? (
          <div className="mt-8 p-4 bg-arcade-yellow rounded-2xl border-3 border-arcade-black text-center shadow-arcade-md animate-in fade-in">
            <div className="text-2xl font-black text-arcade-black mb-2">{winnerMessage}</div>
            <button
              onClick={restartExhibition}
              className="arcade-btn px-6 py-2.5 bg-arcade-electric text-white rounded-xl text-xs font-black uppercase inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> RESTART NEXT EXHIBITION
            </button>
          </div>
        ) : null}
      </div>

      {/* Live Commentary Feed */}
      <div className="bg-white rounded-2xl border-3 border-arcade-black p-5 shadow-arcade-sm">
        <div className="text-xs font-black uppercase text-arcade-black/70 flex items-center gap-1.5 mb-3">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          ARENA COMMENTARY LOG
        </div>
        <div className="space-y-2">
          {combatFeed.map((log, idx) => (
            <div
              key={idx}
              className={`text-xs font-bold p-2.5 rounded-xl border border-arcade-black/20 ${
                idx === 0 ? "bg-warm-100 text-arcade-black font-black" : "bg-white text-arcade-black/70"
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
