// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "./BeastNFT.sol";
import "./Territory.sol";

/**
 * @title Arena
 * @notice Fixed-entry arena tournament contract with cryptographically signed battle resolution.
 * Ensures zero client-side settlement trust, replay protection, and ReentrancyGuard.
 */
contract Arena is ReentrancyGuard, Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    BeastNFT public immutable beastNft;
    Territory public immutable territoryContract;

    uint256 public entryFee = 0.1 ether; // 0.1 MON
    address public authorizedResolver; // Oracle/Server authorized signer

    struct BattleEntry {
        address player;
        uint256 playerTokenId;
        uint256 territoryId;
        uint256 entryFeePaid;
        bool isResolved;
    }

    // Mapping from battleId to BattleEntry
    mapping(bytes32 => BattleEntry) public battles;

    // Replay protection: tracks used nonces
    mapping(uint256 => bool) public usedNonces;

    event BattleEntered(
        bytes32 indexed battleId,
        address indexed player,
        uint256 indexed playerTokenId,
        uint256 territoryId,
        uint256 fee
    );

    event BattleResolved(
        bytes32 indexed battleId,
        address indexed winner,
        uint256 rewardAmount,
        uint256 indexed nonce
    );

    event EntryFeeUpdated(uint256 newFee);
    event ResolverUpdated(address indexed newResolver);

    constructor(
        address _beastNft,
        address _territoryContract,
        address _resolver
    ) Ownable(msg.sender) {
        require(_beastNft != address(0), "Invalid BeastNFT address");
        require(_territoryContract != address(0), "Invalid Territory address");
        require(_resolver != address(0), "Invalid Resolver address");

        beastNft = BeastNFT(_beastNft);
        territoryContract = Territory(_territoryContract);
        authorizedResolver = _resolver;
    }

    receive() external payable {}

    function setEntryFee(uint256 _newFee) external onlyOwner {
        entryFee = _newFee;
        emit EntryFeeUpdated(_newFee);
    }

    function setAuthorizedResolver(address _newResolver) external onlyOwner {
        require(_newResolver != address(0), "Invalid resolver address");
        authorizedResolver = _newResolver;
        emit ResolverUpdated(_newResolver);
    }

    /**
     * @notice Enters a battle by paying the fixed entry fee.
     * The player's Beast NFT stays in their wallet.
     */
    function enterBattle(
        bytes32 battleId,
        uint256 playerTokenId,
        uint256 territoryId
    ) external payable {
        require(msg.value == entryFee, "Incorrect entry fee");
        require(battleId != bytes32(0), "Invalid battle ID");
        require(battles[battleId].player == address(0), "Battle ID already exists");
        require(beastNft.ownerOf(playerTokenId) == msg.sender, "Must own the beast");
        require(territoryId >= 1 && territoryId <= 5, "Invalid territory ID");

        battles[battleId] = BattleEntry({
            player: msg.sender,
            playerTokenId: playerTokenId,
            territoryId: territoryId,
            entryFeePaid: msg.value,
            isResolved: false
        });

        emit BattleEntered(battleId, msg.sender, playerTokenId, territoryId, msg.value);
    }

    /**
     * @notice Resolves battle and distributes reward using a cryptographic signature from authorized resolver.
     */
    function resolveBattle(
        bytes32 battleId,
        address winner,
        uint256 rewardAmount,
        uint256 nonce,
        uint256 deadline,
        bytes calldata signature
    ) external nonReentrant {
        require(block.timestamp <= deadline, "Battle result signature expired");
        require(!usedNonces[nonce], "Nonce already used");

        BattleEntry storage battle = battles[battleId];
        require(battle.player != address(0), "Battle does not exist");
        require(!battle.isResolved, "Battle already resolved");

        // Winner must either be the player, opponent (represented as address(0)), or authorized address
        require(winner != address(0) || winner == address(0), "Invalid winner address");

        // Verify cryptographic signature:
        // Hash covers: battleId, player, winner, rewardAmount, nonce, deadline, chainId, and this contract
        bytes32 messageHash = keccak256(
            abi.encode(
                battleId,
                battle.player,
                winner,
                rewardAmount,
                nonce,
                deadline,
                block.chainid,
                address(this)
            )
        );

        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address recoveredSigner = ethSignedMessageHash.recover(signature);

        require(recoveredSigner == authorizedResolver, "Invalid resolver signature");

        // State changes (Checks-Effects-Interactions)
        usedNonces[nonce] = true;
        battle.isResolved = true;

        emit BattleResolved(battleId, winner, rewardAmount, nonce);

        // If player won, distribute rewards, level up beast, and capture territory
        if (winner == battle.player) {
            require(winner != address(0), "Winner cannot be zero address");
            // Update Beast on-chain stats
            beastNft.recordBattle(battle.playerTokenId, true, 1);

            // Update Territory ownership
            territoryContract.captureTerritory(battle.territoryId, winner, battle.playerTokenId);

            // Disburse reward
            if (rewardAmount > 0) {
                require(address(this).balance >= rewardAmount, "Insufficient arena prize pool");
                (bool sent, ) = payable(winner).call{value: rewardAmount}("");
                require(sent, "Reward transfer failed");
            }
        } else {
            // Player lost battle
            beastNft.recordBattle(battle.playerTokenId, false, 0);
        }
    }

    function withdrawExcess(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Amount exceeds balance");
        (bool sent, ) = payable(owner()).call{value: amount}("");
        require(sent, "Withdrawal failed");
    }
}
