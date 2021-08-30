## Smart Contracts


## Version 2

Extends basic HASHTAG token minting and tagging of ERC721 NFTs introduced in Version one, with the ability to tag target NFTs on different chains. For example, if a HASHTAG token is on Rinkeby, the tagging contract can be configured to permit tagging of NFTs on Polygon mainnet. In addition, smart contracts are being migrated to the Polygon Network.


### HashtagProtocol.sol

**Polygonscan**

Mumbai: https://mumbai.polygonscan.com/address/0x112acF9C8BAB5e0830d756C96bD18730C47e6A09

**Github**

Stage: https://github.com/hashtag-protocol/hashtag-protocol/blob/stage/hashtag-contracts/contracts/HashtagProtocol.sol


### ERC721HashtagRegistry.sol

**Polygonscan**

Mumbai: https://mumbai.polygonscan.com/address/0x487F03DD5ac07c9F475A723AA06d5ecf3Cf2d1d7

**Github**

Stage: https://github.com/hashtag-protocol/hashtag-protocol/blob/stage/hashtag-contracts/contracts/ERC721HashtagRegistry.sol


### HashtagAccessControls.sol

**Polygonscan**

Mumbai: https://mumbai.polygonscan.com/address/0x524c297E92129Ed2392Cd00F0d88430cCC9b542B

**Github**

Stage: https://github.com/hashtag-protocol/hashtag-protocol/blob/stage/hashtag-contracts/contracts/HashtagAccessControls.sol


## Version 1

Implements basic HASHTAG token minting and tagging of target ERC721 NFTs. Tagging is limited to target NFTs existing on same chain (ie. HASHTAG tokens on mainnet can _only_ tag target NFTs on mainnet). This is being modified in Version 2 so that target NFTs can exist on any chain permitted by the protocol (ie. if enabled, Tagging contract on mainnet can tag target NFTs on Polygon).  


### HashtagProtocol.sol

**Etherscan** 

Mainnet: https://etherscan.io/address/0x3a7a449308052d74256bb6867979aba51b2cd887

Rinkeby: https://rinkeby.etherscan.io/address/0xa948549116e716cc0da11afdbcabf01ff04fc35e


### ERC721HashtagRegistry.sol

**Etherscan**

Mainnet: https://etherscan.io/address/0x3a7a449308052d74256bb6867979aba51b2cd887

Rinkeby: https://rinkeby.etherscan.io/address/0x2a23A463C7d676f3C94402eA0B0450E36BF14305


### HashtagAccessControls.sol

**Etherscan**

Mainnet: https://etherscan.io/address/0x0f5eece5f30f5d10301f0c59f579b486a44d55c6

Rinkeby:

