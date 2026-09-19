// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "./BeastNFT.sol";

/**
 * @title HuntCore
 * @notice The authoritative on-chain game brain for MONAD HUNT: CITY LEAGUE.
 * Handles Hunter profiles, 12 Mumbai Territories, 4 Crews, Season management,
 * and deterministic EIP-712 battle settlements with on-chain Elo rating and influence shifts.
 */
contract HuntCore is AccessControl, Pausable, ReentrancyGuard, EIP712 {
    using ECDSA for bytes32;

    bytes32 public constant ARENA_MANAGER_ROLE = keccak256("ARENA_MANAGER_ROLE");
    bytes32 public constant SETTLER_ROLE = keccak256("SETTLER_ROLE");

    bytes32 public constant BATTLE_RESULT_TYPEHASH = keccak256(
        "BattleResult(bytes32 battleId,address player,address winner,address loser,uint256 playerTokenId,uint256 opponentTokenId,uint16 territoryId,uint32 rounds,uint256 nonce,uint256 deadline)"
    );

    uint16 public constant TOTAL_TERRITORIES = 12;
    uint8 public constant TOTAL_CREWS = 4;
    uint32 public constant DEFAULT_RATING = 1000;
    uint32 public constant MIN_RATING = 100;
    uint32 public constant K_FACTOR = 32;

    struct Hunter {
        uint32 rating;
        uint32 wins;
        uint32 losses;
        uint16 streak;
        uint16 bestStreak;
        uint8 crewId; // 1: Neon Vipers, 2: Cyber Wolves, 3: Solar Titans, 4: Shadow Syndicate
        uint64 lastBattleAt;
        bool registered;
    }

    struct Territory {
        uint16 id;
        string name;
        uint8 controllingCrew;
        uint32 energy;
        uint32 battleCount;
        uint64 arenaEndsAt;
        uint16[4] crewInfluence; // indices 0..3 correspond to crew 1..4 (percentage 0..100)
    }

    struct Crew {
        uint32 seasonPoints;
        uint32 wins;
        uint32 losses;
        uint32 members;
    }

    struct Season {
        uint32 id;
        uint64 startsAt;
        uint64 endsAt;
        bool active;
        uint32 totalBattles;
    }

    struct BattleResult {
        bytes32 battleId;
        address player;
        address winner;
        address loser;
        uint256 playerTokenId;
        uint256 opponentTokenId;
        uint16 territoryId;
        uint32 rounds;
        uint256 nonce;
        uint256 deadline;
    }

    BeastNFT public immutable beastNft;

    mapping(address => Hunter) public hunters;
    mapping(uint16 => Territory) public territories;
    mapping(uint8 => Crew) public crews;
    Season public currentSeason;

    mapping(bytes32 => bool) public settledBattles;
    mapping(uint256 => bool) public usedNonces;

    // Events
    event BattleSettled(
        bytes32 indexed battleId,
        uint16 indexed territoryId,
        address indexed winner,
        address loser,
        uint32 winnerRatingBefore,
        uint32 winnerRatingAfter,
        uint32 loserRatingBefore,
        uint32 loserRatingAfter,
        uint16 influenceDelta,
        uint32 crewPointsAwarded,
        uint16 winnerStreak,
        uint256 achievementMask,
        uint64 timestamp
    );

    event ArenaOpened(uint16 indexed territoryId, uint64 endsAt);
    event ArenaClosed(uint16 indexed territoryId, uint8 winningCrew);
    event CrewJoined(address indexed hunter, uint8 indexed crewId);
    event TerritoryShifted(uint16 indexed territoryId, uint8 indexed crewId, uint16 newInfluence);
    event SeasonStarted(uint32 indexed seasonId, uint64 startsAt, uint64 endsAt);

    constructor(address _beastNftAddress, address _settlerAddress)
        EIP712("MonadHuntCore", "1")
    {
        require(_beastNftAddress != address(0), "Invalid BeastNFT address");
        require(_settlerAddress != address(0), "Invalid Settler address");

        beastNft = BeastNFT(_beastNftAddress);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ARENA_MANAGER_ROLE, msg.sender);
        _grantRole(SETTLER_ROLE, _settlerAddress);

        _initTerritories();
        _initSeason(1, uint64(block.timestamp), uint64(block.timestamp + 30 days));
    }

    function _initTerritories() internal {
        _setTerritory(1, "ANDHERI ARENA", 1);
        _setTerritory(2, "BANDRA COAST", 2);
        _setTerritory(3, "POWAI TECH HUB", 3);
        _setTerritory(4, "FORT COLOSSEUM", 4);
        _setTerritory(5, "BKC SKYSCRAPER", 1);
        _setTerritory(6, "COLABA POINT", 2);
        _setTerritory(7, "JUHU SHORE", 3);
        _setTerritory(8, "DADAR JUNCTION", 4);
        _setTerritory(9, "MALAD RIDGE", 1);
        _setTerritory(10, "THANE GATES", 2);
        _setTerritory(11, "NAVI MUMBAI PORT", 3);
        _setTerritory(12, "WORLI SEAFRONT", 4);
    }

    function _setTerritory(uint16 id, string memory name, uint8 initialCrew) internal {
        Territory storage t = territories[id];
        t.id = id;
        t.name = name;
        t.controllingCrew = initialCrew;
        t.energy = 1000;
        t.battleCount = 0;
        t.arenaEndsAt = uint64(block.timestamp + 1 days); // Initial active arenas
        // Set initial baseline influence
        t.crewInfluence[0] = initialCrew == 1 ? 55 : 15;
        t.crewInfluence[1] = initialCrew == 2 ? 55 : 15;
        t.crewInfluence[2] = initialCrew == 3 ? 55 : 15;
        t.crewInfluence[3] = initialCrew == 4 ? 55 : 15;
    }

    function _initSeason(uint32 id, uint64 startsAt, uint64 endsAt) internal {
        currentSeason = Season({
            id: id,
            startsAt: startsAt,
            endsAt: endsAt,
            active: true,
            totalBattles: 0
        });
        emit SeasonStarted(id, startsAt, endsAt);
    }

    // --- Admin / Arena Management ---

    function openArena(uint16 territoryId, uint64 duration) external onlyRole(ARENA_MANAGER_ROLE) {
        require(territoryId >= 1 && territoryId <= TOTAL_TERRITORIES, "Invalid territory");
        uint64 endsAt = uint64(block.timestamp + duration);
        territories[territoryId].arenaEndsAt = endsAt;
        emit ArenaOpened(territoryId, endsAt);
    }

    function closeArena(uint16 territoryId) external onlyRole(ARENA_MANAGER_ROLE) {
        require(territoryId >= 1 && territoryId <= TOTAL_TERRITORIES, "Invalid territory");
        Territory storage t = territories[territoryId];
        t.arenaEndsAt = uint64(block.timestamp);
        emit ArenaClosed(territoryId, t.controllingCrew);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // --- Hunter & Crew Registration ---

    function registerHunter(address hunterAddress, uint8 crewId) internal returns (Hunter storage) {
        Hunter storage h = hunters[hunterAddress];
        if (!h.registered) {
            h.rating = DEFAULT_RATING;
            h.wins = 0;
            h.losses = 0;
            h.streak = 0;
            h.bestStreak = 0;
            h.crewId = crewId > 0 && crewId <= TOTAL_CREWS ? crewId : 1;
            h.lastBattleAt = 0;
            h.registered = true;

            crews[h.crewId].members += 1;
            emit CrewJoined(hunterAddress, h.crewId);
        }
        return h;
    }

    function joinCrew(uint8 crewId) external whenNotPaused {
        require(crewId >= 1 && crewId <= TOTAL_CREWS, "Invalid Crew ID");
        Hunter storage h = hunters[msg.sender];
        if (h.registered) {
            require(h.crewId == 0, "Already in a crew this season");
            h.crewId = crewId;
        } else {
            h.rating = DEFAULT_RATING;
            h.wins = 0;
            h.losses = 0;
            h.streak = 0;
            h.bestStreak = 0;
            h.crewId = crewId;
            h.lastBattleAt = 0;
            h.registered = true;
        }
        crews[crewId].members += 1;
        emit CrewJoined(msg.sender, crewId);
    }

    // --- Battle Settlement (EIP-712 Verified) ---

    function hashBattleResult(BattleResult calldata r) public view returns (bytes32) {
        return _hashTypedDataV4(
            keccak256(
                abi.encode(
                    BATTLE_RESULT_TYPEHASH,
                    r.battleId,
                    r.player,
                    r.winner,
                    r.loser,
                    r.playerTokenId,
                    r.opponentTokenId,
                    r.territoryId,
                    r.rounds,
                    r.nonce,
                    r.deadline
                )
            )
        );
    }

    function settleBattle(
        BattleResult calldata r,
        bytes calldata signature
    ) external whenNotPaused nonReentrant {
        require(currentSeason.active, "Season not active");
        require(block.timestamp <= r.deadline, "Battle signature expired");
        require(!settledBattles[r.battleId], "Battle already settled");
        require(!usedNonces[r.nonce], "Nonce already used");
        require(r.territoryId >= 1 && r.territoryId <= TOTAL_TERRITORIES, "Invalid territory");
        require(r.winner != address(0), "Winner cannot be zero address");

        // Verify EIP-712 signature from SETTLER_ROLE
        bytes32 digest = hashBattleResult(r);
        address recoveredSigner = digest.recover(signature);
        require(hasRole(SETTLER_ROLE, recoveredSigner), "Invalid settlement signature");

        // Verify Beast Ownership
        if (r.player != address(0) && r.playerTokenId > 0) {
            require(beastNft.ownerOf(r.playerTokenId) == r.player, "Player does not own beast");
        }

        // Mark replay prevention state
        settledBattles[r.battleId] = true;
        usedNonces[r.nonce] = true;

        // Ensure both participants are registered
        Hunter storage winnerHunter = hunters[r.winner].registered ? hunters[r.winner] : registerHunter(r.winner, 1);
        Hunter storage loserHunter = (r.loser != address(0) && hunters[r.loser].registered)
            ? hunters[r.loser]
            : (r.loser != address(0) ? registerHunter(r.loser, 2) : hunters[address(0)]);

        uint32 winnerRatingBefore = winnerHunter.rating;
        uint32 loserRatingBefore = loserHunter.rating > 0 ? loserHunter.rating : DEFAULT_RATING;

        // 1. Calculate on-chain Elo Rating Delta (Integer Scaled)
        (uint32 winnerRatingAfter, uint32 loserRatingAfter, uint16 ratingDelta) = _computeEloDelta(
            winnerRatingBefore,
            loserRatingBefore
        );

        winnerHunter.rating = winnerRatingAfter;
        winnerHunter.wins += 1;
        winnerHunter.streak += 1;
        if (winnerHunter.streak > winnerHunter.bestStreak) {
            winnerHunter.bestStreak = winnerHunter.streak;
        }
        winnerHunter.lastBattleAt = uint64(block.timestamp);

        if (r.loser != address(0)) {
            loserHunter.rating = loserRatingAfter;
            loserHunter.losses += 1;
            loserHunter.streak = 0;
            loserHunter.lastBattleAt = uint64(block.timestamp);
        }

        // 2. Calculate Territory Influence Shift (scaled by upset factor)
        uint16 influenceDelta = uint16(10 + (ratingDelta / 4));
        if (influenceDelta > 30) influenceDelta = 30; // Clamp max influence shift per battle

        Territory storage terr = territories[r.territoryId];
        terr.battleCount += 1;
        terr.energy += 50;

        uint8 winnerCrew = winnerHunter.crewId > 0 ? winnerHunter.crewId : 1;
        uint8 crewIndex = winnerCrew - 1;

        uint16 currentInf = terr.crewInfluence[crewIndex];
        uint16 newInf = currentInf + influenceDelta > 100 ? 100 : currentInf + influenceDelta;
        terr.crewInfluence[crewIndex] = newInf;

        // Rebalance other crews proportionally
        _rebalanceInfluence(terr, crewIndex, influenceDelta);

        // Update controlling crew if dominant
        if (terr.crewInfluence[crewIndex] > terr.crewInfluence[terr.controllingCrew - 1]) {
            terr.controllingCrew = winnerCrew;
        }

        emit TerritoryShifted(r.territoryId, winnerCrew, terr.crewInfluence[crewIndex]);

        // 3. Update Crew Points
        uint32 crewPoints = uint32(25 + ratingDelta);
        crews[winnerCrew].seasonPoints += crewPoints;
        crews[winnerCrew].wins += 1;
        if (r.loser != address(0) && loserHunter.crewId > 0) {
            crews[loserHunter.crewId].losses += 1;
        }

        currentSeason.totalBattles += 1;

        // 4. Update Beast NFT stats
        if (r.player == r.winner && r.playerTokenId > 0) {
            beastNft.recordBattle(r.playerTokenId, true, 1);
        } else if (r.player == r.loser && r.playerTokenId > 0) {
            beastNft.recordBattle(r.playerTokenId, false, 0);
        }

        // 5. Compute Achievement Bitmask
        uint256 achievementMask = _computeAchievements(winnerHunter);

        emit BattleSettled(
            r.battleId,
            r.territoryId,
            r.winner,
            r.loser,
            winnerRatingBefore,
            winnerRatingAfter,
            loserRatingBefore,
            loserRatingAfter,
            influenceDelta,
            crewPoints,
            winnerHunter.streak,
            achievementMask,
            uint64(block.timestamp)
        );
    }

    function _computeEloDelta(uint32 winnerRating, uint32 loserRating)
        internal
        pure
        returns (uint32 winnerRatingAfter, uint32 loserRatingAfter, uint16 delta)
    {
        // Elo calculation using scaled integer math
        int32 ratingDiff = int32(loserRating) - int32(winnerRating);
        if (ratingDiff > 400) ratingDiff = 400;
        if (ratingDiff < -400) ratingDiff = -400;

        int32 calculatedDelta = int32(K_FACTOR / 2) + (ratingDiff * int32(K_FACTOR)) / 800;
        if (calculatedDelta < 8) calculatedDelta = 8;
        if (calculatedDelta > 32) calculatedDelta = 32;

        delta = uint16(uint32(calculatedDelta));
        winnerRatingAfter = winnerRating + delta;

        if (loserRating > delta + MIN_RATING) {
            loserRatingAfter = loserRating - delta;
        } else {
            loserRatingAfter = MIN_RATING;
        }
    }

    function _rebalanceInfluence(Territory storage terr, uint8 winningCrewIndex, uint16 delta) internal {
        uint16 deduction = delta / 3;
        if (deduction == 0) deduction = 1;

        for (uint8 i = 0; i < TOTAL_CREWS; i++) {
            if (i != winningCrewIndex) {
                if (terr.crewInfluence[i] > deduction) {
                    terr.crewInfluence[i] -= deduction;
                } else {
                    terr.crewInfluence[i] = 5;
                }
            }
        }
    }

    function _computeAchievements(Hunter storage h) internal view returns (uint256 mask) {
        // Bit 0: First Blood (1 win)
        if (h.wins >= 1) mask |= (1 << 0);
        // Bit 1: Three-Peat (3 streak)
        if (h.streak >= 3) mask |= (1 << 1);
        // Bit 2: Territory Hunter (1200+ rating)
        if (h.rating >= 1200) mask |= (1 << 2);
        // Bit 3: Crew Warrior (10+ wins)
        if (h.wins >= 10) mask |= (1 << 3);
        // Bit 4: City Hunter (25+ wins)
        if (h.wins >= 25) mask |= (1 << 4);
        // Bit 5: Arena Champion (5 streak)
        if (h.streak >= 5) mask |= (1 << 5);
    }

    // --- View Helpers ---

    function getHunter(address hunterAddress) external view returns (Hunter memory) {
        return hunters[hunterAddress];
    }

    function getTerritory(uint16 territoryId) external view returns (
        uint16 id,
        string memory name,
        uint8 controllingCrew,
        uint32 energy,
        uint32 battleCount,
        uint64 arenaEndsAt,
        uint16[4] memory crewInfluence
    ) {
        require(territoryId >= 1 && territoryId <= TOTAL_TERRITORIES, "Invalid territory");
        Territory storage t = territories[territoryId];
        return (
            t.id,
            t.name,
            t.controllingCrew,
            t.energy,
            t.battleCount,
            t.arenaEndsAt,
            t.crewInfluence
        );
    }

    function getCrew(uint8 crewId) external view returns (Crew memory) {
        require(crewId >= 1 && crewId <= TOTAL_CREWS, "Invalid Crew");
        return crews[crewId];
    }
}
