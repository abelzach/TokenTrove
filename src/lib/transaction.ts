import tokenTroveAbi from "../../foundry/out/TokenTrove.sol/TokenTrove.json";
import alphaTokenAbi from "../../foundry/out/CustomERC20.sol/CustomERC20.json";
import tokenTroveBroadcast from "../../foundry/broadcast/DeployTokenTroveScript.s.sol/80002/run-latest.json"
import alphaTokenBroadcast from "../../foundry/broadcast/DeployERC20Tokens.s.sol/80002/run-latest.json"
import { ExecuteRawTransaction } from "okto-sdk-react";
import { encodeFunctionData } from "viem";

const TOKEN_TROVE_CONTRACT_ADDRESS = tokenTroveBroadcast.receipts[0].contractAddress;
const ALPHA_TOKEN_CONTRACT_ADDRESS = alphaTokenBroadcast.receipts[0].contractAddress;

const networkName = "POLYGON_TESTNET_AMOY";

export function createPayoutTxData(id: string, amount: number, password: string, userAddress: string): ExecuteRawTransaction {
    const encodedCall = encodeFunctionData({
        abi: tokenTroveAbi.abi,
        functionName: "createPayout",
        args: [
            id,
            ALPHA_TOKEN_CONTRACT_ADDRESS,
            BigInt(amount*(10**18)),
            password
        ],
    });

    const transactionData = {
      from: userAddress,
      to: TOKEN_TROVE_CONTRACT_ADDRESS,
      data: encodedCall,
    };
    return {
        network_name: networkName,
        transaction: transactionData,
    };
}

export function approveToken(userAddress: string, amount: number): ExecuteRawTransaction {
    const encodedCall = encodeFunctionData({
        abi: alphaTokenAbi.abi,
        functionName: "approve",
        args: [TOKEN_TROVE_CONTRACT_ADDRESS, BigInt(amount*(10**18))],
    });
    const transactionData = {
      from: userAddress,
      to: ALPHA_TOKEN_CONTRACT_ADDRESS,
      data: encodedCall,
    };
    return {
        network_name: networkName,
        transaction: transactionData,
    };
}
