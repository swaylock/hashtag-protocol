// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {HashtagProtocol} from "../HashtagProtocol.sol";

/**
 * @title Hashtag Protocol upgrade testing contract
 * @notice Used in conjuction with HashtagUpgradeable.test.js to test whether a
           contract is upgradable using the OpenZeppelin Hardhat Upgrades plugin.
 * @author Hashtag Protocol
*/
contract HashtagProtocolUpgradeTest is HashtagProtocol {
    function version() pure public override returns (string memory) {
        return "upgrade test";
    }
    function upgradeTest() pure public returns (bool) {
        return true;
    }
}