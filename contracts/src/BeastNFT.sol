// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BeastNFT
 * @notice ERC-721 token representing AI Beasts in MONAD HUNT: CITY LEAGUE.
 * Includes deterministic starter beast minting and combat progression.
 * Beasts remain safely in the player's wallet at all times.
 */
contract BeastNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    struct BeastAttributes {
        string name;
        uint8 beastType; // 0: FIRE, 1: WATER, 2: ELECTRIC, 3: EARTH, 4: SHADOW, 5: CYBER
        uint8 rarity;    // 0: COMMON, 1: RARE, 2: EPIC, 3: LEGENDARY
        uint8 level;
        uint16 attack;
        uint16 defense;
        uint16 speed;
        uint16 energy;
        uint32 xp;
        uint32 wins;
        uint32 losses;
    }

    // Mapping from tokenId to on-chain BeastAttributes
    mapping(uint256 => BeastAttributes) public beasts;

    // Free starter tracking (1 per wallet)
    mapping(address => bool) public hasMintedStarter;
    mapping(address => uint256) public playerStarterTokenId;

    // Authorized battle recorder contract (e.g. HuntCore.sol)
    address public battleRecorder;

    event BeastMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        uint8 rarity,
        uint8 level
    );

    event StarterMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        uint8 beastType
    );

    event BeastLeveledUp(uint256 indexed tokenId, uint8 newLevel, uint32 wins);
    event BattleRecorderUpdated(address indexed newRecorder);

    modifier onlyBattleRecorder() {
        require(msg.sender == battleRecorder || msg.sender == owner(), "Unauthorized battle recorder");
        _;
    }

    constructor() ERC721("Monad Hunt Beast", "BEAST") Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    function setBattleRecorder(address _recorder) external onlyOwner {
        require(_recorder != address(0), "Invalid recorder address");
        battleRecorder = _recorder;
        emit BattleRecorderUpdated(_recorder);
    }

    /**
     * @notice Mints one free starter Beast per wallet with deterministic baseline stats.
     */
    function mintStarter(address to) external returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(!hasMintedStarter[to], "Starter beast already claimed for this wallet");

        uint256 tokenId = _nextTokenId++;
        hasMintedStarter[to] = true;
        playerStarterTokenId[to] = tokenId;

        // Deterministic starter selection based on tokenId and recipient address
        uint8 beastType = uint8(uint256(keccak256(abi.encodePacked(tokenId, to, "STARTER_TYPE"))) % 4); // Fire, Water, Electric, Earth
        
        string memory name = "Emberwyrm";
        if (beastType == 1) name = "Tidewarden";
        else if (beastType == 2) name = "Voltclaw";
        else if (beastType == 3) name = "Terrashell";

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked("https://monadhunt.xyz/metadata/beasts/", _toString(tokenId))));

        beasts[tokenId] = BeastAttributes({
            name: name,
            beastType: beastType,
            rarity: 1, // RARE starter
            level: 1,
            attack: 45 + uint16(beastType * 3),
            defense: 40 + uint16((3 - beastType) * 3),
            speed: 50,
            energy: 100,
            xp: 0,
            wins: 0,
            losses: 0
        });

        emit StarterMinted(tokenId, to, name, beastType);
        emit BeastMinted(tokenId, to, name, 1, 1);

        return tokenId;
    }

    /**
     * @notice Mints a new custom Beast NFT with attributes (Owner / Admin only).
     */
    function mintBeast(
        address to,
        string memory name,
        uint8 beastType,
        uint8 rarity,
        uint8 level,
        uint16 attack,
        uint16 defense,
        uint16 speed,
        uint16 energy,
        string memory uri
    ) external onlyOwner returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        uint256 tokenId = _nextTokenId++;

        emit BeastMinted(tokenId, to, name, rarity, level);
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        beasts[tokenId] = BeastAttributes({
            name: name,
            beastType: beastType,
            rarity: rarity,
            level: level > 0 ? level : 1,
            attack: attack,
            defense: defense,
            speed: speed,
            energy: energy,
            xp: 0,
            wins: 0,
            losses: 0
        });

        return tokenId;
    }

    /**
     * @notice Records combat victory or defeat. Only HuntCore contract or Owner.
     */
    function recordBattle(
        uint256 tokenId,
        bool won,
        uint8 levelUpCount
    ) external onlyBattleRecorder {
        require(_ownerOf(tokenId) != address(0), "Beast does not exist");
        BeastAttributes storage beast = beasts[tokenId];

        if (won) {
            beast.wins += 1;
            beast.xp += 100;
            if (levelUpCount > 0) {
                beast.level += levelUpCount;
                beast.attack += uint16(levelUpCount * 3);
                beast.defense += uint16(levelUpCount * 2);
                beast.speed += uint16(levelUpCount * 1);
                emit BeastLeveledUp(tokenId, beast.level, beast.wins);
            }
        } else {
            beast.losses += 1;
            beast.xp += 25;
        }
    }

    function getBeast(uint256 tokenId) external view returns (BeastAttributes memory) {
        require(_ownerOf(tokenId) != address(0), "Beast does not exist");
        return beasts[tokenId];
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
