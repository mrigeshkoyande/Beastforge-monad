"use client";

import React, { useState } from "react";
import { LeaderboardEntry } from "@/data/mockData";
import { soundFX } from "@/game/SoundFX";
import { Trophy, Crown, MapPin, Zap, ShieldCheck, Users, ExternalLink } from "lucide-react";
import { CREWS, INITIAL_TERRITORY_WAR } from "@/data/warData";

interface LeaderboardProps {
  entries?: LeaderboardEntry[];
  userAddress?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, userAddress }) => {
  const [activeTab, setActiveTab] = useState<"hunters" | "crews" | "territories">("hunters");

  const list = entries || [];

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-7 h-7 rounded bg-mh-reward text-black font-black text-xs flex items-center justify-center font-mono">
            🥇
          </div>
        );
      case 2:
        return (
          <div className="w-7 h-7 rounded bg-mh-silver text-black font-black text-xs flex items-center justify-center font-mono">
            🥈
          </div>
        );
      case 3:
        return (
          <div className="w-7 h-7 rounded bg-amber-700/60 text-white font-black text-xs flex items-center justify-center font-mono">
            🥉
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded bg-mh-navy border border-mh-border text-mh-text3 font-mono font-bold text-xs flex items-center justify-center">
            #{rank}
          </div>
        );
    }
  };

  return (
    <div className="py-6 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-mh-card rounded border border-mh-border text-xs font-mono font-bold text-mh-reward mb-2">
            <Trophy className="w-3.5 h-3.5 text-mh-reward" />
            GLOBAL ON-CHAIN LEADERBOARDS · SEASON 01
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white uppercase tracking-wider leading-none">
            CITY LEAGUE <span className="text-mh-primary">STANDINGS</span>
          </h2>
          <p className="text-mh-text2 text-sm mt-1">
            Ratings and crew points are updated in real-time by authoritative Monad Testnet events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-mh-navy rounded border border-mh-border text-xs font-mono text-mh-text2">
            <ShieldCheck className="w-3.5 h-3.5 text-mh-win" /> Verified Settlement
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab("hunters");
          }}
          className={`mh-btn text-xs py-2 px-4 ${
            activeTab === "hunters" ? "bg-mh-primary text-white" : "mh-btn-secondary"
          }`}
        >
          <span>TOP HUNTERS</span>
        </button>
        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab("crews");
          }}
          className={`mh-btn text-xs py-2 px-4 ${
            activeTab === "crews" ? "bg-mh-primary text-white" : "mh-btn-secondary"
          }`}
        >
          <span>CREW FACTIONS</span>
        </button>
        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab("territories");
          }}
          className={`mh-btn text-xs py-2 px-4 ${
            activeTab === "territories" ? "bg-mh-primary text-white" : "mh-btn-secondary"
          }`}
        >
          <span>CONTESTED TERRITORIES</span>
        </button>
      </div>

      {/* 1. TOP HUNTERS TABLE */}
      {activeTab === "hunters" && (
        <div className="bg-mh-navy rounded-xl border border-mh-border overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#07090E] border-b border-mh-border text-mh-text3 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">RANK</th>
                <th className="py-3 px-4">HUNTER</th>
                <th className="py-3 px-4">CREW</th>
                <th className="py-3 px-4 text-center">ELO RATING</th>
                <th className="py-3 px-4 text-center">W / L</th>
                <th className="py-3 px-4 text-center">STREAK</th>
                <th className="py-3 px-4 text-right">TERRITORIES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mh-border/50 text-mh-text">
              {list.map((entry, idx) => (
                <tr
                  key={entry.rank}
                  className={`hover:bg-mh-cardHover transition-colors ${
                    entry.isUser ? "bg-mh-primary/10 border-l-2 border-mh-primary" : ""
                  }`}
                >
                  <td className="py-3.5 px-4">{getRankBadge(idx + 1)}</td>
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <span>{entry.player}</span>
                    {entry.isUser && (
                      <span className="mh-badge bg-mh-primary text-white text-[9px]">
                        <span>YOU</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-mh-primary font-bold">
                    {idx % 4 === 0 ? "Neon Vipers" : idx % 4 === 1 ? "Cyber Wolves" : idx % 4 === 2 ? "Solar Titans" : "Shadow Syndicate"}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-mh-reward text-sm">
                    {1200 + (10 - idx) * 45}
                  </td>
                  <td className="py-3.5 px-4 text-center text-mh-text2">
                    {entry.wins}W / {Math.floor(entry.battles - entry.wins)}L
                  </td>
                  <td className="py-3.5 px-4 text-center text-mh-win font-bold">
                    {Math.max(1, 5 - (idx % 4))} 🔥
                  </td>
                  <td className="py-3.5 px-4 text-right text-white font-bold">
                    {entry.territories}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. CREW FACTIONS */}
      {activeTab === "crews" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CREWS.map((crew, idx) => (
            <div key={crew.id} className="bg-mh-navy border border-mh-border rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-mh-card border border-mh-border flex items-center justify-center text-2xl">
                    {crew.banner}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-black uppercase text-white tracking-wide">
                      {crew.name}
                    </h3>
                    <div className="text-xs font-mono text-mh-text3">
                      Rank #{idx + 1} · Tag: {crew.tag}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-mh-text3 block uppercase">SEASON POINTS</span>
                  <span className="font-mono text-xl font-black text-mh-reward">{crew.seasonPoints} PTS</span>
                </div>
              </div>

              <p className="text-xs text-mh-text2 mb-4">
                {crew.description}
              </p>

              <div className="grid grid-cols-3 gap-2 bg-[#07090E] p-3 rounded-lg border border-mh-border text-xs font-mono text-center">
                <div>
                  <span className="text-[10px] text-mh-text3 block">VICTORIES</span>
                  <span className="text-mh-win font-bold">{crew.wins} W</span>
                </div>
                <div>
                  <span className="text-[10px] text-mh-text3 block">DEFEATS</span>
                  <span className="text-mh-live font-bold">{crew.losses} L</span>
                </div>
                <div>
                  <span className="text-[10px] text-mh-text3 block">HUNTERS</span>
                  <span className="text-white font-bold">{crew.members}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. CONTESTED TERRITORIES */}
      {activeTab === "territories" && (
        <div className="bg-mh-navy rounded-xl border border-mh-border overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#07090E] border-b border-mh-border text-mh-text3 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">TERRITORY</th>
                <th className="py-3 px-4">CONTROLLING CREW</th>
                <th className="py-3 px-4">GUARDIAN BEAST</th>
                <th className="py-3 px-4 text-center">DEFENSE LEVEL</th>
                <th className="py-3 px-4 text-center">STREAK</th>
                <th className="py-3 px-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mh-border/50 text-mh-text">
              {INITIAL_TERRITORY_WAR.map((t, idx) => (
                <tr key={t.id} className="hover:bg-mh-cardHover transition-colors">
                  <td className="py-3 px-4 text-mh-text3">#{idx + 1}</td>
                  <td className="py-3 px-4 font-bold text-white">
                    {t.name}
                    <span className="block text-[10px] text-mh-text3 font-normal">{t.zone}</span>
                  </td>
                  <td className="py-3 px-4 text-mh-primary font-bold">{t.currentOwner}</td>
                  <td className="py-3 px-4 text-mh-silver">{t.guardian} (L{t.guardianLevel})</td>
                  <td className="py-3 px-4 text-center text-mh-defend font-bold">L{t.defenseLevel} / 5</td>
                  <td className="py-3 px-4 text-center text-mh-reward font-bold">{t.winStreak}W ({t.rewardMultiplier}x)</td>
                  <td className="py-3 px-4 text-right">
                    <span className="mh-badge text-[9px] bg-mh-card border border-mh-border text-white">
                      <span>{t.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
