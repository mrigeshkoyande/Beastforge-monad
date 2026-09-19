// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Territory
 * @notice Manages Mumbai territory ownership in MONAD HUNT.
 * Territories are conquered upon arena victory.
 */
contract Territory is Ownable {
    struct TerritoryInfo {
        uint256 id;
        string name;
        string zone;
        address currentOwner;
        uint256 guardianTokenId;
        uint256 conqueredCount;
        uint256 lastConqueredAt;
    }

    // Mapping from territoryId to TerritoryInfo
    mapping(uint256 => TerritoryInfo) public territories;

    // Authorized Arena contract allowed to update ownership
    address public authorizedArena;

    uint256 public constant TOTAL_TERRITORIES = 5;

    event TerritoryCaptured(
        uint256 indexed territoryId,
        string name,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 guardianTokenId,
        uint256 conqueredCount
    );

    event AuthorizedArenaUpdated(address indexed newArena);

    modifier onlyAuthorizedArena() {
        require(msg.sender == authorizedArena || msg.sender == owner(), "Unauthorized territory capture caller");
        _;
    }

    constructor() Ownable(msg.sender) {
        _initTerritory(1, "ANDHERI ARENA", "North Zone", msg.sender, 27);
        _initTerritory(2, "BANDRA COAST", "West Coast", msg.sender, 14);
        _initTerritory(3, "POWAI TECH HUB", "Central Valley", msg.sender, 3);
        _initTerritory(4, "FORT COLOSSEUM", "South District", msg.sender, 14);
        _initTerritory(5, "BKC SKYSCRAPER", "Financial Hub", msg.sender, 8);
    }

    function _initTerritory(
        uint256 id,
        string memory name,
        string memory zone,
        address initialOwner,
        uint256 guardianTokenId
    ) internal {
        territories[id] = TerritoryInfo({
            id: id,
            name: name,
            zone: zone,
            currentOwner: initialOwner,
            guardianTokenId: guardianTokenId,
            conqueredCount: 1,
            lastConqueredAt: block.timestamp
        });
    }

    function setAuthorizedArena(address _arena) external onlyOwner {
        require(_arena != address(0), "Invalid arena address");
        authorizedArena = _arena;
        emit AuthorizedArenaUpdated(_arena);
    }

    /**
     * @notice Captures a territory. Only callable by authorized Arena contract.
     */
    function captureTerritory(
        uint256 territoryId,
        address newOwner,
        uint256 guardianTokenId
    ) external onlyAuthorizedArena {
        require(territoryId >= 1 && territoryId <= TOTAL_TERRITORIES, "Invalid territory ID");
        require(newOwner != address(0), "Cannot assign territory to zero address");

        TerritoryInfo storage territory = territories[territoryId];
        address previousOwner = territory.currentOwner;

        territory.currentOwner = newOwner;
        territory.guardianTokenId = guardianTokenId;
        territory.conqueredCount += 1;
        territory.lastConqueredAt = block.timestamp;

        emit TerritoryCaptured(
            territoryId,
            territory.name,
            previousOwner,
            newOwner,
            guardianTokenId,
            territory.conqueredCount
        );
    }

    function getTerritory(uint256 territoryId) external view returns (TerritoryInfo memory) {
        require(territoryId >= 1 && territoryId <= TOTAL_TERRITORIES, "Invalid territory ID");
        return territories[territoryId];
    }

    function ownerOfTerritory(uint256 territoryId) external view returns (address) {
        require(territoryId >= 1 && territoryId <= TOTAL_TERRITORIES, "Invalid territory ID");
        return territories[territoryId].currentOwner;
    }
}
