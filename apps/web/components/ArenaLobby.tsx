"use client";

import React, { useState } from "react";
import { Beast, Territory } from "@/data/mockData";
import { BeastSvg } from "./BeastSvg";
import { soundFX } from "@/game/SoundFX";
import { Swords, Zap, Shield, Flame, Sparkles, MapPin, Eye, ArrowRight } from "lucide-react";

interface ArenaLobbyProps {
  playerBeast: Beast;
  opponentBeast: Beast;
  territory: Territory;
  onChangeBeast: () => void;
  onChangeTerritory: () => void;
  onStartBattle: () => void;
  onQuickMatch?: () => void;
}

export const ArenaLobby: React.FC<ArenaLobbyProps> = ({
  playerBeast,
  opponentBeast,
  territory,
  onChangeBeast,
  onChangeTerritory,
  onStartBattle,
  onQuickMatch,
}) => {
  const [predictedWinner, setPredictedWinner] = useState<string>("player");
  const [predictionPlaced, setPredictionPlaced] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<"CASUAL" | "ARENA" | "CHAMPIONSHIP">("ARENA");
  const [isSearchingMatch, setIsSearchingMatch] = useState<boolean>(false);

  const handlePredict = (target: "player" | "opponent") => {
    soundFX.playClick();
    setPredictedWinner(target);
    setPredictionPlaced(true);
  };

  const handleTriggerMatchmaking = () => {
    soundFX.playAttack();
    setIsSearchingMatch(true);
    setTimeout(() => {
      setIsSearchingMatch(false);
      onStartBattle();
    }, 1200);
  };

  return (
    <div className="py-8 max-w-6xl mx-auto px-4">
      {/* Matchmaking & Game Mode Tier Banner (Inspired by Fluffy Fate / Buckshot Game Architecture) */}
      <div className="bg-arcade-black text-white p-4 rounded-2xl border-4 border-arcade-black mb-6 shadow-arcade-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-arcade-coral border-2 border-white flex items-center justify-center font-black text-lg text-black">
            ⚡
          </div>
          <div>
            <div className="text-xs font-black text-arcade-yellow uppercase tracking-widest">
              AUTONOMOUS MATCHMAKING POOL
            </div>
            <div className="text-sm font-bold text-slate-200">
              Queue into Monad Proving Grounds against autonomous AI archetypes
            </div>
          </div>
        </div>

        {/* Game Tier Selector */}
        <div className="flex items-center gap-2">
          {[
            { id: "CASUAL", label: "CASUAL (FREE)", fee: "0.00 MON" },
            { id: "ARENA", label: "ARENA (TESTNET)", fee: "0.10 MON" },
            { id: "CHAMPIONSHIP", label: "CHAMPIONSHIP", fee: "0.25 MON" },
          ].map((tier) => (
            <button
              key={tier.id}
              onClick={() => {
                soundFX.playClick();
                setSelectedTier(tier.id as "CASUAL" | "ARENA" | "CHAMPIONSHIP");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase border transition-all ${
                selectedTier === tier.id
                  ? "bg-arcade-yellow text-arcade-black border-white shadow-arcade-sm"
                  : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lobby Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-arcade-coral rounded-lg border-2 border-arcade-black text-[11px] font-black uppercase tracking-wider shadow-arcade-sm mb-2">
          <Swords className="w-3.5 h-3.5" />
          ARENA MATCHUP LOBBY
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-arcade-black tracking-tight leading-none mb-3">
          CHALLENGE <span className="text-arcade-electric">{territory.name}</span>
        </h1>
        <p className="text-sm md:text-base font-bold text-arcade-black/70">
          Lock in your beast, place your spectator prediction, stake {selectedTier === "CASUAL" ? "0 MON" : selectedTier === "ARENA" ? "0.10 MON" : "0.25 MON"}, and claim glory on Monad.
        </p>
      </div>

      {/* Versus Grid */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center mb-8">
        {/* Player Beast Card */}
        <div className="md:col-span-5 arcade-card bg-white p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black px-2.5 py-1 bg-arcade-mint rounded-lg border-2 border-arcade-black uppercase shadow-arcade-sm">
              YOUR FIGHTER
            </span>
            <button
              onClick={onChangeBeast}
              className="text-xs font-black text-arcade-electric hover:underline flex items-center gap-1"
            >
              CHANGE BEAST →
            </button>
          </div>

          <div className="flex flex-col items-center bg-warm-100 rounded-2xl border-3 border-arcade-black p-4 mb-4">
            <BeastSvg id={playerBeast.id} className="w-32 h-32 mb-2" />
            <div className="text-2xl font-black text-arcade-black">{playerBeast.name}</div>
            <div className="text-xs font-bold text-arcade-black/60">
              Level {playerBeast.level} • {playerBeast.rarity}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
            <div className="p-2 bg-warm-200 rounded-lg border border-arcade-black">
              <div className="text-[10px] text-arcade-black/60">ATTACK</div>
              <div>{playerBeast.attack}</div>
            </div>
            <div className="p-2 bg-warm-200 rounded-lg border border-arcade-black">
              <div className="text-[10px] text-arcade-black/60">DEFENSE</div>
              <div>{playerBeast.defense}</div>
            </div>
            <div className="p-2 bg-warm-200 rounded-lg border border-arcade-black">
              <div className="text-[10px] text-arcade-black/60">SPEED</div>
              <div>{playerBeast.speed}</div>
            </div>
          </div>
        </div>

        {/* Center VS Badge */}
        <div className="md:col-span-1 flex flex-col items-center justify-center">
          <div className="w-14 h-14 bg-arcade-black rounded-2xl border-3 border-white text-white font-black text-xl flex items-center justify-center shadow-arcade">
            VS
          </div>
        </div>

        {/* Opponent Beast Card */}
        <div className="md:col-span-5 arcade-card bg-warm-100 p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black px-2.5 py-1 bg-arcade-coral rounded-lg border-2 border-arcade-black uppercase shadow-arcade-sm">
              ZONE GUARDIAN
            </span>
            <button
              onClick={onChangeTerritory}
              className="text-xs font-black text-arcade-electric hover:underline flex items-center gap-1"
            >
              CHANGE ZONE →
            </button>
          </div>

          <div className="flex flex-col items-center bg-white rounded-2xl border-3 border-arcade-black p-4 mb-4">
            <BeastSvg id={opponentBeast.id} className="w-32 h-32 mb-2" />
            <div className="text-2xl font-black text-arcade-black">{opponentBeast.name}</div>
            <div className="text-xs font-bold text-arcade-black/60">
              Level {opponentBeast.level} • AI {opponentBeast.personality}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
            <div className="p-2 bg-white rounded-lg border border-arcade-black">
              <div className="text-[10px] text-arcade-black/60">ATTACK</div>
              <div>{opponentBeast.attack}</div>
            </div>
            <div className="p-2 bg-white rounded-lg border border-arcade-black">
              <div className="text-[10px] text-arcade-black/60">DEFENSE</div>
              <div>{opponentBeast.defense}</div>
            </div>
            <div className="p-2 bg-white rounded-lg border border-arcade-black">
              <div className="text-[10px] text-arcade-black/60">SPEED</div>
              <div>{opponentBeast.speed}</div>
            </div>
          </div>
        </div>
      </div>

      {/* KILLER FEATURE: Live Spectator Battle Prediction */}
      <div className="arcade-card bg-arcade-yellow p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            <div>
              <h3 className="text-lg font-black text-arcade-black">LIVE ARENA PREDICTION</h3>
              <p className="text-xs font-bold text-arcade-black/70">
                Predict the winner before combat starts to earn +50 Spectator XP & Leaderboard reputation!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePredict("player")}
              className={`arcade-btn px-4 py-2 rounded-xl text-xs flex items-center gap-2 ${
                predictedWinner === "player"
                  ? "bg-arcade-electric text-white"
                  : "bg-white text-arcade-black"
              }`}
            >
              <span>BET {playerBeast.name}</span>
              <span className="px-1.5 py-0.5 bg-black/20 rounded text-[10px] font-mono">72%</span>
            </button>

            <button
              onClick={() => handlePredict("opponent")}
              className={`arcade-btn px-4 py-2 rounded-xl text-xs flex items-center gap-2 ${
                predictedWinner === "opponent"
                  ? "bg-arcade-electric text-white"
                  : "bg-white text-arcade-black"
              }`}
            >
              <span>BET {opponentBeast.name}</span>
              <span className="px-1.5 py-0.5 bg-black/20 rounded text-[10px] font-mono">28%</span>
            </button>
          </div>
        </div>

        {predictionPlaced && (
          <div className="text-xs font-black text-center bg-white py-2 px-4 rounded-xl border-2 border-arcade-black animate-in fade-in">
            🎯 Prediction locked for {predictedWinner === "player" ? playerBeast.name : opponentBeast.name}! +50 XP on match conclusion.
          </div>
        )}
      </div>

      {/* Staking & Launch Bar */}
      <div className="arcade-card bg-white p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs font-black text-arcade-black/60 uppercase block">ENTRY STAKE</span>
            <div className="text-2xl font-black text-arcade-black font-mono">0.10 MON</div>
          </div>
          <div className="h-8 w-0.5 bg-arcade-black/20 hidden md:block" />
          <div>
            <span className="text-xs font-black text-arcade-black/60 uppercase block">POTENTIAL PAYOUT</span>
            <div className="text-2xl font-black text-arcade-electric font-mono">0.18 MON (+120 XP)</div>
          </div>
          <div className="h-8 w-0.5 bg-arcade-black/20 hidden md:block" />
          <div>
            <span className="text-xs font-black text-arcade-black/60 uppercase block">ZONE STAKE</span>
            <div className="text-sm font-black text-arcade-black flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              {territory.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleTriggerMatchmaking}
            disabled={isSearchingMatch}
            className="arcade-btn w-full md:w-auto px-6 py-4 bg-arcade-yellow text-arcade-black rounded-2xl text-base font-black flex items-center justify-center gap-2 shadow-arcade hover:scale-105"
          >
            <Sparkles className="w-5 h-5 text-amber-700" />
            {isSearchingMatch ? "MATCHMAKING..." : "⚡ FIND MATCH"}
          </button>

          <button
            onClick={() => {
              soundFX.playSpecial();
              onStartBattle();
            }}
            className="arcade-btn w-full md:w-auto px-8 py-4 bg-arcade-electric text-white rounded-2xl text-base flex items-center justify-center gap-2 shadow-arcade hover:scale-105"
          >
            <Swords className="w-5 h-5" />
            START BATTLE
          </button>
        </div>
      </div>
    </div>
  );
};
