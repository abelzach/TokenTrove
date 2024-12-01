// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CustomERC20} from "../src/CustomERC20.sol";

contract DeployERC20TokensScript is Script {
    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(privateKey);

        uint256 initialSupply = 10000;

        new CustomERC20("AlphaToken", "ALPHA", initialSupply);
        new CustomERC20("BetaToken", "BETA", initialSupply);
        new CustomERC20("GammaToken", "GAMMA", initialSupply);
        new CustomERC20("DeltaToken", "DELTA", initialSupply);

        vm.stopBroadcast();
    }
}


