"use client";

import React from "react";
import { TxProgress } from "@/lib/web3Service";
import { soundFX } from "@/game/SoundFX";
import { Loader2, CheckCircle2, AlertCircle, ExternalLink, X, ShieldCheck } from "lucide-react";

interface TransactionModalProps {
  progress: TxProgress | null;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ progress, onClose }) => {
  if (!progress || progress.status === "IDLE") return null;

  const isPending = progress.status === "PENDING" || progress.status === "WAITING_SIGNATURE";
  const isSuccess = progress.status === "CONFIRMED";
  const isError = progress.status === "ERROR";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="arcade-card bg-warm-100 max-w-md w-full p-6 text-center shadow-arcade-xl relative">
        {/* Close Button (if not pending) */}
        {!isPending && (
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 bg-warm-200 rounded-xl border-2 border-arcade-black flex items-center justify-center hover:bg-arcade-coral transition-colors"
          >
            <X className="w-4 h-4 text-arcade-black" />
          </button>
        )}

        {/* Status Icon */}
        <div className="flex justify-center mb-4">
          {isPending && (
            <div className="w-16 h-16 rounded-2xl bg-arcade-yellow border-3 border-arcade-black flex items-center justify-center shadow-arcade">
              <Loader2 className="w-8 h-8 text-arcade-black animate-spin" />
            </div>
          )}
          {isSuccess && (
            <div className="w-16 h-16 rounded-2xl bg-arcade-mint border-3 border-arcade-black flex items-center justify-center shadow-arcade">
              <CheckCircle2 className="w-8 h-8 text-emerald-700" />
            </div>
          )}
          {isError && (
            <div className="w-16 h-16 rounded-2xl bg-arcade-coral border-3 border-arcade-black flex items-center justify-center shadow-arcade">
              <AlertCircle className="w-8 h-8 text-red-700" />
            </div>
          )}
        </div>

        {/* Status Title */}
        <div className="text-xs font-black uppercase text-arcade-black/60 mb-1 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-arcade-electric" />
          {progress.status === "WAITING_SIGNATURE"
            ? "Awaiting Wallet Approval"
            : progress.status === "PENDING"
            ? "Confirming On Monad Testnet"
            : progress.status === "CONFIRMED"
            ? "Transaction Confirmed"
            : "Transaction Error"}
        </div>

        <h3 className="text-2xl font-black text-arcade-black tracking-tight mb-3">
          {progress.title}
        </h3>

        {progress.status === "WAITING_SIGNATURE" && (
          <p className="text-xs font-bold text-arcade-black/70 mb-4 bg-arcade-yellow/30 p-2.5 rounded-xl border border-arcade-black/20">
            🦊 Please check your MetaMask popup or click the Fox icon in your browser extension toolbar to approve.
          </p>
        )}

        {/* Tx Hash / Explorer Link */}
        {progress.txHash && (
          <div className="bg-white p-3 rounded-xl border-2 border-arcade-black text-xs font-mono mb-4 text-left shadow-arcade-sm">
            <div className="text-[10px] text-arcade-black/50 font-bold mb-0.5">TRANSACTION HASH:</div>
            <div className="truncate text-arcade-black font-semibold">{progress.txHash}</div>
            {progress.explorerUrl && (
              <a
                href={progress.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 inline-flex items-center gap-1 text-arcade-electric font-black text-[11px] hover:underline"
              >
                View on Monad Explorer <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Error Details */}
        {isError && progress.errorMessage && (
          <div className="bg-red-100 text-red-800 p-3 rounded-xl border-2 border-red-400 text-xs font-bold mb-4 text-left">
            {progress.errorMessage}
          </div>
        )}

        {/* Action Button */}
        {!isPending && (
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="arcade-btn w-full py-3 bg-arcade-electric text-white rounded-xl text-xs flex items-center justify-center gap-2"
          >
            CONTINUE
          </button>
        )}
      </div>
    </div>
  );
};
