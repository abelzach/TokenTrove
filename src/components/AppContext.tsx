"use client";
import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { OktoProvider, BuildType } from "okto-sdk-react";
import { useSession, signIn } from "next-auth/react";
import {
    Chain,
  createPublicClient,
  createWalletClient,
  custom,
  Hex,
  http,
  PublicClient,
  WalletClient,
} from "viem";
import { anvil, baseSepolia, sepolia } from "viem/chains";

export const AppContext = createContext<{
  account?: Hex;
  walletClient?: WalletClient;
  publicClient?: PublicClient;
  apiKey?: string;
  buildType?: BuildType;
  setBuildType?: React.Dispatch<React.SetStateAction<BuildType>>;
  chain?: Chain;
  setChain?: React.Dispatch<React.SetStateAction<Chain>>;
}>({});

export const AppContextProvider = ({ children }: { children: any }) => {
  const apiKey = process.env.NEXT_PUBLIC_OKTO;
  const [buildType, setBuildType] = useState(BuildType.SANDBOX);
  const { data: session } = useSession();
  const [walletClient, setWalletClient] = useState<WalletClient>();
  const [publicClient, setPublicClient] = useState<PublicClient>();
  const [account, setAccount] = useState<Hex>();
  const [chain, setChain] = useState<Chain>(anvil);

  useEffect(() => {
    async function init() {
      if (!walletClient || walletClient.chain !== chain) {
        const [account] = await (window as any).ethereum!.request({
          method: "eth_requestAccounts",
        });
        console.log(account);
        const client = createWalletClient({
          account: account as `0x{string}`,
          chain: chain,
          transport: custom((window as any).ethereum!),
        });
        const publicClient = createPublicClient({
          chain: chain,
          transport: http(),
        });
        await client.switchChain({ id: chain.id });
        setWalletClient(client);
        setPublicClient(publicClient);
        setAccount(account);
      }
    }
    init();
  }, [chain]);

  async function handleGAuthCb() {
    if (session) {
      // @ts-ignore
      return session.id_token;
    }
    await signIn("google");
    return "";
  }

  return (
    <AppContext.Provider
      value={{
        apiKey,
        buildType,
        setBuildType,
        walletClient,
        publicClient,
        account,
        chain,
        setChain,
      }}
    >
      <OktoProvider
        apiKey={apiKey as string}
        buildType={buildType}
        gAuthCb={handleGAuthCb}
      >
        {children}
      </OktoProvider>
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
