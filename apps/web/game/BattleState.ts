import { Beast } from "@/data/mockData";
import { CombatAction, RoundActionResult } from "./BattleAction";

export interface FighterBattleStats {
  id: string;
  name: string;
  level: number;
  attack: number;
  defense: number;
  speed: number;
  maxHp: number;
  currentHp: number;
  energy: number;
  maxEnergy: number;
  specialMove: string;
  personality?: "Aggressive" | "Defensive" | "Tactical" | "Chaotic";
}

export interface BattleConfig {
  battleId: string;
  seed: string;
  playerBeast: Beast;
  opponentBeast: Beast;
  territoryId: string;
  maxRounds?: number;
}

export interface BattleState {
  battleId: string;
  seed: string;
  currentRound: number;
  maxRounds: number;
  player: FighterBattleStats;
  opponent: FighterBattleStats;
  status: "INITIALIZING" | "IN_PROGRESS" | "RESOLVED";
  winner: "PLAYER" | "OPPONENT" | "DRAW" | null;
  history: RoundActionResult[];
  lastResult?: RoundActionResult;
}
