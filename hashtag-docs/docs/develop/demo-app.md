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

The following details how to set up a complete development stack to experiment
with the protocol and the dApp front-end.

This includes a local Hardhat blockchain (evm compatible) with emissions
picked up and indexed by a local subgraph node.

::: tip
Two useful resources for smart contract development on Hardhat are [Open
Zeppelin](https://docs.openzeppelin.com/learn/developing-smart-contracts) and
the [Hardhat documentation](https://hardhat.org/getting-started/#quick-start).
:::

::: tip
One thing I found useful, is to have 5 different
terminal tabs open for each of the steps below. I'll indicate where to open a
new terminal tab. 
:::

### Compile and deploy smart contracts to local blockchain

1. Navigate to /hashtag-contracts and run:

    ``` bash
    # install our package dependencies
    yarn install

    # confirm hardhat is running.
    npx hardhat

    # Start the local blockchain.
    yarn node:hardhat

    # Compile and deploy to your local blockchain.
    yarn deploy:hardhat
    ```

### Compile and deploy to local subgraph

1. Start Docker desktop on your machine. If you don't have it, install it now.
2. Once Docker is running, open another tab and start up the subgraph node:

    ``` bash
    # navigate into the hashtag-subgraph graph-node directory.
    cd hashtag-subgraph/graph-node

    # Start the subgraph image.
    ./run-graph-node.sh
    ```

    It should take a minute or two for the node to fire up.

3. Once the node is running, open another tab and perform the following from the
   `/hashtag-subgraph` directory.

    ``` bash
    # Build the local subgraph.yaml
    yarn precodegen:local
    # Perform codegen
    yarn codegen:local

    # Deploy the code to the locally running graph node.
    yarn remove:local
    yarn create:local
    yarn build && yarn deploy:local

    # If everything went well you should see the following:
    Build completed: QmQxCQMzRMesnRhY2cFvPoUuekUpHVYevmKC4EVgvUvukE

    Deployed to http://localhost:8000/subgraphs/name/hashtag-protocol/hashtag-local/graphql

    Subgraph endpoints:
    Queries (HTTP):     http://localhost:8000/subgraphs/name/hashtag-protocol/hashtag-local
    Subscriptions (WS): http://localhost:8001/subgraphs/name/hashtag-protocol/hashtag-local
    ```

6. Copy the queries endpoint
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

## Fire up the dApp

1. If you have recompiled the smart contracts, copy the build
   artifacts into the /hashtag-dapp/src/truffleconf folder. These will get
   picked up when we start the dapp.
   
   ``` bash
   # From the project root directory
   cp hashtag-contracts/artifacts/contracts/HashtagProtocol.sol/HashtagProtocol.json hashtag-dapp/truffleconf/HashtagProtocol.json
   cp hashtag-contracts/artifacts/contracts/ERC721HashtagRegistry.sol/ERC721HashtagRegistry.json hashtag-dapp/truffleconf/ERC721HashtagRegistry.json
   
   ```

2. Additionally, if you copied recompiled artifacts in the previous step, you
   must add network contract addresses to the artifacts to the end of both
   `hashtag-dapp/src/truffleconf/HashtagProtocol.json` and
   `hashtag-dapp/src/truffleconf/ERC721HashtagRegistry.json`. Replace the addresses
    for network id 31337 with the respective HashtagProtocol and
   ERC721HashtagRegistry contract addresses emitted when you deployed to the
   Hardhat local blockchain:

    ``` json
    // HashtagProtocol.json, at end of file
    ...
    "linkReferences": {},
    "deployedLinkReferences": {},
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
        "address": "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9"
      }
    }

    // ERC721HashtagRegistry.json, at end of file
    ...
    "linkReferences": {},
    "deployedLinkReferences": {},
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
        "address": "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9"
      }
    }
    ```

3. Open another tab and try starting the dapp.

    ``` bash
    cd hashtag-protocol/hashtag-dapp
    yarn install
    yarn dev
    ```

    If everything was set up properly, you should be able to mint tokens and tag
    nfts using a local blockchain and a local subgraph.

