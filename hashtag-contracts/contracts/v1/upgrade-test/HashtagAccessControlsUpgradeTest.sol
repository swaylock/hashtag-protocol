// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {HashtagAccessControls} from "../HashtagAccessControls.sol";

/**
 * @title Hashtag Protocol Access Controls upgrade testing contract
 * @notice Used in conjuction with HashtagUpgradeable.test.js to test whether a
           contract is upgradable using the OpenZeppelin Hardhat Upgrades plugin.
 * @author Hashtag Protocol 
*/
contract HashtagAccessControlsUpgradeTest is HashtagAccessControls {
    function version() public pure override returns (string memory) {
        return "upgrade test";
    }

    function upgradeTest() public pure returns (bool) {
        return true;
    }
}
