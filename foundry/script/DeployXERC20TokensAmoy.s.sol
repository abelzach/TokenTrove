// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {XERC20} from "../src/XERC20.sol";

contract DeployERC20TokensScript is Script {
    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(privateKey);

        uint256 initialSupply = 100000;

        new XERC20(
            "OmegaToken",
            "OMEGA",
            initialSupply,
            payable(0x778A1f43459A05aCcd8B57007119F103c249F929),
            "0x82427ae292798ea3a0c67066b2596aace5f493ce"
        );

        vm.stopBroadcast();
    }
}


