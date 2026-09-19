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

  const isPending = progress.status === "CONFIRMING" || progress.status === "SUBMITTED" || progress.status === "SIGN";
  const isSuccess = progress.status === "SETTLED";
  const isError = progress.status === "ERROR";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-mh-navy border border-mh-border max-w-md w-full p-6 text-center shadow-2xl rounded-xl relative">
        {/* Close Button */}
        {!isPending && (
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 bg-mh-card rounded-lg border border-mh-border flex items-center justify-center text-mh-text2 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Status Icon */}
        <div className="flex justify-center mb-4">
          {isPending && (
            <div className="w-14 h-14 rounded-xl bg-mh-reward/20 border border-mh-reward flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-mh-reward animate-spin" />
            </div>
          )}
          {isSuccess && (
            <div className="w-14 h-14 rounded-xl bg-mh-win/20 border border-mh-win flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-mh-win" />
            </div>
          )}
          {isError && (
            <div className="w-14 h-14 rounded-xl bg-mh-live/20 border border-mh-live flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-mh-live" />
            </div>
          )}
        </div>

        {/* Status Title */}
        <div className="text-xs font-mono font-bold uppercase text-mh-text3 mb-1 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-mh-primary" />
          {progress.status === "SIGN"
            ? "Awaiting Wallet Approval"
            : progress.status === "SUBMITTED" || progress.status === "CONFIRMING"
            ? "Confirming On Monad Testnet"
            : progress.status === "SETTLED"
            ? "Transaction Settled"
            : "Transaction Error"}
        </div>

        <h3 className="font-display text-2xl font-black uppercase text-white tracking-wide mb-3">
          {progress.title}
        </h3>

        {/* Tx Hash / Explorer Link */}
        {progress.txHash && (
          <div className="bg-[#07090E] p-3 rounded-lg border border-mh-border text-xs font-mono mb-4 text-left">
            <div className="text-[10px] text-mh-text3 font-bold mb-0.5">TRANSACTION HASH:</div>
            <div className="truncate text-white font-semibold">{progress.txHash}</div>
            {progress.explorerUrl && (
              <a
                href={progress.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 inline-flex items-center gap-1 text-mh-primary font-bold text-[11px] hover:text-mh-primaryGlow"
              >
                View on Monad Explorer <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Error Details */}
        {isError && progress.errorMessage && (
          <div className="bg-mh-live/20 text-mh-live p-3 rounded-lg border border-mh-live/40 text-xs font-mono mb-4 text-left">
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
            className="mh-btn w-full py-2.5 text-xs text-center"
          >
            <span>CONTINUE</span>
          </button>
        )}
      </div>
    </div>
  );
};
