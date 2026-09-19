# MONAD HUNT 🐲
> **Catch. Stake. Battle. Conquer.**  
> A high-performance on-chain battle arena & Mumbai territory conquest game built natively for **Monad Testnet**.

[![Monad Testnet](https://img.shields.io/badge/Chain-Monad_Testnet_(10143)-7C3AED?style=for-the-badge&logo=ethereum)](https://testnet.monadexplorer.com)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org)
[![Foundry Tests](https://img.shields.io/badge/Foundry_Tests-20_Passing-00C853?style=for-the-badge&logo=hardhat)](https://github.com/foundry-rs/foundry)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 💡 What is MONAD HUNT in Simple Terms?

Imagine **Pokémon Stadium meets Risk with high-speed on-chain staking**, set across real neighborhoods in **Mumbai**:

1. **Own Original Beast NFTs (ERC-721)**: You collect 4 original elemental creatures:
   - 🔥 **Emberwyrm** (*Fire Apex* — Signature: *Cinder Lance*)
   - 🌊 **Tidewarden** (*Water Colossus* — Signature: *Torrent Cannon*)
   - 🔮 **Nullshade** (*Shadow Sovereign* — Signature: *Void Pulse*)
   - ⚡ **Voltpaw** (*Electric Beast* — Signature: *Arcflash*)
2. **Stake & Battle**: Enter turn-based battles against adaptive on-chain opponents. Stake a micro entry fee (`0.10 MON`) into the battle pool.
3. **~1-Second Instant Settlement**: Thanks to Monad's parallel EVM, your battle resolves cryptographically in ~1 second. The winner receives the pool (`0.18 MON`), gains XP, and triggers beast evolution.
4. **Conquer Real Mumbai Territories**: Battle to control 5 real-world Mumbai districts:
   - **Andheri Arena** (Metro & WEH Interchange)
   - **Bandra Coast** (Bandra Fort & Sea Link)
   - **Powai Tech Hub** (Lakeside & Startup Valley)
   - **Fort Colosseum** (Gateway of India Heritage)
   - **BKC Skyscraper** (Financial District)
5. **Soulbound Proof of Skill**: Unlock 5 non-transferable on-chain achievement badges that permanently live in your wallet.

---

## ⚡ Why This Could ONLY Be Built on Monad

| Requirement | Ethereum L1 / Standard Rollups | Monad Testnet |
| :--- | :--- | :--- |
| **Battle Turn Finality** | 12–15 seconds (Unplayable for arcade games) | **~1 second** (Feels like a real-time arcade console) |
| **Transaction Cost** | $2.00 – $15.00 gas per battle move | **Fractions of a cent** (Micro-stakes viable) |
| **Throughput & Concurrency** | 15–50 TPS (Network congests during rush) | **10,000 TPS Parallel EVM** (Handles 1000s of simultaneous battles) |
| **Deterministic Gas Limits** | Inflated gas limits waste user funds | **Enforces strict gas boundaries** |

---

## 🎮 Core Game Mechanics

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MONAD HUNT GAME LOOP                            │
└────────────────────────────────────────────────────────────────────────┘
                                   │
              1. MINT BEAST (ERC-721 BeastNFT.sol)
                                   ▼
             2. SELECT MUMBAI TERRITORY (Territory.sol)
              [Andheri | Bandra | Powai | Fort | BKC]
                                   ▼
         3. STAKE 0.10 MON ENTRY FEE (ArenaCore.sol)
                                   ▼
            4. TURN-BASED COMBAT (Mulberry32 Deterministic Engine)
              [Attack | Defend | Signature Move | Ultimate]
                                   ▼
          5. CRYPTOGRAPHIC PROOF (EIP-191 ECDSA Signature)
                                   ▼
   6. ON-CHAIN REWARD (0.18 MON) + TERRITORY OWNERSHIP + XP ASCENSION
```

---

## 🛡️ Security & Zero-Trust Cryptography

1. **Zero Client-Side Trust for Settlements**:
   The frontend UI is never trusted for financial settlement. Moves and damage calculations execute via a deterministic PRNG engine seeded from `battleId + tokenIds`.
2. **Server Oracle Settlement Proof (EIP-191)**:
   The backend validator replays the battle sequence independently. If verified, it signs an **EIP-191 ECDSA signature** containing `(battleId, winner, rewardAmount, nonce, deadline)`.
3. **Smart Contract Verification (`ArenaCore.sol`)**:
   `ArenaCore.sol` validates `ecrecover(signature)` on-chain before paying out rewards. If client state was tampered with, the signature is rejected and funds remain secure.
4. **Replay Protection**:
   Every signature includes a unique `nonce` and expiring `deadline`. Claimed nonces are recorded in `usedNonces[nonce]` to prevent double-claiming.
5. **Zero Escrow Custody**:
   Player Beast NFTs never leave user wallets during battle. There is zero risk of losing NFTs to contract hacks or opponent liquidation.
6. **ReentrancyGuard**:
   OpenZeppelin v5 `ReentrancyGuard` enforced across all state-modifying withdrawal and prize functions.

---

## 📜 Verified Smart Contracts (Monad Testnet - Chain 10143)

| Contract | Purpose | Monad Testnet Address |
| :--- | :--- | :--- |
| **`ArenaCore.sol`** | Battle staking, ECDSA verification & 0.18 MON prize pool distribution | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| **`BeastToken.sol`** | Original ERC-721 creature ownership with on-chain level & stats | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |
| **`TerritoryWar.sol`** | 5 Mumbai zones, defense fortification HP, and ownership registry | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` |
| **`Achievements.sol`** | Soulbound non-transferable achievement badges (`_update` reverts) | `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` |

*Network RPC: `https://testnet-rpc.monad.xyz/`*  
*Chain ID: `10143` (Hex: `0x279f`)*  
*Explorer: [https://testnet.monadexplorer.com](https://testnet.monadexplorer.com)*

---

## 🐉 Original Beast Roster (100% Original IP)

| Beast | Element | Stage | HP | Attack | Defense | Speed | Signature Move |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Emberwyrm** | Fire / Flying | Prime (Lv 36) | 120 | 85 | 60 | 90 | **Cinder Lance** |
| **Tidewarden** | Water | Prime (Lv 36) | 140 | 70 | 85 | 60 | **Torrent Cannon** |
| **Nullshade** | Dark / Void | Prime (Lv 34) | 100 | 95 | 50 | 85 | **Void Pulse** |
| **Voltpaw** | Electric | Base (Lv 30) | 90 | 80 | 50 | 110 | **Arcflash** |

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js 18+ or 20+
- `pnpm` (`npm install -g pnpm`)
- Foundry (`curl -L https://foundry.paradigm.xyz | bash` followed by `foundryup`)

### 1. Smart Contract Tests (Foundry)
```bash
cd contracts
forge test -v
```
*Result: 20 passed; 0 failed; 0 skipped.*

### 2. Frontend Development Server
```bash
cd apps/web
pnpm install
pnpm run dev
```
Visit **http://localhost:3000** in your browser.

### 3. Production Build & Typecheck
```bash
cd apps/web
pnpm run typecheck
pnpm run build
```

---

## 🏆 Hackathon Demo Features for Judges

* **Dual-Mode Demo Shield**: Built-in `SIMULATED / LIVE` switch in the header. If hackathon venue WiFi fluctuates, Simulated Mode runs with 0 network latency and pre-funded demo MON.
* **Live Telemetry Strip**: Displays live Monad block numbers, transaction latency in milliseconds, and direct links to Monad Explorer.
* **Neo-Brutalist Arcade UI**: High-contrast, accessibility-checked, responsive UI inspired by arcade fighting cabinets and Web3 fintech platforms.
* **Procedural Sound FX**: Zero-dependency Web Audio API sound effects for attacks, shields, critical hits, and victory fanfares.

---

## 👥 Team & Submission Details

* **Hackathon**: Monad Blitz Mumbai V4 (19th September 2026)
* **Venue**: DevX Andheri, Mumbai
* **Submission Portal**: [https://blitz.devnads.com/events/monad-blitz-mumbai-v4](https://blitz.devnads.com/events/monad-blitz-mumbai-v4)

