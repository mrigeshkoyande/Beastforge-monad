// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Achievements.sol";

contract AchievementsTest is Test {
    Achievements public achievements;
    address public owner = address(this);
    address public verifier = address(0xAA11);
    address public player1 = address(0x1111);
    address public player2 = address(0x2222);

    function setUp() public {
        achievements = new Achievements();
        achievements.setVerifier(verifier, true);
    }

    function test_InitialAchievementsRegistered() public view {
        assertEq(achievements.totalAchievements(), 5);
        (uint256 id, string memory name, , , ) = achievements.achievementDefs(0);
        assertEq(id, 0);
        assertEq(name, "FIRST BLOOD");
    }

    function test_VerifierCanUnlockAchievement() public {
        vm.prank(verifier);
        achievements.unlockAchievement(player1, 0);

        assertTrue(achievements.hasUnlocked(player1, 0));
        assertGt(achievements.unlockTimestamp(player1, 0), 0);
    }

    function test_OwnerCanUnlockAchievement() public {
        achievements.unlockAchievement(player1, 1);
        assertTrue(achievements.hasUnlocked(player1, 1));
    }

    function test_UnauthorizedUnlock_Reverts() public {
        vm.prank(player2);
        vm.expectRevert("Caller not authorized verifier");
        achievements.unlockAchievement(player1, 0);
    }

    function test_DuplicateUnlock_Reverts() public {
        vm.prank(verifier);
        achievements.unlockAchievement(player1, 0);

        // Attempt second unlock
        vm.prank(verifier);
        vm.expectRevert("Achievement already unlocked");
        achievements.unlockAchievement(player1, 0);
    }

    function test_NonExistentAchievement_Reverts() public {
        vm.prank(verifier);
        vm.expectRevert("Achievement does not exist");
        achievements.unlockAchievement(player1, 99);
    }

    function test_GetPlayerAchievements() public {
        vm.prank(verifier);
        achievements.unlockAchievement(player1, 0);
        vm.prank(verifier);
        achievements.unlockAchievement(player1, 3);

        (bool[] memory unlocked, uint256[] memory timestamps) = achievements.getPlayerAchievements(player1);
        assertEq(unlocked.length, 5);
        assertTrue(unlocked[0]);
        assertFalse(unlocked[1]);
        assertFalse(unlocked[2]);
        assertTrue(unlocked[3]);
        assertFalse(unlocked[4]);

        assertGt(timestamps[0], 0);
        assertEq(timestamps[1], 0);
        assertGt(timestamps[3], 0);
    }
}
