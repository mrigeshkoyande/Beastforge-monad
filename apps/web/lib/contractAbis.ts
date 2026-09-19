// Contract ABIs for MONAD HUNT: CITY LEAGUE

export const BEAST_NFT_ABI = [
  {
    type: "function",
    name: "mintStarter",
    inputs: [{ name: "to", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "hasMintedStarter",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "playerStarterTokenId",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBeast",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct BeastNFT.BeastAttributes",
        components: [
          { name: "name", type: "string", internalType: "string" },
          { name: "beastType", type: "uint8", internalType: "uint8" },
          { name: "rarity", type: "uint8", internalType: "uint8" },
          { name: "level", type: "uint8", internalType: "uint8" },
          { name: "attack", type: "uint16", internalType: "uint16" },
          { name: "defense", type: "uint16", internalType: "uint16" },
          { name: "speed", type: "uint16", internalType: "uint16" },
          { name: "energy", type: "uint16", internalType: "uint16" },
          { name: "xp", type: "uint32", internalType: "uint32" },
          { name: "wins", type: "uint32", internalType: "uint32" },
          { name: "losses", type: "uint32", internalType: "uint32" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ownerOf",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
] as const;

export const HUNT_CORE_ABI = [
  {
    type: "function",
    name: "joinCrew",
    inputs: [{ name: "crewId", type: "uint8", internalType: "uint8" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "settleBattle",
    inputs: [
      {
        name: "r",
        type: "tuple",
        internalType: "struct HuntCore.BattleResult",
        components: [
          { name: "battleId", type: "bytes32", internalType: "bytes32" },
          { name: "player", type: "address", internalType: "address" },
          { name: "winner", type: "address", internalType: "address" },
          { name: "loser", type: "address", internalType: "address" },
          { name: "playerTokenId", type: "uint256", internalType: "uint256" },
          { name: "opponentTokenId", type: "uint256", internalType: "uint256" },
          { name: "territoryId", type: "uint16", internalType: "uint16" },
          { name: "rounds", type: "uint32", internalType: "uint32" },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "deadline", type: "uint256", internalType: "uint256" },
        ],
      },
      { name: "signature", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getHunter",
    inputs: [{ name: "hunterAddress", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct HuntCore.Hunter",
        components: [
          { name: "rating", type: "uint32", internalType: "uint32" },
          { name: "wins", type: "uint32", internalType: "uint32" },
          { name: "losses", type: "uint32", internalType: "uint32" },
          { name: "streak", type: "uint16", internalType: "uint16" },
          { name: "bestStreak", type: "uint16", internalType: "uint16" },
          { name: "crewId", type: "uint8", internalType: "uint8" },
          { name: "lastBattleAt", type: "uint64", internalType: "uint64" },
          { name: "registered", type: "bool", internalType: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTerritory",
    inputs: [{ name: "territoryId", type: "uint16", internalType: "uint16" }],
    outputs: [
      { name: "id", type: "uint16", internalType: "uint16" },
      { name: "name", type: "string", internalType: "string" },
      { name: "controllingCrew", type: "uint8", internalType: "uint8" },
      { name: "energy", type: "uint32", internalType: "uint32" },
      { name: "battleCount", type: "uint32", internalType: "uint32" },
      { name: "arenaEndsAt", type: "uint64", internalType: "uint64" },
      { name: "crewInfluence", type: "uint16[4]", internalType: "uint16[4]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCrew",
    inputs: [{ name: "crewId", type: "uint8", internalType: "uint8" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct HuntCore.Crew",
        components: [
          { name: "seasonPoints", type: "uint32", internalType: "uint32" },
          { name: "wins", type: "uint32", internalType: "uint32" },
          { name: "losses", type: "uint32", internalType: "uint32" },
          { name: "members", type: "uint32", internalType: "uint32" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "currentSeason",
    inputs: [],
    outputs: [
      { name: "id", type: "uint32", internalType: "uint32" },
      { name: "startsAt", type: "uint64", internalType: "uint64" },
      { name: "endsAt", type: "uint64", internalType: "uint64" },
      { name: "active", type: "bool", internalType: "bool" },
      { name: "totalBattles", type: "uint32", internalType: "uint32" },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "BattleSettled",
    inputs: [
      { name: "battleId", type: "bytes32", indexed: true, internalType: "bytes32" },
      { name: "territoryId", type: "uint16", indexed: true, internalType: "uint16" },
      { name: "winner", type: "address", indexed: true, internalType: "address" },
      { name: "loser", type: "address", indexed: false, internalType: "address" },
      { name: "winnerRatingBefore", type: "uint32", indexed: false, internalType: "uint32" },
      { name: "winnerRatingAfter", type: "uint32", indexed: false, internalType: "uint32" },
      { name: "loserRatingBefore", type: "uint32", indexed: false, internalType: "uint32" },
      { name: "loserRatingAfter", type: "uint32", indexed: false, internalType: "uint32" },
      { name: "influenceDelta", type: "uint16", indexed: false, internalType: "uint16" },
      { name: "crewPointsAwarded", type: "uint32", indexed: false, internalType: "uint32" },
      { name: "winnerStreak", type: "uint16", indexed: false, internalType: "uint16" },
      { name: "achievementMask", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "timestamp", type: "uint64", indexed: false, internalType: "uint64" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ArenaOpened",
    inputs: [
      { name: "territoryId", type: "uint16", indexed: true, internalType: "uint16" },
      { name: "endsAt", type: "uint64", indexed: false, internalType: "uint64" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ArenaClosed",
    inputs: [
      { name: "territoryId", type: "uint16", indexed: true, internalType: "uint16" },
      { name: "winningCrew", type: "uint8", indexed: false, internalType: "uint8" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CrewJoined",
    inputs: [
      { name: "hunter", type: "address", indexed: true, internalType: "address" },
      { name: "crewId", type: "uint8", indexed: true, internalType: "uint8" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TerritoryShifted",
    inputs: [
      { name: "territoryId", type: "uint16", indexed: true, internalType: "uint16" },
      { name: "crewId", type: "uint8", indexed: true, internalType: "uint8" },
      { name: "newInfluence", type: "uint16", indexed: false, internalType: "uint16" },
    ],
    anonymous: false,
  },
] as const;

// Legacy ABIs maintained for backwards compatibility if needed
export const ARENA_ABI = HUNT_CORE_ABI;
export const TERRITORY_ABI = HUNT_CORE_ABI;
