// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {TokenTrove} from "../src/TokenTrove.sol";

contract DeployTokenTroveScript is Script {
    TokenTrove public tokenTrove;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        tokenTrove = new TokenTrove();

        vm.stopBroadcast();
    }
}
