import React from "react";

interface BeastSvgProps {
  id: string;
  className?: string;
  animate?: boolean;
}

export const BeastSvg: React.FC<BeastSvgProps> = ({ id, className = "w-32 h-32", animate = false }) => {
  const normId = id.toLowerCase();

  // 1. EMBERWYRM (Fire/Flying Apex Dragon)
  if (normId.includes("emberwyrm") || normId.includes("vortex")) {
    return (
      <svg
        viewBox="0 0 200 200"
        className={`${className} ${animate ? "animate-pulse-glow" : ""}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="90" fill="#FEF08A" stroke="#080808" strokeWidth="5" />
        <circle cx="100" cy="100" r="76" fill="#F97316" stroke="#080808" strokeWidth="4" />
        
        {/* Dragon Wings */}
        <path d="M25 75 Q40 30 75 55 Q50 90 35 110 Z" fill="#0D9488" stroke="#080808" strokeWidth="4" />
        <path d="M175 75 Q160 30 125 55 Q150 90 165 110 Z" fill="#0D9488" stroke="#080808" strokeWidth="4" />
        
        {/* Horns */}
        <path d="M68 55 Q60 25 45 35 Q60 55 75 70 Z" fill="#EA580C" stroke="#080808" strokeWidth="4" />
        <path d="M132 55 Q140 25 155 35 Q140 55 125 70 Z" fill="#EA580C" stroke="#080808" strokeWidth="4" />

        {/* Emberwyrm Dragon Head */}
        <path
          d="M62 85 Q100 60 138 85 Q152 135 100 165 Q48 135 62 85 Z"
          fill="#EA580C"
          stroke="#080808"
          strokeWidth="5"
        />

        {/* Cream Belly / Snout Plate */}
        <path d="M78 120 Q100 105 122 120 Q112 152 100 156 Q88 152 78 120 Z" fill="#FEF08A" stroke="#080808" strokeWidth="3" />

        {/* Fierce Blue Dragon Eyes */}
        <polygon points="72,92 90,88 88,102 70,100" fill="#38BDF8" stroke="#080808" strokeWidth="3" />
        <polygon points="128,92 110,88 112,102 130,100" fill="#38BDF8" stroke="#080808" strokeWidth="3" />
        <circle cx="80" cy="95" r="3" fill="#080808" />
        <circle cx="120" cy="95" r="3" fill="#080808" />

        {/* Nostrils */}
        <circle cx="94" cy="118" r="2.5" fill="#080808" />
        <circle cx="106" cy="118" r="2.5" fill="#080808" />

        {/* Sharp Fangs */}
        <polygon points="84,132 88,142 92,132" fill="#FFFFFF" stroke="#080808" strokeWidth="2" />
        <polygon points="108,132 112,142 116,132" fill="#FFFFFF" stroke="#080808" strokeWidth="2" />

        {/* Fire Flame on Forehead */}
        <path d="M95 50 Q100 30 105 50 Q115 42 105 60 Q95 60 95 50 Z" fill="#EF4444" stroke="#080808" strokeWidth="2" />
        <circle cx="100" cy="48" r="4" fill="#FACC15" />
      </svg>
    );
  }

  // 2. TIDEWARDEN (Water Shellfish Heavy Tank)
  if (normId.includes("tidewarden") || normId.includes("titan")) {
    return (
      <svg
        viewBox="0 0 200 200"
        className={`${className} ${animate ? "animate-pulse-glow" : ""}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="15" y="15" width="170" height="170" rx="36" fill="#BAE6FD" stroke="#080808" strokeWidth="5" />
        
        {/* Steel Water Cannons on Shoulders */}
        <rect x="35" y="28" width="22" height="42" rx="4" transform="rotate(-25 35 28)" fill="#94A3B8" stroke="#080808" strokeWidth="4" />
        <ellipse cx="45" cy="30" rx="9" ry="5" transform="rotate(-25 45 30)" fill="#38BDF8" stroke="#080808" strokeWidth="3" />
        
        <rect x="145" y="20" width="22" height="42" rx="4" transform="rotate(25 145 20)" fill="#94A3B8" stroke="#080808" strokeWidth="4" />
        <ellipse cx="155" cy="38" rx="9" ry="5" transform="rotate(25 155 38)" fill="#38BDF8" stroke="#080808" strokeWidth="3" />

        {/* Brown Shell Rim */}
        <circle cx="100" cy="112" r="66" fill="#78350F" stroke="#080808" strokeWidth="5" />
        <circle cx="100" cy="112" r="54" fill="#B45309" stroke="#080808" strokeWidth="4" />

        {/* Tidewarden Head */}
        <ellipse cx="100" cy="86" rx="46" ry="38" fill="#60A5FA" stroke="#080808" strokeWidth="5" />

        {/* Ears */}
        <polygon points="62,60 76,76 56,76" fill="#93C5FD" stroke="#080808" strokeWidth="3" />
        <polygon points="138,60 124,76 144,76" fill="#93C5FD" stroke="#080808" strokeWidth="3" />

        {/* Determined Eyes */}
        <ellipse cx="80" cy="82" rx="9" ry="7" fill="#FFFFFF" stroke="#080808" strokeWidth="3" />
        <ellipse cx="120" cy="82" rx="9" ry="7" fill="#FFFFFF" stroke="#080808" strokeWidth="3" />
        <circle cx="82" cy="82" r="4" fill="#78350F" />
        <circle cx="118" cy="82" r="4" fill="#78350F" />

        {/* Tough Jaw */}
        <path d="M78 98 Q100 115 122 98" stroke="#080808" strokeWidth="4" fill="#FEF08A" />
        <polygon points="82,98 86,106 90,98" fill="#FFF" stroke="#080808" strokeWidth="2" />
        <polygon points="110,98 114,106 118,98" fill="#FFF" stroke="#080808" strokeWidth="2" />
      </svg>
    );
  }

  // 3. NULLSHADE (Ghost / Shadow Assassin)
  if (normId.includes("nullshade") || normId.includes("shadow")) {
    return (
      <svg
        viewBox="0 0 200 200"
        className={`${className} ${animate ? "animate-pulse-glow" : ""}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="88" fill="#E9D5FF" stroke="#080808" strokeWidth="5" />
        
        {/* Pointy Spikes on Back */}
        <polygon points="60,40 75,65 50,60" fill="#6B21A8" stroke="#080808" strokeWidth="4" />
        <polygon points="100,28 110,55 90,55" fill="#6B21A8" stroke="#080808" strokeWidth="4" />
        <polygon points="140,40 125,65 150,60" fill="#6B21A8" stroke="#080808" strokeWidth="4" />

        {/* Nullshade Round Purple Body */}
        <circle cx="100" cy="108" r="62" fill="#7E22CE" stroke="#080808" strokeWidth="5" />

        {/* Pointy Horn Ears */}
        <polygon points="52,72 38,32 78,56" fill="#7E22CE" stroke="#080808" strokeWidth="4" />
        <polygon points="148,72 162,32 122,56" fill="#7E22CE" stroke="#080808" strokeWidth="4" />

        {/* Iconic Sinister Red Eyes */}
        <polygon points="66,86 92,80 88,102 62,94" fill="#EF4444" stroke="#080808" strokeWidth="3" />
        <polygon points="134,86 108,80 112,102 138,94" fill="#EF4444" stroke="#080808" strokeWidth="3" />
        <circle cx="82" cy="90" r="3" fill="#080808" />
        <circle cx="118" cy="90" r="3" fill="#080808" />

        {/* Huge Mischievous Grin with Teeth */}
        <path
          d="M62 118 Q100 155 138 118 Q100 135 62 118 Z"
          fill="#FFFFFF"
          stroke="#080808"
          strokeWidth="4"
        />
        <line x1="78" y1="124" x2="78" y2="134" stroke="#080808" strokeWidth="3" />
        <line x1="90" y1="126" x2="90" y2="137" stroke="#080808" strokeWidth="3" />
        <line x1="100" y1="128" x2="100" y2="139" stroke="#080808" strokeWidth="3" />
        <line x1="110" y1="126" x2="110" y2="137" stroke="#080808" strokeWidth="3" />
        <line x1="122" y1="124" x2="122" y2="134" stroke="#080808" strokeWidth="3" />
      </svg>
    );
  }

  // 4. VOLTPAW (Apex Strider • Electric)
  return (
    <svg
      viewBox="0 0 200 200"
      className={`${className} ${animate ? "animate-pulse-glow" : ""}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="100" r="88" fill="#FEF08A" stroke="#080808" strokeWidth="5" />
      
      {/* Long Black-Tipped Ears */}
      <path d="M52 75 Q30 25 42 12 Q58 22 70 65 Z" fill="#FACC15" stroke="#080808" strokeWidth="4" />
      <path d="M42 12 Q48 20 40 32 Q34 26 42 12 Z" fill="#080808" />

      <path d="M148 75 Q170 25 158 12 Q142 22 130 65 Z" fill="#FACC15" stroke="#080808" strokeWidth="4" />
      <path d="M158 12 Q152 20 160 32 Q166 26 158 12 Z" fill="#080808" />

      {/* Round Yellow Head */}
      <circle cx="100" cy="115" r="54" fill="#FACC15" stroke="#080808" strokeWidth="5" />

      {/* Sparky Eyes */}
      <circle cx="78" cy="104" r="9" fill="#080808" />
      <circle cx="81" cy="101" r="3.5" fill="#FFFFFF" />

      <circle cx="122" cy="104" r="9" fill="#080808" />
      <circle cx="119" cy="101" r="3.5" fill="#FFFFFF" />

      {/* Tiny Nose */}
      <polygon points="98,114 102,114 100,117" fill="#080808" />

      {/* Cheerful Mouth */}
      <path d="M92 122 Q96 127 100 122 Q104 127 108 122" stroke="#080808" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M96 124 Q100 135 104 124 Z" fill="#EF4444" stroke="#080808" strokeWidth="2" />

      {/* Rosy Red Electric Cheeks */}
      <circle cx="62" cy="122" r="12" fill="#EF4444" stroke="#080808" strokeWidth="3" />
      <circle cx="138" cy="122" r="12" fill="#EF4444" stroke="#080808" strokeWidth="3" />
    </svg>
  );
};
