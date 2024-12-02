// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@routerprotocol/evm-gateway-contracts/contracts/IDapp.sol";
import "@routerprotocol/evm-gateway-contracts/contracts/IGateway.sol";

contract XERC20 is ERC20, IDapp {
    address public owner;

    // address of the Gateway contract
    IGateway public gatewayContract;

    // chain type + chain id => address of our contract in string format
    mapping(string => string) public ourContractOnChains;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address payable gatewayAddress,
        string memory feePayerAddress
    ) ERC20(name, symbol) {
        gatewayContract = IGateway(gatewayAddress);
        owner = msg.sender;

        // Minting initial supply to the owner
        _mint(msg.sender, initialSupply * (10 ** decimals()));

        gatewayContract.setDappMetadata(feePayerAddress);
    }

    /// @notice function to set the fee payer address on Router Chain.
    /// @param feePayerAddress address of the fee payer on Router Chain.
    function setDappMetadata(string memory feePayerAddress) external {
        require(msg.sender == owner, "only owner");
        gatewayContract.setDappMetadata(feePayerAddress);
    }

    
    /// @notice function to set the address of our NFT contracts on different chains.
    /// This will help in access control when a cross-chain request is received.
    /// @param chainId chain Id of the destination chain in string.
    /// @param contractAddress address of the NFT contract on the destination chain.
    function setContractOnChain(
        string calldata chainId,
        string calldata contractAddress
    ) external {
        require(msg.sender == owner, "only owner");
        ourContractOnChains[chainId] = contractAddress;
    }

    /// @notice function to transfer tokens cross-chain.
    /// @param destChainId chain ID of the destination chain in string.
    /// @param amount amount of tokens to transfer.
    /// @param recipient recipient address on the destination chain in bytes format.
    /// @param requestMetadata abi-encoded metadata according to source and destination chains.
    function transferCrossChain(
        string calldata destChainId,
        uint256 amount,
        bytes calldata recipient,
        bytes calldata requestMetadata
    ) public payable {
        require(
            keccak256(abi.encodePacked(ourContractOnChains[destChainId])) !=
                keccak256(abi.encodePacked("")),
            "contract on dest not set"
        );

        // Burning the tokens from the sender
        _burn(msg.sender, amount);

        // Creating the payload to send to the destination chain
        bytes memory packet = abi.encode(amount, recipient);
        bytes memory requestPacket = abi.encode(
            ourContractOnChains[destChainId],
            packet
        );

        gatewayContract.iSend{value: msg.value}(
            1,
            0,
            string(""),
            destChainId,
            requestMetadata,
            requestPacket
        );
    }

    /// @notice function to transfer tokens cross-chain on behalf of a user.
    /// @param destChainId chain ID of the destination chain in string.
    /// @param amount amount of tokens to transfer.
    /// @param recipient recipient address on the destination chain in bytes format.
    /// @param requestMetadata abi-encoded metadata according to source and destination chains.
    function transferFromCrossChain(
        string calldata destChainId,
        address tokenOwner,
        uint256 amount,
        bytes calldata recipient,
        bytes calldata requestMetadata
    ) public payable {
        require(
            keccak256(abi.encodePacked(ourContractOnChains[destChainId])) !=
                keccak256(abi.encodePacked("")),
            "contract on dest not set"
        );

        // Checking allowance and burning tokens from the owner
        uint256 currentAllowance = allowance(tokenOwner, msg.sender);
        require(currentAllowance >= amount, "ERC20: insufficient allowance");
        _approve(tokenOwner, msg.sender, currentAllowance - amount);
        _burn(tokenOwner, amount);

        // Creating the payload to send to the destination chain
        bytes memory packet = abi.encode(amount, recipient);
        bytes memory requestPacket = abi.encode(
            ourContractOnChains[destChainId],
            packet
        );

        gatewayContract.iSend{value: msg.value}(
            1,
            0,
            string(""),
            destChainId,
            requestMetadata,
            requestPacket
        );
    }

    /// @notice function to handle the cross-chain request received from some other chain.
    /// @param packet the payload sent by the source chain contract when the request was created.
    /// @param srcChainId chain ID of the source chain in string.
    function iReceive(
        string memory, // requestSender,
        bytes memory packet,
        string memory srcChainId
    ) external override returns (bytes memory) {
        require(msg.sender == address(gatewayContract), "only gateway");

        // Decoding the payload
        (uint256 amount, bytes memory recipient) = abi.decode(
            packet,
            (uint256, bytes)
        );

        // Minting tokens to the recipient
        _mint(toAddress(recipient), amount);

        return abi.encode(srcChainId);
    }

    /// @notice function to convert bytes to address.
    /// @param _bytes bytes to be converted.
    /// @return addr address pertaining to the bytes.
    function toAddress(bytes memory _bytes) internal pure returns (address addr) {
        bytes20 srcAddress;
        assembly {
            srcAddress := mload(add(_bytes, 0x20))
        }
        addr = address(srcAddress);
    }

    /// @notice function to handle the acknowledgement received from the destination chain.
    /// @param requestIdentifier event nonce which is received when we create a cross-chain request.
    /// @param execFlag a boolean value suggesting whether the call was successfully executed on the destination chain.
    /// @param execData returning the data returned from the handleRequestFromSource function of the destination chain.
    function iAck(
        uint256 requestIdentifier,
        bool execFlag,
        bytes memory execData
    ) external override {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount * (10 ** decimals()));
    }
}

