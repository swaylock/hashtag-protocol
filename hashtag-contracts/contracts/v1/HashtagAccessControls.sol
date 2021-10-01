// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title Hashtag Protocol Access Controls contract
 * @notice Maintains a mapping of ethereum addresses and roles they have within the protocol
 * @author Hashtag Protocol
 */
contract HashtagAccessControls is Initializable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant PUBLISHER_ROLE = keccak256("PUBLISHER");
    bytes32 public constant SMART_CONTRACT_ROLE = keccak256("SMART_CONTRACT");

    function initialize() public initializer {
        __AccessControl_init();
        // Give default admin role to the deployer.
        // setupRole is should only be called within initialize().
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    // Ensure that only address with admin role can upgrade.
    function _authorizeUpgrade(address) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

    function version() public pure virtual returns (string memory) {
        return "1";
    }

    /**
     * @notice Checks whether an address has a smart contract role
     * @param _addr Address being checked
     * @return bool True if the address has the role, false if not
     */
    function isSmartContract(address _addr) public view returns (bool) {
        return hasRole(SMART_CONTRACT_ROLE, _addr);
    }

    /**
     * @notice Checks whether an address has an admin role
     * @param _addr Address being checked
     * @return bool True if the address has the role, false if not
     */
    function isAdmin(address _addr) public view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, _addr);
    }

    /**
     * @notice Checks whether an address has a publisher role
     * @param _addr Address being checked
     * @return bool True if the address has the role, false if not
     */
    function isPublisher(address _addr) public view returns (bool) {
        return hasRole(PUBLISHER_ROLE, _addr);
    }
}
