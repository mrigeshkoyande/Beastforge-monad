export interface Beast {
  id: string;
  tokenId: number;
  name: string;
  title: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  element: "Fire" | "Earth" | "Electric" | "Dark" | "Water";
  level: number;
  xp: number;
  nextLevelXp: number;
  attack: number;
  defense: number;
  speed: number;
  energy: number;
  hp: number;
  maxHp: number;
  wins: number;
  losses: number;
  winRate: number;
  specialMove: string;
  specialDesc: string;
  personality: "Aggressive" | "Defensive" | "Tactical" | "Chaotic";
  bgGradient: string;
  accentColor: string;
  badgeBg: string;
}

export interface Territory {
  id: string;
  numericId: number;
  name: string;
  zone: string;
  currentOwner: string;
  guardian: string;
  guardianLevel: number;
  reward: string;
  entryFee: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  status: "CHALLENGEABLE" | "DEFENDING" | "LOCKED";
  conqueredCount: number;
  description: string;
  badgeBg: string;
}

export interface LeaderboardEntry {
  rank: number;
  player: string;
  address: string;
  topBeast: string;
  wins: number;
  battles: number;
  territories: number;
  predictionXp: number;
  winRate: string;
  earnedMon: string;
  isUser?: boolean;
}

export const MOCK_BEASTS: Beast[] = [
  {
    id: "emberwyrm",
    tokenId: 6,
    name: "EMBERWYRM",
    title: "Apex Wyrm • Fire & Sky",
    rarity: "LEGENDARY",
    element: "Fire",
    level: 36,
    xp: 2840,
    nextLevelXp: 3600,
    attack: 84,
    defense: 78,
    speed: 100,
    energy: 95,
    hp: 120,
    maxHp: 120,
    wins: 24,
    losses: 4,
    winRate: 85.7,
    specialMove: "CINDER LANCE",
    specialDesc: "Impales the rival target with a piercing lance of molten magma, melting through barrier shields.",
    personality: "Aggressive",
    bgGradient: "from-amber-300 via-orange-500 to-red-600",
    accentColor: "#F97316",
    badgeBg: "bg-arcade-coral",
  },
  {
    id: "tidewarden",
    tokenId: 9,
    name: "TIDEWARDEN",
    title: "Apex Carapace • Deep Sea Bastion",
    rarity: "EPIC",
    element: "Water",
    level: 36,
    xp: 2710,
    nextLevelXp: 3600,
    attack: 83,
    defense: 100,
    speed: 78,
    energy: 85,
    hp: 135,
    maxHp: 135,
    wins: 21,
    losses: 6,
    winRate: 77.8,
    specialMove: "TORRENT CANNON",
    specialDesc: "Blasts colossal pressurized ocean geysers from shell-mounted cannons with shattering kinetic force.",
    personality: "Defensive",
    bgGradient: "from-sky-300 via-blue-500 to-indigo-700",
    accentColor: "#3B82F6",
    badgeBg: "bg-arcade-electric",
  },
  {
    id: "nullshade",
    tokenId: 94,
    name: "NULLSHADE",
    title: "Apex Phantom • Shadow Assassin",
    rarity: "RARE",
    element: "Dark",
    level: 34,
    xp: 2100,
    nextLevelXp: 3400,
    attack: 90,
    defense: 60,
    speed: 110,
    energy: 90,
    hp: 95,
    maxHp: 95,
    wins: 19,
    losses: 5,
    winRate: 79.2,
    specialMove: "VOID PULSE",
    specialDesc: "Releases a high-frequency shockwave of negative astral energy that drains rival stamina.",
    personality: "Tactical",
    bgGradient: "from-purple-300 via-indigo-600 to-slate-900",
    accentColor: "#8B5CF6",
    badgeBg: "bg-arcade-purple",
  },
  {
    id: "voltpaw",
    tokenId: 25,
    name: "VOLTPAW",
    title: "Apex Strider • Lightning Ace",
    rarity: "COMMON",
    element: "Electric",
    level: 30,
    xp: 1540,
    nextLevelXp: 3000,
    attack: 75,
    defense: 55,
    speed: 115,
    energy: 90,
    hp: 90,
    maxHp: 90,
    wins: 16,
    losses: 7,
    winRate: 69.5,
    specialMove: "ARCFLASH",
    specialDesc: "Channels high-voltage lightning conduits from fur pads, striking instantly with maximum precision.",
    personality: "Chaotic",
    bgGradient: "from-yellow-200 via-amber-300 to-yellow-500",
    accentColor: "#EAB308",
    badgeBg: "bg-arcade-yellow",
  }
];

export const MOCK_TERRITORIES: Territory[] = [
  {
    id: "andheri",
    numericId: 1,
    name: "ANDHERI ARENA",
    zone: "North Zone",
    currentOwner: "Team Shadow",
    guardian: "VORTEX",
    guardianLevel: 12,
    reward: "0.18 MON",
    entryFee: "0.1 MON",
    rarity: "EPIC",
    status: "CHALLENGEABLE",
    conqueredCount: 42,
    description: "High-octane industrial neon battlegrounds of Andheri.",
    badgeBg: "bg-arcade-coral",
  },
  {
    id: "bandra",
    numericId: 2,
    name: "BANDRA COAST",
    zone: "West Coast",
    currentOwner: "0x71...8A2F",
    guardian: "TITAN",
    guardianLevel: 14,
    reward: "0.22 MON",
    entryFee: "0.1 MON",
    rarity: "RARE",
    status: "CHALLENGEABLE",
    conqueredCount: 38,
    description: "Sea-spray cliffs and fast coastal winds near Bandra Fort.",
    badgeBg: "bg-arcade-mint",
  },
  {
    id: "powai",
    numericId: 3,
    name: "POWAI TECH HUB",
    zone: "Central Valley",
    currentOwner: "CyberGuild",
    guardian: "BOLT",
    guardianLevel: 8,
    reward: "0.15 MON",
    entryFee: "0.1 MON",
    rarity: "COMMON",
    status: "CHALLENGEABLE",
    conqueredCount: 29,
    description: "High-frequency server cooling lake with high energy recharge.",
    badgeBg: "bg-arcade-yellow",
  },
  {
    id: "fort",
    numericId: 4,
    name: "FORT COLOSSEUM",
    zone: "South District",
    currentOwner: "IronLegion",
    guardian: "TITAN",
    guardianLevel: 15,
    reward: "0.35 MON",
    entryFee: "0.1 MON",
    rarity: "LEGENDARY",
    status: "CHALLENGEABLE",
    conqueredCount: 56,
    description: "Historic colonial stone proving ground where legends are crowned.",
    badgeBg: "bg-arcade-purple",
  },
  {
    id: "bkc",
    numericId: 5,
    name: "BKC SKYSCRAPER",
    zone: "Financial Hub",
    currentOwner: "MonadWhale",
    guardian: "SHADOW",
    guardianLevel: 11,
    reward: "0.25 MON",
    entryFee: "0.1 MON",
    rarity: "EPIC",
    status: "CHALLENGEABLE",
    conqueredCount: 64,
    description: "Rooftop glass-and-steel helipad stadium over the financial center.",
    badgeBg: "bg-arcade-coral",
  }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    player: "SHADOW_LORD",
    address: "0x4aB1...9C2D",
    topBeast: "VORTEX (Lvl 16)",
    wins: 42,
    battles: 49,
    territories: 8,
    predictionXp: 850,
    winRate: "85.7%",
    earnedMon: "12.4 MON",
  },
  {
    rank: 2,
    player: "ROHAN_X",
    address: "0x98E2...44F1",
    topBeast: "TITAN (Lvl 15)",
    wins: 36,
    battles: 44,
    territories: 6,
    predictionXp: 720,
    winRate: "81.8%",
    earnedMon: "9.8 MON",
  },
  {
    rank: 3,
    player: "ARYA_BLITZ",
    address: "0x3F81...A29C",
    topBeast: "SHADOW (Lvl 13)",
    wins: 31,
    battles: 40,
    territories: 5,
    predictionXp: 610,
    winRate: "77.5%",
    earnedMon: "7.6 MON",
  },
  {
    rank: 4,
    player: "JAYRAJ (YOU)",
    address: "0x71C9...8A2F",
    topBeast: "VORTEX (Lvl 12)",
    wins: 27,
    battles: 34,
    territories: 4,
    predictionXp: 450,
    winRate: "79.4%",
    earnedMon: "6.2 MON",
    isUser: true,
  },
  {
    rank: 5,
    player: "KABIR_MONAD",
    address: "0x11D8...3B49",
    topBeast: "BOLT (Lvl 11)",
    wins: 22,
    battles: 31,
    territories: 3,
    predictionXp: 390,
    winRate: "70.9%",
    earnedMon: "4.8 MON",
  }
];

export const MOCK_PROFILE = {
  name: "JAYRAJ",
  handle: "@jayraj_hunt",
  address: "0x71C9...8A2F",
  fullAddress: "0x71C9347B95F4D3501A39D9eEb5C2D2B095208A2F",
  monBalance: "8.42 MON",
  level: 18,
  rank: "#4 Global",
  xp: 3840,
  nextLevelXp: 5000,
  wins: 27,
  losses: 7,
  totalBattles: 34,
  winRate: "79.4%",
  earnedMon: "6.20 MON",
  territoriesOwned: 4,
  predictionXp: 450,
  beastsOwned: 3,
  badges: [
    { title: "Mumbai Conqueror", desc: "Held Andheri Arena for 24h", icon: "👑" },
    { title: "Dragon Master", desc: "Vortex reached Level 10+", icon: "🔥" },
    { title: "Oracle Eye", desc: "Predicted 5 battles correctly", icon: "🔮" },
    { title: "Blitz Pioneer", desc: "Monad Blitz Mumbai V4 Participant", icon: "⚡" },
  ],
};
