"use client";

import React, { useState } from "react";
import Link from "next/link";
import { soundFX } from "@/game/SoundFX";
import {
  Volume2,
  VolumeX,
  Wallet,
  MapPin,
  Swords,
  Trophy,
  User,
  Radio,
  Tv,
  Award,
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  walletConnected: boolean;
  walletAddress?: string;
  monBalance?: string;
  onConnectWallet: (connect: boolean) => void;
  isDemoMode: boolean;
  onToggleDemoMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  walletConnected,
  walletAddress,
  monBalance = "0.00 MON",
  onConnectWallet,
  isDemoMode,
  onToggleDemoMode,
}) => {
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
  };

  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "0x71C9...8A2F";

  return (
    <header className="sticky top-0 z-40 bg-mh-navy/90 backdrop-blur-md border-b border-mh-border px-4 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div
          onClick={() => handleNav("landing")}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-10 h-10 bg-mh-primary/20 border border-mh-primary/50 rounded-lg flex items-center justify-center shadow-mh-glow">
            <span className="text-2xl">🐲</span>
          </div>
          <div>
            <div className="font-display font-black text-2xl tracking-wider uppercase text-white leading-none">
              MONAD<span className="text-mh-primary">HUNT</span>
            </div>
            <div className="text-[10px] font-mono tracking-widest text-mh-text3 uppercase flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-mh-win animate-pulse" />
              CITY LEAGUE · SEASON 01
            </div>
          </div>
        </div>

        {/* Center Nav Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <button
            onClick={() => handleNav("arena")}
            className={`mh-btn text-xs py-1.5 px-3.5 ${
              activeTab === "arena" ? "bg-mh-primary text-white" : "mh-btn-secondary"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5" /> Arena
            </span>
          </button>

          <button
            onClick={() => handleNav("map")}
            className={`mh-btn text-xs py-1.5 px-3.5 ${
              activeTab === "map" ? "bg-mh-primary text-white" : "mh-btn-secondary"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Mumbai Map
            </span>
          </button>

          <button
            onClick={() => handleNav("leaderboard")}
            className={`mh-btn text-xs py-1.5 px-3.5 ${
              activeTab === "leaderboard" ? "bg-mh-primary text-white" : "mh-btn-secondary"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" /> Leaderboards
            </span>
          </button>

          <button
            onClick={() => handleNav("tv")}
            className={`mh-btn text-xs py-1.5 px-3.5 ${
              activeTab === "tv" ? "bg-mh-primary text-white" : "mh-btn-secondary"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5" /> Hunt TV
            </span>
          </button>

          <button
            onClick={() => handleNav("profile")}
            className={`mh-btn text-xs py-1.5 px-3.5 ${
              activeTab === "profile" ? "bg-mh-primary text-white" : "mh-btn-secondary"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Profile
            </span>
          </button>

          <Link
            href="/live"
            className="mh-btn text-xs py-1.5 px-3.5 bg-mh-live/20 border-mh-live/50 text-mh-live hover:bg-mh-live hover:text-white"
          >
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> /Live Feed
            </span>
          </Link>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Demo Mode Toggle */}
          <div className="flex items-center gap-1.5 bg-mh-card px-2.5 py-1 rounded border border-mh-border">
            <span className="text-[10px] font-mono font-bold text-mh-text3 uppercase">
              {isDemoMode ? "SIMULATED" : "LIVE"}
            </span>
            <button
              onClick={() => {
                soundFX.playClick();
                onToggleDemoMode(!isDemoMode);
              }}
              className={`w-8 h-4.5 rounded-full p-0.5 transition-colors border ${
                !isDemoMode ? "bg-mh-win border-mh-win" : "bg-mh-reward/40 border-mh-reward"
              }`}
              title={isDemoMode ? "Switch to Live Monad Testnet" : "Switch to Demo Simulated Mode"}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  !isDemoMode ? "translate-x-3.5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded bg-mh-card border border-mh-border text-mh-text2 hover:text-white"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Wallet Connect Button */}
          {walletConnected ? (
            <div className="flex items-center gap-2 bg-mh-card border border-mh-border px-3 py-1.5 rounded">
              <div className="w-2 h-2 rounded-full bg-mh-win animate-pulse" />
              <div className="text-left font-mono">
                <div className="text-xs font-bold text-white">{displayAddress}</div>
                <div className="text-[10px] text-mh-primary font-bold">{monBalance}</div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onConnectWallet(true)}
              className="mh-btn text-xs py-2 px-4"
            >
              <span className="flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" /> Connect Wallet
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
