// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@routerprotocol/evm-gateway-contracts/contracts/IDapp.sol";
import "@routerprotocol/evm-gateway-contracts/contracts/IDapp.sol";
import "@routerprotocol/evm-gateway-contracts/contracts/IGateway.sol";
import {XERC20} from "./XERC20.sol";

contract TokenTrove {
    enum PayoutStatus {
        ACTIVE,
        INACTIVE,
        CLAIMED
    }

    struct Payout {
        uint256 amount;
        address owner;
        address tokenAddress;
        bytes32 passwordHash;
        PayoutStatus status;
    }

    mapping(string => Payout) public payouts;
    address public contractOwner;

    constructor() {
        contractOwner = msg.sender;
    }

    modifier onlyPayoutOwner(string calldata id) {
        require(payouts[id].owner == msg.sender, "Only the payout owner can perform this action");
        _;
    }

    function createPayout(
        string memory id,
        address tokenAddress,
        uint256 amount,
        string memory password
    ) external {
        require(payouts[id].owner == address(0), "Payout with this ID already exists");
        require(
            XERC20(tokenAddress).allowance(msg.sender, address(this)) >= amount,
            "Contract does not have sufficient allowance"
        );
        bytes32 passwordHash = keccak256(abi.encodePacked(password));

        payouts[id] = Payout({
            amount: amount,
            owner: msg.sender,
            tokenAddress: tokenAddress,
            passwordHash: passwordHash,
            status: PayoutStatus.ACTIVE
        });
    }

    function setStatus(string calldata id, PayoutStatus status) external onlyPayoutOwner(id) {
        Payout storage payout = payouts[id];
        require(payout.status == PayoutStatus.ACTIVE, "Payout is not active");
        require(msg.sender == payout.owner, "Only the payout owner can activate this");
        payout.status = status;
    }

    function redeem(string calldata id, string memory password) external {
        Payout storage payout = payouts[id];
        require(payout.status == PayoutStatus.ACTIVE, "Payout is not active");
        require(
            payout.passwordHash == keccak256(abi.encodePacked(password)),
            "Invalid password"
        );

        XERC20 token = XERC20(payout.tokenAddress);
        require(token.transferFrom(payout.owner, msg.sender, payout.amount));

        payout.status = PayoutStatus.CLAIMED;
    }

    function redeemCrossChain(string calldata chainId, string calldata id, string memory password) external {
        Payout storage payout = payouts[id];
        require(payout.status == PayoutStatus.ACTIVE, "Payout is not active");
        require(
            payout.passwordHash == keccak256(abi.encodePacked(password)),
            "Invalid password"
        );

        XERC20 token = XERC20(payout.tokenAddress);
        token.transferFromCrossChain(chainId, payout.owner, msg.sender, payout.amount);

        payout.status = PayoutStatus.CLAIMED;
    }
}

