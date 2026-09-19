# 🐲 MONAD HUNT:CITY LEAGUE
*Catch. Stake. Battle. Conquer.*

A persistent competitive on-chain cyberpunk gaming world where **Hunters** and their **AI Beasts** battle for territorial dominance across **Mumbai's 12 proving grounds**, climb an integer Elo rating ladder, represent **4 Faction Syndicates**, and settle every battle cryptographically on **Monad Testnet**.

> **"THE CITY IS THE BATTLEFIELD. MY BATTLE CHANGES THE CITY."**  
> One click, one confirmed transaction, and a territory's control shifts for every player watching across the globe.

---

## 1. Product Overview & Core Game Loop

```text
HUNTER → BEAST → ARENA → BATTLE → SETTLEMENT (EIP-712 on-chain)
   → RATING → TERRITORY INFLUENCE → CREW POINTS
   → ACHIEVEMENT → LEADERBOARD → SEASON 01 → CHAMPIONSHIP
```

1. **Hunter Enlistment & Starter Claim**: Connect MetaMask or Web3 wallet to Monad Testnet (`Chain ID 10143`), mint a free deterministic starter Beast NFT (1 free claim per wallet), and pledge allegiance to one of four Faction Crews.
2. **Mumbai Tactical Map**: Inspect 12 distinct Mumbai proving grounds (Andheri, Bandra, Powai, Fort, BKC, Colaba, Juhu, Dadar, Malad, Thane, Navi Mumbai, Worli). View live statuses: `STABLE`, `CONTESTED`, `UNDER ATTACK`, `DEFENDING`, `LIVE ARENA`, `DOMINATED`.
3. **Turn-Based Proving Ground Battles**: Engage in elemental combat against autonomous zone guardians. Execute attacks, shields, dodges, and signature special powers.
4. **On-Chain Cryptographic Settlement**: The deterministic server oracle validates combat moves and signs an **EIP-712 typed structured digest**. `HuntCore.sol` validates the signature, computes Elo rating deltas, shifts territory influence, credits crew points, and records progress on the Beast NFT.
5. **Live Settlement Console**: Watch real-time 4-stage transaction execution (`SIGN` → `SUBMITTED` → `CONFIRMING` → `SETTLED`) with measured latency, block number, gas used, and explorer verification link.
6. **Live World Sync**: Open a second browser window at `/live` to watch the **HUNT FEED** stream incoming `BattleSettled` events and witness live territory bars move in real time.

---

## 2. Complete Routes Map

All routes are fully implemented with dedicated page controllers, responsive layouts, and atmospheric backgrounds:

| Route | View Description | Background Atmosphere | Key Functionality |
| :--- | :--- | :--- | :--- |
| **`/`** | **Cinematic Landing Page** | `variant="landing"` + Background Video | Hero section matching reference design, official logo, interactive territory HUD pins, live season stats bar, feature strip, 9 landing sections, and Trailer Modal. |
| **`/app`** | **Command Center Dashboard** | `variant="default"` | Command center header, squad vanguard status, fast dispatch to contested zones, and full crew faction switcher. |
| **`/arena`** | **Battle Arena & Turn Combat** | `variant="arena"` | Arena Lobby, Beast selection, real-time battle loop with animations, sound effects, and EIP-712 settlement. |
| **`/map`** | **Mumbai Tactical Map** | `variant="map"` | 12 Mumbai territories with interactive zone inspection, conquest percentages, and fortification actions. |
| **`/leaderboards`** | **Global Leaderboard** | `variant="leaderboard"` | Top Hunter rankings, win rates, earned MON rewards, top beasts, and live wallet address highlighting. |
| **`/crews`** | **Faction War Syndicates** | `variant="crews"` | 4 Cyber Factions (Neon Vipers, Cyber Wolves, Solar Titans, Shadow Syndicate) with lore, season points, and allegiance toggle. |
| **`/hunt-tv`** | **Hunt TV & Battle Telemetry** | `variant="hunt-tv"` | Esports battle highlight cards, live spectator stream, and recent on-chain verdicts. |
| **`/profile`** | **Hunter & Beast Profile** | `variant="profile"` | Personal stats, owned Beast inventory, ability unlocks, level-up progression, and achievement showcase. |
| **`/live`** | **Live Settlement Feed** | `variant="hunt-tv"` | Real-time SSE/telemetry stream of battle confirmations on Monad Testnet. |

---

## 3. Real Web3 Wallet Integration

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

## 4. Media Assets & Video Streaming

- **Official Video Trailer**: Stored locally in `public/media/trailer.mp4` (~5.38 MB).
- **Trailer Modal Player**: Triggered by `[ WATCH TRAILER ▶ ]` in the hero section and sections throughout the app. Features HTML5 video controls, keyboard accessibility (`Esc` to close), and automatic pause on exit.
- **Cinematic Atmospheric Background**: High-performance `<video autoPlay muted loop playsInline>` embedded with low opacity and dark gradient masking in `HeroSection.tsx` and `CinematicBackground.tsx`.
- **Official Branding**: Original high-resolution logo asset located at `public/assets/branding/monad-hunt-logo.jpg`.

---

## 5. Deployed Smart Contracts (Monad Testnet)

| Contract | Address | Explorer Link | Purpose |
| :--- | :--- | :--- | :--- |
| **`HuntCore.sol`** | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` | [MonadExplorer ↗](https://testnet.monadexplorer.com/address/0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0) | Authoritative game brain, EIP-712 signature verification, integer Elo rating deltas, territory conquest, crew points, and achievements. |
| **`BeastNFT.sol`** | `0x5FbDB2315678afecb367f032d93F642f64180aa3` | [MonadExplorer ↗](https://testnet.monadexplorer.com/address/0x5FbDB2315678afecb367f032d93F642f64180aa3) | ERC-721 Beast NFT contract managing on-chain combat attributes, levels, and evolution stages. |
| **Settlement Signer** | `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720` | Authorized Oracle | Off-chain deterministic battle move validator and EIP-712 signer. |

---

## 6. Local Development Setup

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

## 7. Production Build & Validation

```bash
# Typecheck TypeScript files
npm run typecheck

# Build optimized production bundle
npm run build

# Start production server
npm run start
```

---

## 8. Docker Deployment

The application features a production-ready, multi-stage `Dockerfile` with Next.js `standalone` output for minimal container footprint:

```bash
# Build Docker image
docker build -t monad-hunt .

# Run Docker container
docker run -p 3000:3000 monad-hunt
```

Access the containerized application at [http://localhost:3000](http://localhost:3000).

---

## 9. Vercel Deployment Guide

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

## 10. QA & Verification Checklist

- [x] **Landing Page (`/`)**: Hero section displays official logo, Mumbai city & beast visual, live season counters, and feature strip.
- [x] **No Text Ghosting**: Left-side gradient mask eliminates all duplicate burned-in mockup text.
- [x] **Video Trailer**: `[ WATCH TRAILER ▶ ]` modal streams `public/media/trailer.mp4` with audio controls.
- [x] **Interactive HUD Pins**: Clicking map markers navigates directly to territory inspection.
- [x] **Complete Navigation**: All navbar links (`HOME`, `ARENA`, `MAP`, `LEADERBOARDS`, `CREWS`, `HUNT TV`, `PROFILE`) route correctly.
- [x] **Global GameContext**: Wallet state, selected Beast, and territory progression persist across all routes.
- [x] **Wallet Connection**: Connects to MetaMask, validates Chain ID `10143`, and handles rejections/wrong network.
- [x] **Zero Empty Black Voids**: `CinematicBackground` provides variant atmospheric textures across all views.
- [x] **Production Multi-Stage Docker**: Clean standalone Dockerfile and `.dockerignore`.
- [x] **TypeScript & Next.js Build**: Passes `npm run typecheck` and `npm run build` with **0 errors**.

---

## 11. License
MONAD HUNT: CITY LEAGUE © 2026. Built on Monad Testnet. All rights reserved.
