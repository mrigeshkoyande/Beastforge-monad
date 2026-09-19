"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CinematicBackground } from "@/components/CinematicBackground";
import { PlayerProfile } from "@/components/PlayerProfile";
import { useGame } from "@/context/GameContext";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, userCrewId, setPlayerBeast } = useGame();

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-[#05070B] text-white">
      <CinematicBackground variant="profile" />

      <div>
        <Navbar />

        <main className="py-8 max-w-[1600px] mx-auto px-4 sm:px-8">
          <PlayerProfile
            profile={profile}
            userCrewId={userCrewId}
            onSelectBeast={(b) => setPlayerBeast(b)}
            onEnterArena={() => router.push("/arena")}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
}
