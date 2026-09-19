"use client";

import React, { useState, useEffect } from "react";
import { Beast, MOCK_BEASTS } from "@/data/mockData";
import { BeastSvg } from "./BeastSvg";
import { soundFX } from "@/game/SoundFX";
import { CombatAction } from "@/game/BattleAction";
import {
  Tv,
  Users,
  Swords,
  RotateCcw,
  Radio,
  ExternalLink,
  Shield,
  Flame,
  Award,
} from "lucide-react";
import { INITIAL_TERRITORY_WAR } from "@/data/warData";

export const SpectatorMode: React.FC = () => {
  const [beast1, setBeast1] = useState<Beast>(MOCK_BEASTS[0]); // Emberwyrm
  const [beast2, setBeast2] = useState<Beast>(MOCK_BEASTS[1]); // Tidewarden
  const [beast1Hp, setBeast1Hp] = useState<number>(100);
  const [beast2Hp, setBeast2Hp] = useState<number>(120);
  const [round, setRound] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [spectatorCount, setSpectatorCount] = useState<number>(312);
  const [combatFeed, setCombatFeed] = useState<string[]>([
    "⚔️ Exhibition Arena opened at POWAI TECH HUB.",
    "🛡️ TIDEWARDEN entered defensive guard posture.",
  ]);
  const [winnerMessage, setWinnerMessage] = useState<string | null>(null);

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
      const actions: CombatAction[] = ["ATTACK", "DEFEND", "SPECIAL"];
      const b1Act = actions[Math.floor(Math.random() * actions.length)];
      const b2Act = actions[Math.floor(Math.random() * actions.length)];

      const b1Dmg = b1Act === "SPECIAL" ? 32 : b1Act === "ATTACK" ? 20 : 8;
      const b2Dmg = b2Act === "SPECIAL" ? 28 : b2Act === "ATTACK" ? 18 : 6;

      setBeast2Hp((prev) => {
        const next = Math.max(0, prev - b1Dmg);
        if (next <= 0) {
          setWinnerMessage(`${beast1.name} CLAIMS HUNT TV ARENA VICTORY! 🏆`);
          soundFX.playVictory();
        }
        return next;
      });

      setBeast1Hp((prev) => {
        const next = Math.max(0, prev - b2Dmg);
        if (next <= 0 && !winnerMessage) {
          setWinnerMessage(`${beast2.name} PREVAILS IN HUNT TV ARENA! 🏆`);
        }
        return next;
      });

      soundFX.playAttack();
      setRound((r) => r + 1);
      setCombatFeed((prev) => [
        `Round ${round}: ${beast1.name} [${b1Act}] (${b1Dmg} dmg) ⚔️ ${beast2.name} [${b2Act}] (${b2Dmg} dmg)`,
        ...prev.slice(0, 4),
      ]);
    }, 2400);

    return () => clearInterval(roundInterval);
  }, [isAutoPlaying, winnerMessage, round, beast1.name, beast2.name]);

  const restartExhibition = () => {
    setBeast1Hp(beast1.maxHp);
    setBeast2Hp(beast2.maxHp);
    setRound(1);
    setWinnerMessage(null);
    setCombatFeed(["⚔️ New exhibition round started."]);
  };

  return (
    <div className="py-6 max-w-7xl mx-auto px-4">
      {/* Top Banner */}
      <div className="bg-mh-navy border border-mh-border rounded-xl p-4 mb-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-mh-live/20 border border-mh-live text-mh-live font-mono font-bold text-xs rounded uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            HUNT TV BROADCAST
          </div>
          <span className="text-xs font-mono text-mh-text2">
            No wallet required • Live Mumbai Arena Simulation
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-mh-reward bg-mh-card px-3 py-1.5 rounded border border-mh-border">
            <Users className="w-4 h-4 text-mh-reward" />
            <span>{spectatorCount} SPECTATORS</span>
          </div>

          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="mh-btn text-xs py-1.5 px-3"
          >
            <span>{isAutoPlaying ? "PAUSE" : "RESUME"}</span>
          </button>
        </div>
      </div>

      {/* Main Coliseum Screen */}
      <div className="bg-mh-navy border border-mh-border rounded-xl p-6 md:p-8 mb-6 shadow-2xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Beast 1 */}
          <div className="lg:col-span-5 bg-mh-card rounded-xl border border-mh-border p-6 text-center shadow-md relative">
            <span className="absolute top-4 left-4 mh-badge bg-mh-primary/20 text-mh-primary border border-mh-primary/40 text-[10px]">
              <span>CHALLENGER</span>
            </span>
            <div className="w-32 h-32 mx-auto mb-3 flex items-center justify-center">
              <BeastSvg id={beast1.id} className="w-28 h-28" animate={true} />
            </div>
            <div className="font-display text-2xl font-black uppercase text-white tracking-wide">{beast1.name}</div>
            <div className="text-xs font-mono text-mh-text3 mb-4">Level {beast1.level} • {beast1.element} Drake</div>

            {/* HP Bar */}
            <div className="w-full bg-[#07090E] h-3.5 rounded-full border border-mh-border overflow-hidden mb-2">
              <div
                className="h-full bg-mh-win transition-all duration-300"
                style={{ width: `${(beast1Hp / beast1.maxHp) * 100}%` }}
              />
            </div>
            <div className="text-xs font-mono font-bold text-mh-text2 flex justify-between">
              <span>HP</span>
              <span>{beast1Hp} / {beast1.maxHp}</span>
            </div>
          </div>

          {/* VS Divider & Commentary */}
          <div className="lg:col-span-2 text-center flex flex-col items-center justify-center">
            <div className="font-display text-4xl font-black text-mh-live tracking-widest my-2">
              VS
            </div>
            <span className="font-mono text-xs text-mh-text3 uppercase">
              Round {round}
            </span>
          </div>

          {/* Beast 2 */}
          <div className="lg:col-span-5 bg-mh-card rounded-xl border border-mh-border p-6 text-center shadow-md relative">
            <span className="absolute top-4 right-4 mh-badge bg-mh-defend/20 text-mh-defend border border-mh-defend/40 text-[10px]">
              <span>DEFENDER</span>
            </span>
            <div className="w-32 h-32 mx-auto mb-3 flex items-center justify-center">
              <BeastSvg id={beast2.id} className="w-28 h-28" animate={true} />
            </div>
            <div className="font-display text-2xl font-black uppercase text-white tracking-wide">{beast2.name}</div>
            <div className="text-xs font-mono text-mh-text3 mb-4">Level {beast2.level} • {beast2.element} Titan</div>

            {/* HP Bar */}
            <div className="w-full bg-[#07090E] h-3.5 rounded-full border border-mh-border overflow-hidden mb-2">
              <div
                className="h-full bg-mh-win transition-all duration-300"
                style={{ width: `${(beast2Hp / beast2.maxHp) * 100}%` }}
              />
            </div>
            <div className="text-xs font-mono font-bold text-mh-text2 flex justify-between">
              <span>HP</span>
              <span>{beast2Hp} / {beast2.maxHp}</span>
            </div>
          </div>
        </div>

        {/* Winner Banner */}
        {winnerMessage && (
          <div className="mt-6 bg-mh-reward/20 border border-mh-reward rounded-lg p-4 text-center animate-bounce">
            <div className="font-display text-2xl font-black text-mh-reward uppercase tracking-wide">
              {winnerMessage}
            </div>
            <button
              onClick={restartExhibition}
              className="mt-3 mh-btn text-xs py-1.5 px-4"
            >
              <span>NEW EXHIBITION BATTLE</span>
            </button>
          </div>
        )}

        {/* Live Commentary Feed */}
        <div className="mt-6 bg-[#07090E] border border-mh-border rounded-lg p-4 font-mono text-xs">
          <div className="text-mh-text3 text-[10px] uppercase font-bold mb-2 flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5 text-mh-primary" /> LIVE HUNT TV COMMENTARY LOG
          </div>
          <div className="space-y-1.5 text-mh-text2">
            {combatFeed.map((feed, i) => (
              <div key={i} className="truncate">
                {feed}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Arena Highlights & Territory Wars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-mh-navy border border-mh-border rounded-xl p-5 shadow-xl">
          <h3 className="font-display text-xl font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Flame className="w-4 h-4 text-mh-live" /> TOP HUNT HIGHLIGHTS
          </h3>
          <div className="space-y-3">
            {[
              { territory: "POWAI TECH HUB", hunter: "0x71C9...8A2F", result: "+24 ELO Upset", time: "2m ago" },
              { territory: "BANDRA COAST", hunter: "CyberHunter", result: "5-Streak Defense", time: "12m ago" },
              { territory: "BKC SKYSCRAPER", hunter: "NeonWhale", result: "Rooftop Conquest", time: "28m ago" },
            ].map((h, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-mh-card border border-mh-border text-xs font-mono">
                <div>
                  <span className="font-bold text-white block">{h.territory}</span>
                  <span className="text-[10px] text-mh-text3">{h.hunter} · {h.time}</span>
                </div>
                <span className="text-mh-reward font-bold">{h.result}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-mh-navy border border-mh-border rounded-xl p-5 shadow-xl">
          <h3 className="font-display text-xl font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-mh-defend" /> ACTIVE WAR PROVING GROUNDS
          </h3>
          <div className="space-y-3">
            {INITIAL_TERRITORY_WAR.slice(0, 3).map((t) => (
              <div key={t.id} className="flex items-center justify-between p-2.5 rounded bg-mh-card border border-mh-border text-xs">
                <div>
                  <span className="font-display font-black text-white uppercase block text-sm">{t.name}</span>
                  <span className="text-[10px] font-mono text-mh-text3">{t.currentOwner} · {t.winStreak} Streak</span>
                </div>
                <span className="mh-badge text-[10px] bg-mh-live/20 border-mh-live/40 text-mh-live">
                  <span>{t.status}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
