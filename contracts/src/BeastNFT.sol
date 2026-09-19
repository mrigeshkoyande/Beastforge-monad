// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BeastNFT
 * @notice ERC-721 token representing AI Beasts in MONAD HUNT.
 * Beasts remain safely in the player's wallet at all times.
 */
contract BeastNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    struct BeastAttributes {
        string name;
        uint8 rarity; // 0: COMMON, 1: RARE, 2: EPIC, 3: LEGENDARY
        uint8 level;
        uint16 attack;
        uint16 defense;
        uint16 speed;
        uint16 energy;
        uint32 wins;
        uint32 losses;
    }

    // Mapping from tokenId to on-chain BeastAttributes
    mapping(uint256 => BeastAttributes) public beasts;

    // Authorized battle recorder contract (e.g. Arena.sol)
    address public battleRecorder;

    event BeastMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        uint8 rarity,
        uint8 level
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
     * @notice Mints a new Beast NFT with attributes.
     */
    function mintBeast(
        address to,
        string memory name,
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
            rarity: rarity,
            level: level > 0 ? level : 1,
            attack: attack,
            defense: defense,
            speed: speed,
            energy: energy,
            wins: 0,
            losses: 0
        });

        return tokenId;
    }

    /**
     * @notice Records combat victory or defeat. Only Arena contract or Owner.
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
            if (levelUpCount > 0) {
                beast.level += levelUpCount;
                beast.attack += uint16(levelUpCount * 2);
                beast.defense += uint16(levelUpCount * 2);
                beast.speed += uint16(levelUpCount * 1);
                emit BeastLeveledUp(tokenId, beast.level, beast.wins);
            }
        } else {
            beast.losses += 1;
        }
    }

    function getBeast(uint256 tokenId) external view returns (BeastAttributes memory) {
        require(_ownerOf(tokenId) != address(0), "Beast does not exist");
        return beasts[tokenId];
    }
}
