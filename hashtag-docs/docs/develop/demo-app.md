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

# create a local .env file
touch .env

# copy .env.example into .env
cp .env.example .env

# start the local development server
yarn dev
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

## Fire up the dApp

Open another tab and try starting the dapp.

    ``` bash
    cd hashtag-protocol/hashtag-dapp
    yarn install
    yarn dev
    ```

    If everything was set up properly, you should be able to mint tokens and tag
    nfts using a local blockchain and a local subgraph.

