"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Radio, Activity, ExternalLink, Shield, Zap, Flame, Award, Swords, ArrowLeft } from "lucide-react";
import { INITIAL_TERRITORY_WAR, CREWS } from "@/data/warData";

interface LiveFeedItem {
  id: string;
  timestamp: string;
  type: "BATTLE_SETTLED" | "ARENA_OPENED" | "TERRITORY_SHIFTED";
  territoryName: string;
  winner: string;
  winnerCrew: string;
  loser?: string;
  ratingDelta: number;
  influenceDelta: number;
  crewPoints: number;
  txHash: string;
  latencyMs: number;
}

export default function LiveFeedPage() {
  const [blockNumber, setBlockNumber] = useState<number>(1084221);
  const [avgLatency, setAvgLatency] = useState<number>(412);
  const [rpcStatus, setRpcStatus] = useState<"CONNECTED" | "SYNCING">("CONNECTED");
  
  const [liveEvents, setLiveEvents] = useState<LiveFeedItem[]>([
    {
      id: "ev-1",
      timestamp: "Just now",
      type: "BATTLE_SETTLED",
      territoryName: "POWAI TECH HUB",
      winner: "0x71C9...8A2F",
      winnerCrew: "Neon Vipers",
      loser: "0x8f21...3b9a",
      ratingDelta: 24,
      influenceDelta: 16,
      crewPoints: 56,
      txHash: "0x7a91bf2e4d9c8120fa88b9c241ea908819ef34bc8912e754a908bc12e4f5a3e1",
      latencyMs: 380,
    },
    {
      id: "ev-2",
      timestamp: "45s ago",
      type: "BATTLE_SETTLED",
      territoryName: "BANDRA COAST",
      winner: "0x3e1d...9f01",
      winnerCrew: "Cyber Wolves",
      loser: "0x5539...de12",
      ratingDelta: 18,
      influenceDelta: 12,
      crewPoints: 42,
      txHash: "0x4b1e9d8c3a2f10b7e6d5c4b3a2f10e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3",
      latencyMs: 425,
    },
    {
      id: "ev-3",
      timestamp: "2m ago",
      type: "TERRITORY_SHIFTED",
      territoryName: "ANDHERI ARENA",
      winner: "0x19fa...09de",
      winnerCrew: "Neon Vipers",
      ratingDelta: 28,
      influenceDelta: 22,
      crewPoints: 60,
      txHash: "0x9c8120fa88b9c241ea908819ef34bc8912e754a908bc12e4f5a3e17a91bf2e4",
      latencyMs: 395,
    },
    {
      id: "ev-4",
      timestamp: "4m ago",
      type: "ARENA_OPENED",
      territoryName: "FORT COLOSSEUM",
      winner: "Arena Manager",
      winnerCrew: "Shadow Syndicate",
      ratingDelta: 0,
      influenceDelta: 0,
      crewPoints: 0,
      txHash: "0x2f10b7e6d5c4b3a2f10e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a34b1e9d8c3a",
      latencyMs: 350,
    },
  ]);

  // Live Simulated Block Pulse
  useEffect(() => {
    const timer = setInterval(() => {
      setBlockNumber((prev) => prev + 1);
      // Small latency fluctuation
      setAvgLatency(Math.floor(380 + Math.random() * 50));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-mh-bg text-mh-text flex flex-col justify-between">
      <div>
        <Navbar
          activeTab="live"
          onTabChange={() => {}}
          walletConnected={false}
          walletAddress=""
          monBalance="0.00 MON"
          onConnectWallet={() => {}}
          isDemoMode={false}
          onToggleDemoMode={() => {}}
        />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-mh-text2 hover:text-white text-sm font-mono transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Main Arena
            </Link>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-mh-live/20 border border-mh-live/40 text-mh-live rounded text-xs font-mono font-bold animate-pulse">
                <Radio className="w-3.5 h-3.5" /> LIVE ON-CHAIN FEED
              </span>
            </div>
          </div>

          {/* NETWORK PULSE STRIP (§5.2) */}
          <div className="bg-mh-navy border border-mh-border rounded-xl p-5 mb-8 shadow-xl">
            <div className="text-xs font-mono uppercase tracking-widest text-mh-text3 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-mh-primary" /> MONAD NETWORK TELEMETRY PULSE
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-mh-card p-3 rounded-lg border border-mh-border">
                <div className="text-[11px] font-mono text-mh-text3">STATUS</div>
                <div className="text-sm font-bold text-mh-win flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-mh-win animate-pulse" />
                  {rpcStatus} (RPC OK)
                </div>
              </div>

              <div className="bg-mh-card p-3 rounded-lg border border-mh-border">
                <div className="text-[11px] font-mono text-mh-text3">LATEST BLOCK</div>
                <div className="text-sm font-mono font-bold text-white mt-1">
                  #{blockNumber}
                </div>
              </div>

              <div className="bg-mh-card p-3 rounded-lg border border-mh-border">
                <div className="text-[11px] font-mono text-mh-text3">AVG SETTLEMENT LATENCY</div>
                <div className="text-sm font-mono font-bold text-mh-reward mt-1">
                  {avgLatency} ms
                </div>
              </div>

              <div className="bg-mh-card p-3 rounded-lg border border-mh-border">
                <div className="text-[11px] font-mono text-mh-text3">TARGET BLOCKCHAIN</div>
                <div className="text-sm font-bold text-mh-primary mt-1">
                  Monad Testnet (10143)
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Feed Stream */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-mh-border">
                <h2 className="font-display text-2xl font-black uppercase tracking-wider text-white">
                  REAL-TIME MONAD SETTLEMENTS
                </h2>
                <span className="text-xs font-mono text-mh-text3">
                  Streaming BattleSettled Events
                </span>
              </div>

              <div className="space-y-3">
                {liveEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="bg-mh-card border border-mh-border rounded-lg p-4 hover:border-mh-primary/50 transition-all shadow-md animate-fade-in"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-mh-primary/20 text-mh-primary rounded">
                          <Swords className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="font-display font-black uppercase text-base text-white tracking-wide">
                            {ev.territoryName}
                          </div>
                          <div className="text-xs font-mono text-mh-text3">
                            {ev.timestamp} · Settled in <span className="text-mh-reward font-bold">{ev.latencyMs}ms</span>
                          </div>
                        </div>
                      </div>

                      <span className="mh-badge bg-mh-navy border border-mh-border text-mh-text2 text-[10px]">
                        <span>{ev.type}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-[#07090E] p-2.5 rounded border border-mh-border/50 text-xs font-mono my-2.5">
                      <div>
                        <span className="text-mh-text3 block text-[10px]">WINNER</span>
                        <span className="text-white font-bold">{ev.winner}</span>
                        <span className="block text-[10px] text-mh-primary font-sans font-bold">{ev.winnerCrew}</span>
                      </div>
                      <div>
                        <span className="text-mh-text3 block text-[10px]">RATING SHIFT</span>
                        <span className="text-mh-reward font-bold">▲ +{ev.ratingDelta} ELO</span>
                      </div>
                      <div>
                        <span className="text-mh-text3 block text-[10px]">INFLUENCE SHIFT</span>
                        <span className="text-mh-win font-bold">▲ +{ev.influenceDelta}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-mh-border/40 text-xs font-mono">
                      <span className="text-mh-text3 truncate max-w-[280px]">
                        TX: {ev.txHash.slice(0, 16)}...{ev.txHash.slice(-8)}
                      </span>
                      <a
                        href={`https://testnet.monadexplorer.com/tx/${ev.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-mh-primary hover:text-mh-primaryGlow flex items-center gap-1 font-bold"
                      >
                        VERIFY ON MONAD <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Panel: Living City Territory Control Status */}
            <div className="space-y-6">
              <div className="bg-mh-navy border border-mh-border rounded-xl p-5 shadow-xl">
                <h3 className="font-display text-xl font-black uppercase text-white tracking-wider mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-mh-defend" /> CREW TERRITORY INFLUENCE
                </h3>

                <div className="space-y-4">
                  {CREWS.map((crew) => (
                    <div key={crew.id} className="bg-mh-card p-3 rounded-lg border border-mh-border">
                      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <span className="flex items-center gap-1.5 text-white">
                          <span>{crew.banner}</span> {crew.name}
                        </span>
                        <span className="font-mono text-mh-reward">{crew.seasonPoints} PTS</span>
                      </div>
                      <div className="w-full bg-[#07090E] h-2 rounded-full overflow-hidden border border-mh-border">
                        <div
                          className="h-full transition-all duration-500 rounded-full"
                          style={{
                            width: `${(crew.seasonPoints / 3500) * 100}%`,
                            backgroundColor: crew.color,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-mh-text3 mt-1.5">
                        <span>{crew.wins} W - {crew.losses} L</span>
                        <span>{crew.members} Hunters</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Territory Status Quick Glance */}
              <div className="bg-mh-navy border border-mh-border rounded-xl p-5 shadow-xl">
                <h3 className="font-display text-xl font-black uppercase text-white tracking-wider mb-4">
                  MUMBAI TERRITORIES (12)
                </h3>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {INITIAL_TERRITORY_WAR.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-2 rounded bg-mh-card border border-mh-border text-xs"
                    >
                      <div>
                        <span className="font-bold text-white block">{t.name}</span>
                        <span className="text-[10px] text-mh-text3 font-mono">{t.zone}</span>
                      </div>
                      <span className="mh-badge text-[10px] bg-mh-navy border border-mh-border text-mh-reward">
                        <span>{t.status}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
