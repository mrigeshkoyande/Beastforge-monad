import { CombatAction, AIPersonality } from "./BattleAction";
import { FighterBattleStats } from "./BattleState";

// Mulberry32 deterministic 32-bit PRNG
export class SeededRandom {
  private state: number;

  constructor(seedString: string) {
    let h = 1779033703 ^ seedString.length;
    for (let i = 0; i < seedString.length; i++) {
      h = Math.imul(h ^ seedString.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    this.state = h >>> 0;
  }

  // Returns float in [0, 1)
  public nextFloat(): number {
    this.state = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    this.state = (this.state + Math.imul(this.state ^ (this.state >>> 7), 61 | this.state)) ^ this.state;
    return ((this.state ^ (this.state >>> 14)) >>> 0) / 4294967296;
  }

  // Returns integer in [min, max]
  public nextInt(min: number, max: number): number {
    return Math.floor(this.nextFloat() * (max - min + 1)) + min;
  }
}

export class AIStrategy {
  public static selectAction(
    personality: AIPersonality,
    aiFighter: FighterBattleStats,
    playerFighter: FighterBattleStats,
    lastPlayerAction: CombatAction | null,
    rng: SeededRandom
  ): CombatAction {
    const roll = rng.nextFloat();
    const canUseSpecial = aiFighter.energy >= 35;

    switch (personality) {
      case "Aggressive": {
        if (canUseSpecial && roll < 0.35) return "SPECIAL";
        if (roll < 0.85) return "ATTACK";
        if (roll < 0.95) return "DODGE";
        return "DEFEND";
      }

      case "Defensive": {
        // Prefers defending and conserving energy until high
        if (aiFighter.currentHp < aiFighter.maxHp * 0.4 && roll < 0.7) {
          return "DEFEND";
        }
        if (canUseSpecial && aiFighter.energy >= 70 && roll < 0.5) {
          return "SPECIAL";
        }
        if (roll < 0.55) return "DEFEND";
        if (roll < 0.85) return "ATTACK";
        return "DODGE";
      }

      case "Tactical": {
        // Adapts based on player state & last move
        if (lastPlayerAction === "DEFEND" && canUseSpecial) {
          return "SPECIAL"; // Pierce defense with special
        }
        if (playerFighter.energy >= 35 && roll < 0.5) {
          return "DEFEND"; // Expect player's special move
        }
        if (aiFighter.currentHp < aiFighter.maxHp * 0.35 && roll < 0.6) {
          return "DEFEND";
        }
        if (canUseSpecial && roll < 0.4) {
          return "SPECIAL";
        }
        if (roll < 0.75) return "ATTACK";
        return "DODGE";
      }

      case "Chaotic":
      default: {
        if (canUseSpecial && roll < 0.4) return "SPECIAL";
        if (roll < 0.65) return "ATTACK";
        if (roll < 0.85) return "DODGE";
        return "DEFEND";
      }
    }
  }
}
