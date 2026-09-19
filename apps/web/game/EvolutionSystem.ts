export type EvolutionStage = "BASE" | "PRIME" | "OMEGA";

export interface BeastAbility {
  id: string;
  name: string;
  description: string;
  energyCost: number;
  multiplier: number;
  unlockedAtLevel: number;
  icon: string;
}

export interface BeastProgression {
  stage: EvolutionStage;
  currentXp: number;
  nextLevelXp: number;
  level: number;
  winStreak: number;
  abilities: BeastAbility[];
  unlockedAbilities: string[];
}

export interface TerritoryWarBattle {
  id: string;
  timestamp: string;
  attacker: string;
  attackerBeast: string;
  defender: string;
  defenderBeast: string;
  won: boolean;
  rewardEarned: string;
}

export type TerritoryStatus =
  | "STABLE"
  | "CONTESTED"
  | "UNDER ATTACK"
  | "DEFENDING"
  | "LIVE ARENA"
  | "DOMINATED"
  | "CHALLENGEABLE"
  | "FORTIFIED";

export interface TerritoryWarState {
  id: string;
  numericId: number;
  name: string;
  zone: string;
  currentOwner: string;
  ownerAvatar?: string;
  guardian: string;
  guardianLevel: number;
  guardianStage: EvolutionStage;
  defenseLevel: number; // 1 to 5
  maxDefenseLevel: number;
  defenseHp: number; // defense points remaining
  winStreak: number;
  rewardMultiplier: number; // e.g. 1.0, 1.2, 1.5, 2.0
  baseReward: string;
  entryFee: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  status: TerritoryStatus;
  conqueredCount: number;
  description: string;
  badgeBg: string;
  // Real-World Mumbai Interactive Map Coordinates
  mapCoordinates: { x: number; y: number }; // percentage on interactive map canvas
  landmark: string;
  district: string;
  controllingCrewId?: number;
  crewInfluence?: number[];
  recentBattles: TerritoryWarBattle[];
}

export interface AchievementItem {
  id: number;
  name: string;
  code:
    | "FIRST_BLOOD"
    | "THREE_PEAT"
    | "TERRITORY_HUNTER"
    | "CREW_WARRIOR"
    | "CITY_HUNTER"
    | "ARENA_CHAMPION"
    | "WARRIOR"
    | "UNSTOPPABLE"
    | "CONQUEROR"
    | "MONAD_CHAMPION";
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  txHash?: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
}

// Evolution config by beast name and level
export const EVOLUTION_CONFIG: Record<
  string,
  {
    baseName: string;
    primeLevel: number;
    primeName: string;
    omegaLevel: number;
    omegaName: string;
    abilities: BeastAbility[];
  }
> = {
  vortex: {
    baseName: "VORTEX",
    primeLevel: 15,
    primeName: "VORTEX PRIME",
    omegaLevel: 25,
    omegaName: "VORTEX OMEGA",
    abilities: [
      {
        id: "flame_dart",
        name: "Flame Dart",
        description: "Swift dart of fire dealing fast piercing damage.",
        energyCost: 30,
        multiplier: 1.2,
        unlockedAtLevel: 1,
        icon: "Flame",
      },
      {
        id: "fire_blast",
        name: "Fire Blast",
        description: "Torrent of 2000° plasma that melts armor.",
        energyCost: 60,
        multiplier: 1.8,
        unlockedAtLevel: 10,
        icon: "Zap",
      },
      {
        id: "supernova",
        name: "Supernova Flare",
        description: "Cataclysmic solar detonation piercing 100% defense.",
        energyCost: 90,
        multiplier: 2.6,
        unlockedAtLevel: 20,
        icon: "Sparkles",
      },
    ],
  },
  titan: {
    baseName: "TITAN",
    primeLevel: 15,
    primeName: "TITAN PRIME",
    omegaLevel: 25,
    omegaName: "TITAN OMEGA",
    abilities: [
      {
        id: "rock_throw",
        name: "Rock Throw",
        description: "Hurls heavy granite boulders at the opponent.",
        energyCost: 30,
        multiplier: 1.1,
        unlockedAtLevel: 1,
        icon: "Shield",
      },
      {
        id: "earthquake",
        name: "Earthquake",
        description: "Shakes the bedrock dealing crushing area impact.",
        energyCost: 60,
        multiplier: 1.7,
        unlockedAtLevel: 10,
        icon: "Activity",
      },
      {
        id: "tectonic_slam",
        name: "Tectonic Shatter",
        description: "Splits the continental shelf in two under rival beast.",
        energyCost: 90,
        multiplier: 2.5,
        unlockedAtLevel: 20,
        icon: "Zap",
      },
    ],
  },
  shadow: {
    baseName: "SHADOW",
    primeLevel: 15,
    primeName: "SHADOW PRIME",
    omegaLevel: 25,
    omegaName: "SHADOW OMEGA",
    abilities: [
      {
        id: "shadow_claw",
        name: "Shadow Claw",
        description: "Quick slash imbued with void energy.",
        energyCost: 30,
        multiplier: 1.3,
        unlockedAtLevel: 1,
        icon: "Moon",
      },
      {
        id: "void_strike",
        name: "Void Strike",
        description: "Teleports into blind-spot with guaranteed critical damage.",
        energyCost: 60,
        multiplier: 1.9,
        unlockedAtLevel: 10,
        icon: "Ghost",
      },
      {
        id: "abyssal_rift",
        name: "Abyssal Rift",
        description: "Opens an event horizon swallowing opponent energy.",
        energyCost: 90,
        multiplier: 2.7,
        unlockedAtLevel: 20,
        icon: "Sparkles",
      },
    ],
  },
  bolt: {
    baseName: "BOLT",
    primeLevel: 15,
    primeName: "BOLT PRIME",
    omegaLevel: 25,
    omegaName: "BOLT OMEGA",
    abilities: [
      {
        id: "spark_jab",
        name: "Spark Jab",
        description: "Quick electric prod to interrupt rival momentum.",
        energyCost: 30,
        multiplier: 1.2,
        unlockedAtLevel: 1,
        icon: "Zap",
      },
      {
        id: "thunder_blitz",
        name: "Thunder Blitz",
        description: "Tri-burst lightning arc that shocks rival beast.",
        energyCost: 60,
        multiplier: 1.85,
        unlockedAtLevel: 10,
        icon: "Zap",
      },
      {
        id: "plasma_storm",
        name: "Plasma Storm",
        description: "Unleashes 1,000,000 volts in an inescapable tempest.",
        energyCost: 90,
        multiplier: 2.6,
        unlockedAtLevel: 20,
        icon: "Sun",
      },
    ],
  },
};

/**
 * Calculates XP, Level, and Evolution Stage progression after a battle.
 */
export function calculatePostBattleProgression(
  currentLevel: number,
  currentXp: number,
  isVictory: boolean,
  currentWinStreak: number,
  defenseBonusMultiplier: number = 1.0
): {
  newLevel: number;
  newXp: number;
  nextLevelXp: number;
  xpGained: number;
  leveledUp: boolean;
  evolved: boolean;
  newStage: EvolutionStage;
  unlockedAbility: BeastAbility | null;
  newWinStreak: number;
} {
  const baseXp = isVictory ? 150 : 45;
  const xpGained = Math.round(baseXp * defenseBonusMultiplier);
  let newXp = currentXp + xpGained;
  let newLevel = currentLevel;
  let leveledUp = false;

  const nextLevelXp = newLevel * 100;

  if (newXp >= nextLevelXp) {
    newLevel += 1;
    newXp = newXp - nextLevelXp;
    leveledUp = true;
  }

  let newStage: EvolutionStage = "BASE";
  if (newLevel >= 25) {
    newStage = "OMEGA";
  } else if (newLevel >= 15) {
    newStage = "PRIME";
  }

  const prevStage: EvolutionStage = currentLevel >= 25 ? "OMEGA" : currentLevel >= 15 ? "PRIME" : "BASE";
  const evolved = newStage !== prevStage;

  const newWinStreak = isVictory ? currentWinStreak + 1 : 0;

  let unlockedAbility: BeastAbility | null = null;
  const beastConf = EVOLUTION_CONFIG.vortex;
  if (leveledUp && beastConf) {
    const ability = beastConf.abilities.find((a) => a.unlockedAtLevel === newLevel);
    if (ability) unlockedAbility = ability;
  }

  return {
    newLevel,
    newXp,
    nextLevelXp: newLevel * 100,
    xpGained,
    leveledUp,
    evolved,
    newStage,
    unlockedAbility,
    newWinStreak,
  };
}
