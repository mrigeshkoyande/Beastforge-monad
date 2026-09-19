import { RoundActionResult } from "./BattleAction";

export interface BattleResult {
  battleId: string;
  seed: string;
  winner: "PLAYER" | "OPPONENT" | "DRAW";
  roundsCompleted: number;
  playerFinalHp: number;
  opponentFinalHp: number;
  totalDamageDealtByPlayer: number;
  totalDamageDealtByOpponent: number;
  history: RoundActionResult[];
  resultHash: string;
}
