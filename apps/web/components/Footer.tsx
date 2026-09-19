"use client";

import React from "react";
import { soundFX } from "@/game/SoundFX";
import { ExternalLink, Shield, Terminal } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-arcade-black text-white border-t-4 border-arcade-black py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="text-2xl">🐲</span>
            <span className="font-black text-2xl tracking-tighter">
              MONAD<span className="text-arcade-electric">HUNT</span>
            </span>
            <span className="text-xs font-black px-2 py-0.5 bg-arcade-yellow text-arcade-black rounded">
              V4 BLITZ
            </span>
          </div>
          <p className="text-xs font-bold text-white/70 max-w-md">
            Catch. Stake. Battle. Conquer. A competitive AI beast arena where victories have real on-chain ownership. Built for Monad Blitz Mumbai V4.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Monad Testnet (Chain ID 10143)</span>
          </div>

          <a
            href="https://testnet.monadexplorer.com"
            target="_blank"
            rel="noreferrer"
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-1 text-arcade-yellow hover:underline"
          >
            Explorer <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://docs.monad.xyz"
            target="_blank"
            rel="noreferrer"
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-1 text-white/80 hover:underline"
          >
            Monad Docs <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 text-center text-[11px] font-mono text-white/50">
        Engineered with isolated smart contracts (BeastNFT, Arena, Territory) • Zero client-side settlement trust.
      </div>
    </footer>
  );
};
