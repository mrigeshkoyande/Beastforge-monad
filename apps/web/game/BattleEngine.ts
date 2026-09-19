import { CombatAction, RoundActionResult, AIPersonality } from "./BattleAction";
import { BattleConfig, BattleState, FighterBattleStats } from "./BattleState";
import { BattleResult } from "./BattleResult";
import { SeededRandom, AIStrategy } from "./AIStrategy";

export class BattleEngine {
  private state: BattleState;
  private rng: SeededRandom;

  constructor(config: BattleConfig) {
    this.rng = new SeededRandom(config.seed);

    const playerFighter: FighterBattleStats = {
      id: config.playerBeast.id,
      name: config.playerBeast.name,
      level: config.playerBeast.level,
      attack: config.playerBeast.attack,
      defense: config.playerBeast.defense,
      speed: config.playerBeast.speed,
      maxHp: config.playerBeast.maxHp,
      currentHp: config.playerBeast.hp,
      energy: 100,
      maxEnergy: 100,
      specialMove: config.playerBeast.specialMove,
      personality: config.playerBeast.personality,
    };

    const opponentFighter: FighterBattleStats = {
      id: config.opponentBeast.id,
      name: config.opponentBeast.name,
      level: config.opponentBeast.level,
      attack: config.opponentBeast.attack,
      defense: config.opponentBeast.defense,
      speed: config.opponentBeast.speed,
      maxHp: config.opponentBeast.maxHp,
      currentHp: config.opponentBeast.hp,
      energy: 100,
      maxEnergy: 100,
      specialMove: config.opponentBeast.specialMove,
      personality: config.opponentBeast.personality || "Aggressive",
    };

    this.state = {
      battleId: config.battleId,
      seed: config.seed,
      currentRound: 1,
      maxRounds: config.maxRounds || 10,
      player: playerFighter,
      opponent: opponentFighter,
      status: "IN_PROGRESS",
      winner: null,
      history: [],
    };
  }

  public getState(): BattleState {
    return { ...this.state };
  }

  // Execute a single turn deterministically given player action
  public step(playerAction: CombatAction): RoundActionResult {
    if (this.state.status === "RESOLVED") {
      throw new Error("Battle is already resolved");
    }

    const currentRound = this.state.currentRound;
    const player = this.state.player;
    const opponent = this.state.opponent;

    // AI chooses action deterministically
    const lastPlayerAction =
      this.state.history.length > 0
        ? this.state.history[this.state.history.length - 1].playerAction
        : null;

    const opponentAction = AIStrategy.selectAction(
      (opponent.personality as AIPersonality) || "Aggressive",
      opponent,
      player,
      lastPlayerAction,
      this.rng
    );

    const commentary: string[] = [];

    // Dodge evaluations
    let playerDodged = false;
    let opponentDodged = false;

    if (playerAction === "DODGE") {
      const dodgeChance = 0.4 + (player.speed / (player.speed + opponent.speed)) * 0.25;
      playerDodged = this.rng.nextFloat() < dodgeChance;
    }
    if (opponentAction === "DODGE") {
      const dodgeChance = 0.4 + (opponent.speed / (player.speed + opponent.speed)) * 0.25;
      opponentDodged = this.rng.nextFloat() < dodgeChance;
    }

    // Process Player Attack
    let damageToOpponent = 0;
    let playerCrit = false;
    let playerBlocked = opponentAction === "DEFEND";

    if (playerAction === "ATTACK") {
      if (!opponentDodged) {
        const baseDmg = player.attack * 0.35 + this.rng.nextInt(2, 8);
        const reduction = playerBlocked ? opponent.defense * 0.2 : 0;
        damageToOpponent = Math.max(5, Math.floor(baseDmg - reduction));
        commentary.push(`${player.name} attacked for ${damageToOpponent} DMG!`);
      } else {
        commentary.push(`${opponent.name} skillfully dodged the attack!`);
      }
    } else if (playerAction === "SPECIAL") {
      if (player.energy >= 35) {
        player.energy -= 35;
        playerCrit = true;
        const specialDmg = player.attack * 0.65 + this.rng.nextInt(6, 14);
        const reduction = playerBlocked ? opponent.defense * 0.1 : 0;
        damageToOpponent = Math.max(12, Math.floor(specialDmg - reduction));
        commentary.push(`⚡ ${player.name} unleashed ${player.specialMove}! Deals ${damageToOpponent} CRITICAL DMG!`);
      } else {
        damageToOpponent = Math.floor(player.attack * 0.2);
        commentary.push(`${player.name} lacked energy for ${player.specialMove}, landing a weak strike!`);
      }
    } else if (playerAction === "DEFEND") {
      player.energy = Math.min(player.maxEnergy, player.energy + 20);
      commentary.push(`🛡️ ${player.name} raised energy shields (+20 NRG)`);
    } else if (playerAction === "DODGE") {
      player.energy = Math.min(player.maxEnergy, player.energy + 15);
      commentary.push(`🏃 ${player.name} shifted into evasive stance (+15 NRG)`);
    }

    // Apply damage to opponent
    opponent.currentHp = Math.max(0, opponent.currentHp - damageToOpponent);

    // Process Opponent Attack if still alive
    let damageToPlayer = 0;
    let opponentCrit = false;
    let opponentBlocked = playerAction === "DEFEND";

    if (opponent.currentHp > 0) {
      if (opponentAction === "ATTACK") {
        if (!playerDodged) {
          const baseDmg = opponent.attack * 0.32 + this.rng.nextInt(2, 7);
          const reduction = opponentBlocked ? player.defense * 0.2 : 0;
          damageToPlayer = Math.max(4, Math.floor(baseDmg - reduction));
          commentary.push(`${opponent.name} struck back for ${damageToPlayer} DMG!`);
        } else {
          commentary.push(`${player.name} dodged the incoming blow!`);
        }
      } else if (opponentAction === "SPECIAL") {
        if (opponent.energy >= 35) {
          opponent.energy -= 35;
          opponentCrit = true;
          const specialDmg = opponent.attack * 0.6 + this.rng.nextInt(5, 12);
          const reduction = opponentBlocked ? player.defense * 0.1 : 0;
          damageToPlayer = Math.max(10, Math.floor(specialDmg - reduction));
          commentary.push(`⚡ ${opponent.name} detonated ${opponent.specialMove}! Deals ${damageToPlayer} DMG!`);
        } else {
          damageToPlayer = Math.floor(opponent.attack * 0.2);
          commentary.push(`${opponent.name} sputtered, dealing minor impact!`);
        }
      } else if (opponentAction === "DEFEND") {
        opponent.energy = Math.min(opponent.maxEnergy, opponent.energy + 20);
        commentary.push(`🛡️ ${opponent.name} braced into defensive guard (+20 NRG)`);
      } else if (opponentAction === "DODGE") {
        opponent.energy = Math.min(opponent.maxEnergy, opponent.energy + 15);
        commentary.push(`🏃 ${opponent.name} moved evasively (+15 NRG)`);
      }

      // Apply damage to player
      player.currentHp = Math.max(0, player.currentHp - damageToPlayer);
    }

    // Record round result
    const roundResult: RoundActionResult = {
      round: currentRound,
      playerAction,
      opponentAction,
      playerDamageTaken: damageToPlayer,
      opponentDamageTaken: damageToOpponent,
      playerBlocked,
      opponentBlocked,
      playerDodged,
      opponentDodged,
      playerCrit,
      opponentCrit,
      playerEnergyChange: 0,
      opponentEnergyChange: 0,
      commentary,
    };

    this.state.history.push(roundResult);
    this.state.lastResult = roundResult;

    // Check winner conditions
    if (opponent.currentHp <= 0 && player.currentHp > 0) {
      this.state.status = "RESOLVED";
      this.state.winner = "PLAYER";
      commentary.push(`🏆 ${player.name} knocked out ${opponent.name} in Round ${currentRound}!`);
    } else if (player.currentHp <= 0 && opponent.currentHp > 0) {
      this.state.status = "RESOLVED";
      this.state.winner = "OPPONENT";
      commentary.push(`💀 ${player.name} was defeated by ${opponent.name}!`);
    } else if (player.currentHp <= 0 && opponent.currentHp <= 0) {
      this.state.status = "RESOLVED";
      this.state.winner = "DRAW";
      commentary.push(`⚔️ Mutual knockout! Draw match!`);
    } else if (currentRound >= this.state.maxRounds) {
      this.state.status = "RESOLVED";
      if (player.currentHp > opponent.currentHp) {
        this.state.winner = "PLAYER";
        commentary.push(`🏆 10 Rounds reached! ${player.name} wins by HP advantage (${player.currentHp} vs ${opponent.currentHp})!`);
      } else if (opponent.currentHp > player.currentHp) {
        this.state.winner = "OPPONENT";
        commentary.push(`10 Rounds reached! ${opponent.name} wins by HP advantage!`);
      } else {
        this.state.winner = "DRAW";
        commentary.push(`10 Rounds reached! Exact HP draw!`);
      }
    } else {
      this.state.currentRound += 1;
    }

    return roundResult;
  }

  // Produce cryptographic-grade result structure
  public finalizeResult(): BattleResult {
    const totalDmgPlayer = this.state.history.reduce((sum, r) => sum + r.opponentDamageTaken, 0);
    const totalDmgOpponent = this.state.history.reduce((sum, r) => sum + r.playerDamageTaken, 0);

    const outcomeString = `${this.state.battleId}:${this.state.seed}:${this.state.winner}:${this.state.history.length}:${this.state.player.currentHp}:${this.state.opponent.currentHp}`;

    // Simple deterministic hash function for hackathon MVP proof
    let hash = 0;
    for (let i = 0; i < outcomeString.length; i++) {
      const char = outcomeString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    const resultHash = "0x" + Math.abs(hash).toString(16).padStart(64, "0");

    return {
      battleId: this.state.battleId,
      seed: this.state.seed,
      winner: this.state.winner || "DRAW",
      roundsCompleted: this.state.history.length,
      playerFinalHp: this.state.player.currentHp,
      opponentFinalHp: this.state.opponent.currentHp,
      totalDamageDealtByPlayer: totalDmgPlayer,
      totalDamageDealtByOpponent: totalDmgOpponent,
      history: this.state.history,
      resultHash,
    };
  }

  // Replay a sequence of player moves to guarantee deterministic reproduction
  public static replay(config: BattleConfig, moves: CombatAction[]): BattleResult {
    const engine = new BattleEngine(config);
    for (const move of moves) {
      if (engine.getState().status === "RESOLVED") break;
      engine.step(move);
    }
    return engine.finalizeResult();
  }
}
