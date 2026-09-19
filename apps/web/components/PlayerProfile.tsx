"use client";

import React from "react";
import { MOCK_PROFILE, MOCK_BEASTS, Beast } from "@/data/mockData";
import { BeastSvg } from "./BeastSvg";
import { soundFX } from "@/game/SoundFX";
import { User, Trophy, Swords, MapPin, Zap, Award, Wallet, ShieldCheck, Flame } from "lucide-react";
import { CREWS } from "@/data/warData";

interface PlayerProfileProps {
  profile?: typeof MOCK_PROFILE;
  onSelectBeast: (beast: Beast) => void;
  onEnterArena: () => void;
  userCrewId?: number;
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({
  profile = MOCK_PROFILE,
  onSelectBeast,
  onEnterArena,
  userCrewId = 1,
}) => {
  const userCrew = CREWS.find((c) => c.id === userCrewId) || CREWS[0];

  return (
    <div className="py-6 max-w-6xl mx-auto px-4">
      {/* Header Profile Card */}
      <div className="bg-mh-navy border border-mh-border rounded-xl p-6 md:p-8 mb-6 shadow-2xl relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-mh-card border border-mh-border flex items-center justify-center text-3xl shadow-inner">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-3xl md:text-4xl font-black text-white uppercase tracking-wide">
                  {profile.name}
                </h1>
                <span className="mh-badge bg-mh-primary/20 border border-mh-primary text-mh-primaryGlow text-[10px]">
                  <span>HUNTER LVL {profile.level}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-mh-text2">
                <span>{profile.address}</span>
                <span className="text-mh-primary font-bold">• {userCrew.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right font-mono">
              <span className="text-[10px] uppercase text-mh-text3 block">HUNTER RATING</span>
              <span className="text-2xl font-black text-mh-reward">1,248 ELO</span>
            </div>
            <button
              onClick={() => {
                soundFX.playClick();
                onEnterArena();
              }}
              className="mh-btn text-xs py-2.5 px-4"
            >
              <span className="flex items-center gap-1.5">
                <Swords className="w-4 h-4" /> ENTER ARENA
              </span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-5 border-t border-mh-border/60">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-mh-text3">SEASON 01 LEVEL {profile.level} PROGRESS</span>
            <span className="text-mh-primary font-bold">
              {profile.xp} / {profile.nextLevelXp} XP (76.8%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#07090E] rounded-full border border-mh-border overflow-hidden">
            <div
              className="h-full bg-mh-primary rounded-full transition-all"
              style={{ width: "76.8%" }}
            />
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-mh-card border border-mh-border rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase text-mh-text3 block mb-1">TOTAL BATTLES</span>
          <div className="text-2xl font-black text-white font-mono">{profile.totalBattles}</div>
          <span className="text-[11px] font-mono text-mh-text2">{profile.wins}W - {profile.losses}L ({profile.winRate})</span>
        </div>

        <div className="bg-mh-card border border-mh-border rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase text-mh-text3 block mb-1">BEST WIN STREAK</span>
          <div className="text-2xl font-black text-mh-win font-mono">7 STREAK</div>
          <span className="text-[11px] font-mono text-mh-text2">Current: 4 Consecutive</span>
        </div>

        <div className="bg-mh-card border border-mh-border rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase text-mh-text3 block mb-1">TERRITORIES CONQUERED</span>
          <div className="text-2xl font-black text-mh-reward font-mono">
            {profile.territoriesOwned} / 12 ZONES
          </div>
          <span className="text-[11px] font-mono text-mh-text2">Mumbai Influence leader</span>
        </div>

        <div className="bg-mh-card border border-mh-border rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase text-mh-text3 block mb-1">CREW CONTRIBUTION</span>
          <div className="text-2xl font-black text-mh-primary font-mono">+420 PTS</div>
          <span className="text-[11px] font-mono text-mh-text2">To {userCrew.name}</span>
        </div>
      </div>

      {/* Owned Beasts Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-mh-card rounded border border-mh-border text-[10px] font-mono text-mh-reward uppercase mb-1">
              <span>📕 ON-CHAIN BESTIARY</span>
              <span>•</span>
              <span className="text-mh-win">ERC-721 ROSTER</span>
            </div>
            <h2 className="font-display text-2xl font-black text-white uppercase tracking-wide">
              MY BEAST SQUAD ({MOCK_BEASTS.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_BEASTS.map((beast) => (
            <div
              key={beast.id}
              onClick={() => {
                soundFX.playClick();
                onSelectBeast(beast);
              }}
              className="bg-mh-card rounded-xl border border-mh-border p-4 cursor-pointer hover:border-mh-primary transition-all shadow-md group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono text-mh-text3">#{beast.tokenId}</span>
                  <span className="mh-badge text-[9px] bg-mh-navy border border-mh-border text-mh-reward">
                    <span>{beast.rarity}</span>
                  </span>
                </div>

                <div className="w-24 h-24 mx-auto my-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BeastSvg id={beast.id} className="w-20 h-20" animate={false} />
                </div>

                <div className="font-display text-xl font-black uppercase text-white tracking-wide text-center">
                  {beast.name}
                </div>
                <div className="text-xs font-mono text-mh-text3 text-center mb-3">
                  Level {beast.level} • {beast.element}
                </div>
              </div>

              <div className="bg-[#07090E] p-2 rounded border border-mh-border/60 text-[11px] font-mono flex justify-between">
                <span>ATK: {beast.attack}</span>
                <span>DEF: {beast.defense}</span>
                <span>SPD: {beast.speed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
