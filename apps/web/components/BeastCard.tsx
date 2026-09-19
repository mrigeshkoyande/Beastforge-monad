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
        return "bg-mh-live/20 text-mh-live border-mh-live";
      case "EPIC":
        return "bg-mh-primary/20 text-mh-primaryGlow border-mh-primary";
      case "RARE":
        return "bg-mh-defend/20 text-mh-defend border-mh-defend";
      default:
        return "bg-mh-card text-mh-reward border-mh-border";
    }
  };

  return (
    <div
      className={`bg-mh-navy rounded-xl border p-5 flex flex-col justify-between transition-all duration-200 ${
        isSelected ? "border-mh-primary shadow-mh-glow" : "border-mh-border hover:border-mh-primary/60"
      }`}
    >
      {/* Top Bar: Token ID & Rarity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-mh-card rounded border border-mh-border text-mh-text2">
            NFT #{String(beast.tokenId).padStart(3, "0")}
          </span>
          <span className={`mh-badge text-[10px] border ${getRarityBadge(beast.rarity)}`}>
            <span>{beast.rarity}</span>
          </span>
        </div>

        {/* Beast SVG Showcase */}
        <div
          onClick={() => onViewDetails?.(beast)}
          className="relative bg-mh-card rounded-xl border border-mh-border p-4 flex items-center justify-center cursor-pointer group mb-4 overflow-hidden shadow-inner"
        >
          <div className="absolute top-2 left-2 flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 bg-mh-navy rounded border border-mh-border text-white">
            <span>LVL {beast.level}</span>
          </div>
          <div className="absolute top-2 right-2 text-[11px] font-mono font-bold px-2 py-0.5 bg-mh-navy rounded border border-mh-border flex items-center gap-1 text-mh-reward">
            <Flame className="w-3 h-3 text-mh-live" />
            {beast.element}
          </div>

          <BeastSvg id={beast.id} className="w-32 h-32 group-hover:scale-105 transition-transform" />
        </div>

        {/* Beast Name & Title */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl font-black text-white uppercase tracking-wide">{beast.name}</h3>
            <span className="text-xs font-mono font-bold text-mh-win px-2 py-0.5 bg-mh-win/10 rounded border border-mh-win/30">
              {beast.winRate}% WR
            </span>
          </div>
          <p className="text-xs text-mh-text3 truncate">{beast.title}</p>
        </div>

        {/* Stat Bars */}
        <div className="space-y-2 mb-5 font-mono text-xs">
          <div>
            <div className="flex justify-between text-[11px] text-mh-text2 mb-1">
              <span>ATTACK</span>
              <span className="text-white font-bold">{beast.attack}</span>
            </div>
            <div className="w-full bg-[#07090E] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-mh-live"
                style={{ width: `${(beast.attack / 100) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-mh-text2 mb-1">
              <span>DEFENSE</span>
              <span className="text-white font-bold">{beast.defense}</span>
            </div>
            <div className="w-full bg-[#07090E] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-mh-defend"
                style={{ width: `${(beast.defense / 100) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-mh-text2 mb-1">
              <span>SPEED</span>
              <span className="text-white font-bold">{beast.speed}</span>
            </div>
            <div className="w-full bg-[#07090E] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-mh-reward"
                style={{ width: `${(beast.speed / 100) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            soundFX.playClick();
            onSelect?.(beast);
          }}
          className={`mh-btn text-xs py-2 ${
            isSelected ? "bg-mh-win border-mh-win text-black" : ""
          }`}
        >
          <span>{isSelected ? "ACTIVE BEAST" : "SELECT"}</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            onViewDetails?.(beast);
          }}
          className="mh-btn mh-btn-secondary text-xs py-2"
        >
          <span className="flex items-center justify-center gap-1">
            <Eye className="w-3.5 h-3.5" /> DETAILS
          </span>
        </button>
      </div>
    </div>
  );
};
