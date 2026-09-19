"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { soundFX } from "@/game/SoundFX";
import { useGame } from "@/context/GameContext";
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
  LogOut,
  Sparkles,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    walletConnected,
    walletAddress,
    monBalance,
    connectWallet,
    disconnectWallet,
    isDemoMode,
    setIsDemoMode,
  } = useGame();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.enabled = next;
    if (next) soundFX.playClick();
  };

  const navLinks = [
    { href: "/", label: "HOME", icon: Home, exact: true },
    { href: "/arena", label: "ARENA", icon: Swords },
    { href: "/map", label: "MAP", icon: MapPin },
    { href: "/leaderboards", label: "LEADERBOARDS", icon: Trophy },
    { href: "/crews", label: "CREWS", icon: Users },
    { href: "/hunt-tv", label: "HUNT TV", icon: Tv },
    { href: "/profile", label: "PROFILE", icon: User },
  ];

  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "0x71C9...8A2F";

  return (
    <header className="sticky top-0 z-50 bg-[#05070B]/90 backdrop-blur-xl border-b border-[#1E273D]/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        {/* Brand with Official Logo Asset */}
        <Link
          href="/"
          onClick={() => soundFX.playClick()}
          className="flex items-center gap-3 select-none group"
        >
          <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-lg bg-[#0A0E17] border border-[#1E273D] group-hover:border-[#E63946] transition-colors">
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
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 2xl:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => soundFX.playClick()}
                className={`relative px-3.5 py-2 text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-2 ${
                  isActive ? "text-white" : "text-[#94A3B8] hover:text-white"
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
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Sound FX Toggle (Compact) */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-[#0E1422] border border-[#1E273D] text-[#94A3B8] hover:text-white hover:border-[#E63946]/50 transition-all"
            title="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#F4D35E]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Connect Wallet / Connected State */}
          {walletConnected ? (
            <div className="relative">
              <button
                onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                className="flex items-center gap-2.5 bg-[#0E1422] border border-[#E63946]/50 hover:border-[#E63946] px-3.5 py-1.5 rounded-lg text-left font-mono transition-all shadow-[0_0_15px_rgba(230,57,70,0.15)]"
              >
                <div className="w-2 h-2 rounded-full bg-[#E63946]" />
                <div>
                  <div className="text-xs font-bold text-white leading-none">{displayAddress}</div>
                  <div className="text-[10px] text-[#F4D35E] font-bold mt-0.5">{monBalance}</div>
                </div>
              </button>

              {walletDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0B0F17] border border-[#1E273D] rounded-lg shadow-2xl p-2 z-50 text-xs font-mono">
                  <div className="p-2 border-b border-[#1E273D]">
                    <div className="text-[10px] uppercase text-[#64748B] font-bold">Network</div>
                    <div className="text-white text-xs font-semibold flex items-center justify-between mt-0.5">
                      <span>MONAD TESTNET</span>
                      <span className="text-[10px] text-[#F4D35E] font-bold">
                        {isDemoMode ? "SIMULATED" : "CHAIN 10143"}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 border-b border-[#1E273D] text-[#94A3B8] break-all text-[11px]">
                    <div className="text-[10px] uppercase text-[#64748B] font-bold mb-0.5">Account</div>
                    {walletAddress}
                  </div>
                  <button
                    onClick={() => {
                      disconnectWallet();
                      setWalletDropdownOpen(false);
                    }}
                    className="w-full mt-1 p-2 rounded hover:bg-[#E63946]/20 text-[#E63946] flex items-center gap-2 text-left font-bold transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect Wallet</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                soundFX.playClick();
                connectWallet();
              }}
              className="relative group px-4 sm:px-6 py-2 rounded-lg font-display font-black text-xs sm:text-sm uppercase tracking-wider text-white transition-all bg-gradient-to-r from-[#E63946] via-[#B2182B] to-[#8B1E2D] shadow-[0_0_20px_rgba(230,57,70,0.4)] hover:shadow-[0_0_30px_rgba(230,57,70,0.8)] hover:scale-[1.02] active:scale-[0.98] border border-[#FF4D5B]/50 flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>CONNECT WALLET</span>
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-3 pt-3 border-t border-[#1E273D] bg-[#05070B] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E273D] text-xs font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E63946]" />
              MONAD TESTNET
            </span>
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className="text-[10px] uppercase font-bold text-[#F4D35E]"
            >
              MODE: {isDemoMode ? "SIMULATED" : "LIVE"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    soundFX.playClick();
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-lg font-mono text-xs font-bold flex items-center gap-2 border transition-all ${
                    isActive
                      ? "bg-[#E63946]/20 border-[#E63946] text-white shadow-[0_0_15px_rgba(230,57,70,0.3)]"
                      : "bg-[#0B0F17] border-[#1E273D] text-[#94A3B8] hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#E63946]" : "text-[#64748B]"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
