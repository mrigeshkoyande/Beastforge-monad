"use client";

import React from "react";
import { soundFX } from "@/game/SoundFX";
import { ExternalLink, ShieldCheck, Terminal } from "lucide-react";
import { CONTRACT_ADDRESSES } from "@/lib/contractAddresses";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-mh-navy text-mh-text border-t border-mh-border py-10 px-4 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5 mb-2">
            <span className="text-2xl">🐲</span>
            <span className="font-display font-black text-2xl tracking-wider text-white uppercase">
              MONAD<span className="text-mh-primary">HUNT</span>
            </span>
            <span className="mh-badge bg-mh-card border border-mh-border text-mh-reward text-[10px]">
              <span>CITY LEAGUE</span>
            </span>
          </div>
          <p className="text-xs text-mh-text2 max-w-md">
            Catch. Stake. Battle. Conquer. A persistent competitive game world where Hunters and their Beasts battle for control of Mumbai&apos;s territories on Monad Testnet.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-mh-card rounded border border-mh-border">
            <span className="w-2 h-2 rounded-full bg-mh-win animate-pulse" />
            <span>Monad Testnet (Chain ID 10143)</span>
          </div>

          <a
            href="https://testnet.monadexplorer.com"
            target="_blank"
            rel="noreferrer"
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-1 text-mh-primary hover:text-mh-primaryGlow font-bold"
          >
            Explorer <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://faucet.monad.xyz"
            target="_blank"
            rel="noreferrer"
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-1 text-mh-reward hover:underline font-bold"
          >
            Faucet <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://docs.monad.xyz"
            target="_blank"
            rel="noreferrer"
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-1 text-mh-text2 hover:text-white"
          >
            Docs <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-mh-border/50 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-mh-text3 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-mh-win" />
          <span>HuntCore: {CONTRACT_ADDRESSES.HUNT_CORE.slice(0, 8)}...{CONTRACT_ADDRESSES.HUNT_CORE.slice(-6)} • EIP-712 Settlement Verified</span>
        </div>
        <div>
          <span>MONAD HUNT: CITY LEAGUE © 2026. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
