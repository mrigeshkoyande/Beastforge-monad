"use client";

import React, { useRef, useEffect } from "react";
import { X, Play, Volume2, Shield, Flame, Swords, ExternalLink } from "lucide-react";
import { soundFX } from "@/game/SoundFX";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnterCity: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  onEnterCity,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Close on Escape key & stop playback
  useEffect(() => {
    const vid = videoRef.current;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (vid) {
        vid.pause();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    soundFX.playClick();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#0B0F17] border border-[#E63946]/60 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(230,57,70,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E273D] bg-[#05070B]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E63946] animate-pulse shadow-[0_0_10px_#E63946]" />
            <span className="font-display font-black text-lg uppercase tracking-wider text-white">
              MONAD HUNT · OFFICIAL GAMEPLAY TRAILER
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-[#161B26] text-[#94A3B8] hover:text-white hover:bg-[#E63946]/20 transition-colors"
            title="Close Trailer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Video Player */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src="/media/trailer.mp4"
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          >
            Your browser does not support HTML5 video.
          </video>
        </div>

        {/* Footer CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[#080C14] border-t border-[#1E273D]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
            <Flame className="w-4 h-4 text-[#E63946]" />
            <span>Recorded on Monad Testnet · High-Throughput 10,000 TPS Gameplay</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded text-xs font-mono font-bold text-[#94A3B8] hover:text-white bg-[#161B26] border border-[#1E273D]"
            >
              CLOSE
            </button>
            <button
              onClick={() => {
                handleClose();
                onEnterCity();
              }}
              className="w-full sm:w-auto px-7 py-2.5 rounded font-display font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-[#E63946] to-[#8B1E2D] shadow-[0_0_20px_rgba(230,57,70,0.6)] hover:shadow-[0_0_30px_rgba(230,57,70,0.9)] border border-[#FF4D5B]/50 flex items-center justify-center gap-2"
            >
              <Swords className="w-4 h-4" />
              <span>ENTER THE CITY →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
