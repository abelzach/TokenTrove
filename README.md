# TokenTrove

TokenTrove empowers content creators to host engaging giveaways and reward their subscribers in an innovative and user friendly way.

## Depolyed Contracts
| Contract | PolygonAmoy Address |
|------------------|------------------|
| TokenTrove  | 0x477f15bd3e37dba2596deb1c5dd13f97a7260f7b |
| OmegaToken  | 0x702fa152ebdd749d48695d1b5b5f44c108404d2a |


## Project Setup

### 1. Setup NextJs App
1. Install node dependeices
```sh
npm i
```
2. Example .env
```
GOOGLE_CLIENT_SECRET=<Google Client Secret>
GOOGLE_CLIENT_ID=<Google client ID>
AUTH_SECRET=<Auth Secret>
NEXT_PUBLIC_OPENAI_API_KEY=<OPENAI Api Key>
NEXT_PUBLIC_OKTO=<OKTO Api Key>
```
3. Start frontend
```sh
npm run dev
```

### 2. Setup Foundry
1. Setup [Foundry](https://book.getfoundry.sh/getting-started/installation)
2. Example .env
```
PRIVATE_KEY=0x<private key>
TESTNET_RPC_URL=localhost:8545
```
3. Deploy TokenTrove
```
cd foundry
source .env && forge script script/DeployTokenTroveScript.s.sol  --rpc-url $TESTNET_RPC_URL --private-key $PRIVATE_KEY --broadcast
```
4. Deploy OmegaToken
```
cd foundry
source .env && forge script script/DeployERC20Tokens.s.sol  --rpc-url $TESTNET_RPC_URL --private-key $PRIVATE_KEY --broadcast
```
