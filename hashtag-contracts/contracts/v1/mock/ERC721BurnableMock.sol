// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

/*
    Mock contract used in the testing of tagging NFT assets
*/
contract ERC721BurnableMock is ERC721, ERC721Burnable {
    uint256 public tokenPointer = 0;

    constructor (string memory name, string memory symbol) ERC721(name, symbol) { }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function mint() public {
        tokenPointer = tokenPointer + 1;
        _mint(msg.sender, tokenPointer);
    }
}
