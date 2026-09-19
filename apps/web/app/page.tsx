"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CinematicBackground } from "@/components/CinematicBackground";
import { HeroSection } from "@/components/landing/HeroSection";
import { LandingSections } from "@/components/landing/LandingSections";
import { TrailerModal } from "@/components/landing/TrailerModal";
import { LiveSettlementConsole } from "@/components/LiveSettlementConsole";
import { useGame } from "@/context/GameContext";

export default function HomePage() {
  const router = useRouter();
  const {
    walletConnected,
    connectWallet,
    playerBeast,
    setPlayerBeast,
    isTrailerOpen,
    setIsTrailerOpen,
    txProgress,
    isConsoleOpen,
    setIsConsoleOpen,
  } = useGame();

  const handleEnterCity = () => {
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-white flex flex-col justify-between selection:bg-[#E63946] selection:text-white relative">
      <CinematicBackground variant="landing" />

      <div>
        {/* Navigation Bar */}
        <Navbar />

        {/* Live Settlement Console */}
        <LiveSettlementConsole
          isOpen={isConsoleOpen}
          progress={txProgress}
          onClose={() => setIsConsoleOpen(false)}
        />

        {/* Real Gameplay Video Trailer Modal */}
        <TrailerModal
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          onEnterCity={handleEnterCity}
        />

        {/* Full-Screen Hero Section */}
        <HeroSection
          onEnterCity={handleEnterCity}
          onWatchTrailer={() => setIsTrailerOpen(true)}
          onConnectWallet={connectWallet}
          onSelectTerritoryZone={(zoneId) => {
            router.push("/map");
          }}
          playerBeast={playerBeast}
          walletConnected={walletConnected}
        />

        {/* Full Interactive Landing Sections */}
        <LandingSections
          onEnterCity={handleEnterCity}
          onSelectTab={(tab) => {
            if (tab === "arena") router.push("/arena");
            else if (tab === "map") router.push("/map");
            else if (tab === "crews") router.push("/crews");
            else if (tab === "profile") router.push("/profile");
            else if (tab === "leaderboard") router.push("/leaderboards");
            else if (tab === "tv") router.push("/hunt-tv");
            else router.push("/app");
          }}
          onSelectBeast={(b) => {
            setPlayerBeast(b);
            router.push("/arena");
          }}
        />
      </div>

      <Footer />
    </div>
  );
}
