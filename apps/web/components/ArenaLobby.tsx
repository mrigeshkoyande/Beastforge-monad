"use client";

import React, { useState } from "react";
import { Beast, Territory } from "@/data/mockData";
import { BeastSvg } from "./BeastSvg";
import { soundFX } from "@/game/SoundFX";
import { Swords, Zap, Shield, Flame, Sparkles, MapPin, Eye, ArrowRight } from "lucide-react";

interface ArenaLobbyProps {
  playerBeast: Beast;
  opponentBeast: Beast;
  territory: any;
  onChangeBeast: () => void;
  onChangeTerritory: () => void;
  onStartBattle: () => void;
}

export const ArenaLobby: React.FC<ArenaLobbyProps> = ({
  playerBeast,
  opponentBeast,
  territory,
  onChangeBeast,
  onChangeTerritory,
  onStartBattle,
}) => {
  return (
    <div className="py-6 max-w-6xl mx-auto px-4">
      {/* Lobby Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-mh-card rounded border border-mh-border text-xs font-mono font-bold text-mh-reward uppercase mb-2">
          <Swords className="w-3.5 h-3.5 text-mh-reward" />
          ARENA MATCHUP LOBBY · {territory.name}
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-black text-white uppercase tracking-wider leading-none mb-3">
          CHALLENGE <span className="text-mh-primary">{territory.name}</span>
        </h1>
        <p className="text-xs md:text-sm text-mh-text2">
          Lock in your beast, confirm proving ground parameters, and battle for territorial dominance on Monad.
        </p>
      </div>

      {/* Versus Grid */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center mb-8">
        {/* Player Beast Card */}
        <div className="md:col-span-5 bg-mh-navy rounded-xl border border-mh-border p-6 relative shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="mh-badge bg-mh-primary/20 text-mh-primaryGlow border border-mh-primary text-[10px]">
              <span>YOUR FIGHTER</span>
            </span>
            <button
              onClick={onChangeBeast}
              className="text-xs font-mono text-mh-primary hover:text-mh-primaryGlow font-bold flex items-center gap-1"
            >
              CHANGE BEAST →
            </button>
          </div>

          <div className="flex flex-col items-center bg-mh-card rounded-xl border border-mh-border p-4 mb-4 shadow-inner">
            <BeastSvg id={playerBeast.id} className="w-32 h-32 mb-2" />
            <div className="font-display text-2xl font-black text-white uppercase tracking-wide">{playerBeast.name}</div>
            <div className="text-xs font-mono text-mh-text3">
              Level {playerBeast.level} • {playerBeast.rarity}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2 bg-[#07090E] rounded border border-mh-border">
              <div className="text-[10px] text-mh-text3">ATTACK</div>
              <div className="text-white font-bold">{playerBeast.attack}</div>
            </div>
            <div className="p-2 bg-[#07090E] rounded border border-mh-border">
              <div className="text-[10px] text-mh-text3">DEFENSE</div>
              <div className="text-white font-bold">{playerBeast.defense}</div>
            </div>
            <div className="p-2 bg-[#07090E] rounded border border-mh-border">
              <div className="text-[10px] text-mh-text3">SPEED</div>
              <div className="text-white font-bold">{playerBeast.speed}</div>
            </div>
          </div>
        </div>

        {/* VS Center Pillar */}
        <div className="md:col-span-1 text-center flex flex-col items-center justify-center">
          <div className="font-display text-4xl font-black text-mh-live tracking-widest my-2">
            VS
          </div>
        </div>

        {/* Opponent Beast Card */}
        <div className="md:col-span-5 bg-mh-navy rounded-xl border border-mh-border p-6 relative shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="mh-badge bg-mh-live/20 text-mh-live border border-mh-live text-[10px]">
              <span>ZONE GUARDIAN</span>
            </span>
            <button
              onClick={onChangeTerritory}
              className="text-xs font-mono text-mh-reward hover:underline font-bold flex items-center gap-1"
            >
              CHANGE ZONE →
            </button>
          </div>

          <div className="flex flex-col items-center bg-mh-card rounded-xl border border-mh-border p-4 mb-4 shadow-inner">
            <BeastSvg id={opponentBeast.id} className="w-32 h-32 mb-2" />
            <div className="font-display text-2xl font-black text-white uppercase tracking-wide">{opponentBeast.name}</div>
            <div className="text-xs font-mono text-mh-text3">
              Level {opponentBeast.level} • {opponentBeast.rarity}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2 bg-[#07090E] rounded border border-mh-border">
              <div className="text-[10px] text-mh-text3">ATTACK</div>
              <div className="text-white font-bold">{opponentBeast.attack}</div>
            </div>
            <div className="p-2 bg-[#07090E] rounded border border-mh-border">
              <div className="text-[10px] text-mh-text3">DEFENSE</div>
              <div className="text-white font-bold">{opponentBeast.defense}</div>
            </div>
            <div className="p-2 bg-[#07090E] rounded border border-mh-border">
              <div className="text-[10px] text-mh-text3">SPEED</div>
              <div className="text-white font-bold">{opponentBeast.speed}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="text-center">
        <button
          onClick={onStartBattle}
          className="mh-btn text-base py-4 px-10 shadow-mh-glow"
        >
          <span className="flex items-center gap-2">
            <Swords className="w-5 h-5" /> COMMENCE PROVING GROUND BATTLE
          </span>
        </button>
      </div>
    </div>
  );
};
