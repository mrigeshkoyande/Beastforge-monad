"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  char?: string;
}

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only run if pointer is fine (desktop mouse) and not reduced-motion
    if (typeof window === "undefined") return;

    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasFinePointer || prefersReducedMotion) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let isVisible = false;
    let animationFrameId: number;

    const particles: Particle[] = [];
    const MAX_PARTICLES = 12;
    const sparkleChars = ["✦", "✧", "·", "•"];
    const colors = ["#FF5B69", "#E63946", "#F4D35E", "#8B1E2D"];

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        currentX = mouseX;
        currentY = mouseY;
        if (dotRef.current) {
          dotRef.current.style.opacity = "1";
        }
      }

      // Occasionally spawn a tiny sparkle particle (limited to MAX_PARTICLES)
      if (particles.length < MAX_PARTICLES && Math.random() < 0.35) {
        const offsetAngle = Math.random() * Math.PI * 2;
        const offsetDist = Math.random() * 8 + 2;
        particles.push({
          x: mouseX + Math.cos(offsetAngle) * offsetDist,
          y: mouseY + Math.sin(offsetAngle) * offsetDist,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8 - 0.2, // slight upward float
          size: Math.random() * 2.5 + 1.5,
          alpha: 0.8,
          color: colors[Math.floor(Math.random() * colors.length)],
          char: Math.random() > 0.4 ? sparkleChars[Math.floor(Math.random() * sparkleChars.length)] : undefined,
        });
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (dotRef.current) {
        dotRef.current.style.opacity = "0";
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    // Animation Loop with Smooth Interpolation (Lerp)
    const render = () => {
      // Smooth interpolation for the red orb (slight trailing lag)
      const lerpFactor = 0.22;
      currentX += (mouseX - currentX) * lerpFactor;
      currentY += (mouseY - currentY) * lerpFactor;

      if (dotRef.current && isVisible) {
        dotRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }

      // Render micro-particles on canvas
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.035; // Fast fade out
          p.size *= 0.96; // Shrink

          if (p.alpha <= 0 || p.size <= 0.3) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);

          if (p.char) {
            ctx.font = `${Math.round(p.size * 3.5)}px sans-serif`;
            ctx.fillStyle = p.color;
            ctx.fillText(p.char, p.x, p.y);
          } else {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {/* Canvas for tiny sparkles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 6px Red Magical Dot with Soft Ambient Glow */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-2 h-2 rounded-full bg-[#FF4D5B] opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow:
            "0 0 8px 1px rgba(230, 57, 70, 0.85), 0 0 16px 2px rgba(139, 30, 45, 0.5)",
          willChange: "transform",
        }}
      />
    </div>
  );
};
