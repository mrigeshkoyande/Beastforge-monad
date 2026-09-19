"use client";

import React, { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { monadTestnet } from "@/lib/monadChain";
import { ExternalLink, Zap } from "lucide-react";

interface ChainStatusBarProps {
  isSimulated: boolean;
  lastTxHash?: string | null;
  lastLatencyMs?: number | null;
  isConnectedChain?: boolean;
}

export const ChainStatusBar: React.FC<ChainStatusBarProps> = ({
  isSimulated,
  lastTxHash,
  lastLatencyMs,
  isConnectedChain = true,
}) => {
  const [blockNumber, setBlockNumber] = useState<string>("...");
  const [isLiveRpcHealthy, setIsLiveRpcHealthy] = useState<boolean>(true);

  useEffect(() => {
    let unwatch: (() => void) | null = null;
    let fallbackInterval: NodeJS.Timeout | null = null;

    try {
      const client = createPublicClient({
        chain: monadTestnet,
        transport: http("https://testnet-rpc.monad.xyz/"),
      });

      try {
        unwatch = client.watchBlockNumber({
          onBlockNumber: (block) => {
            setBlockNumber(block.toString());
            setIsLiveRpcHealthy(true);
          },
          onError: () => {
            setIsLiveRpcHealthy(false);
          },
          pollingInterval: 1000,
        });
      } catch {
        // Polling fallback
      }

      const fetchBlock = async () => {
        try {
          const num = await client.getBlockNumber();
          setBlockNumber(num.toString());
          setIsLiveRpcHealthy(true);
        } catch {
          setIsLiveRpcHealthy(false);
        }
      };

      fetchBlock();
      fallbackInterval = setInterval(fetchBlock, 1000);
    } catch {
      setIsLiveRpcHealthy(false);
    }

    return () => {
      if (unwatch) unwatch();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, []);

  const formatHash = (hash: string) => {
    if (!hash || hash.length < 12) return hash;
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <aside
      aria-label="Monad Testnet Chain Status"
      className="bg-arcade-black text-white border-b-3 border-arcade-black px-3 sm:px-6 py-1.5 text-[11px] font-mono select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Chain ID + Pulsing Dot + Block Number */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnectedChain && isLiveRpcHealthy
                  ? "bg-emerald-400 animate-pulse ring-2 ring-emerald-400/40"
                  : "bg-red-500 animate-ping"
              }`}
            />
            <span className="font-black text-slate-200">
              MONAD TESTNET ({monadTestnet.id})
            </span>
          </div>

          <span className="text-white/30 hidden sm:inline">•</span>

          <div className="flex items-center gap-1 text-slate-300">
            <span className="text-arcade-yellow font-black">BLOCK</span>
            <span className="font-bold text-white bg-white/10 px-1.5 py-0.5 rounded border border-white/20">
              #{blockNumber}
            </span>
          </div>
        </div>

        {/* Right: Mode Status, Last TX, and Settlement Latency */}
        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          {/* Mode Pill */}
          {isSimulated ? (
            <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold text-[10px]">
              SIMULATED MODE
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              LIVE TESTNET
            </span>
          )}

          {/* Settlement Latency in ms */}
          <div className="flex items-center gap-1">
            <span className="text-white/50">LATENCY:</span>
            <span
              className={`font-black ${
                isSimulated || lastLatencyMs === null || lastLatencyMs === undefined
                  ? "text-slate-400"
                  : "text-emerald-400"
              }`}
            >
              {isSimulated || lastLatencyMs === null || lastLatencyMs === undefined
                ? "—"
                : `SETTLED IN ${lastLatencyMs}ms`}
            </span>
          </div>

          {/* Last Tx Hash Link */}
          {lastTxHash && (
            <a
              href={`https://testnet.monadexplorer.com/tx/${lastTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 underline font-bold"
              title="View on Monad Testnet Explorer"
            >
              <span>{formatHash(lastTxHash)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </aside>
  );
};
