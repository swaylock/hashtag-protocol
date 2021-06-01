# Guide to deploy on Mumbai testnet

1. Contracts 

Fill your .env in hashtag-contracts.

```
cd hashtag-contracts
cp .env.example .env
```

Although the Infura now support polygon network but when I use, I meet a error "not sync with lastest block". So I decide use rpc from maticvigil.

Create a free rpc at https://rpc.maticvigil.com

Compile the contract using hardhat.

```
npx hardhat --network mumbai compile
```

Replace Admin address, Publisher address with your Admin and Publisher address in scripts/2_setup_admin_and_publisher.js

Replace Platform address with your Platform address in scripts/3_deploy_hashtag_protocol.js

After that, run all sorted scripts on below to deploy contract on mumbai testnet.

```
npx hardhat --network mumbai run scripts/1_deploy_access_controls.js
npx hardhat --network mumbai run scripts/2_setup_admin_and_publisher.js
npx hardhat --network mumbai run scripts/3_deploy_hashtag_protocol.js
npx hardhat --network mumbai run scripts/4_deploy_hashtag_registry.js
```

Remember to save 3 addresses on the terminal as accessControls(HashtagAccessControls), Nft(HashtagProtocol) and Registry(ERC721HashtagRegistry) to then fill it in hashtag-subgraph.

2. Subgraph 

Fill 3 addresses above in subgraph.mumbai.yaml

Search each address at https://explorer-mumbai.maticvigil.com/ or https://polygon-explorer-mumbai.chainstacklabs.com/ to find the block where the contract is created (contract creation), then fill the block number in the startBlock section. 

Deploy subgraph at https://thegraph.com/explorer/subgraph/hashtag-protocol/hashtag-polygon-mumbai

```
graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>
yarn deploy:mumbai
```

3. UI

Create a file .env.local in hashtag-frontend.

```
VUE_APP_HASHTAG_SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/hashtag-protocol/hashtag-polygon-mumbai
VUE_APP_PUBLISHER_ADDRESS=
VUE_APP_BLOCKNATIVE_API_KEY=
VUE_APP_ONBOARD_NETWORK_ID=80001
VUE_APP_ONBOARD_NETWORK_NAME=mumbai
VUE_APP_TOP_NFTS_SUBGRAPH_URL=
```

At this time, the blocknative does not yet support polygon network so we don't have API and onboard network id.

Fill VUE_APP_PUBLISHER_ADDRESS with same address your use in hashtag-contracts/scripts/2_setup_admin_and_publisher.js

