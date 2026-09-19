// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "../src/BeastNFT.sol";
import "../src/Territory.sol";
import "../src/Arena.sol";

contract MonadHuntTest is Test {
    using MessageHashUtils for bytes32;

    BeastNFT public beastNft;
    Territory public territory;
    Arena public arena;

    uint256 public resolverPrivateKey = 0xA11CE;
    address public resolver;

    address public player1 = address(0x1111);
    address public player2 = address(0x2222);

    uint256 public player1TokenId;

    function setUp() public {
        resolver = vm.addr(resolverPrivateKey);

        beastNft = new BeastNFT();
        territory = new Territory();
        arena = new Arena(address(beastNft), address(territory), resolver);

        // Authorize arena in beastNFT and territory
        beastNft.setBattleRecorder(address(arena));
        territory.setAuthorizedArena(address(arena));

        // Fund arena prize pool with 10 MON
        vm.deal(address(arena), 10 ether);

        // Mint Beast for Player 1
        player1TokenId = beastNft.mintBeast(
            player1,
            "VORTEX",
            3, // LEGENDARY
            12,
            82,
            64,
            77,
            91,
            "ipfs://vortex-metadata"
        );

        // Fund players
        vm.deal(player1, 5 ether);
        vm.deal(player2, 5 ether);
    }

    // ==========================================
    // BEAST NFT TESTS
    // ==========================================

    function test_BeastNFT_MintAndOwnership() public view {
        assertEq(beastNft.ownerOf(player1TokenId), player1);
        BeastNFT.BeastAttributes memory attr = beastNft.getBeast(player1TokenId);
        assertEq(attr.name, "VORTEX");
        assertEq(attr.level, 12);
        assertEq(attr.rarity, 3);
        assertEq(attr.attack, 82);
    }

    function test_BeastNFT_UnauthorizedMint_Reverts() public {
        vm.prank(player1);
        vm.expectRevert();
        beastNft.mintBeast(
            player1,
            "TITAN",
            2,
            14,
            75,
            88,
            52,
            70,
            "ipfs://titan"
        );
    }

    // ==========================================
    // ARENA ENTRY TESTS
    // ==========================================

    function test_Arena_ValidEntry() public {
        bytes32 battleId = keccak256(abi.encodePacked("battle_001"));
        vm.prank(player1);
        arena.enterBattle{value: 0.1 ether}(battleId, player1TokenId, 1);

        (address p, uint256 tid, uint256 terrId, uint256 fee, bool resolved) = arena.battles(battleId);
        assertEq(p, player1);
        assertEq(tid, player1TokenId);
        assertEq(terrId, 1);
        assertEq(fee, 0.1 ether);
        assertFalse(resolved);
    }

    function test_Arena_WrongEntryFee_Reverts() public {
        bytes32 battleId = keccak256(abi.encodePacked("battle_002"));
        vm.prank(player1);
        vm.expectRevert("Incorrect entry fee");
        arena.enterBattle{value: 0.05 ether}(battleId, player1TokenId, 1);
    }

    function test_Arena_NotBeastOwner_Reverts() public {
        bytes32 battleId = keccak256(abi.encodePacked("battle_003"));
        vm.prank(player2);
        vm.expectRevert("Must own the beast");
        arena.enterBattle{value: 0.1 ether}(battleId, player1TokenId, 1);
    }

    function test_Arena_DuplicateBattleEntry_Reverts() public {
        bytes32 battleId = keccak256(abi.encodePacked("battle_004"));
        vm.prank(player1);
        arena.enterBattle{value: 0.1 ether}(battleId, player1TokenId, 1);

        // Attempting to re-enter same battleId
        vm.prank(player1);
        vm.expectRevert("Battle ID already exists");
        arena.enterBattle{value: 0.1 ether}(battleId, player1TokenId, 1);
    }

    // ==========================================
    // BATTLE RESOLUTION & SIGNATURE TESTS
    // ==========================================

    function _signBattleResult(
        bytes32 battleId,
        address player,
        address winner,
        uint256 rewardAmount,
        uint256 nonce,
        uint256 deadline,
        uint256 signerKey
    ) internal view returns (bytes memory) {
        bytes32 messageHash = keccak256(
            abi.encode(
                battleId,
                player,
                winner,
                rewardAmount,
                nonce,
                deadline,
                block.chainid,
                address(arena)
            )
        );
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerKey, ethSignedMessageHash);
        return abi.encodePacked(r, s, v);
    }

    function test_Arena_ValidBattleResolution_PlayerWins() public {
        bytes32 battleId = keccak256(abi.encodePacked("battle_win_01"));
        vm.prank(player1);
        arena.enterBattle{value: 0.1 ether}(battleId, player1TokenId, 1); // Andheri Arena

        uint256 reward = 0.18 ether;
        uint256 nonce = 101;
        uint256 deadline = block.timestamp + 1 hours;

        bytes memory signature = _signBattleResult(
            battleId,
            player1,
            player1,
            reward,
            nonce,
            deadline,
            resolverPrivateKey
        );

        uint256 player1BalBefore = player1.balance;

        arena.resolveBattle(battleId, player1, reward, nonce, deadline, signature);

        // 1. Check reward payout
        assertEq(player1.balance, player1BalBefore + reward);

        // 2. Check Beast level up and win count
        BeastNFT.BeastAttributes memory attr = beastNft.getBeast(player1TokenId);
        assertEq(attr.wins, 1);
        assertEq(attr.level, 13); // leveled up from 12 to 13

        // 3. Check Territory capture
        assertEq(territory.ownerOfTerritory(1), player1);

        // 4. Check battle state marked resolved
        (, , , , bool isResolved) = arena.battles(battleId);
        assertTrue(isResolved);
    }

    function test_Arena_InvalidSignature_Reverts() public {
        bytes32 battleId = keccak256(abi.encodePacked("battle_bad_sig"));
        vm.prank(player1);
        arena.enterBattle{value: 0.1 ether}(battleId, player1TokenId, 1);

        uint256 fakeSignerKey = 0xB0B;
        bytes memory badSignature = _signBattleResult(
            battleId,
            player1,
            player1,
            0.18 ether,
            102,
            block.timestamp + 1 hours,
            fakeSignerKey
        );

        vm.expectRevert("Invalid resolver signature");
        arena.resolveBattle(
            battleId,
            player1,
            0.18 ether,
            102,
            block.timestamp + 1 hours,
            badSignature
        );
    }

    function test_Arena_ExpiredSignature_Reverts() public {
        bytes32 battleId = keccak256(abi.encodePacked("battle_expired"));
        vm.prank(player1);
        arena.enterBattle{value: 0.1 ether}(battleId, player1TokenId, 1);

        uint256 deadline = block.timestamp + 10 minutes;
        bytes memory signature = _signBattleResult(
            battleId,
            player1,
            player1,
            0.18 ether,
            103,
            deadline,
            resolverPrivateKey
        );

        // Warp time past deadline
        vm.warp(block.timestamp + 11 minutes);

        vm.expectRevert("Battle result signature expired");
        arena.resolveBattle(battleId, player1, 0.18 ether, 103, deadline, signature);
    }

    function test_Arena_ReplayedNonce_Reverts() public {
        bytes32 battleId1 = keccak256(abi.encodePacked("battle_replay_1"));
        vm.prank(player1);
        arena.enterBattle{value: 0.1 ether}(battleId1, player1TokenId, 1);

        uint256 nonce = 999;
        uint256 deadline = block.timestamp + 1 hours;
        bytes memory sig1 = _signBattleResult(
            battleId1,
            player1,
            player1,
            0.18 ether,
            nonce,
            deadline,
            resolverPrivateKey
        );

        arena.resolveBattle(battleId1, player1, 0.18 ether, nonce, deadline, sig1);

        // Second battle trying to use the same nonce
        bytes32 battleId2 = keccak256(abi.encodePacked("battle_replay_2"));
        vm.prank(player1);
        arena.enterBattle{value: 0.1 ether}(battleId2, player1TokenId, 1);

        bytes memory sig2 = _signBattleResult(
            battleId2,
            player1,
            player1,
            0.18 ether,
            nonce, // Reused nonce!
            deadline,
            resolverPrivateKey
        );

        vm.expectRevert("Nonce already used");
        arena.resolveBattle(battleId2, player1, 0.18 ether, nonce, deadline, sig2);
    }

    function test_Arena_DuplicateResolution_Reverts() public {
        bytes32 battleId = keccak256(abi.encodePacked("battle_dup_resolve"));
        vm.prank(player1);
        arena.enterBattle{value: 0.1 ether}(battleId, player1TokenId, 1);

        uint256 nonce = 500;
        uint256 deadline = block.timestamp + 1 hours;
        bytes memory sig = _signBattleResult(
            battleId,
            player1,
            player1,
            0.18 ether,
            nonce,
            deadline,
            resolverPrivateKey
        );

        arena.resolveBattle(battleId, player1, 0.18 ether, nonce, deadline, sig);

        // Resolving again should revert
        vm.expectRevert("Nonce already used");
        arena.resolveBattle(battleId, player1, 0.18 ether, nonce, deadline, sig);
    }

    function test_Arena_UnauthorizedResolver_Reverts() public {
        bytes32 battleId = keccak256(abi.encodePacked("battle_unauth_resolver"));
        vm.prank(player1);
        arena.enterBattle{value: 0.1 ether}(battleId, player1TokenId, 1);

        uint256 randomKey = 0x9999;
        bytes memory badSig = _signBattleResult(
            battleId,
            player1,
            player1,
            0.18 ether,
            777,
            block.timestamp + 1 hours,
            randomKey
        );

        vm.expectRevert("Invalid resolver signature");
        arena.resolveBattle(battleId, player1, 0.18 ether, 777, block.timestamp + 1 hours, badSig);
    }

    // ==========================================
    // TERRITORY TESTS
    // ==========================================

    function test_Territory_UnauthorizedCapture_Reverts() public {
        vm.prank(player1);
        vm.expectRevert("Unauthorized territory capture caller");
        territory.captureTerritory(1, player1, player1TokenId);
    }
}
