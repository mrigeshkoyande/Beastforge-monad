"use client";

import React from "react";
import Image from "next/image";
import { soundFX } from "@/game/SoundFX";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { CONTRACT_ADDRESSES } from "@/lib/contractAddresses";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#05070B] text-white border-t border-[#1E273D] py-12 px-4 sm:px-8 mt-16 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
            <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center overflow-hidden rounded bg-[#0A0E17] border border-[#1E273D]">
              <Image
                src="/assets/branding/monad-hunt-logo.jpg"
                alt="Monad Hunt"
                width={40}
                height={40}
                className="object-contain filter contrast-125 mix-blend-screen scale-110"
              />
            </div>
            <span className="font-display font-black text-2xl tracking-wider text-white uppercase flex items-center gap-1.5">
              <span>MONAD</span>
              <span className="text-[#E63946]">HUNT</span>
            </span>
            <span className="font-mono text-[10px] font-bold text-[#F4D35E] bg-[#F4D35E]/10 border border-[#F4D35E]/30 px-2 py-0.5 rounded">
              CITY LEAGUE
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] max-w-md leading-relaxed">
            Catch. Stake. Battle. Conquer. A persistent competitive game world where Hunters and their AI Beasts battle for control of Mumbai&apos;s territories on Monad Testnet.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0B0F17] rounded-lg border border-[#1E273D]">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
            <span className="text-[#94A3B8]">Monad Testnet (Chain ID 10143)</span>
          </div>

          <a
            href="https://testnet.monadexplorer.com"
            target="_blank"
            rel="noreferrer"
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-1 text-[#E63946] hover:text-[#FF5B69] font-bold transition-colors"
          >
            Explorer <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://faucet.monad.xyz"
            target="_blank"
            rel="noreferrer"
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-1 text-[#F4D35E] hover:underline font-bold transition-colors"
          >
            Faucet <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://docs.monad.xyz"
            target="_blank"
            rel="noreferrer"
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-1 text-[#94A3B8] hover:text-white transition-colors"
          >
            Docs <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto mt-8 pt-6 border-t border-[#1E273D]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#64748B] gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
          <span>HuntCore: {CONTRACT_ADDRESSES.HUNT_CORE.slice(0, 8)}...{CONTRACT_ADDRESSES.HUNT_CORE.slice(-6)} · EIP-712 Settlement Verified</span>
        </div>
        <div>
          <span>MONAD HUNT: CITY LEAGUE © 2026. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
