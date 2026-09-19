# 🐲 MONAD HUNT: CITY LEAGUE
### *Catch. Stake. Battle. Conquer.*

[![Monad Testnet](https://img.shields.io/badge/Blockchain-Monad_Testnet_(10143)-836EF9?style=for-the-badge&logo=ethereum&logoColor=white)](https://testnet.monadexplorer.com)
[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js_14_App_Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Viem](https://img.shields.io/badge/Web3-Viem_%2B_Wagmi-1E273D?style=for-the-badge&logo=web3.js&logoColor=white)](https://viem.sh)
[![Docker](https://img.shields.io/badge/Deployment-Docker_Multi--Stage-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-E63946?style=for-the-badge)](LICENSE)

A persistent, esports-grade competitive on-chain gaming world where **Hunters** and their **AI Beasts** battle for territorial supremacy across **Mumbai's 12 proving grounds**, climb an authoritative integer Elo rating ladder, represent **4 Cyber Faction Syndicates**, and settle every single battle cryptographically on **Monad Testnet** at sub-second finality.

> **"THE CITY IS THE BATTLEFIELD. MY BATTLE CHANGES THE CITY."**  
> One click, one confirmed transaction on Monad, and a territory's control shifts in real time for every player watching across the globe.

---

## 🎮 Core Game Loop & Architecture

```text
HUNTER → BEAST → ARENA → BATTLE → SETTLEMENT (EIP-712 on Monad)
   → RATING DELTA → TERRITORY INFLUENCE → CREW POINTS
   → ACHIEVEMENT UNLOCKS → LEADERBOARD → SEASON 01 CHAMPIONSHIP
```

```
┌────────────────────────────────────────────────────────┐
│             FRONTEND (Next.js 14 + Viem + Wagmi)       │
│  - Mumbai Tactical Map (Interactive 12 Zones)          │
│  - Battle Screen & Turn-Based Combat Engine            │
│  - Live Settlement Console (/live feed subscriber)     │
│  - Cinematic Video Trailer & Global Atmosphere         │
└──────────────────────────┬─────────────────────────────┘
                           │ 1. Request Settlement Signature
                           ▼
┌────────────────────────────────────────────────────────┐
│        DETERMINISTIC ORACLE (/api/settle)              │
│  - Replays combat actions step-by-step                 │
│  - Computes winner & ratings deterministically         │
│  - Signs EIP-712 Typed Structured Data Digest          │
└──────────────────────────┬─────────────────────────────┘
                           │ 2. EIP-712 Signature + Parameters
                           ▼
┌────────────────────────────────────────────────────────┐
│          MONAD TESTNET SMART CONTRACTS                 │
│  - BeastNFT.sol (ERC-721 Starter + Combat Stats)       │
│  - HuntCore.sol (Authoritative game brain)             │
│    • EIP-712 Signature Verification                    │
│    • On-Chain Integer Elo Rating Math (K=32, min 100)  │
│    • 12 Mumbai Territory Influence Shifts              │
│    • 4 Crew Points & Streak Multipliers                │
│    • On-Chain Achievement Bitmask                      │
│    • Emits rich BattleSettled & TerritoryShifted events│
└────────────────────────────────────────────────────────┘
```

---

## 🗺️ Complete Application Routes Map

Every navigation link and game view is fully implemented with dedicated page controllers, responsive layouts, and zero empty black space:

| Route | View Description | Atmospheric Background | Key Functionality |
| :--- | :--- | :--- | :--- |
| **`/`** | **Cinematic Landing Page** | `variant="landing"` + Video Atmosphere | Hero section with official logo, live Mumbai territory HUD pins, season stats bar, feature strip, 9 full landing sections, and interactive video trailer modal. |
| **`/app`** | **Command Center Dashboard** | `variant="default"` | Command center header, active squad vanguard status, fast dispatch to contested zones, and crew faction switcher. |
| **`/arena`** | **Battle Arena & Turn Combat** | `variant="arena"` | Arena Lobby, Beast selection, real-time battle loop with animations, synthesized sound effects, and EIP-712 settlement. |
| **`/map`** | **Mumbai Tactical Map** | `variant="map"` | 12 Mumbai territories with interactive zone inspection, conquest percentages, and fortification actions. |
| **`/leaderboards`** | **Global Leaderboard** | `variant="leaderboard"` | Top Hunter rankings, win rates, earned MON rewards, top beasts, and live wallet address highlighting. |
| **`/crews`** | **Faction War Syndicates** | `variant="crews"` | 4 Cyber Factions (Neon Vipers, Cyber Wolves, Solar Titans, Shadow Syndicate) with lore, season points, and allegiance toggle. |
| **`/hunt-tv`** | **Hunt TV & Battle Telemetry** | `variant="hunt-tv"` | Esports battle highlight cards, live spectator stream, and recent on-chain verdicts. |
| **`/profile`** | **Hunter & Beast Profile** | `variant="profile"` | Personal stats, owned Beast inventory, ability unlocks, level-up progression, and achievement showcase. |
| **`/live`** | **Live Settlement Feed** | `variant="hunt-tv"` | Real-time SSE/telemetry stream of battle confirmations on Monad Testnet. |

---

## 🎨 Design System & Visual Palette

The application uses an esports-inspired dark cyberpunk palette tailored for maximum visual depth and high contrast:

| Color Token | Hex Code | RGB | Role in Interface |
| :--- | :--- | :--- | :--- |
| **Deep Maroon** | `#8B1E2D` | `rgb(139, 30, 45)` | Base card borders, combat backdrops, and button gradients |
| **Electric Crimson** | `#E63946` | `rgb(230, 57, 70)` | Primary energy, attack actions, live status indicators & glows |
| **Solar Gold** | `#F4D35E` | `rgb(244, 211, 94)` | Rating points, achievements, tournament highlights & rewards |
| **Tactical Steel** | `#457B9D` | `rgb(69, 123, 157)` | Defense states, territory nodes, intelligence & secondary accents |
| **Obsidian Dark** | `#05070B` / `#0B0F17` | `rgb(5, 7, 11)` | Deep cyberpunk contrast surface backgrounds |

---

## ⚡ Real Web3 Wallet System

### Supported Wallets & Providers
- **Injected Web3 Wallets**: MetaMask, Rabby, Coinbase Wallet, Brave Wallet, and all EIP-1193 standard EVM providers.
- **Library Stack**: Native `Viem` (`v2.56.5`) + `Wagmi` (`v3.7.7`) + `@tanstack/react-query`.

### Network Parameters
- **Network Name**: Monad Testnet
- **Chain ID**: `10143` (`0x279f` in hex)
- **Currency Symbol**: `MON` (18 decimals)
- **RPC URL**: `https://testnet-rpc.monad.xyz/`
- **Block Explorer**: `https://testnet.monadexplorer.com`

### Robust Error & Network Handling
1. **Wallet Detection**: If no browser wallet is detected, prompts: *"No Web3 wallet detected. Please install MetaMask to interact with Monad Testnet."*
2. **Automatic Network Switch**: Automatically requests `wallet_switchEthereumChain` to Chain ID `10143`. If Monad Testnet is not yet added to the user's wallet, it automatically dispatches `wallet_addEthereumChain` with official Monad RPC and explorer metadata.
3. **Rejection Handling**: Gracefully handles user rejection (`code: 4001`) and pending requests (`code: -32002`) without throwing raw console errors.
4. **Auto-Reconnection**: Re-hydrates authorized accounts on page load and listens to `accountsChanged` and `chainChanged` events.
5. **Simulated Mode Fallback**: Users without a wallet or testnet MON can toggle `SIMULATED` mode to test the complete combat, progression, and territory conquest loop without blockchain friction.

---

## 🎬 Media & Video Trailer Integration

- **Official Video Trailer**: Stored locally in `public/media/trailer.mp4` (~5.38 MB).
- **Trailer Modal Player**: Triggered by `[ WATCH TRAILER ▶ ]` in the hero section and sections throughout the app. Features HTML5 video controls, keyboard accessibility (`Esc` to close), and automatic pause on exit.
- **Cinematic Atmospheric Background**: High-performance `<video autoPlay muted loop playsInline>` embedded with low opacity and dark gradient masking in `HeroSection.tsx` and `CinematicBackground.tsx`.
- **Official Branding**: Original high-resolution logo asset located at `public/assets/branding/monad-hunt-logo.jpg`.

---

## 🏛️ 12 Mumbai Territories & 4 Faction Crews

### 12 Strategic Proving Grounds
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

### 4 Cyber Faction Syndicates
- 🐍 **Neon Vipers**: Agility-first strike squad operating from Bandra & Western coastlines.
- 🐺 **Cyber Wolves**: High-damage predator pack dominating northern and eastern industrial zones.
- ☀️ **Solar Titans**: Unyielding fortification vanguard rooted in Fort, Colaba, and South Mumbai.
- 🔮 **Shadow Syndicate**: Tactical disruptor syndicate executing precision ambushes across Powai & BKC.

---

## 📜 Deployed Smart Contracts (Monad Testnet)

| Contract | Address | Explorer Link | Purpose |
| :--- | :--- | :--- | :--- |
| **`HuntCore.sol`** | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` | [MonadExplorer ↗](https://testnet.monadexplorer.com/address/0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0) | Authoritative game brain, EIP-712 signature verification, integer Elo rating deltas, territory conquest, crew points, and achievements. |
| **`BeastNFT.sol`** | `0x5FbDB2315678afecb367f032d93F642f64180aa3` | [MonadExplorer ↗](https://testnet.monadexplorer.com/address/0x5FbDB2315678afecb367f032d93F642f64180aa3) | ERC-721 Beast NFT contract managing on-chain combat attributes, levels, and evolution stages. |
| **Settlement Signer** | `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720` | Authorized Oracle | Off-chain deterministic battle move validator and EIP-712 signer. |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js `20.x` or higher
- npm or pnpm
- Git

### Installation & Run
```bash
# 1. Clone repository
git clone https://github.com/mrigeshkoyande/Beastforge-monad.git
cd Beastforge-monad/apps/web

# 2. Install dependencies
npm install

# 3. Configure environment
cp ../../.env.example .env.local

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Production Build & Validation

```bash
# Typecheck TypeScript files
npm run typecheck

# Build optimized production bundle (all 16 routes)
npm run build

# Start production server
npm run start
```

---

## 🐳 Docker Deployment

The application features a production-ready, multi-stage `Dockerfile` with Next.js `standalone` output for minimal container footprint:

```bash
# Build Docker image from repo root
docker build -t monad-hunt .

# Run container on port 3000
docker run -p 3000:3000 monad-hunt
```

Access the containerized application at [http://localhost:3000](http://localhost:3000).

---

## ☁️ Vercel Deployment Guide

### Deployment Steps
1. Push repository to GitHub (`main` branch).
2. Connect your repository in the [Vercel Dashboard](https://vercel.com).
3. Set **Root Directory** to `apps/web`.
4. Configure the following environment variables in Vercel:

| Variable Name | Required | Example Value | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_MONAD_CHAIN_ID` | Yes | `10143` | Monad Testnet Chain ID |
| `NEXT_PUBLIC_MONAD_RPC_URL` | Yes | `https://testnet-rpc.monad.xyz/` | Official Monad Testnet RPC endpoint |
| `NEXT_PUBLIC_MONAD_EXPLORER_URL` | Yes | `https://testnet.monadexplorer.com` | Monad Block Explorer URL |
| `NEXT_PUBLIC_HUNT_CORE_ADDRESS` | Yes | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` | HuntCore contract address |
| `NEXT_PUBLIC_BEAST_NFT_ADDRESS` | Yes | `0x5FbDB2315678afecb367f032d93F642f64180aa3` | BeastNFT contract address |
| `NEXT_PUBLIC_RESOLVER_ADDRESS` | Yes | `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720` | Authorized Oracle signer address |
| `SETTLEMENT_SIGNER_PRIVATE_KEY` | Yes | *(Server-only key)* | Private key for signing EIP-712 battle settlements in `/api/settle` |

> [!CAUTION]
> **Security Reminder**: Never expose `SETTLEMENT_SIGNER_PRIVATE_KEY` or any deployer private keys in client-side bundles or repository commits.

---

## ✅ Quality & Security Verification Checklist

- [x] **Landing Page (`/`)**: Hero section displays official logo, Mumbai city & beast visual, live season counters, and feature strip.
- [x] **No Text Ghosting**: Left-side gradient mask eliminates all duplicate burned-in mockup text.
- [x] **Video Trailer**: `[ WATCH TRAILER ▶ ]` modal streams `public/media/trailer.mp4` with audio controls and escape key handling.
- [x] **Interactive HUD Pins**: Clicking map markers navigates directly to territory inspection.
- [x] **Complete Navigation**: All navbar links (`HOME`, `ARENA`, `MAP`, `LEADERBOARDS`, `CREWS`, `HUNT TV`, `PROFILE`) route correctly.
- [x] **Global GameContext**: Wallet state, selected Beast, and territory progression persist across all routes.
- [x] **Real Wallet Handshake**: Connects to MetaMask, validates Chain ID `10143`, and handles rejections/wrong network.
- [x] **Zero Empty Black Voids**: `CinematicBackground` provides variant atmospheric textures across all views.
- [x] **Production Multi-Stage Docker**: Clean standalone Dockerfile and `.dockerignore`.
- [x] **TypeScript & Next.js Build**: Passes `npm run typecheck` and `npm run build` with **0 errors**.

---

## 📄 License
MONAD HUNT: CITY LEAGUE © 2026. Built on Monad Testnet. All rights reserved.
