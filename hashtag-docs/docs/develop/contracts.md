# Smart Contracts


## Version 2

Extends basic HASHTAG token minting and tagging of ERC721 NFTs introduced in Version one, with the ability to tag target NFTs on different chains. For example, if a HASHTAG token is on Rinkeby, the tagging contract can be configured to permit tagging of NFTs on Polygon mainnet. In addition, smart contracts are being migrated to the Polygon Network.

For the latest contract source code in progress, please see [Hashtag Protocol contracts directory](https://github.com/hashtag-protocol/hashtag-protocol/tree/stage/hashtag-contracts).


### HashtagProtocol.sol

**Polygon Mumbai**



* Polygonscan: [https://mumbai.polygonscan.com/address/0x112acF9C8BAB5e0830d756C96bD18730C47e6A09](https://mumbai.polygonscan.com/address/0x112acF9C8BAB5e0830d756C96bD18730C47e6A09)
* Github: [https://github.com/hashtag-protocol/hashtag-protocol/blob/stage/hashtag-contracts/contracts/HashtagProtocol.sol](https://github.com/hashtag-protocol/hashtag-protocol/blob/stage/hashtag-contracts/contracts/HashtagProtocol.sol)


### ERC721HashtagRegistry.sol

**Polygon Mumbai**



* Polygonscan: [https://mumbai.polygonscan.com/address/0x487F03DD5ac07c9F475A723AA06d5ecf3Cf2d1d7](https://mumbai.polygonscan.com/address/0x487F03DD5ac07c9F475A723AA06d5ecf3Cf2d1d7)
* Github: [https://github.com/hashtag-protocol/hashtag-protocol/blob/stage/hashtag-contracts/contracts/ERC721HashtagRegistry.sol](https://github.com/hashtag-protocol/hashtag-protocol/blob/stage/hashtag-contracts/contracts/ERC721HashtagRegistry.sol)


### HashtagAccessControls.sol

**Polygon Mumbai**



* Polygonscan: [https://mumbai.polygonscan.com/address/0x524c297E92129Ed2392Cd00F0d88430cCC9b542B](https://mumbai.polygonscan.com/address/0x524c297E92129Ed2392Cd00F0d88430cCC9b542B)
* Github: [https://github.com/hashtag-protocol/hashtag-protocol/blob/stage/hashtag-contracts/contracts/HashtagAccessControls.sol](https://github.com/hashtag-protocol/hashtag-protocol/blob/stage/hashtag-contracts/contracts/HashtagAccessControls.sol)


## Version 1

Implements basic HASHTAG token minting and tagging of target ERC721 NFTs. Tagging is limited to target NFTs existing on same chain (ie. HASHTAG tokens on mainnet can _only_ tag target NFTs on mainnet). This is being modified in Version 2 so that target NFTs can exist on any chain permitted by the protocol (ie. if enabled, Tagging contract on mainnet can tag target NFTs on Polygon).  


### HashtagProtocol.sol

**Ethereum Mainnet**



* Etherscan: [https://etherscan.io/address/0x3a7a449308052d74256bb6867979aba51b2cd887](https://etherscan.io/address/0x3a7a449308052d74256bb6867979aba51b2cd887)
* Github: [https://github.com/hashtag-protocol/hashtag-protocol/blob/v0.1.0-Beta/hashtag-contracts/contracts/HashtagProtocol.sol](https://github.com/hashtag-protocol/hashtag-protocol/blob/v0.1.0-Beta/hashtag-contracts/contracts/HashtagProtocol.sol)

**Ethereum Rinkeby Testnet**



* Etherscan: [https://rinkeby.etherscan.io/address/0xa948549116e716cc0da11afdbcabf01ff04fc35e](https://rinkeby.etherscan.io/address/0xa948549116e716cc0da11afdbcabf01ff04fc35e)


### ERC721HashtagRegistry.sol

**Ethereum Mainnet**



* Etherscan: [https://etherscan.io/address/0x3a7a449308052d74256bb6867979aba51b2cd887](https://etherscan.io/address/0x3a7a449308052d74256bb6867979aba51b2cd887)
* Github: [https://github.com/hashtag-protocol/hashtag-protocol/blob/v0.1.0-Beta/hashtag-contracts/contracts/ERC721HashtagRegistry.sol](https://github.com/hashtag-protocol/hashtag-protocol/blob/v0.1.0-Beta/hashtag-contracts/contracts/ERC721HashtagRegistry.sol)

**Ethereum Rinkeby Testnet**



* Etherscan: [https://rinkeby.etherscan.io/address/0x2a23A463C7d676f3C94402eA0B0450E36BF14305](https://rinkeby.etherscan.io/address/0x2a23A463C7d676f3C94402eA0B0450E36BF14305)


### HashtagAccessControls.sol

**Ethereum Mainnet**



* Etherscan: [https://etherscan.io/address/0x0f5eece5f30f5d10301f0c59f579b486a44d55c6](https://etherscan.io/address/0x0f5eece5f30f5d10301f0c59f579b486a44d55c6)
* Github: [https://github.com/hashtag-protocol/hashtag-protocol/blob/v0.1.0-Beta/hashtag-contracts/contracts/HashtagAccessControls.sol](https://github.com/hashtag-protocol/hashtag-protocol/blob/v0.1.0-Beta/hashtag-contracts/contracts/HashtagAccessControls.sol)

**Ethereum Rinkeby Testnet**



* Etherscan:
