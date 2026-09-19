// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/BeastNFT.sol";
import "../src/HuntCore.sol";

contract HuntCoreTest is Test {
    BeastNFT public beastNft;
    HuntCore public huntCore;

    uint256 internal settlerPrivateKey = 0xA11CE;
    address internal settler;

    address internal player1 = address(0x1001);
    address internal player2 = address(0x1002);
    address internal stranger = address(0x9999);

    uint256 internal player1BeastId;
    uint256 internal player2BeastId;

    function setUp() public {
        settler = vm.addr(settlerPrivateKey);

        beastNft = new BeastNFT();
        huntCore = new HuntCore(address(beastNft), settler);

        beastNft.setBattleRecorder(address(huntCore));

        // Mint starter beasts
        player1BeastId = beastNft.mintStarter(player1);
        player2BeastId = beastNft.mintStarter(player2);

        // Join crews
        vm.prank(player1);
        huntCore.joinCrew(1); // Neon Vipers

        vm.prank(player2);
        huntCore.joinCrew(2); // Cyber Wolves
    }

    function test_OneStarterPerWallet_RevertsOnDuplicate() public {
        vm.expectRevert("Starter beast already claimed for this wallet");
        beastNft.mintStarter(player1);
    }

    function test_JoinCrew_SuccessAndDuplicateCheck() public {
        address newPlayer = address(0x3333);
        vm.prank(newPlayer);
        huntCore.joinCrew(3); // Solar Titans

        HuntCore.Hunter memory h = huntCore.getHunter(newPlayer);
        assertEq(h.crewId, 3);
        assertEq(h.rating, 1000);

        // Duplicate join
        vm.prank(newPlayer);
        vm.expectRevert("Already in a crew this season");
        huntCore.joinCrew(4);
    }

    function _signBattleResult(
        HuntCore.BattleResult memory r,
        uint256 pKey
    ) internal view returns (bytes memory) {
        bytes32 digest = huntCore.hashBattleResult(r);
        (uint8 v, bytes32 rSig, bytes32 sSig) = vm.sign(pKey, digest);
        return abi.encodePacked(rSig, sSig, v);
    }

    function test_SettleBattle_Success() public {
        bytes32 battleId = keccak256("battle_test_01");
        uint256 nonce = 101;
        uint256 deadline = block.timestamp + 3600;

        HuntCore.BattleResult memory r = HuntCore.BattleResult({
            battleId: battleId,
            player: player1,
            winner: player1,
            loser: player2,
            playerTokenId: player1BeastId,
            opponentTokenId: player2BeastId,
            territoryId: 3, // Powai Tech Hub
            rounds: 4,
            nonce: nonce,
            deadline: deadline
        });

        bytes memory signature = _signBattleResult(r, settlerPrivateKey);

        huntCore.settleBattle(r, signature);

        HuntCore.Hunter memory winnerHunter = huntCore.getHunter(player1);
        HuntCore.Hunter memory loserHunter = huntCore.getHunter(player2);

        assertGt(winnerHunter.rating, 1000);
        assertLt(loserHunter.rating, 1000);
        assertEq(winnerHunter.wins, 1);
        assertEq(winnerHunter.streak, 1);
        assertEq(loserHunter.losses, 1);
        assertEq(loserHunter.streak, 0);

        // Check territory influence
        (, , uint8 controllingCrew, , , , uint16[4] memory influence) = huntCore.getTerritory(3);
        assertGt(influence[0], 15); // Crew 1 influence increased
    }

    function test_SettleBattle_ReplayRejected() public {
        bytes32 battleId = keccak256("battle_test_replay");
        uint256 nonce = 102;
        uint256 deadline = block.timestamp + 3600;

        HuntCore.BattleResult memory r = HuntCore.BattleResult({
            battleId: battleId,
            player: player1,
            winner: player1,
            loser: player2,
            playerTokenId: player1BeastId,
            opponentTokenId: player2BeastId,
            territoryId: 1,
            rounds: 3,
            nonce: nonce,
            deadline: deadline
        });

        bytes memory signature = _signBattleResult(r, settlerPrivateKey);

        huntCore.settleBattle(r, signature);

        // Second submission should revert
        vm.expectRevert("Battle already settled");
        huntCore.settleBattle(r, signature);
    }

    function test_SettleBattle_ExpiredDeadline_Reverts() public {
        bytes32 battleId = keccak256("battle_test_expired");
        uint256 nonce = 103;
        uint256 deadline = block.timestamp - 1; // Expired

        HuntCore.BattleResult memory r = HuntCore.BattleResult({
            battleId: battleId,
            player: player1,
            winner: player1,
            loser: player2,
            playerTokenId: player1BeastId,
            opponentTokenId: player2BeastId,
            territoryId: 1,
            rounds: 3,
            nonce: nonce,
            deadline: deadline
        });

        bytes memory signature = _signBattleResult(r, settlerPrivateKey);

        vm.expectRevert("Battle signature expired");
        huntCore.settleBattle(r, signature);
    }

    function test_SettleBattle_WrongSigner_Reverts() public {
        bytes32 battleId = keccak256("battle_test_wrong_signer");
        uint256 nonce = 104;
        uint256 deadline = block.timestamp + 3600;

        HuntCore.BattleResult memory r = HuntCore.BattleResult({
            battleId: battleId,
            player: player1,
            winner: player1,
            loser: player2,
            playerTokenId: player1BeastId,
            opponentTokenId: player2BeastId,
            territoryId: 1,
            rounds: 3,
            nonce: nonce,
            deadline: deadline
        });

        // Sign with unauthorized private key
        bytes memory badSignature = _signBattleResult(r, 0xBAD519);

        vm.expectRevert("Invalid settlement signature");
        huntCore.settleBattle(r, badSignature);
    }

    function test_SettleBattle_NotBeastOwner_Reverts() public {
        bytes32 battleId = keccak256("battle_test_not_owner");
        uint256 nonce = 105;
        uint256 deadline = block.timestamp + 3600;

        HuntCore.BattleResult memory r = HuntCore.BattleResult({
            battleId: battleId,
            player: stranger, // stranger does not own player1BeastId
            winner: stranger,
            loser: player2,
            playerTokenId: player1BeastId,
            opponentTokenId: player2BeastId,
            territoryId: 1,
            rounds: 3,
            nonce: nonce,
            deadline: deadline
        });

        bytes memory signature = _signBattleResult(r, settlerPrivateKey);

        vm.expectRevert("Player does not own beast");
        huntCore.settleBattle(r, signature);
    }

    function test_RatingFloor_ClampsAt100() public {
        // Repeatedly simulate losses to check floor at 100
        for (uint256 i = 0; i < 40; i++) {
            bytes32 bId = keccak256(abi.encodePacked("battle_loss_", i));
            HuntCore.BattleResult memory r = HuntCore.BattleResult({
                battleId: bId,
                player: player1,
                winner: player2,
                loser: player1,
                playerTokenId: player1BeastId,
                opponentTokenId: player2BeastId,
                territoryId: 1,
                rounds: 2,
                nonce: 200 + i,
                deadline: block.timestamp + 3600
            });
            bytes memory signature = _signBattleResult(r, settlerPrivateKey);
            huntCore.settleBattle(r, signature);
        }

        HuntCore.Hunter memory loserHunter = huntCore.getHunter(player1);
        assertGe(loserHunter.rating, 100);
    }
}
