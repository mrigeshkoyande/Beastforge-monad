export type CombatAction = "ATTACK" | "DEFEND" | "SPECIAL" | "DODGE";

export type AIPersonality = "Aggressive" | "Defensive" | "Tactical" | "Chaotic";

export interface RoundActionResult {
  round: number;
  playerAction: CombatAction;
  opponentAction: CombatAction;
  playerDamageTaken: number;
  opponentDamageTaken: number;
  playerBlocked: boolean;
  opponentBlocked: boolean;
  playerDodged: boolean;
  opponentDodged: boolean;
  playerCrit: boolean;
  opponentCrit: boolean;
  playerEnergyChange: number;
  opponentEnergyChange: number;
  commentary: string[];
}
