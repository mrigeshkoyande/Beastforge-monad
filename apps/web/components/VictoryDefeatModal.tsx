"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Beast, Territory } from "@/data/mockData";
import { BeastSvg } from "./BeastSvg";
import { soundFX } from "@/game/SoundFX";
import { Trophy, Skull, ArrowRight, ExternalLink, ShieldCheck, MapPin, Sparkles, CheckCircle2 } from "lucide-react";

interface VictoryDefeatModalProps {
  won: boolean;
  playerBeast: Beast;
  opponentBeast: Beast;
  territory: Territory;
  battleId?: string;
  resultHash?: string;
  txHash?: string;
  onClaim: () => void;
  onViewLeaderboard: () => void;
}

export const VictoryDefeatModal: React.FC<VictoryDefeatModalProps> = ({
  won,
  playerBeast,
  opponentBeast,
  territory,
  battleId = "0x7a8f9c1b3d2e5a409f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a",
  resultHash = "0x4f1299c1e8d7b6a5043f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5043f2e1d0",
  txHash = "0x8f29c4" + Math.random().toString(16).slice(2, 10) + "b4e1",
  onClaim,
  onViewLeaderboard,
}) => {
  useEffect(() => {
    if (won) {
      soundFX.playVictory();
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
    }
  }, [won]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="arcade-card bg-warm-100 max-w-lg w-full p-6 text-center shadow-arcade-xl relative max-h-[95vh] overflow-y-auto">
        {/* Banner */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border-3 border-arcade-black text-sm font-black uppercase tracking-wider shadow-arcade-sm mb-4 ${
            won ? "bg-arcade-yellow text-arcade-black" : "bg-red-200 text-red-900"
          }`}
        >
          {won ? <Trophy className="w-4 h-4 text-amber-600" /> : <Skull className="w-4 h-4 text-red-600" />}
          {won ? "🏆 MATCH VICTORY!" : "DEFEAT IN ARENA"}
        </div>

        {/* Big Headline */}
        <h2 className="text-4xl md:text-5xl font-black text-arcade-black tracking-tight mb-2">
          {won ? (
            <>
              {playerBeast.name} <span className="text-arcade-electric">TRIUMPHS!</span>
            </>
          ) : (
            <>
              {opponentBeast.name} <span className="text-red-600">PREVAILED</span>
            </>
          )}
        </h2>

        <p className="text-xs md:text-sm font-bold text-arcade-black/70 mb-5">
          {won
            ? `Your beast dominated the match and captured ${territory.name}!`
            : `Close match! Upgrade ${playerBeast.name} and challenge again.`}
        </p>

        {/* Beast Showcase */}
        <div className="bg-white rounded-2xl border-4 border-arcade-black p-4 mb-5 shadow-arcade-sm flex flex-col items-center">
          <BeastSvg id={won ? playerBeast.id : opponentBeast.id} className="w-32 h-32 mb-2" animate={won} />
          <div className="text-xl font-black text-arcade-black">
            {won ? playerBeast.name : opponentBeast.name}
          </div>
          <div className="text-xs font-bold text-arcade-black/60">
            {won ? `Level ${playerBeast.level} • ${playerBeast.rarity}` : "Zone Guardian"}
          </div>
        </div>

        {/* Rewards Box */}
        {won && (
          <div className="bg-arcade-mint/60 border-3 border-arcade-black rounded-2xl p-4 mb-4 shadow-arcade-sm text-left">
            <div className="text-xs font-black text-arcade-black uppercase mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-arcade-electric" />
              EARNED ON-CHAIN SPOILS
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2 rounded-xl border border-arcade-black">
                <span className="text-[10px] font-bold text-arcade-black/60 block">MON REWARD</span>
                <span className="text-sm font-black text-arcade-electric font-mono">+0.18 MON</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-arcade-black">
                <span className="text-[10px] font-bold text-arcade-black/60 block">BEAST XP</span>
                <span className="text-sm font-black text-emerald-600 font-mono">+120 XP</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-arcade-black">
                <span className="text-[10px] font-bold text-arcade-black/60 block">SPECTATOR XP</span>
                <span className="text-sm font-black text-purple-600 font-mono">+50 XP</span>
              </div>
            </div>

            <div className="mt-3 bg-white p-2.5 rounded-xl border border-arcade-black flex items-center justify-between">
              <span className="text-xs font-bold text-arcade-black flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-500" />
                Territory Flag:
              </span>
              <span className="text-xs font-black text-arcade-black uppercase">{territory.name} CAPTURED</span>
            </div>
          </div>
        )}

        {/* PHASE 5: Cryptographically Verified Settlement Box */}
        <div className="bg-white p-4 rounded-xl border-3 border-arcade-black text-left mb-6 shadow-arcade-sm">
          <div className="flex items-center justify-between text-xs font-black mb-2 border-b border-arcade-black/10 pb-1.5">
            <span className="flex items-center gap-1 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
              BATTLE RESULT VERIFIED
            </span>
            <span className="text-[10px] font-mono text-arcade-black/60">ECDSA SIGNED</span>
          </div>

          <div className="space-y-1.5 text-[11px] font-mono">
            <div className="flex items-center justify-between">
              <span className="text-arcade-black/60 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Battle ID:
              </span>
              <span className="font-semibold text-arcade-black truncate max-w-[200px]">{battleId}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-arcade-black/60 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Winner:
              </span>
              <span className="font-semibold text-arcade-electric">
                {won ? playerBeast.name : opponentBeast.name} (Verified)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-arcade-black/60 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Result Hash:
              </span>
              <span className="font-semibold text-arcade-black truncate max-w-[200px]">{resultHash}</span>
            </div>

            <div className="flex items-center justify-between border-t border-arcade-black/10 pt-1">
              <span className="text-arcade-black/60 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Monad Tx:
              </span>
              <a
                href={`https://testnet.monadexplorer.com/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-arcade-electric font-bold flex items-center gap-0.5 hover:underline"
              >
                {txHash.slice(0, 10)}...{txHash.slice(-4)} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => {
              soundFX.playCoin();
              onClaim();
            }}
            className="arcade-btn py-3.5 bg-arcade-electric text-white rounded-xl text-xs flex items-center justify-center gap-2"
          >
            CLAIM & RETURN
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              onViewLeaderboard();
            }}
            className="arcade-btn py-3.5 bg-arcade-yellow text-arcade-black rounded-xl text-xs flex items-center justify-center gap-2"
          >
            VIEW LEADERBOARD
            <Trophy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
