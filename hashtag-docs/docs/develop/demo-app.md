# Demo application

Our demo application, located at
[https://app.hashtag-protocol.org](https://app.hashtag-protocol.org) is a sample
implementation of Hashtag Protocol meant to be a showcase and testing ground for
the various features and functions of the protocol.

## Installing locally

Working from the root directory of [your fork](/develop/#developer-workflow) of
the [Hashtag Protocol
repository](https://github.com/hashtag-protocol/hashtag-protocol) navigate into
`/hashtag-dapp/` and install the dapp dependencies.

``` sh
cd hashtag-dapp
yarn install --lock-file
```

### Environment variables configuration

Our dApp is set up to use .env variables for it's configuration. See
[.env.example](https://github.com/hashtag-protocol/hashtag-protocol/blob/stage/hashtag-dapp/.env.example)
more information about what the environment variables are used for.

While still within `/hashtag-dapp/`, make a file called `.env.local`

``` sh
touch .env.local
```

Copy and save the following into that `.env.local`

``` ini
VUE_APP_HASHTAG_SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/blockrockettech/hashtag
VUE_APP_TOP_NFTS_SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/blockrockettech/nft-tokens
VUE_APP_PUBLISHER_ADDRESS=0xd677aed0965ac9b54e709f01a99ceca205aebc4b
VUE_APP_BLOCKNATIVE_API_KEY=371f97ec-05be-429d-b0a6-de74aa69c61c
VUE_APP_ONBOARD_NETWORK_ID=4
```

### Development server

Startup the local development server

``` sh
yarn serve
```

::: tip When developing the application locally, you may either use our remote
staging/testing endpoints given above or you may install each of the services
locally. If you choose the latter, make sure you modify the .env.local file to
point to your local endpoints.

Learn more about Vue.js [environment
variables](https://cli.vuejs.org/guide/mode-and-env.html#modes-and-environment-variables).
:::

## Local development

One thing I found useful, is to have 5 different
terminal tabs open for each of the steps below. I'll indicate where to open a
new terminal tab. 

::: tip
Two useful resources for smart contract development on Hardhat are [Open
Zeppelin](https://docs.openzeppelin.com/learn/developing-smart-contracts) and
the [Hardhat documentation](https://hardhat.org/getting-started/#quick-start).
:::

1. Open terminal tab 1 and install Hardhat:

``` bash

# Yarn
yarn install -D hardhat
```

Confirm hardhat is installed by running the following:

``` bash
npx hardhat
```

Note: you can find additional resources for setting up and using hardhat [here](https://hardhat.org/getting-started/#installation).

2. In the same tab, start a local blockchain hardhat

``` zsh
npx hardhat node
```

Hardhat Network will print out its address, <http://127.0.0.1:8545>, along with a list of available accounts and their private keys.

3. Open another tab (tab #2). Navigate to the hashtag-contracts directory and
   compile and migrate the solidity contracts to the local blockchain we just
   started.

``` bash
cd hashtag-contracts
npx hardhat compile
```

4. Replace Admin address, Publisher address with your Admin and Publisher
   address in `scripts/2_setup_admin_and_publisher.js`

Replace Platform address with your Platform address in scripts/3_deploy_hashtag_protocol.js

These addresses can be found in the tab in which you started the local
blockchain in step 2 above. The addresses will look something like:

```
Accounts
========
Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2: 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc (10000 ETH)
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

Use Account #0 for the "Admin address" and Account #1 for the Publisher address
and Account #2 for the Platform address.

Note that you should also import and label these addresses into your local
wallet such as Metamask for UI/UX testing the dApp.


5. Open a new tab and run all sorted scripts on below to deploy contract on your local testnet.

npx hardhat --network localhost run scripts/1_deploy_access_controls.js
npx hardhat --network localhost run scripts/2_setup_admin_and_publisher.js
npx hardhat --network localhost run scripts/3_deploy_hashtag_protocol.js
npx hardhat --network localhost run scripts/4_deploy_hashtag_registry.js

Note that after you run 1_deploy_access_controls.js you will be shown the access
controls contract address as follows:

```
Deploying access controls with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Access controls deployed at:  0x5FbDB2315678afecb367f032d93F642f64180aa3
Finished!
```

You will need to copy this and paste into the command
line prompt in the next three scripts, as follows:

```
npx hardhat run scripts/2_setup_admin_and_publisher.js
Setting up access controls with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Access Controls Address? [paste access controls address here]

Access Controls Address:  0x5FbDB2315678afecb367f032d93F642f64180aa3

```

Remember to save 3 deployed contract addresses output in the hardhat node tab
(step 2). It should look something like this: 

```
eth_sendTransaction
  Contract deployment: HashtagAccessControls
  Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3 <--
  Transaction:         0xdd4444f80fa6aae2da7562a2eab9d162833a24d9eeff64d6729a01766fec6d5a
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            600091 of 600091
  Block #1:            0x5da063e16bea8d328db2975fd863d628093affac8113d5f7861feac1bb1c8d72

eth_chainId
eth_getTransactionByHash
web3_clientVersion (2)
eth_accounts
eth_chainId
eth_accounts
eth_chainId
eth_estimateGas
eth_gasPrice
eth_sendTransaction
  Contract deployment: HashtagProtocol
  Contract address:    0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9 <--
  Transaction:         0xf653634e580966ec27957477ef02b88c2c0ba4c95fff16f4c150c0fdcabf9233
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            2711291 of 2711291
  Block #4:            0xe8107a7ee41be74608496bba652d54539b244b07eaec86ffb6f1f37fdfc28c6e

eth_chainId
eth_getTransactionByHash
eth_blockNumber
eth_chainId (2)
eth_getTransactionReceipt
web3_clientVersion (2)
eth_accounts
eth_chainId
net_version
eth_accounts
eth_chainId
eth_estimateGas
eth_gasPrice
eth_sendTransaction
  Contract deployment: ERC721HashtagRegistry
  Contract address:    0xdc64a140aa3e981100a9beca4e685f962f0cf6c9 <--
  Transaction:         0xe384590761af3d89bdab0a3fcffd71e337b066b9f14e997d5e178bf7a0df0c7c
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            1676246 of 1676246
  Block #5:            0x7bfcc967cbb603f808dcfe0d15307062889d81683d232c4fc5dd7366d0264f1e

```

We will use these in the next steps.

4. Add network & contract information to /hashtag-dapp/src/truffleconf files. These will get
   picked up when we start the dapp.

In your editor, open `/src/truffleconf/HashtagProtocol.json` and
`/src/truffleconf/ERC721HashtagRegistry.json`. In each file, scroll down to the
"networks" section and edit them so they look like this:

``` json
// HashtagProtocol.json
"networks": {
  "1": {
    "address": "0x3a7a449308052d74256Bb6867979AbA51b2cD887"
  },
  "4": {
    "address": "0xA948549116e716CC0Da11AFdbCabf01ff04Fc35e"
  },
  "5777": {
    "address": "0x38238AC79c0DA146cadd64acb5597517961817a7"
  },
  "31337": {
    "address": "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9"
  }
},

// ERC721HashtagRegistry.json
"networks": {
  "1": {
    "address": "0x4f1f007F2db30fb61fDad2598417B8019f311A37"
  },
  "4": {
    "address": "0x2a23A463C7d676f3C94402eA0B0450E36BF14305"
  },
  "5777": {
    "address": "0x5c467525c449C54cE1880CA368814c2dbff87836"
  },
  "31337": {
    "address": "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9"
  }
},
```

5. Add the three contract addresses above to the appropriate section of the
   `/hashtag-subgraph/subgraph.yaml` configuration file.

6. Start Docker desktop on your machine. If you don't have it, install it now.
7. Once Docker is running, open another tab and start up the subgraph node as follows:

``` bash
# navigate into the hashtag-subgraph graph-node directory.
cd hashtag-subgraph/graph-node

# Start the subgraph image.
./run-graph-node.sh
```

8. Open another tab. Deploy our subgraph code to the graph node we started in
   step 6. The following are performed in the `/hashtag-subgraph` directory.

``` bash
# Perform the following commands.
yarn remove-local
yarn create-local
yarn build && yarn deploy-local

# If everything went well you should see the following:
Build completed: QmQxCQMzRMesnRhY2cFvPoUuekUpHVYevmKC4EVgvUvukE

Deployed to http://localhost:8000/subgraphs/name/hashtag-protocol/hashtag-local/graphql

Subgraph endpoints:
Queries (HTTP):     http://localhost:8000/subgraphs/name/hashtag-protocol/hashtag-local
Subscriptions (WS): http://localhost:8001/subgraphs/name/hashtag-protocol/hashtag-local
```

7. Copy the queries endpoint
   `http://localhost:8000/subgraphs/name/hashtag-protocol/hashtag-local` and
   paste it into the `/hashtag-dapp/.env.local` local environment variables
   file. In fact, your .env.local file should look something like this:

``` bash
VUE_APP_HASHTAG_SUBGRAPH_URL=<http://localhost:8000/subgraphs/name/hashtag-protocol/hashtag-local>
VUE_APP_TOP_NFTS_SUBGRAPH_URL=<https://api.thegraph.com/subgraphs/name/blockrockettech/nft-tokens>
VUE_APP_BLOCKNATIVE_API_KEY=371f97ec-05be-429d-b0a6-de74aa69c61c
VUE_APP_ONBOARD_NETWORK_ID=5777
VUE_APP_PUBLISHER_ADDRESS=0xfc5b19737950da71573EC38e7B4579608cdE4E65
VUE_APP_ONBOARD_LOCALSTORAGE_WALLET_KEY=HashtagSelectedWallet
```

8. Open another tab and try starting the dapp.

```
cd hashtag-protocol/hashtag-dapp
yarn install
yarn serve
```

If everything was set up properly, you should be able to mint tokens and tag
nfts using a local blockchain and a local subgraph.

