// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Achievements
 * @notice On-chain achievement registry for MONAD HUNT.
 * Tracks verified achievements earned via battles and territory conquests.
 * Prevents arbitrary frontend awards and duplicate claims.
 */
contract Achievements is Ownable {
    enum AchievementType {
        FIRST_BLOOD,     // 0: Win your first arena battle
        WARRIOR,         // 1: Win 10 battles
        UNSTOPPABLE,     // 2: Achieve a 5-win streak
        CONQUEROR,       // 3: Capture 3 territories
        MONAD_CHAMPION   // 4: Conquer all 5 Mumbai territories
    }

    struct Achievement {
        uint256 id;
        string name;
        string description;
        string icon;
        uint256 xpReward;
    }

    // Mapping: achievement ID => Achievement details
    mapping(uint256 => Achievement) public achievementDefs;
    uint256 public totalAchievements;

    // Mapping: player => achievement ID => unlocked status
    mapping(address => mapping(uint256 => bool)) public hasUnlocked;
    
    // Mapping: player => achievement ID => timestamp of unlock
    mapping(address => mapping(uint256 => uint256)) public unlockTimestamp;

    // Authorized verifiers (e.g. Arena contract or Oracle signer)
    mapping(address => bool) public authorizedVerifiers;

    event AchievementUnlocked(
        address indexed player,
        uint256 indexed achievementId,
        string name,
        uint256 timestamp
    );

    event VerifierUpdated(address indexed verifier, bool authorized);

    modifier onlyVerifier() {
        require(authorizedVerifiers[msg.sender] || msg.sender == owner(), "Caller not authorized verifier");
        _;
    }

    constructor() Ownable(msg.sender) {
        _registerAchievement(0, "FIRST BLOOD", "Win your first battle in the Arena", "Trophy", 100);
        _registerAchievement(1, "WARRIOR", "Win 10 battles across Mumbai", "Swords", 250);
        _registerAchievement(2, "UNSTOPPABLE", "Achieve a 5-win streak in competitive arena", "Flame", 500);
        _registerAchievement(3, "CONQUEROR", "Capture 3 distinct Mumbai territories", "MapPin", 750);
        _registerAchievement(4, "MONAD CHAMPION", "Conquer all 5 Mumbai territories and reign supreme", "Crown", 1500);
        
        authorizedVerifiers[msg.sender] = true;
    }

    function _registerAchievement(
        uint256 id,
        string memory name,
        string memory description,
        string memory icon,
        uint256 xpReward
    ) internal {
        achievementDefs[id] = Achievement({
            id: id,
            name: name,
            description: description,
            icon: icon,
            xpReward: xpReward
        });
        totalAchievements++;
    }

    function setVerifier(address verifier, bool authorized) external onlyOwner {
        require(verifier != address(0), "Invalid verifier address");
        authorizedVerifiers[verifier] = authorized;
        emit VerifierUpdated(verifier, authorized);
    }

    /**
     * @notice Unlocks an achievement for a player. Callable only by authorized verifier.
     * Prevents duplicate unlocking.
     */
    function unlockAchievement(address player, uint256 achievementId) external onlyVerifier {
        require(player != address(0), "Invalid player");
        require(achievementId < totalAchievements, "Achievement does not exist");
        require(!hasUnlocked[player][achievementId], "Achievement already unlocked");

        hasUnlocked[player][achievementId] = true;
        unlockTimestamp[player][achievementId] = block.timestamp;

        emit AchievementUnlocked(player, achievementId, achievementDefs[achievementId].name, block.timestamp);
    }

    /**
     * @notice Helper to check which achievements a player has unlocked.
     */
    function getPlayerAchievements(address player) external view returns (bool[] memory unlocked, uint256[] memory timestamps) {
        unlocked = new bool[](totalAchievements);
        timestamps = new uint256[](totalAchievements);

        for (uint256 i = 0; i < totalAchievements; i++) {
            unlocked[i] = hasUnlocked[player][i];
            timestamps[i] = unlockTimestamp[player][i];
        }
    }
}
