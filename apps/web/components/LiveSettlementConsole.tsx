"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Copy, ExternalLink, ShieldCheck, Clock, Loader2, AlertCircle } from "lucide-react";
import { TxProgress } from "@/lib/web3Service";

interface LiveSettlementConsoleProps {
  progress: TxProgress | null;
  onClose?: () => void;
  isOpen: boolean;
}

export const LiveSettlementConsole: React.FC<LiveSettlementConsoleProps> = ({
  progress,
  onClose,
  isOpen,
}) => {
  const [copied, setCopied] = useState(false);
  const [elapsedTimer, setElapsedTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (progress?.status === "CONFIRMING" || progress?.status === "SUBMITTED") {
      const start = Date.now();
      interval = setInterval(() => {
        setElapsedTimer(Date.now() - start);
      }, 50);
    } else {
      setElapsedTimer(0);
    }
    return () => clearInterval(interval);
  }, [progress?.status]);

  if (!isOpen || !progress) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDemo = progress.txHash?.includes("SIMULATED");
  const isSettled = progress.status === "SETTLED";
  const isConfirming = progress.status === "CONFIRMING" || progress.status === "SUBMITTED";
  const isSigning = progress.status === "SIGN";
  const isError = progress.status === "ERROR";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-mh-navy border border-mh-border rounded-xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-mh-border pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className={`w-3 h-3 rounded-full ${isSettled ? "bg-mh-win" : isConfirming ? "bg-mh-reward animate-ping" : isSigning ? "bg-mh-primary animate-pulse" : "bg-mh-live"}`} />
            <h3 className="font-display text-2xl font-black tracking-wider uppercase text-white">
              LIVE SETTLEMENT CONSOLE
            </h3>
          </div>
          {isDemo && (
            <span className="mh-badge bg-mh-card text-mh-reward border border-mh-reward/40 text-[10px]">
              <span>SIMULATED DATA</span>
            </span>
          )}
        </div>

        {/* 4-Stage Progress Stepper */}
        <div className="grid grid-cols-4 gap-2 mb-6 text-center">
          {[
            { label: "1. SIGN", active: isSigning || isConfirming || isSettled, done: isConfirming || isSettled },
            { label: "2. SUBMITTED", active: isConfirming || isSettled, done: isConfirming || isSettled },
            { label: "3. CONFIRMING", active: isConfirming, done: isSettled },
            { label: "4. SETTLED", active: isSettled, done: isSettled },
          ].map((step, idx) => (
            <div
              key={idx}
              className={`py-2 px-1 rounded border text-xs font-mono font-bold transition-all ${
                step.done
                  ? "bg-mh-win/10 border-mh-win/50 text-mh-win"
                  : step.active
                  ? "bg-mh-primary/20 border-mh-primary text-mh-primaryGlow animate-pulse"
                  : "bg-mh-card border-mh-border text-mh-text3"
              }`}
            >
              {step.label}
            </div>
          ))}
        </div>

        {/* Status Message */}
        <div className="bg-mh-card p-3.5 rounded-lg border border-mh-border mb-5 flex items-center gap-3">
          {isConfirming && <Loader2 className="w-5 h-5 text-mh-reward animate-spin shrink-0" />}
          {isSettled && <CheckCircle2 className="w-5 h-5 text-mh-win shrink-0" />}
          {isSigning && <ShieldCheck className="w-5 h-5 text-mh-primary shrink-0" />}
          {isError && <AlertCircle className="w-5 h-5 text-mh-live shrink-0" />}
          <div className="text-sm font-medium text-mh-text truncate">
            {progress.title || "Processing Battle Settlement..."}
            {isConfirming && (
              <span className="ml-2 font-mono text-xs text-mh-reward font-bold">
                ({(elapsedTimer / 1000).toFixed(2)}s)
              </span>
            )}
          </div>
        </div>

        {/* Real Receipt Telemetry Grid */}
        <div className="bg-[#07090E] border border-mh-border/80 rounded-lg p-4 font-mono text-xs space-y-2.5 mb-6">
          <div className="flex justify-between items-center text-mh-text2 border-b border-mh-border/50 pb-2">
            <span>STATUS</span>
            <span className={`font-bold ${isSettled ? "text-mh-win" : isError ? "text-mh-live" : "text-mh-reward"}`}>
              ● {progress.status}
            </span>
          </div>

          <div className="flex justify-between items-center text-mh-text2 border-b border-mh-border/50 pb-2">
            <span>NETWORK</span>
            <span className="text-white font-medium">Monad Testnet (Chain ID 10143)</span>
          </div>

          {progress.txHash && (
            <div className="flex justify-between items-center text-mh-text2 border-b border-mh-border/50 pb-2">
              <span>TX HASH</span>
              <div className="flex items-center gap-2">
                <span className="text-mh-primary font-bold">
                  {progress.txHash.length > 20
                    ? `${progress.txHash.slice(0, 8)}...${progress.txHash.slice(-6)}`
                    : progress.txHash}
                </span>
                {!isDemo && (
                  <button
                    onClick={() => handleCopy(progress.txHash!)}
                    className="text-mh-text3 hover:text-white p-0.5"
                    title="Copy Hash"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
                {!isDemo && progress.explorerUrl && (
                  <a
                    href={progress.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-mh-primary hover:text-mh-primaryGlow"
                    title="View on Explorer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center text-mh-text2 border-b border-mh-border/50 pb-2">
            <span>BLOCK</span>
            <span className="text-white font-medium">
              {progress.blockNumber ? `#${progress.blockNumber.toString()}` : "—"}
            </span>
          </div>

          <div className="flex justify-between items-center text-mh-text2 border-b border-mh-border/50 pb-2">
            <span>GAS USED</span>
            <span className="text-white font-medium">
              {progress.gasUsed ? progress.gasUsed.toString() : "—"}
            </span>
          </div>

          <div className="flex justify-between items-center text-mh-text2 border-b border-mh-border/50 pb-2">
            <span>MEASURED LATENCY</span>
            <span className="text-mh-reward font-bold">
              {progress.latencyMs ? `${progress.latencyMs} ms` : isConfirming ? `${elapsedTimer} ms` : "—"}
            </span>
          </div>

          <div className="flex justify-between items-center text-mh-text2">
            <span>SIGNER</span>
            <span className="text-mh-text3 truncate max-w-[200px]">
              0xa0Ee7A142d267C1f36714E4a8F75612F20a79720 (EIP-712)
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          {(isSettled || isError) && (
            <button
              onClick={onClose}
              className="mh-btn w-full text-center py-2.5"
            >
              <span>{isError ? "CLOSE & CONTINUE" : "CONTINUE"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
