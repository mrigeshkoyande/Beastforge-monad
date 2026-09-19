"use client";

import React, { useState, useRef, useEffect } from "react";
import { soundFX } from "@/game/SoundFX";
import {
  Volume2,
  VolumeX,
  Wallet,
  Sparkles,
  MapPin,
  Swords,
  Trophy,
  User,
  Award,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  walletConnected: boolean;
  walletAddress?: string;
  setWalletConnected: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isDemoMode,
  setIsDemoMode,
  walletConnected,
  walletAddress,
  setWalletConnected,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.enabled = next;
    if (next) soundFX.playClick();
  };

  const handleNav = (tab: string) => {
    soundFX.playClick();
    setCurrentTab(tab);
    setIsProfileOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "0x71...8A2F";

  return (
    <header className="sticky top-0 z-40 bg-warm-100/95 backdrop-blur-md border-b-4 border-arcade-black px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
        {/* Left: Brand / Logo */}
        <div
          onClick={() => handleNav("landing")}
          className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-arcade-coral rounded-xl border-3 border-arcade-black flex items-center justify-center shadow-arcade-sm group-hover:-rotate-6 transition-transform">
            <span className="text-xl sm:text-2xl">🐲</span>
          </div>
          <div className="hidden xs:block">
            <div className="font-black text-xl sm:text-2xl tracking-tighter leading-none text-arcade-black flex items-center gap-0.5">
              MONAD<span className="text-arcade-electric">HUNT</span>
            </div>
            <div className="text-[9px] sm:text-[10px] font-black tracking-widest text-arcade-black/60 uppercase flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              BLITZ MUMBAI V4
            </div>
          </div>
        </div>

        {/* Center: StakED-style Boxed Neo-Brutalist Nav Buttons */}
        <nav className="flex items-center gap-2">
          <button
            onClick={() => handleNav("arena")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg font-black text-xs uppercase border-2 border-arcade-black shadow-[2px_2px_0px_#080808] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#080808] active:translate-x-[1px] active:translate-y-[1px] ${
              currentTab === "arena"
                ? "bg-arcade-coral text-arcade-black"
                : "bg-white text-arcade-black hover:bg-warm-200"
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Arena</span>
          </button>

          <button
            onClick={() => handleNav("map")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg font-black text-xs uppercase border-2 border-arcade-black shadow-[2px_2px_0px_#080808] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#080808] active:translate-x-[1px] active:translate-y-[1px] ${
              currentTab === "map"
                ? "bg-arcade-mint text-arcade-black"
                : "bg-white text-arcade-black hover:bg-warm-200"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">War Map</span>
            <span className="sm:hidden">Map</span>
          </button>

          <button
            onClick={() => handleNav("leaderboard")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg font-black text-xs uppercase border-2 border-arcade-black shadow-[2px_2px_0px_#080808] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#080808] active:translate-x-[1px] active:translate-y-[1px] ${
              currentTab === "leaderboard"
                ? "bg-arcade-purple text-arcade-black"
                : "bg-white text-arcade-black hover:bg-warm-200"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ranks</span>
          </button>
        </nav>

        {/* Right Status Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Honest Labelling Switch: SIMULATED / LIVE TESTNET */}
          <div className="flex items-center gap-1.5 bg-white px-2 sm:px-3 py-1.5 rounded-xl border-3 border-arcade-black shadow-arcade-sm">
            <span className="text-[10px] sm:text-[11px] font-black uppercase text-arcade-black tracking-tight">
              {isDemoMode ? "SIMULATED" : "LIVE"}
            </span>
            <button
              onClick={() => {
                soundFX.playClick();
                setIsDemoMode(!isDemoMode);
              }}
              className={`w-9 h-5 sm:w-10 sm:h-5.5 rounded-full border-2 border-arcade-black transition-colors relative flex items-center p-0.5 ${
                !isDemoMode ? "bg-emerald-400" : "bg-amber-300"
              }`}
              title={
                isDemoMode
                  ? "Currently in Simulated Mode (No chain writes)"
                  : "Currently Connected to Real Monad Testnet"
              }
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-arcade-black transition-transform ${
                  !isDemoMode ? "translate-x-4 sm:translate-x-4.5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-3 border-arcade-black bg-white flex items-center justify-center shadow-arcade-sm hover:bg-warm-200 transition-colors"
            title={soundEnabled ? "Mute Arcade SFX" : "Unmute SFX"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-arcade-black" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-arcade-black/40" />
            )}
          </button>

          {/* Wallet Connect Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              setWalletConnected(!walletConnected);
            }}
            className={`arcade-btn px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 ${
              walletConnected
                ? "bg-arcade-mint text-arcade-black"
                : "bg-arcade-electric text-white"
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{walletConnected ? displayAddress : "CONNECT"}</span>
            <span className="sm:hidden">{walletConnected ? displayAddress.slice(0, 4) : "CONNECT"}</span>
          </button>

          {/* Profile Dropdown Menu (Contains Badges, Beasts, Profile Overview) */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                soundFX.playClick();
                setIsProfileOpen(!isProfileOpen);
              }}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-3 border-arcade-black flex items-center justify-center shadow-arcade-sm transition-all ${
                isProfileOpen || currentTab === "profile" || currentTab === "achievements" || currentTab === "beasts"
                  ? "bg-arcade-electric text-white"
                  : "bg-white text-arcade-black hover:bg-warm-200"
              }`}
              title="Hunter Profile"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border-3 border-arcade-black shadow-arcade-xl py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b-2 border-arcade-black/10 mb-1">
                  <div className="text-[10px] font-black text-arcade-black/60 uppercase">HUNTER ACCOUNT</div>
                  <div className="text-xs font-black text-arcade-black font-mono truncate">
                    {walletConnected ? "0x71C9...8A2F" : "GUEST (NOT CONNECTED)"}
                  </div>
                </div>

                <button
                  onClick={() => handleNav("profile")}
                  className="w-full px-3 py-2 text-left text-xs font-black uppercase flex items-center gap-2 hover:bg-warm-200 text-arcade-black"
                >
                  <User className="w-4 h-4 text-arcade-electric" />
                  <span>Profile Overview</span>
                </button>

                <button
                  onClick={() => handleNav("achievements")}
                  className="w-full px-3 py-2 text-left text-xs font-black uppercase flex items-center gap-2 hover:bg-warm-200 text-arcade-black"
                >
                  <Award className="w-4 h-4 text-arcade-purple" />
                  <span>On-Chain Badges</span>
                </button>

                <button
                  onClick={() => handleNav("beasts")}
                  className="w-full px-3 py-2 text-left text-xs font-black uppercase flex items-center gap-2 hover:bg-warm-200 text-arcade-black"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Beast Inventory</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
