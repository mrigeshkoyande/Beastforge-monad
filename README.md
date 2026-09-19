# MONAD HUNT — CITY LEAGUE

## Catch. Stake. Battle. Conquer.

[![Monad Testnet](https://img.shields.io/badge/Blockchain-Monad_Testnet_(10143)-836EF9?style=for-the-badge&logo=ethereum&logoColor=white)](https://testnet.monadexplorer.com)
[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js_14_App_Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Viem](https://img.shields.io/badge/Web3-Viem_%2B_Wagmi-1E273D?style=for-the-badge&logo=web3.js&logoColor=white)](https://viem.sh)
[![Docker](https://img.shields.io/badge/Deployment-Docker_Multi--Stage-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-E63946?style=for-the-badge)](LICENSE)

---

## Overview

**MONAD HUNT: CITY LEAGUE** is an esports-grade, competitive Web3 gaming application where players collect and evolve AI Beasts, battle rival Hunters in real-time turn-based tactical combat, gain integer Elo rating points, conquer territories across a virtual cyberpunk Mumbai, compete through 4 faction Syndicates, and participate in seasonal championships with cryptographic settlement on **Monad Testnet** at sub-second finality.

```text
Hunter
 ↓
Beast
 ↓
Battle Arena
 ↓
Elo Rating Delta (K=32)
 ↓
Territory Control Shift
 ↓
Crew Syndicate Points
 ↓
Season 01 Championship
```

---

## Why MONAD HUNT?

Traditional Web3 games suffer from high transaction latency, prohibitive gas costs for gameplay turns, low visual quality, and client-side memory exploits.

MONAD HUNT leverages **Monad Testnet** to solve these fundamental bottlenecks:
1. **Sub-second Settlement Finality**: Instant combat validation and state confirmation on Monad.
2. **Authoritative EIP-712 Settlement**: Battle moves are validated deterministically step-by-step; the oracle signs an EIP-712 typed structured data payload verified directly on-chain by `HuntCore.sol`.
3. **Persistent Progression**: Beast attributes, levels, territory ownership percentages, and crew point ladders exist permanently on the Monad blockchain.
4. **Esports Competitive Integrity**: Integer Elo rating engine prevents inflation and rating manipulation.

---

## Problem

- **Generic Crypto Dashboards**: Most Web3 games look like DeFi admin panels rather than adrenaline-pumping esports titles.
- **Client-Side Financial Authority**: Games that trust client-side JavaScript for battle calculations are trivially easy to hack.
- **Disconnected Lore & UI Clutter**: Games overload screens with glowing badges and lack meaningful geographic stakes.

---

## Solution

- **Cinematic Dark Esports Interface**: High-contrast cyberpunk UI featuring subtle atmospheric lighting, custom Monad cursor physics, and custom Monad scrollbar aesthetics.
- **Deterministic Off-Chain Engine + On-Chain Proofs**: Every battle verdict and move sequence is verified cryptographically via `ECDSA.recover` in `HuntCore.sol`.
- **12 Interactive Mumbai Proving Grounds**: A living virtual Mumbai where arena victories directly shift district control percentages in real time.

---

## Game Concept

In a near-future cyberpunk Mumbai, rogue synthetic beasts have emerged across key districts. Hunters forge bonds with these AI Beasts, forming syndicates to battle across arenas from Bandra to BKC. Every victory expands a Hunter's rating, increases their syndicate's territory influence, and unlocks on-chain achievements for Season 01.

> **"THE CITY IS THE BATTLEFIELD. MY BATTLE CHANGES THE CITY."**

---

## Core Game Loop

```text
[ Connect Wallet / Auto Simulated Mode ]
                 ↓
      [ Select Your Fighter Beast ]
                 ↓
   [ Choose Mumbai Territory Zone ]
                 ↓
    [ Enter Battle Arena Lobby ]
                 ↓
   [ Execute Tactical Combat Moves ]
   (Quick Strike / Special / Guard / Evade)
                 ↓
 [ Deterministic Move Replay & Oracle Verdict ]
                 ↓
 [ EIP-712 Cryptographic Settlement on Monad ]
                 ↓
 ┌───────────────────────────────────────────┐
 │ • Elo Rating Updated (K=32, min 100)      │
 │ • Territory Influence Shifted (1-100%)    │
 │ • Crew Faction Season Points Awarded      │
 │ • On-Chain Achievements Bitmask Updated   │
 │ • Real-Time Live Settlement Feed Emitted  │
 └───────────────────────────────────────────┘
```

---

## Features

- **Turn-Based Combat Engine**: Tactical move selection, attack animations, damage floaters, and Web Audio API synthesized sound effects.
- **12 Mumbai Territories**: Andheri, Bandra, Powai, Fort, BKC, Colaba, Juhu, Dadar, Malad, Thane, Navi Mumbai, and Worli.
- **4 Faction Syndicates**: Neon Vipers, Cyber Wolves, Solar Titans, and Shadow Syndicate.
- **Global Leaderboard**: Live rankings, win rates, earned MON rewards, and top beast showcases.
- **Hunt TV**: Live spectator battle stream telemetry and match highlight reel.
- **Hunter Profile**: Beast evolution chamber, ability unlocks, match history, and achievement badges.
- **Custom Cursor & Scrollbar**: 6px red magical dot with smooth trailing lag, ephemeral sparkles, and custom Monad logo scrollbar thumb.
- **Resilient Dual Mode (Live Monad Testnet + Simulated Fallback)**: Instant zero-friction demo mode or authentic Web3 interaction on Monad Chain ID `10143`.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT APPLICATION                       │
│        (Next.js 14 App Router, React 18, TailwindCSS)        │
│                                                             │
│  • Navbar (Clean Hierarchy, Monad Branding, Compact Wallet) │
│  • Hero Section (Cinematic Artwork, Video, Slogan)          │
│  • Arena (/arena) | Map (/map) | Leaderboards (/leaderboards)│
│  • Crews (/crews) | Hunt TV (/hunt-tv) | Profile (/profile) │
│  • Custom Cursor Engine (RAF smooth lerp, <12 sparkles)     │
│  • Global GameContext (State synchronization & sound FX)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 SETTLEMENT ORACLE API LAYER                 │
│                      (/api/settle)                          │
│                                                             │
│  • Deterministic battle combat replay                       │
│  • Damage calculation & HP verification                     │
│  • Computes integer Elo rating delta                        │
│  • Signs EIP-712 Typed Structured Data Digest               │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 MONAD TESTNET BLOCKCHAIN                    │
│                     (Chain ID 10143)                        │
│                                                             │
│  • HuntCore.sol (Core game logic & state settlement)        │
│  • BeastNFT.sol (ERC-721 Beast ownership & combat stats)    │
│  • EIP-712 Signature verification                           │
│  • Territory influence bitfields & Crew point ladders       │
│  • On-chain events emitted to block explorer                │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: TailwindCSS + Custom Dark Esports Design System
- **Web3 / Blockchain**: Viem v2.x, Wagmi v3.x, Ethers v6.x
- **State Management**: React Context (`GameContext.tsx`) + `@tanstack/react-query`
- **Audio Engine**: Synthesized Web Audio API (`SoundFX.ts`)
- **Icons**: Lucide React
- **Containerization**: Docker (Multi-stage build)

---

## Project Structure

```text
Beastforge-monad/
├── .env.example                     # Environment template
├── Dockerfile                       # Multi-stage production container
├── .dockerignore                    # Docker exclusions
├── README.md                        # Project documentation
├── CONTRIBUTING.md                  # Contribution guidelines
├── LICENSE                          # MIT License
├── contracts/                       # Solidity smart contracts
│   ├── HuntCore.sol                 # Core game brain & settlement contract
│   └── BeastNFT.sol                 # ERC-721 Beast contract
└── apps/
    └── web/                         # Next.js 14 web application
        ├── app/
        │   ├── layout.tsx           # Root layout with CustomCursor & Providers
        │   ├── page.tsx             # Cinematic Landing Page
        │   ├── globals.css          # Design system & custom scrollbar
        │   ├── app/page.tsx         # Command Center Dashboard
        │   ├── arena/page.tsx       # Battle Arena & Turn Combat
        │   ├── map/page.tsx         # Mumbai Tactical Map
        │   ├── leaderboards/page.tsx# Global Leaderboard
        │   ├── crews/page.tsx       # Faction War Syndicates
        │   ├── hunt-tv/page.tsx     # Hunt TV & Telemetry
        │   ├── profile/page.tsx     # Hunter & Beast Profile
        │   ├── live/page.tsx        # Real-time settlement feed
        │   └── api/settle/route.ts  # EIP-712 Settlement Oracle
        ├── components/
        │   ├── Navbar.tsx           # Clean header navigation
        │   ├── Footer.tsx           # Footer with links & legal
        │   ├── CustomCursor.tsx     # Red magical dot cursor engine
        │   ├── CinematicBackground.tsx # Ambient atmospheric layers
        │   ├── BattleScreen.tsx     # Combat rendering & actions
        │   ├── ArenaLobby.tsx       # Beast match selector
        │   ├── TerritoryMap.tsx     # Interactive 12-zone Mumbai map
        │   ├── VictoryDefeatModal.tsx# Battle results & rewards
        │   ├── EvolutionModal.tsx   # Beast level up showcase
        │   ├── TerritoryDetailModal.tsx # High-contrast zone inspection modal
        │   ├── LiveSettlementConsole.tsx # On-chain transaction monitor
        │   └── landing/
        │       ├── HeroSection.tsx  # Hero header with cinematic background
        │       ├── LandingSections.tsx # Interactive landing modules
        │       └── TrailerModal.tsx # Video player modal
        ├── context/
        │   └── GameContext.tsx      # Global state & Web3 wallet provider
        ├── data/
        │   └── mockData.ts          # Default beasts, territories, & lore
        ├── game/
        │   └── SoundFX.ts           # Web Audio API sound effects
        └── public/
            ├── assets/              # Branding & artwork assets
            │   ├── branding/monad-mark.svg # Monad M logo vector asset
            │   └── hero/mumbai-beast-hero.jpg # Clean reference background art
            ├── media/trailer.mp4    # Official gameplay trailer
            └── icon.svg             # Cyber beast favicon
```

---

## Web3 Architecture

```text
User
 ↓
Wallet (MetaMask / EIP-1193)
 ↓
Frontend (Viem / Wagmi Client)
 ↓
Monad RPC (https://testnet-rpc.monad.xyz)
 ↓
HuntCore Smart Contract (0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0)
 ↓
On-Chain State (Elo Ratings, Territory Influence, Crew Points)
```

### On-Chain vs. Off-Chain Separation
- **On-Chain**: Player Elo ratings, Beast token IDs, territory influence percentages (1–100%), faction crew point aggregates, achievement bitmasks, and official battle verification events.
- **Off-Chain**: Tactical move animations, sound FX synthesis, UI visual styling, spectator telemetry stream.
- **Simulated Mode**: Local mock fallback allowing immediate testing of the complete loop without requiring testnet MON.

---

## Monad Integration

- **Chain ID**: `10143` (`0x279f` in hex)
- **Currency**: `MON`
- **RPC URL**: `https://testnet-rpc.monad.xyz/`
- **Block Explorer**: `https://testnet.monadexplorer.com`

---

## Smart Contract Interaction

### `HuntCore.sol`
Maintains authoritative game state and verifies EIP-712 battle settlements:
```solidity
function settleBattle(
    BattleSettlement calldata settlement,
    bytes calldata signature
) external returns (bool);
```

### `BeastNFT.sol`
ERC-721 token representing collectible and evolving AI Beasts:
```solidity
function mintStarterBeast(address hunter) external returns (uint256);
function getBeastStats(uint256 tokenId) external view returns (BeastStats memory);
```

---

## Wallet Integration

- Supported: MetaMask, Rabby, Coinbase Wallet, Brave Wallet, and all EIP-1193 standard EVM providers.
- **Automatic Demo Fallback**: If no wallet extension is detected or if connection is rejected, the application seamlessly activates Simulated Demo Mode (`0x71C9347B95F4D3501A39D9eEb5C2D2B095208A2F`) so evaluators are never blocked.

---

## Simulated Mode

For judges, evaluators, or users without a Web3 wallet, the application includes a full **Simulated Mode**. When active:
- All combat turns execute with real calculations.
- Rating changes, territory influence shifts, and crew points update in real time.
- The Live Settlement Console simulates transaction confirmation phases.

---

## Battle System

- **Turn-Based Actions**:
  - **Quick Strike**: Fast attack with high accuracy.
  - **Special Power**: Element-specific finisher move consuming energy.
  - **Guard**: Tactical defense mitigating incoming damage and generating energy.
  - **Evade**: Evasive stance boosting dodge probability.
- **AI Opponents**: Responsive combat algorithms tailored to each territory's difficulty.

---

## Territory System

12 strategic proving grounds across Mumbai:
- **Andheri Arena**, **Bandra Coast**, **Powai Tech Hub**, **Fort Colosseum**, **BKC Skyscraper**, **Colaba Point**, **Juhu Shore**, **Dadar Junction**, **Malad Ridge**, **Thane Gates**, **Navi Mumbai Port**, **Worli Seafront**.

Territory states include: `CONTESTED`, `LIVE ARENA`, `DOMINATED`, `STABLE`, `UNDER ATTACK`, `DEFENDING`.

---

## Crew System

4 Cyber Factions competing for seasonal dominance:
1. 🐍 **Neon Vipers**: Agility-first strike squad operating from Bandra & Western coastlines.
2. 🐺 **Cyber Wolves**: High-damage predator pack dominating northern & eastern zones.
3. ☀️ **Solar Titans**: Unyielding fortification vanguard rooted in Fort & South Mumbai.
4. 🔮 **Shadow Syndicate**: Tactical disruptors executing precision strikes across Powai & BKC.

---

## Rating System

- **Authoritative Integer Elo**: K-factor of 32, minimum rating floor of 100.
- Formula: 
  $$\Delta R = K \times (S - E)$$
  Where $S$ is the match outcome (1 for win, 0 for loss) and $E$ is the expected win probability based on rating differential.

---

## Achievement System

On-chain bitmask achievement system tracking milestones:
- `FIRST_BLOOD`: Win your first battle.
- `THREE_PEAT`: Achieve a 3-win streak.
- `TERRITORY_HUNTER`: Flip control of a Mumbai territory.
- `CREW_WARRIOR`: Contribute points to your syndicate.
- `CITY_HUNTER`: Conquer 5 distinct zones.

---

## Season System

- **Season 01: Genesis of Mumbai**: Active 30-day season with countdown timers, aggregate crew standings, and seasonal reward pools for top-ranking Hunters.

---

## Hunt TV

- Real-time spectator telemetry stream showcasing recent on-chain verdicts, featured matches, and tactical telemetry data.

---

## UI / UX Architecture

- **Visual Hierarchy**:
  - **Level 1 (Primary)**: MONAD HUNT branding, main titles, primary CTAs, main game content.
  - **Level 2 (Secondary)**: Navigation, stats, supporting info.
  - **Level 3 (Ambient)**: Background atmosphere, tactical scanlines, slow lighting pulses, custom cursor.
- **Custom Cursor**: 6px red magical dot with smooth interpolation, max 12 particles, pointer-events: none, disabled on touch and prefers-reduced-motion.
- **Custom Scrollbar**: Dark track with Monad red thumb containing the official Monad Hunt 'M' mark.

---

## Installation

```bash
# 1. Clone repository
git clone https://github.com/mrigeshkoyande/Beastforge-monad.git

# 2. Enter web directory
cd Beastforge-monad/apps/web

# 3. Install dependencies
npm install

# 4. Copy environment file
cp ../../.env.example .env.local
```

---

## Prerequisites

- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` (v10+) or `pnpm`
- **Git**: `2.x+`
- **Browser**: Modern desktop browser (Chrome, Brave, Firefox, Edge).

---

## Environment Variables

| Variable | Required | Default / Example Value | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_MONAD_CHAIN_ID` | Yes | `10143` | Monad Testnet Chain ID |
| `NEXT_PUBLIC_MONAD_RPC_URL` | Yes | `https://testnet-rpc.monad.xyz/` | Official Monad RPC endpoint |
| `NEXT_PUBLIC_MONAD_EXPLORER_URL` | Yes | `https://testnet.monadexplorer.com` | Monad Explorer URL |
| `NEXT_PUBLIC_HUNT_CORE_ADDRESS` | Yes | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` | Deployed HuntCore contract address |
| `NEXT_PUBLIC_BEAST_NFT_ADDRESS` | Yes | `0x5FbDB2315678afecb367f032d93F642f64180aa3` | Deployed BeastNFT contract address |
| `NEXT_PUBLIC_RESOLVER_ADDRESS` | Yes | `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720` | Authorized Oracle signer address |
| `SETTLEMENT_SIGNER_PRIVATE_KEY` | Server-only | *(Server Key)* | Private key used by `/api/settle` to sign EIP-712 digests |

---

## Configuration

All network and game parameters are centrally configured in:
- `apps/web/context/GameContext.tsx`
- `apps/web/data/mockData.ts`
- `apps/web/tailwind.config.ts`

---

## Running Locally

```bash
cd apps/web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Development

```bash
# Run linter
npm run lint

# Run TypeScript typecheck
npm run typecheck
```

---

## Production Build

```bash
cd apps/web
npm run build
npm run start
```

---

## Docker

```bash
# Build Docker image from repository root
docker build -t monad-hunt .

# Run container
docker run -p 3000:3000 monad-hunt
```

Access the application at [http://localhost:3000](http://localhost:3000).

---

## Vercel Deployment

1. Import the repository in [Vercel](https://vercel.com).
2. Set **Root Directory** to `apps/web`.
3. Set Framework Preset to **Next.js**.
4. Configure Environment Variables.
5. Deploy.

---

## Instructor / Evaluator Guide

### Step-by-Step Evaluation:
1. **Launch Application**: Open `http://localhost:3000`.
2. **Landing Page Inspection**: Review the clean navbar, official branding, Mumbai background, season statistics, and watch the gameplay trailer via `[ WATCH TRAILER ▶ ]`.
3. **Connect Wallet / Simulated Mode**: Click `[ CONNECT WALLET ]` to connect MetaMask on Monad Testnet (Chain ID 10143) or use the simulated fallback mode.
4. **Enter Arena**: Navigate to `/arena` or click `[ ENTER THE CITY ]`.
5. **Execute a Battle**: Click `[ COMMENCE PROVING GROUND BATTLE ]`, choose combat moves (Quick Strike, Special, Guard), and defeat the opponent.
6. **Observe Settlement**: Watch the Live Settlement Console display the EIP-712 signature verification and on-chain confirmation.
7. **Inspect Map Progression**: Navigate to `/map` to verify territory influence updates.
8. **Check Leaderboards & Crews**: Navigate to `/leaderboards` and `/crews` to view Elo rating updates and faction points.
9. **Review Profile & Hunt TV**: Visit `/profile` and `/hunt-tv` to inspect achievements and spectator telemetry.

---

## How to Test the Application

### Evaluation Checklist
- [x] Application starts cleanly on `http://localhost:3000`
- [x] Landing page loads with exact reference artwork and zero double-text ghosting
- [x] Responsive layout scales across mobile, tablet, and desktop screens
- [x] Navigation bar is uncluttered with zero glowing green badges
- [x] Custom Monad logo scrollbar is active
- [x] Custom red magical dot cursor follows smoothly
- [x] Cursor disabled on mobile/touch & prefers-reduced-motion
- [x] Video trailer plays cleanly in modal
- [x] Wallet connects or seamlessly falls back to simulated mode
- [x] Arena battle loop executes with animations and sound FX
- [x] Settlement console confirms battle verdict
- [x] Elo rating and territory influence update dynamically
- [x] Mumbai Tactical Map interactive zone inspection works with high-contrast dark theme
- [x] Leaderboards, Crews, Hunt TV, and Profile views load

---

## How the Open Source Project Works

MONAD HUNT is structured as an open-source monorepo. Community contributors can propose new Beasts, design Mumbai territory expansions, or build additional tournament formats.

---

## How to Contribute

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/new-beast-species`
3. Commit changes: `git commit -m "feat: add cybernetic manticore beast"`
4. Push to branch: `git push origin feature/new-beast-species`
5. Open a Pull Request.

---

## Code Standards

- Strict TypeScript types for all data structures.
- Independent React UI and isolated game logic.
- Zero client-side financial/rating authority.
- Clean component boundaries and semantic HTML5.

---

## Security

- Private keys must never be committed to source control or exposed in client bundles.
- All settlement verification is conducted on-chain in `HuntCore.sol` via `ECDSA.recover`.
- Input validation on all API endpoints.

---

## Known Limitations

- Monad Testnet RPC is subject to testnet availability.
- Simulated mode stores session progress in memory/local state.
- Additional multiplayer matchmaking lobbies are slated for Phase 3.

---

## Roadmap

- **Phase 1**: Hackathon MVP (Complete)
- **Phase 2**: Persistent City League & On-Chain Staking (In Progress)
- **Phase 3**: Real-Time WebRTC Multiplayer Arenas (Planned)
- **Phase 4**: Dynamic Territory Defense & Fortification Contracts (Planned)
- **Phase 5**: Hunter Crew DAO Governance & Prize Vaults (Planned)
- **Phase 6**: Global Season Championships (Planned)
- **Phase 7**: Hunt TV Spectator Wagering & Live Broadcasts (Roadmap)
- **Phase 8**: Community Arena Creator SDK (Roadmap)

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Credits

Developed with ❤️ for the **Monad Hackathon** by the MONAD HUNT core engineering team.
