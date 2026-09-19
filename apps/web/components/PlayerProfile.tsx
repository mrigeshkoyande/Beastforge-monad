"use client";

import React from "react";
import { MOCK_PROFILE, MOCK_BEASTS, Beast } from "@/data/mockData";
import { BeastSvg } from "./BeastSvg";
import { soundFX } from "@/game/SoundFX";
import { User, Trophy, Swords, MapPin, Zap, Award, Wallet, ShieldCheck, ArrowRight } from "lucide-react";

interface PlayerProfileProps {
  profile?: typeof MOCK_PROFILE;
  onSelectBeast: (beast: Beast) => void;
  onEnterArena: () => void;
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({ profile = MOCK_PROFILE, onSelectBeast, onEnterArena }) => {
  return (
    <div className="py-8 max-w-6xl mx-auto px-4">
      {/* Header Profile Card */}
      <div className="arcade-card bg-white p-6 md:p-8 mb-8 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-arcade-yellow rounded-2xl border-4 border-arcade-black flex items-center justify-center text-4xl shadow-arcade">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl md:text-4xl font-black text-arcade-black tracking-tight">
                  {profile.name}
                </h1>
                <span className="text-xs font-black px-2.5 py-0.5 bg-arcade-electric text-white rounded-md border border-arcade-black">
                  LEVEL {profile.level}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-arcade-black/60">
                <span>{profile.address}</span>
                <span className="text-arcade-electric font-black">• MONAD TESTNET</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-arcade-black/60 block">GLOBAL RANK</span>
              <span className="text-2xl font-black text-arcade-black font-mono">{profile.rank}</span>
            </div>
            <button
              onClick={() => {
                soundFX.playClick();
                onEnterArena();
              }}
              className="arcade-btn py-3 px-5 bg-arcade-electric text-white rounded-xl text-xs flex items-center gap-2"
            >
              <Swords className="w-4 h-4" />
              BATTLE NOW
            </button>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-6 pt-6 border-t-2 border-arcade-black/10">
          <div className="flex justify-between items-center text-xs font-black mb-1.5">
            <span>LEVEL {profile.level} PROGRESS</span>
            <span className="font-mono text-arcade-electric">
              {profile.xp} / {profile.nextLevelXp} XP (76.8%)
            </span>
          </div>
          <div className="w-full h-3 bg-warm-200 rounded-full border-2 border-arcade-black overflow-hidden">
            <div
              className="h-full bg-arcade-electric rounded-full transition-all"
              style={{ width: "76.8%" }}
            />
          </div>
        </div>
      </div>

      {/* 4 Stats Highlights Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="arcade-card bg-arcade-mint p-5">
          <span className="text-[10px] font-black uppercase text-arcade-black/70 block mb-1">TOTAL EARNED</span>
          <div className="text-2xl font-black text-arcade-black font-mono">{profile.earnedMon}</div>
          <span className="text-[11px] font-bold text-arcade-black/70">From arena victories</span>
        </div>

        <div className="arcade-card bg-arcade-yellow p-5">
          <span className="text-[10px] font-black uppercase text-arcade-black/70 block mb-1">WIN RATE</span>
          <div className="text-2xl font-black text-arcade-black font-mono">{profile.winRate}</div>
          <span className="text-[11px] font-bold text-arcade-black/70">
            {profile.wins}W - {profile.losses}L
          </span>
        </div>

        <div className="arcade-card bg-arcade-coral p-5">
          <span className="text-[10px] font-black uppercase text-arcade-black/70 block mb-1">MUMBAI LANDLORD</span>
          <div className="text-2xl font-black text-arcade-black font-mono">
            {profile.territoriesOwned} / 5 ZONES
          </div>
          <span className="text-[11px] font-bold text-arcade-black/70">Collecting passive MON rent</span>
        </div>

        <div className="arcade-card bg-arcade-purple p-5">
          <span className="text-[10px] font-black uppercase text-arcade-black/70 block mb-1">BESTIARY UNLOCKED</span>
          <div className="text-2xl font-black text-arcade-black font-mono">4 / 4 APEX</div>
          <span className="text-[11px] font-bold text-arcade-black/70">100% Collection flex</span>
        </div>
      </div>

      {/* Owned Beasts Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-arcade-yellow rounded border-2 border-arcade-black text-[10px] font-black uppercase shadow-arcade-sm mb-1">
              <span>📕 ON-CHAIN BESTIARY</span>
              <span>•</span>
              <span className="text-emerald-700">VERIFIED METAMASK ROSTER</span>
            </div>
            <h2 className="text-2xl font-black text-arcade-black tracking-tight">
              MY BEAST ROSTER ({MOCK_BEASTS.length})
            </h2>
          </div>
          <span className="text-xs font-bold text-arcade-black/60 hidden sm:block">
            Zero-Escrow: NFTs safely in your wallet
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_BEASTS.slice(0, 3).map((beast) => (
            <div key={beast.id} className="arcade-card bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-warm-200 rounded border border-arcade-black">
                    #{String(beast.tokenId).padStart(3, "0")}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-arcade-yellow rounded border border-arcade-black">
                    {beast.rarity}
                  </span>
                </div>

                <div className="bg-warm-100 rounded-xl border-2 border-arcade-black p-3 flex justify-center mb-3">
                  <BeastSvg id={beast.id} className="w-28 h-28" />
                </div>

                <h3 className="text-xl font-black text-arcade-black">{beast.name}</h3>
                <p className="text-xs font-bold text-arcade-black/60 mb-3">
                  Level {beast.level} • {beast.element} Element
                </p>
              </div>

              <button
                onClick={() => {
                  soundFX.playAttack();
                  onSelectBeast(beast);
                  onEnterArena();
                }}
                className="arcade-btn w-full py-2.5 bg-arcade-electric text-white rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Swords className="w-3.5 h-3.5" />
                SELECT FOR BATTLE
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="arcade-card bg-warm-50 p-6">
        <h3 className="text-xl font-black text-arcade-black mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          EARNED TROPHIES & REPUTATION
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {profile.badges.map((badge, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border-3 border-arcade-black shadow-arcade-sm">
              <div className="text-3xl mb-2">{badge.icon}</div>
              <div className="font-black text-sm text-arcade-black">{badge.title}</div>
              <div className="text-xs font-bold text-arcade-black/60 mt-1">{badge.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
