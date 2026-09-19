"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Beast, Territory } from "@/data/mockData";
import { BeastSvg } from "./BeastSvg";
import { soundFX } from "@/game/SoundFX";
import { Trophy, Skull, ArrowRight, ShieldCheck, MapPin, Zap, Flame, Award } from "lucide-react";

interface VictoryDefeatModalProps {
  won: boolean;
  playerBeast: Beast;
  opponentBeast: Beast;
  territory: any;
  ratingBefore?: number;
  ratingAfter?: number;
  ratingDelta?: number;
  influenceDelta?: number;
  crewPoints?: number;
  streak?: number;
  onClaim: () => void;
  onViewLeaderboard: () => void;
}

export const VictoryDefeatModal: React.FC<VictoryDefeatModalProps> = ({
  won,
  playerBeast,
  opponentBeast,
  territory,
  ratingBefore = 1000,
  ratingAfter = 1024,
  ratingDelta = 24,
  influenceDelta = 16,
  crewPoints = 49,
  streak = 1,
  onClaim,
  onViewLeaderboard,
}) => {
  useEffect(() => {
    if (won) {
      soundFX.playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [won]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-mh-navy border border-mh-border max-w-lg w-full p-6 text-center shadow-2xl rounded-xl relative max-h-[95vh] overflow-y-auto">
        {/* Banner */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-1 rounded text-xs font-mono font-black uppercase tracking-wider mb-4 border ${
            won
              ? "bg-mh-win/20 border-mh-win/50 text-mh-win"
              : "bg-mh-live/20 border-mh-live/50 text-mh-live"
          }`}
        >
          {won ? <Trophy className="w-4 h-4 text-mh-win" /> : <Skull className="w-4 h-4 text-mh-live" />}
          {won ? "🏆 ON-CHAIN ARENA VICTORY" : "ARENA DEFEAT"}
        </div>

        {/* Big Headline */}
        <h2 className="font-display text-4xl md:text-5xl font-black text-white uppercase tracking-wider leading-none mb-2">
          {won ? (
            <>
              {playerBeast.name} <span className="text-mh-primary">TRIUMPHS!</span>
            </>
          ) : (
            <>
              {opponentBeast.name} <span className="text-mh-live">PREVAILED</span>
            </>
          )}
        </h2>

        <p className="text-xs text-mh-text2 mb-5">
          {won
            ? `Your battle has permanently shifted the influence of ${territory?.name || "the territory"} on Monad!`
            : `Tactical setback in ${territory?.name || "the arena"}. Regroup and challenge again.`}
        </p>

        {/* Beast Showcase */}
        <div className="bg-mh-card rounded-lg border border-mh-border p-4 mb-5 flex flex-col items-center shadow-inner">
          <BeastSvg id={won ? playerBeast.id : opponentBeast.id} className="w-28 h-28 mb-2" animate={won} />
          <div className="font-display text-2xl font-black text-white uppercase tracking-wide">
            {won ? playerBeast.name : opponentBeast.name}
          </div>
          <div className="text-xs font-mono text-mh-text3">
            {won ? `Level ${playerBeast.level} • ${playerBeast.rarity}` : "Zone Guardian"}
          </div>
        </div>

        {/* On-Chain Rating & Influence Delta Grid */}
        <div className="grid grid-cols-3 gap-2 text-center mb-5">
          <div className="bg-mh-card p-3 rounded-lg border border-mh-border">
            <span className="text-[10px] font-mono text-mh-text3 block uppercase">HUNTER ELO</span>
            <span className={`text-base font-black font-mono ${won ? "text-mh-reward" : "text-mh-live"}`}>
              {won ? `+${ratingDelta}` : `-${ratingDelta}`}
            </span>
            <span className="block text-[10px] font-mono text-mh-text2">
              {won ? `${ratingBefore} → ${ratingAfter}` : `${ratingBefore} → ${ratingAfter}`}
            </span>
          </div>

          <div className="bg-mh-card p-3 rounded-lg border border-mh-border">
            <span className="text-[10px] font-mono text-mh-text3 block uppercase">INFLUENCE</span>
            <span className={`text-base font-black font-mono ${won ? "text-mh-win" : "text-mh-text3"}`}>
              {won ? `+${influenceDelta}%` : "0%"}
            </span>
            <span className="block text-[10px] font-mono text-mh-text2">Territory</span>
          </div>

          <div className="bg-mh-card p-3 rounded-lg border border-mh-border">
            <span className="text-[10px] font-mono text-mh-text3 block uppercase">CREW POINTS</span>
            <span className="text-base font-black text-mh-primary font-mono">
              {won ? `+${crewPoints}` : "0"}
            </span>
            <span className="block text-[10px] font-mono text-mh-text2">Faction</span>
          </div>
        </div>

        {/* Streak & What's Next Objective Box (§6) */}
        <div className="bg-[#07090E] border border-mh-border rounded-lg p-3.5 text-left mb-6 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-mh-text2 border-b border-mh-border/50 pb-2">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-mh-reward" /> Current Streak:
            </span>
            <span className="text-white font-bold">{won ? `${streak} BATTLES` : "RESET TO 0"}</span>
          </div>

          <div className="flex items-center justify-between text-mh-text2">
            <span className="flex items-center gap-1.5 text-mh-reward">
              <Zap className="w-3.5 h-3.5" /> Next Objective:
            </span>
            <span className="text-white font-medium text-right">
              {won ? "Fortify Bandra Coast or conquer BKC" : "Re-enter Powai Proving Grounds"}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClaim}
            className="mh-btn py-2.5 text-xs text-center"
          >
            <span>RETURN TO MAP</span>
          </button>
          <button
            onClick={onViewLeaderboard}
            className="mh-btn mh-btn-secondary py-2.5 text-xs text-center"
          >
            <span>LEADERBOARDS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
