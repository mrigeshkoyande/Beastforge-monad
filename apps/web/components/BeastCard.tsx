"use client";

import React from "react";
import { Beast } from "@/data/mockData";
import { BeastSvg } from "./BeastSvg";
import { soundFX } from "@/game/SoundFX";
import { Swords, Eye, Zap, Shield, Flame } from "lucide-react";

interface BeastCardProps {
  beast: Beast;
  isSelected?: boolean;
  onSelect?: (beast: Beast) => void;
  onViewDetails?: (beast: Beast) => void;
}

export const BeastCard: React.FC<BeastCardProps> = ({
  beast,
  isSelected,
  onSelect,
  onViewDetails,
}) => {
  const getRarityBadge = (rarity: Beast["rarity"]) => {
    switch (rarity) {
      case "LEGENDARY":
        return "bg-arcade-coral text-arcade-black border-2 border-arcade-black";
      case "EPIC":
        return "bg-arcade-purple text-arcade-black border-2 border-arcade-black";
      case "RARE":
        return "bg-arcade-mint text-arcade-black border-2 border-arcade-black";
      default:
        return "bg-arcade-yellow text-arcade-black border-2 border-arcade-black";
    }
  };

  return (
    <div
      className={`arcade-card bg-white p-5 flex flex-col justify-between transition-all duration-200 ${
        isSelected ? "ring-4 ring-arcade-electric translate-y-[-4px]" : "hover:-translate-y-1"
      }`}
    >
      {/* Top Bar: Token ID & Rarity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[11px] font-black px-2 py-0.5 bg-warm-200 rounded-md border-2 border-arcade-black">
            NFT #{String(beast.tokenId).padStart(3, "0")}
          </span>
          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-arcade-sm ${getRarityBadge(beast.rarity)}`}>
            {beast.rarity}
          </span>
        </div>

        {/* Beast SVG Showcase */}
        <div
          onClick={() => onViewDetails?.(beast)}
          className="relative bg-warm-100 rounded-2xl border-3 border-arcade-black p-4 flex items-center justify-center cursor-pointer group mb-4 overflow-hidden"
        >
          <div className="absolute top-2 left-2 flex items-center gap-1 text-[11px] font-black px-2 py-0.5 bg-white rounded-md border border-arcade-black">
            <span>LVL {beast.level}</span>
          </div>
          <div className="absolute top-2 right-2 text-[11px] font-black px-2 py-0.5 bg-white rounded-md border border-arcade-black flex items-center gap-1">
            <Flame className="w-3 h-3 text-red-500" />
            {beast.element}
          </div>

          <BeastSvg id={beast.id} className="w-36 h-36 group-hover:scale-105 transition-transform" />
        </div>

        {/* Beast Name & Title */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-arcade-black tracking-tight">{beast.name}</h3>
            <span className="text-xs font-black text-arcade-electric px-2 py-0.5 bg-blue-50 rounded border border-arcade-electric">
              {beast.winRate}% WR
            </span>
          </div>
          <p className="text-xs font-bold text-arcade-black/60 truncate">{beast.title}</p>
        </div>

        {/* Stat Bars */}
        <div className="space-y-2 mb-5">
          {/* Attack */}
          <div>
            <div className="flex justify-between text-[11px] font-black text-arcade-black mb-0.5">
              <span>ATTACK</span>
              <span>{beast.attack}</span>
            </div>
            <div className="h-2.5 bg-warm-200 rounded-full border border-arcade-black overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{ width: `${Math.min(100, (beast.attack / 100) * 100)}%` }}
              />
            </div>
          </div>

          {/* Defense */}
          <div>
            <div className="flex justify-between text-[11px] font-black text-arcade-black mb-0.5">
              <span>DEFENSE</span>
              <span>{beast.defense}</span>
            </div>
            <div className="h-2.5 bg-warm-200 rounded-full border border-arcade-black overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(100, (beast.defense / 100) * 100)}%` }}
              />
            </div>
          </div>

          {/* Speed */}
          <div>
            <div className="flex justify-between text-[11px] font-black text-arcade-black mb-0.5">
              <span>SPEED</span>
              <span>{beast.speed}</span>
            </div>
            <div className="h-2.5 bg-warm-200 rounded-full border border-arcade-black overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${Math.min(100, (beast.speed / 100) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-arcade-black/10">
        <button
          onClick={() => {
            soundFX.playClick();
            onViewDetails?.(beast);
          }}
          className="arcade-btn py-2 px-3 bg-warm-200 text-arcade-black rounded-xl text-xs flex items-center justify-center gap-1"
        >
          <Eye className="w-3.5 h-3.5" />
          DETAILS
        </button>

        <button
          onClick={() => {
            soundFX.playAttack();
            onSelect?.(beast);
          }}
          className={`arcade-btn py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1 ${
            isSelected
              ? "bg-emerald-400 text-arcade-black font-black"
              : "bg-arcade-electric text-white font-black"
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          {isSelected ? "READY" : "SELECT"}
        </button>
      </div>
    </div>
  );
};
