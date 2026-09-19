import { NextResponse } from "next/server";
import { keccak256, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { CONTRACT_ADDRESSES } from "@/lib/contractAddresses";
import { BattleEngine } from "@/game/BattleEngine";
import { MOCK_BEASTS } from "@/data/mockData";
import { CombatAction } from "@/game/BattleAction";

// Dedicated server-side settlement signer key (never exposed to frontend)
const SETTLEMENT_SIGNER_KEY = (process.env.SETTLEMENT_SIGNER_PRIVATE_KEY ||
  process.env.RESOLVER_PRIVATE_KEY ||
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80") as `0x${string}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { battleId, playerAddress, opponentAddress, playerBeastId, opponentBeastId, moves, territoryId } = body;

    if (!battleId || !playerAddress || !moves) {
      return NextResponse.json({ error: "Missing required battle settlement parameters" }, { status: 400 });
    }

    // 1. Re-verify the battle deterministically on server
    const pBeast = MOCK_BEASTS.find((b) => b.id === playerBeastId) || MOCK_BEASTS[0];
    const oBeast = MOCK_BEASTS.find((b) => b.id === opponentBeastId) || MOCK_BEASTS[1];

    const config = {
      battleId,
      seed: `seed_mumbai_${territoryId || 1}_${pBeast.tokenId}_${oBeast.tokenId}`,
      playerBeast: pBeast,
      opponentBeast: oBeast,
      territoryId: String(territoryId || 1),
      maxRounds: 10,
    };

    // Deterministic replay
    const verifiedResult = BattleEngine.replay(config, moves as CombatAction[]);

    const isWinnerPlayer = verifiedResult.winner === "PLAYER";
    const winner = (isWinnerPlayer ? playerAddress : (opponentAddress || "0x0000000000000000000000000000000000000000")) as `0x${string}`;
    const loser = (isWinnerPlayer ? (opponentAddress || "0x0000000000000000000000000000000000000000") : playerAddress) as `0x${string}`;

    const nonce = Math.floor(Math.random() * 900000) + 100000;
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour validity
    const chainId = 10143; // Monad Testnet

    // Format bytes32 battleId
    let bytes32BattleId = battleId.startsWith("0x") ? battleId : keccak256(toHex(battleId));
    if (bytes32BattleId.length < 66) {
      bytes32BattleId = "0x" + bytes32BattleId.slice(2).padStart(64, "0");
    }

    const battleResultData = {
      battleId: bytes32BattleId as `0x${string}`,
      player: playerAddress as `0x${string}`,
      winner,
      loser,
      playerTokenId: BigInt(pBeast.tokenId || 1),
      opponentTokenId: BigInt(oBeast.tokenId || 2),
      territoryId: Number(territoryId || 1),
      rounds: Number(verifiedResult.roundsCompleted || 3),
      nonce: BigInt(nonce),
      deadline: BigInt(deadline),
    };

    // 2. EIP-712 Typed Structured Data Signing
    const domain = {
      name: "MonadHuntCore",
      version: "1",
      chainId: chainId,
      verifyingContract: CONTRACT_ADDRESSES.HUNT_CORE,
    } as const;

    const types = {
      BattleResult: [
        { name: "battleId", type: "bytes32" },
        { name: "player", type: "address" },
        { name: "winner", type: "address" },
        { name: "loser", type: "address" },
        { name: "playerTokenId", type: "uint256" },
        { name: "opponentTokenId", type: "uint256" },
        { name: "territoryId", type: "uint16" },
        { name: "rounds", type: "uint32" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    } as const;

    const oracleAccount = privateKeyToAccount(SETTLEMENT_SIGNER_KEY);
    const signature = await oracleAccount.signTypedData({
      domain,
      types,
      primaryType: "BattleResult",
      message: battleResultData,
    });

    return NextResponse.json({
      success: true,
      battleResult: {
        battleId: bytes32BattleId,
        player: playerAddress,
        winner,
        loser,
        playerTokenId: pBeast.tokenId || 1,
        opponentTokenId: oBeast.tokenId || 2,
        territoryId: Number(territoryId || 1),
        rounds: verifiedResult.roundsCompleted,
        nonce,
        deadline,
      },
      signature,
      isWinnerPlayer,
      resultHash: verifiedResult.resultHash,
      signer: oracleAccount.address,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message || "Internal settlement error" }, { status: 500 });
  }
}
