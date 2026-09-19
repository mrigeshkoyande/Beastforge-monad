"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CinematicBackground } from "@/components/CinematicBackground";
import { SpectatorMode } from "@/components/SpectatorMode";

export default function HuntTvPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-[#05070B] text-white">
      <CinematicBackground variant="hunt-tv" />

      <div>
        <Navbar />

        <main className="py-8 max-w-[1600px] mx-auto px-4 sm:px-8">
          <SpectatorMode />
        </main>
      </div>

      <Footer />
    </div>
  );
}
