# 🐲 MONAD HUNT: CITY LEAGUE
*Catch. Stake. Battle. Conquer.*

A persistent competitive on-chain game world where **Hunters** and their **Beasts** battle for territorial control of **Mumbai's 12 proving grounds**, climb an Elo rating ladder, represent **4 Faction Crews**, and settle every single battle on **Monad Testnet**.

> **"My battle changes the city."**  
> One click, one confirmed transaction, and a territory's control and influence shifts for every player watching across the globe.

---

## 1. Product Overview & Core Game Loop

```
HUNTER → BEAST → ARENA → BATTLE → SETTLEMENT (on-chain)
   → RATING → TERRITORY INFLUENCE → CREW POINTS
   → ACHIEVEMENT → LEADERBOARD → SEASON 01 → CHAMPIONSHIP
```

1. **Hunter Enlistment & Starter Claim**: Connect MetaMask or Web3 wallet to Monad Testnet (`Chain ID 10143`), mint a free deterministic starter Beast NFT (1 free claim per wallet), and pledge allegiance to one of four Faction Crews.
2. **Mumbai Tactical Map**: Inspect 12 distinct Mumbai proving grounds (Andheri, Bandra, Powai, Fort, BKC, Colaba, Juhu, Dadar, Malad, Thane, Navi Mumbai, Worli). View live statuses: `STABLE`, `CONTESTED`, `UNDER ATTACK`, `DEFENDING`, `LIVE ARENA`, `DOMINATED`.
3. **Turn-Based Proving Ground Battles**: Engage in elemental combat against autonomous zone guardians. Execute attacks, shields, dodges, and special powers.
4. **On-Chain Cryptographic Settlement**: The deterministic server oracle validates combat moves and signs an **EIP-712 typed structured digest**. `HuntCore.sol` validates the signature, computes Elo rating deltas, shifts territory influence, credits crew points, and records progress on the Beast NFT.
5. **Live Settlement Console**: Watch real-time 4-stage transaction execution (`SIGN` → `SUBMITTED` → `CONFIRMING` → `SETTLED`) with measured latency, block number, gas used, and explorer verification link.
6. **Live World Sync**: Open a second browser window at `/live` to watch the **HUNT FEED** stream incoming `BattleSettled` events and witness live territory bars move in real time.

---

## 2. Why Monad?

- **Real per-battle settlement**: Traditional blockchains force games to batch actions off-chain because of high fees and slow finality. Monad's high throughput and sub-second block times make individual on-chain battle settlement and micro-state changes practical.
- **Live Measured Latency**: The client measures the exact wall-clock time between transaction submission and receipt receipt verification (`latencyMs`). No hardcoded or fabricated finality claims are ever shown.

---

## 3. Architecture & Trust Model

```
┌────────────────────────────────────────────────────────┐
│             FRONTEND (Next.js 14 + Viem + Wagmi)       │
│  - Mumbai Tactical Map (SVG + List View)               │
│  - Battle Screen & Sound FX                            │
│  - Live Settlement Console (/live feed subscriber)     │
└──────────────────────────┬─────────────────────────────┘
                           │ 1. Request Settlement Signature
                           ▼
┌────────────────────────────────────────────────────────┐
│        DETERMINISTIC ORACLE (/api/settle)              │
│  - Replays moves in BattleEngine.ts                     │
│  - Computes outcome & winner deterministically         │
│  - Signs EIP-712 Typed Structured Data Digest          │
└──────────────────────────┬─────────────────────────────┘
                           │ 2. EIP-712 Signature + Parameters
                           ▼
┌────────────────────────────────────────────────────────┐
│          MONAD TESTNET SMART CONTRACTS                 │
│  - BeastNFT.sol (ERC-721 Starter + Attributes)         │
│  - HuntCore.sol (Authoritative game brain)             │
│    • EIP-712 Signature Verification                    │
│    • On-Chain Integer Elo Rating Math (K=32, min 100)  │
│    • 12 Mumbai Territory Influence Shifts              │
│    • 4 Crew Points & Streak Multipliers                │
│    • On-Chain Achievement Bitmask                      │
│    • Emits rich BattleSettled & TerritoryShifted events│
└────────────────────────────────────────────────────────┘
```

### Anti-Cheat & Honest MVP Trust Model
- **The Problem**: Letting the client dictate battle outcomes or rewards creates trivial exploit vectors.
- **Our Implementation**: Combat actions are submitted to a deterministic server module that replays the turns step-by-step. The server oracle signs an **EIP-712 `BattleResult`** with a cryptographic domain separator (`chainId: 10143`, `verifyingContract: HuntCore`). The `HuntCore.sol` smart contract verifies the signature on-chain, enforces replay prevention via `battleId` and unique nonces, checks deadlines, and computes all game consequences directly on Monad.
- **Decentralization Roadmap**: In subsequent phases, deterministic execution will transition to on-chain verification or ZK/TEE state attestations.

---

## 4. Deployed Smart Contracts (Monad Testnet)

| Contract | Address | Verification / Explorer |
| :--- | :--- | :--- |
| **`HuntCore.sol`** | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` | [View on MonadExplorer ↗](https://testnet.monadexplorer.com/address/0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0) |
| **`BeastNFT.sol`** | `0x5FbDB2315678afecb367f032d93F642f64180aa3` | [View on MonadExplorer ↗](https://testnet.monadexplorer.com/address/0x5FbDB2315678afecb367f032d93F642f64180aa3) |
| **Settlement Signer** | `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720` | Authorized EIP-712 Oracle Signer |

---

## 5. Mumbai Proving Grounds & Faction Crews

### 12 Mumbai Territories
1. **Andheri Arena** (Western Suburbs) — High-octane industrial neon proving grounds.
2. **Bandra Coast** (West Coast) — Sea-spray battle cliffs overlooking the Sea Link.
3. **Powai Tech Hub** (Central Valley) — Lakeside tech valley and incubator enclaves.
4. **Fort Colosseum** (South District) — Historic Victorian gothic stone colosseum.
5. **BKC Skyscraper** (Financial Hub) — Rooftop glass-and-steel helipad stadium.
6. **Colaba Point** (Historic South) — Southern tip citadel flanked by naval causeways.
7. **Juhu Shore** (Coastal Strip) — Golden sands battleground over sunset tides.
8. **Dadar Junction** (Heartland) — Central rail nexus where arterial routes converge.
9. **Malad Ridge** (Northern Heights) — Elevated rocky heights guarding media estates.
10. **Thane Gates** (Northeastern Gateway) — Gateway citadel spanning eastern lake mountains.
11. **Navi Mumbai Port** (Eastern Industrial) — Deep-water container logistics docks.
12. **Worli Seafront** (Central Coast) — Luxury high-rise coastal esplanade.

### 4 Faction Crews
- **Neon Vipers** (Electric Purple): High-speed cyber strike specialists dominating Northern & Western Mumbai.
- **Cyber Wolves** (Cyan Blue): Tactical coastal pack masters controlling the Arabian Sea seafronts.
- **Solar Titans** (Solar Amber): Heavy power generators and tech enclave fortification leaders in Central Valley.
- **Shadow Syndicate** (Crimson Red): Aggressive underground skirmishers reigning over historic South districts.

---

## 6. Monad-Native Cyber Esports Design System

- **Surfaces**: Dark Obsidian (`#0B0E14`, `#10141D`, `#161B26`, `#1E2535`, `#232B3B`).
- **Primary Accent**: Monad Purple (`#836EF9`, `#A594FF`).
- **Semantic Accents**: Red (`#FF1A2A`) for LIVE / Attack state ONLY; Yellow (`#FFCC00`) for rewards / ELO only; Blue (`#00B0FF`) for defense; Green (`#00E676`) for verified victory.
- **Signature Geometry**: `skewX(-12deg)` angled buttons (`.mh-btn`), badges (`.mh-badge`), and title bars with counter-skewed inner typography.
- **Typography**: `Barlow Condensed` (display headers), `Inter` (body text), `JetBrains Mono` (hashes, block numbers, telemetry).

---

## 7. 3-Minute Live Hackathon Demo Script

1. **Landing & Identity**: Open site (`/`) → View `MONAD HUNT / CITY LEAGUE / SEASON 01 — MUMBAI`.
2. **Wallet Connection**: Click `CONNECT WALLET` → MetaMask auto-prompts and switches to **Monad Testnet (10143)**.
3. **Starter Claim & Crew Pledge**: Click `CLAIM FREE STARTER BEAST` (executes `mintStarter`), select **Neon Vipers** (`joinCrew`).
4. **Tactical Map Exploration**: Click **POWAI TECH HUB** (`LIVE ARENA`) on the interactive SVG radar map.
5. **Arena Combat**: Click `ENTER ARENA` → Launch turn-based battle against guardian Tidewarden. Execute attacks, power moves, and shields.
6. **Live Settlement Console**: Upon match finish, witness the 4-stage console:
   - `[1] SIGN` (EIP-712 digest generated & wallet prompted)
   - `[2] SUBMITTED` (Real Tx Hash displayed with copy & explorer links)
   - `[3] CONFIRMING` (Live timer ticks while waiting for Monad receipt)
   - `[4] SETTLED` (Displays exact block number, gas used, and measured latency in ms)
7. **Two-Window Live City Sync**: In a second browser window, navigate to `/live`. As soon as the first window settles, the live **HUNT FEED** instantly renders the settlement event and shifts the territory dominance bar in real time!
8. **Progression & Standings**: Inspect the Victory Modal (`▲ +24 ELO`, `+16% Influence`, `+49 Crew Points`), check updated Hunter Leaderboards and Profile.

---

## 8. Local Development & Verification

### Prerequisites
- Node.js >= 18
- npm / pnpm / yarn
- Foundry (for smart contract tests and deployment)

### Running the Web Application
```bash
# Install dependencies
cd apps/web
npm install

# Run development server
npm run dev

# Run TypeScript check & production build
npm run typecheck
npm run build
```

### Running Foundry Smart Contract Tests
```bash
cd contracts
forge test -vvv
```

---

## 9. Security & Rules Verification Checklist

- [x] No private keys or secret keys exposed in client bundles or repository history.
- [x] `.env.example` provides complete configuration placeholders.
- [x] EIP-712 structured data signing with domain separator (`chainId`, `verifyingContract`, `battleId`, `nonce`, `deadline`).
- [x] Replay and duplicate settlement prevention enforced on-chain.
- [x] Access control (`DEFAULT_ADMIN_ROLE`, `ARENA_MANAGER_ROLE`, `SETTLER_ROLE`) and Pausable state controls.
- [x] Player Beasts never leave the player's wallet during battles.
- [x] No fake transaction hashes, fake block numbers, or fake explorer links. Demo mode clearly marked with `SIMULATED DATA`.
