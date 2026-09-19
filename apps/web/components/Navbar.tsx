"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { soundFX } from "@/game/SoundFX";
import {
  Home,
  Swords,
  MapPin,
  Trophy,
  Users,
  Tv,
  User,
  Wallet,
  Menu,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  walletConnected: boolean;
  walletAddress?: string;
  monBalance?: string;
  onConnectWallet: (connect: boolean) => void;
  isDemoMode?: boolean;
  onToggleDemoMode?: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  walletConnected,
  walletAddress,
  monBalance = "0.00 MON",
  onConnectWallet,
  isDemoMode = true,
  onToggleDemoMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.enabled = next;
    if (next) soundFX.playClick();
  };

  const handleNav = (tab: string) => {
    soundFX.playClick();
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "0x71C9...8A2F";

  const navLinks = [
    { id: "landing", label: "HOME", icon: Home },
    { id: "arena", label: "ARENA", icon: Swords },
    { id: "map", label: "MAP", icon: MapPin },
    { id: "leaderboard", label: "LEADERBOARDS", icon: Trophy },
    { id: "crews", label: "CREWS", icon: Users },
    { id: "tv", label: "HUNT TV", icon: Tv },
    { id: "profile", label: "PROFILE", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#05070B]/90 backdrop-blur-xl border-b border-[#1E273D]/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        {/* Brand with Official Logo Asset */}
        <div
          onClick={() => handleNav("landing")}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center overflow-hidden rounded bg-[#0A0E17] border border-[#1E273D] group-hover:border-[#E63946] transition-colors">
            <Image
              src="/assets/branding/monad-hunt-logo.jpg"
              alt="Monad Hunt"
              width={44}
              height={44}
              className="object-contain filter contrast-125 mix-blend-screen scale-110"
              priority
            />
          </div>
          <div>
            <div className="font-display font-black text-xl sm:text-2xl tracking-wider uppercase text-white leading-none flex items-center gap-1.5">
              <span>MONAD</span>
              <span className="text-[#E63946] drop-shadow-[0_0_10px_rgba(230,57,70,0.8)]">HUNT</span>
            </div>
            <div className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase flex items-center gap-1.5 mt-0.5">
              <span>CITY LEAGUE</span>
              <span className="text-[#E63946] font-bold">·</span>
              <span className="text-[#F4D35E]">SEASON 01</span>
            </div>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-3">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative px-3 py-2 text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "text-white"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors ${
                    isActive ? "text-[#E63946]" : "text-[#64748B]"
                  }`}
                />
                <span>{item.label}</span>

                {/* Red Active Glow Underline Indicator matching reference */}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#E63946] shadow-[0_0_10px_#E63946] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Monad Testnet Live Status Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-[#0B101B] border border-[#1E273D] px-3 py-1.5 rounded-full text-xs font-mono text-[#94A3B8]">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_8px_#00E676]" />
            <span className="font-semibold text-white tracking-wider">MONAD TESTNET</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-[#0E1422] border border-[#1E273D] text-[#94A3B8] hover:text-white hover:border-[#E63946]/50 transition-all"
            title="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#F4D35E]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Connect Wallet / Connected State */}
          {walletConnected ? (
            <div className="flex items-center gap-2 bg-[#0E1422] border border-[#E63946]/50 px-3.5 py-1.5 rounded text-left font-mono">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-ping" />
              <div>
                <div className="text-xs font-bold text-white leading-none">{displayAddress}</div>
                <div className="text-[10px] text-[#F4D35E] font-bold mt-0.5">{monBalance}</div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                soundFX.playClick();
                onConnectWallet(true);
              }}
              className="relative group px-4 sm:px-6 py-2 rounded font-display font-black text-xs sm:text-sm uppercase tracking-wider text-white transition-all bg-gradient-to-r from-[#E63946] via-[#B2182B] to-[#8B1E2D] shadow-[0_0_20px_rgba(230,57,70,0.4)] hover:shadow-[0_0_30px_rgba(230,57,70,0.7)] hover:scale-[1.02] active:scale-[0.98] border border-[#FF4D5B]/50"
            >
              <span className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                <span>CONNECT WALLET</span>
              </span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-[#0E1422] border border-[#1E273D] text-[#94A3B8] hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-3 pt-3 border-t border-[#1E273D] bg-[#05070B] rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E273D] text-xs font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00E676]" />
              MONAD TESTNET
            </span>
            {onToggleDemoMode && (
              <button
                onClick={() => onToggleDemoMode(!isDemoMode)}
                className="text-[10px] uppercase font-bold text-[#F4D35E]"
              >
                MODE: {isDemoMode ? "SIMULATED" : "LIVE"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`p-2.5 rounded text-left font-mono text-xs font-bold flex items-center gap-2 border transition-all ${
                    isActive
                      ? "bg-[#E63946]/20 border-[#E63946] text-white"
                      : "bg-[#0B0F17] border-[#1E273D] text-[#94A3B8] hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#E63946]" : "text-[#64748B]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
