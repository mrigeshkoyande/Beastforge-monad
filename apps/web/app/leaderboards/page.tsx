"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CinematicBackground } from "@/components/CinematicBackground";
import { Leaderboard } from "@/components/Leaderboard";
import { useGame } from "@/context/GameContext";

export default function LeaderboardsPage() {
  const { leaderboard, walletAddress } = useGame();

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-[#05070B] text-white">
      <CinematicBackground variant="leaderboard" />

      <div>
        <Navbar />

        <main className="py-8 max-w-[1600px] mx-auto px-4 sm:px-8">
          <Leaderboard entries={leaderboard} userAddress={walletAddress} />
        </main>
      </div>

      <Footer />
    </div>
  );
}
