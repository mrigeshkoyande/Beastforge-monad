// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/BeastNFT.sol";
import "../src/HuntCore.sol";

contract DeployHuntCore is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address settlerAddress = vm.envAddress("SETTLER_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy BeastNFT
        BeastNFT beastNft = new BeastNFT();
        console.log("BeastNFT deployed at:", address(beastNft));

        // 2. Deploy HuntCore
        HuntCore huntCore = new HuntCore(address(beastNft), settlerAddress);
        console.log("HuntCore deployed at:", address(huntCore));

        // 3. Grant HuntCore permission to update Beast stats
        beastNft.setBattleRecorder(address(huntCore));
        console.log("HuntCore set as battle recorder on BeastNFT");

        vm.stopBroadcast();
    }
}
