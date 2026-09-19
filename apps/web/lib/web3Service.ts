import { createPublicClient, http, formatEther, encodeFunctionData } from "viem";
import { monadTestnet } from "./monadChain";
import { CONTRACT_ADDRESSES } from "./contractAddresses";
import { BEAST_NFT_ABI, HUNT_CORE_ABI } from "./contractAbis";

export type Web3Mode = "REAL" | "DEMO";

export type TxStepStatus = "IDLE" | "SIGN" | "SUBMITTED" | "CONFIRMING" | "SETTLED" | "ERROR";

export interface SettlementMetrics {
  txHash: string;
  blockNumber?: bigint | number;
  gasUsed?: bigint | number;
  latencyMs?: number;
  signer?: string;
  status: "SETTLED" | "PENDING" | "ERROR";
  explorerUrl?: string;
}

export interface TxProgress {
  status: TxStepStatus;
  title: string;
  txHash?: string;
  blockNumber?: bigint | number;
  gasUsed?: bigint | number;
  latencyMs?: number;
  explorerUrl?: string;
  errorMessage?: string;
}

export interface OnChainBattleResult {
  battleId: string;
  player: string;
  winner: string;
  loser: string;
  playerTokenId: number;
  opponentTokenId: number;
  territoryId: number;
  rounds: number;
  nonce: number;
  deadline: number;
}

export interface IWeb3Service {
  mode: Web3Mode;
  connectWallet(): Promise<{ address: string; balance: string }>;
  getBalance(address: string): Promise<string>;
  mintStarterBeast(to: string, onProgress?: (p: TxProgress) => void): Promise<{ txHash: string; tokenId: number }>;
  joinCrew(crewId: number, onProgress?: (p: TxProgress) => void): Promise<{ txHash: string }>;
  settleBattle(
    battleResult: OnChainBattleResult,
    signature: string,
    onProgress?: (p: TxProgress) => void
  ): Promise<SettlementMetrics>;
  getHunter(address: string): Promise<any>;
  getTerritory(territoryId: number): Promise<any>;
}

// 1. DEMO SERVICE (Honest simulation with SIMULATED tagging, no fake tx hashes or fake explorer links)
export class DemoMonadService implements IWeb3Service {
  public mode: Web3Mode = "DEMO";

  public async connectWallet(): Promise<{ address: string; balance: string }> {
    return {
      address: "0x71C9347B95F4D3501A39D9eEb5C2D2B095208A2F",
      balance: "8.42 MON",
    };
  }

  public async getBalance(_address: string): Promise<string> {
    return "8.42 MON";
  }

  public async mintStarterBeast(
    _to: string,
    onProgress?: (p: TxProgress) => void
  ): Promise<{ txHash: string; tokenId: number }> {
    onProgress?.({
      status: "SIGN",
      title: "Simulating Starter Beast Claim...",
    });
    await new Promise((r) => setTimeout(r, 600));

    onProgress?.({
      status: "CONFIRMING",
      title: "Minting Starter Beast (Simulated)...",
    });
    await new Promise((r) => setTimeout(r, 800));

    const tokenId = Math.floor(Math.random() * 400 + 100);
    onProgress?.({
      status: "SETTLED",
      title: `Starter Beast Claimed (Demo Token #${tokenId})`,
    });

    return { txHash: "SIMULATED_MINT_TX", tokenId };
  }

  public async joinCrew(
    _crewId: number,
    onProgress?: (p: TxProgress) => void
  ): Promise<{ txHash: string }> {
    onProgress?.({
      status: "SIGN",
      title: "Joining Crew in Demo Mode...",
    });
    await new Promise((r) => setTimeout(r, 500));
    onProgress?.({
      status: "SETTLED",
      title: "Crew Joined (Simulated)",
    });
    return { txHash: "SIMULATED_JOIN_CREW" };
  }

  public async settleBattle(
    _battleResult: OnChainBattleResult,
    _signature: string,
    onProgress?: (p: TxProgress) => void
  ): Promise<SettlementMetrics> {
    const startTime = Date.now();
    onProgress?.({
      status: "SIGN",
      title: "Simulating EIP-712 Settlement Signing...",
    });
    await new Promise((r) => setTimeout(r, 600));

    onProgress?.({
      status: "SUBMITTED",
      title: "Settlement Broadcasted (Simulated)...",
      txHash: "SIMULATED_SETTLEMENT_TX",
    });
    await new Promise((r) => setTimeout(r, 700));

    const elapsed = Date.now() - startTime;
    const metrics: SettlementMetrics = {
      txHash: "SIMULATED_SETTLEMENT_TX",
      blockNumber: 1084221,
      gasUsed: 84210,
      latencyMs: elapsed,
      signer: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
      status: "SETTLED",
    };

    onProgress?.({
      status: "SETTLED",
      title: "Battle Settled (Simulated Mode)",
      txHash: metrics.txHash,
      blockNumber: metrics.blockNumber,
      gasUsed: metrics.gasUsed,
      latencyMs: metrics.latencyMs,
    });

    return metrics;
  }

  public async getHunter(_address: string): Promise<any> {
    return {
      rating: 1250,
      wins: 14,
      losses: 3,
      streak: 4,
      bestStreak: 7,
      crewId: 1,
      registered: true,
    };
  }

  public async getTerritory(_territoryId: number): Promise<any> {
    return {
      id: 3,
      name: "POWAI TECH HUB",
      controllingCrew: 3,
      energy: 1450,
      battleCount: 42,
    };
  }
}

// 2. REAL MONAD TESTNET SERVICE (Live Viem + MetaMask on Monad Testnet 10143)
export class RealMonadService implements IWeb3Service {
  public mode: Web3Mode = "REAL";
  public publicClient = createPublicClient({
    chain: monadTestnet,
    transport: http("https://testnet-rpc.monad.xyz/"),
  });

  private getEthereum(): any {
    if (typeof window === "undefined") return null;
    const win = window as any;
    if (win.ethereum?.providers?.length) {
      const metamask = win.ethereum.providers.find((p: any) => p.isMetaMask);
      if (metamask) return metamask;
      return win.ethereum.providers[0];
    }
    if (win.ethereum) return win.ethereum;
    return null;
  }

  public async connectWallet(): Promise<{ address: string; balance: string }> {
    const ethereum = this.getEthereum();
    if (!ethereum) {
      throw new Error("No Web3 wallet detected. Please install MetaMask to interact with Monad Testnet.");
    }

    let accounts: string[] = [];
    try {
      accounts = (await ethereum.request({ method: "eth_requestAccounts" })) as string[];
    } catch (err: any) {
      if (err?.code === -32002) {
        throw new Error("MetaMask request is already pending. Please approve in your wallet.");
      }
      if (err?.code === 4001) {
        throw new Error("MetaMask connection rejected by user.");
      }
      throw new Error(err?.message || "Failed to connect to MetaMask.");
    }

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found in MetaMask.");
    }
    const address = accounts[0];

    // Ensure Monad Testnet (10143 / 0x279f) is active
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x279f" }],
      });
    } catch (switchError: any) {
      if (switchError?.code === 4902 || switchError?.data?.originalError?.code === 4902 || switchError?.message?.includes("Unrecognized")) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x279f",
                chainName: "Monad Testnet",
                nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
                rpcUrls: ["https://testnet-rpc.monad.xyz/"],
                blockExplorerUrls: ["https://testnet.monadexplorer.com"],
              },
            ],
          });
        } catch {
          // ignore if already present
        }
      }
    }

    let balanceStr = "0.00 MON";
    try {
      const balanceWei = await this.publicClient.getBalance({ address: address as `0x${string}` });
      balanceStr = `${parseFloat(formatEther(balanceWei)).toFixed(3)} MON`;
    } catch {
      balanceStr = "0.00 MON";
    }

    return { address, balance: balanceStr };
  }

  public async getBalance(address: string): Promise<string> {
    try {
      const balanceWei = await this.publicClient.getBalance({ address: address as `0x${string}` });
      return `${parseFloat(formatEther(balanceWei)).toFixed(3)} MON`;
    } catch {
      return "0.00 MON";
    }
  }

  public async mintStarterBeast(
    to: string,
    onProgress?: (p: TxProgress) => void
  ): Promise<{ txHash: string; tokenId: number }> {
    onProgress?.({
      status: "SIGN",
      title: "Confirm Starter Beast Mint in MetaMask...",
    });

    const ethereum = this.getEthereum();
    if (!ethereum) throw new Error("Wallet not connected");

    const data = encodeFunctionData({
      abi: BEAST_NFT_ABI,
      functionName: "mintStarter",
      args: [to as `0x${string}`],
    });

    const startTime = Date.now();
    const txHash = (await ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: to,
          to: CONTRACT_ADDRESSES.BEAST_NFT,
          data,
        },
      ],
    })) as string;

    onProgress?.({
      status: "CONFIRMING",
      title: "Minting Starter Beast on Monad Testnet...",
      txHash,
      explorerUrl: `https://testnet.monadexplorer.com/tx/${txHash}`,
    });

    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    const elapsed = Date.now() - startTime;
    onProgress?.({
      status: "SETTLED",
      title: "Starter Beast Mint Confirmed!",
      txHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
      latencyMs: elapsed,
      explorerUrl: `https://testnet.monadexplorer.com/tx/${txHash}`,
    });

    return { txHash, tokenId: 1 };
  }

  public async joinCrew(
    crewId: number,
    onProgress?: (p: TxProgress) => void
  ): Promise<{ txHash: string }> {
    const ethereum = this.getEthereum();
    if (!ethereum) throw new Error("Wallet not connected");

    const accounts = (await ethereum.request({ method: "eth_accounts" })) as string[];
    const from = accounts[0];

    onProgress?.({
      status: "SIGN",
      title: "Confirm Crew Allegiance in MetaMask...",
    });

    const data = encodeFunctionData({
      abi: HUNT_CORE_ABI,
      functionName: "joinCrew",
      args: [crewId],
    });

    const txHash = (await ethereum.request({
      method: "eth_sendTransaction",
      params: [{ from, to: CONTRACT_ADDRESSES.HUNT_CORE, data }],
    })) as string;

    onProgress?.({
      status: "CONFIRMING",
      title: "Registering Crew on Monad Testnet...",
      txHash,
      explorerUrl: `https://testnet.monadexplorer.com/tx/${txHash}`,
    });

    await this.publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    onProgress?.({
      status: "SETTLED",
      title: "Crew Joined Successfully!",
      txHash,
      explorerUrl: `https://testnet.monadexplorer.com/tx/${txHash}`,
    });

    return { txHash };
  }

  public async settleBattle(
    battleResult: OnChainBattleResult,
    signature: string,
    onProgress?: (p: TxProgress) => void
  ): Promise<SettlementMetrics> {
    const ethereum = this.getEthereum();
    if (!ethereum) throw new Error("Wallet not connected for live settlement");

    const accounts = (await ethereum.request({ method: "eth_accounts" })) as string[];
    const from = accounts[0];

    onProgress?.({
      status: "SIGN",
      title: "Prompting Wallet for On-Chain Settlement Submission...",
    });

    const battleStruct = {
      battleId: battleResult.battleId as `0x${string}`,
      player: battleResult.player as `0x${string}`,
      winner: battleResult.winner as `0x${string}`,
      loser: battleResult.loser as `0x${string}`,
      playerTokenId: BigInt(battleResult.playerTokenId),
      opponentTokenId: BigInt(battleResult.opponentTokenId),
      territoryId: battleResult.territoryId,
      rounds: battleResult.rounds,
      nonce: BigInt(battleResult.nonce),
      deadline: BigInt(battleResult.deadline),
    };

    const data = encodeFunctionData({
      abi: HUNT_CORE_ABI,
      functionName: "settleBattle",
      args: [battleStruct, signature as `0x${string}`],
    });

    const startTime = Date.now();
    const txHash = (await ethereum.request({
      method: "eth_sendTransaction",
      params: [{ from, to: CONTRACT_ADDRESSES.HUNT_CORE, data }],
    })) as string;

    onProgress?.({
      status: "SUBMITTED",
      title: "Settlement Transaction Submitted",
      txHash,
      explorerUrl: `https://testnet.monadexplorer.com/tx/${txHash}`,
    });

    onProgress?.({
      status: "CONFIRMING",
      title: "Waiting for Monad Testnet Block Receipt...",
      txHash,
      explorerUrl: `https://testnet.monadexplorer.com/tx/${txHash}`,
    });

    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    const latencyMs = Date.now() - startTime;

    const metrics: SettlementMetrics = {
      txHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
      latencyMs,
      signer: CONTRACT_ADDRESSES.SETTLER,
      status: receipt.status === "success" ? "SETTLED" : "ERROR",
      explorerUrl: `https://testnet.monadexplorer.com/tx/${txHash}`,
    };

    onProgress?.({
      status: "SETTLED",
      title: "Battle Settled On-Chain!",
      txHash: metrics.txHash,
      blockNumber: metrics.blockNumber,
      gasUsed: metrics.gasUsed,
      latencyMs: metrics.latencyMs,
      explorerUrl: metrics.explorerUrl,
    });

    return metrics;
  }

  public async getHunter(address: string): Promise<any> {
    try {
      const hunter = await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES.HUNT_CORE,
        abi: HUNT_CORE_ABI,
        functionName: "getHunter",
        args: [address as `0x${string}`],
      });
      return hunter;
    } catch {
      return null;
    }
  }

  public async getTerritory(territoryId: number): Promise<any> {
    try {
      const data = await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES.HUNT_CORE,
        abi: HUNT_CORE_ABI,
        functionName: "getTerritory",
        args: [territoryId],
      });
      return data;
    } catch {
      return null;
    }
  }
}

export function getWeb3Service(mode: Web3Mode): IWeb3Service {
  if (mode === "REAL") {
    return new RealMonadService();
  }
  return new DemoMonadService();
}
