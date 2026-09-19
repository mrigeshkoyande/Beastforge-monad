"use client";

import React, { useState } from "react";
import { LeaderboardEntry } from "@/data/mockData";
import { soundFX } from "@/game/SoundFX";
import { Trophy, Crown, MapPin, Zap, Database, ShieldCheck } from "lucide-react";

interface LeaderboardProps {
  entries?: LeaderboardEntry[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  const [filter, setFilter] = useState<"all" | "territories" | "predictions">("all");

  const list = entries || [];

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-xl bg-arcade-yellow border-2 border-arcade-black flex items-center justify-center font-black text-sm shadow-arcade-sm">
            🥇
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-200 border-2 border-arcade-black flex items-center justify-center font-black text-sm shadow-arcade-sm">
            🥈
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-600/30 border-2 border-arcade-black flex items-center justify-center font-black text-sm shadow-arcade-sm">
            🥉
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-white border-2 border-arcade-black flex items-center justify-center font-mono font-black text-xs">
            #{rank}
          </div>
        );
    }
  };

  const sortedList = [...list].sort((a, b) => {
    if (filter === "territories") return b.territories - a.territories;
    if (filter === "predictions") return b.predictionXp - a.predictionXp;
    return b.wins - a.wins;
  });

  return (
    <div className="py-8 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-block px-3 py-1 bg-arcade-purple rounded-lg border-2 border-arcade-black text-[11px] font-black uppercase tracking-wider shadow-arcade-sm mb-2">
            GLOBAL RANKINGS
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-arcade-black tracking-tight leading-none">
            HUNTER <span className="text-arcade-electric">LEADERBOARD</span>
          </h2>
        </div>

        <div className="flex flex-col md:items-end gap-1.5">
          <div className="flex items-center gap-2 text-xs font-black">
            <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border-2 border-arcade-black shadow-arcade-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified On-Chain Battles
            </span>
            <span className="flex items-center gap-1 bg-warm-200 px-2.5 py-1 rounded-lg border-2 border-arcade-black shadow-arcade-sm">
              <Database className="w-3.5 h-3.5 text-arcade-electric" />
              Event Indexer
            </span>
          </div>
          <p className="text-xs font-bold text-arcade-black/60">
            Real-time battle event indexing settled via Monad Testnet contracts.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => {
            soundFX.playClick();
            setFilter("all");
          }}
          className={`arcade-btn px-4 py-2 rounded-xl text-xs ${
            filter === "all" ? "bg-arcade-electric text-white" : "bg-white text-arcade-black"
          }`}
        >
          MOST ARENA WINS
        </button>
        <button
          onClick={() => {
            soundFX.playClick();
            setFilter("territories");
          }}
          className={`arcade-btn px-4 py-2 rounded-xl text-xs ${
            filter === "territories" ? "bg-arcade-yellow text-arcade-black" : "bg-white text-arcade-black"
          }`}
        >
          TERRITORIES HELD
        </button>
        <button
          onClick={() => {
            soundFX.playClick();
            setFilter("predictions");
          }}
          className={`arcade-btn px-4 py-2 rounded-xl text-xs ${
            filter === "predictions" ? "bg-arcade-mint text-arcade-black" : "bg-white text-arcade-black"
          }`}
        >
          PREDICTION ORACLES (XP)
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="arcade-card bg-white p-4 md:p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-3 border-arcade-black text-[11px] font-black uppercase text-arcade-black/60 tracking-wider">
              <th className="pb-3 px-3">RANK</th>
              <th className="pb-3 px-3">HUNTER / WALLET</th>
              <th className="pb-3 px-3">SIGNATURE BEAST</th>
              <th className="pb-3 px-3 text-center">WINS / BATTLES</th>
              <th className="pb-3 px-3 text-center">TERRITORIES</th>
              <th className="pb-3 px-3 text-center">PREDICTION XP</th>
              <th className="pb-3 px-3 text-right">MON WON</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-arcade-black/10">
            {sortedList.map((row, idx) => (
              <tr
                key={row.address}
                className={`transition-colors text-xs font-bold ${
                  row.isUser
                    ? "bg-arcade-yellow/30 font-black border-2 border-arcade-black rounded-lg"
                    : "hover:bg-warm-100"
                }`}
              >
                <td className="py-4 px-3">{getRankBadge(idx + 1)}</td>
                <td className="py-4 px-3">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-arcade-black">{row.player}</span>
                    <span className="font-mono text-[10px] text-arcade-black/50">{row.address}</span>
                  </div>
                </td>
                <td className="py-4 px-3">
                  <span className="inline-block px-2.5 py-1 bg-warm-200 rounded border border-arcade-black font-semibold text-[11px]">
                    {row.topBeast}
                  </span>
                </td>
                <td className="py-4 px-3 text-center font-mono">
                  <span className="text-emerald-600 font-black">{row.wins}</span>
                  <span className="text-arcade-black/40"> / {row.battles}</span>
                  <span className="text-[10px] text-arcade-black/60 ml-1">({row.winRate})</span>
                </td>
                <td className="py-4 px-3 text-center font-black">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-arcade-mint/60 rounded border border-arcade-black">
                    <MapPin className="w-3 h-3 text-red-500" />
                    {row.territories}
                  </span>
                </td>
                <td className="py-4 px-3 text-center font-mono font-black text-purple-600">
                  {row.predictionXp} XP
                </td>
                <td className="py-4 px-3 text-right font-mono font-black text-arcade-electric text-sm">
                  {row.earnedMon}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
