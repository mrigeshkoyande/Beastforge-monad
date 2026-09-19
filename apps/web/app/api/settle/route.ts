import { NextResponse } from "next/server";
import { keccak256, encodeAbiParameters, parseAbiParameters, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { CONTRACT_ADDRESSES } from "@/lib/contractAddresses";
import { BattleEngine } from "@/game/BattleEngine";
import { MOCK_BEASTS } from "@/data/mockData";
import { CombatAction } from "@/game/BattleAction";

// Dedicated server-side oracle signer key (never exposed to frontend)
const SERVER_ORACLE_KEY = (process.env.RESOLVER_PRIVATE_KEY ||
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80") as `0x${string}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { battleId, playerAddress, playerBeastId, opponentBeastId, moves, territoryId } = body;

    if (!battleId || !playerAddress || !moves) {
      return NextResponse.json({ error: "Missing required battle settlement parameters" }, { status: 400 });
    }

    // 1. Re-verify the battle independently on the server using deterministic engine
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

    // Replay moves deterministically on server
    const verifiedResult = BattleEngine.replay(config, moves as CombatAction[]);

    const isWinnerPlayer = verifiedResult.winner === "PLAYER";
    const winner = isWinnerPlayer ? (playerAddress as `0x${string}`) : ("0x0000000000000000000000000000000000000000" as `0x${string}`);
    const rewardWei = isWinnerPlayer ? parseEther("0.18") : BigInt(0);

    const nonce = Math.floor(Math.random() * 900000) + 100000;
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour validity
    const chainId = BigInt(10143); // Monad Testnet

    // Format bytes32 battleId
    let bytes32BattleId = battleId.startsWith("0x") ? battleId : keccak256(Buffer.from(battleId));
    if (bytes32BattleId.length < 66) {
      bytes32BattleId = "0x" + bytes32BattleId.slice(2).padStart(64, "0");
    }

    // 2. Construct digest matching Arena.sol exact ABI encoding:
    // keccak256(abi.encode(battleId, player, winner, rewardAmount, nonce, deadline, block.chainid, address(this)))
    const messageHash = keccak256(
      encodeAbiParameters(
        parseAbiParameters("bytes32, address, address, uint256, uint256, uint256, uint256, address"),
        [
          bytes32BattleId as `0x${string}`,
          playerAddress as `0x${string}`,
          winner,
          rewardWei,
          BigInt(nonce),
          BigInt(deadline),
          chainId,
          CONTRACT_ADDRESSES.ARENA,
        ]
      )
    );

    // 3. Sign using server's authorized resolver account
    const oracleAccount = privateKeyToAccount(SERVER_ORACLE_KEY);
    const signature = await oracleAccount.signMessage({
      message: { raw: messageHash },
    });

    return NextResponse.json({
      success: true,
      battleId: bytes32BattleId,
      player: playerAddress,
      winner,
      isWinnerPlayer,
      rewardAmount: isWinnerPlayer ? "0.18" : "0",
      rewardWei: rewardWei.toString(),
      nonce,
      deadline,
      signature,
      resultHash: verifiedResult.resultHash,
      roundsCompleted: verifiedResult.roundsCompleted,
      signer: oracleAccount.address,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message || "Internal settlement error" }, { status: 500 });
  }
}
