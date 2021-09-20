// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721HashtagRegistry} from "../ERC721HashtagRegistry.sol";

/**
 * @title ERC721 Hashtag Registry upgrade testing contract
 * @notice Used in conjuction with HashtagUpgradeable.test.js to test whether a
           contract is upgradable using the OpenZeppelin Hardhat Upgrades plugin.
 * @author Hashtag Protocol 
*/
contract ERC721HashtagRegistryUpgradeTest is ERC721HashtagRegistry {
    function version() pure public override returns (string memory) {
        return "upgrade test";
    }
    function upgradeTest() pure public returns (bool) {
        return true;
    }
}
