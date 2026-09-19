"use client";

import React, { useEffect, useRef } from "react";
import { TerritoryWarState } from "@/game/EvolutionSystem";

interface HeroRadarCanvasProps {
  territories: TerritoryWarState[];
  onSelectTerritory: (territory: TerritoryWarState) => void;
}

export const HeroRadarCanvas: React.FC<HeroRadarCanvasProps> = ({
  territories,
  onSelectTerritory,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let angle = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) - 20;

      // 1. Dark radar backdrop
      ctx.fillStyle = "#090D16";
      ctx.fillRect(0, 0, width, height);

      // 2. High-tech grid lines
      ctx.strokeStyle = "rgba(37, 99, 235, 0.15)";
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Concentric radar circles
      [0.25, 0.5, 0.75, 1.0].forEach((ratio) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * ratio, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
        ctx.lineWidth = ratio === 1.0 ? 2 : 1;
        ctx.stroke();
      });

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
      ctx.stroke();

      // 4. Sweeping radar beam
      angle = (angle + 0.03) % (Math.PI * 2);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle - 0.45, angle);
      ctx.closePath();
      const sweepGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius
      );
      sweepGradient.addColorStop(0, "rgba(37, 99, 235, 0)");
      sweepGradient.addColorStop(1, "rgba(56, 189, 248, 0.4)");
      ctx.fillStyle = sweepGradient;
      ctx.fill();

      // Leading beam ray
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      );
      ctx.strokeStyle = "#38BDF8";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 5. Territory arena nodes (5 Mumbai hotspots)
      territories.forEach((t, idx) => {
        // Map relative coordinates to radar radius
        const nodeX = (t.mapCoordinates.x / 100) * width;
        const nodeY = (t.mapCoordinates.y / 100) * height;
        const isPlayer = t.currentOwner.includes("YOU") || t.currentOwner.includes("0x71C9");

        // Pulsing radar blip
        const pulse = Math.sin(Date.now() / 250 + idx) * 3;
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 12 + Math.max(0, pulse), 0, Math.PI * 2);
        ctx.fillStyle = isPlayer ? "rgba(74, 222, 128, 0.25)" : "rgba(251, 113, 133, 0.25)";
        ctx.fill();

        // Node center
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 6, 0, Math.PI * 2);
        ctx.fillStyle = isPlayer ? "#4ADE80" : "#FB7185";
        ctx.strokeStyle = "#080808";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Node Label
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(t.name.split(" ")[0], nodeX + 9, nodeY - 4);
        ctx.font = "8px monospace";
        ctx.fillStyle = isPlayer ? "#4ADE80" : "#FDE047";
        ctx.fillText(`+${t.baseReward}`, nodeX + 9, nodeY + 6);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [territories]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Find closest territory within 25px
    for (const t of territories) {
      const nodeX = (t.mapCoordinates.x / 100) * canvas.width;
      const nodeY = (t.mapCoordinates.y / 100) * canvas.height;
      const dist = Math.hypot(clickX - nodeX, clickY - nodeY);
      if (dist < 30) {
        onSelectTerritory(t);
        return;
      }
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[380px] rounded-2xl border-4 border-arcade-black overflow-hidden shadow-arcade-xl bg-slate-950">
      {/* Top Telemetry Header */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between pointer-events-none z-10 text-[10px] font-mono text-white/80">
        <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-black text-emerald-400">MUMBAI SECTOR RADAR</span>
        </div>
        <div className="bg-black/60 px-2 py-0.5 rounded border border-white/20 font-bold text-slate-300">
          19.0760° N, 72.8777° E
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={480}
        height={340}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair block"
      />

      {/* Bottom Telemetry Legend */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none z-10 text-[9px] font-mono">
        <div className="flex items-center gap-3 bg-black/70 px-2.5 py-1 rounded border border-white/20 text-white">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>PLAYER HELD</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>RIVAL APEX</span>
          </div>
        </div>

        <div className="bg-arcade-yellow text-arcade-black font-black px-2 py-0.5 rounded border border-arcade-black shadow-arcade-sm">
          CLICK NODE TO ENGAGE
        </div>
      </div>
    </div>
  );
};
