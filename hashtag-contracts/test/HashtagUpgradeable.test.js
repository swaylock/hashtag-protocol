const { ethers, upgrades } = require('hardhat');
const { assert } = require("chai");

let factories, deployed, accounts;

before('get factories', async function () {

  factories = {
    HashtagAccessControls: await ethers.getContractFactory('HashtagAccessControls'),
    HashtagAccessControlsUpgradeTest: await ethers.getContractFactory('HashtagAccessControlsUpgradeTest'),
    HashtagProtocol: await ethers.getContractFactory('HashtagProtocol'),
    HashtagProtocolUpgradeTest: await ethers.getContractFactory('HashtagProtocolUpgradeTest'),
    ERC721HashtagRegistry: await ethers.getContractFactory('ERC721HashtagRegistry'),
    ERC721HashtagRegistryUpgradeTest: await ethers.getContractFactory('ERC721HashtagRegistryUpgradeTest'),
  };

  // See namedAccounts section of hardhat.config.js
  const namedAccounts = await ethers.getNamedSigners();
  accounts = {
    accountHashtagAdmin: namedAccounts["accountHashtagAdmin"],
    accountHashtagPublisher: namedAccounts["accountHashtagPublisher"],
    accountHashtagPlatform: namedAccounts["accountHashtagPlatform"],
  };

  // Set deployed contract placeholders so they are shareable b/w tests.
  deployed = {
    HashtagAccessControls: {},
    HashtagProtocol: {},
    ERC721HashtagRegistry: {},
  };

});

describe("HashtagAccessControl", function () {
  it('is upgradeable', async function () {

    deployed.HashtagAccessControls = await upgrades.deployProxy(factories.HashtagAccessControls, { kind: 'uups' });
    assert(await deployed.HashtagAccessControls.isAdmin(accounts.accountHashtagAdmin.address) === true);
    assert(await deployed.HashtagAccessControls.version() === "1");

    deployed.HashtagAccessControls = await upgrades.upgradeProxy(deployed.HashtagAccessControls.address, factories.HashtagAccessControlsUpgradeTest);
    assert(await deployed.HashtagAccessControls.isAdmin(accounts.accountHashtagAdmin.address) === true);
    assert(await deployed.HashtagAccessControls.version() === "upgrade test");
    assert(await deployed.HashtagAccessControls.upgradeTest() === true);

  });
});

describe("HashtagProtocol", function () {
  it('is upgradeable', async function () {

    deployed.HashtagProtocol = await upgrades.deployProxy(factories.HashtagProtocol, [deployed.HashtagAccessControls.address, accounts.accountHashtagPlatform.address],{ kind: 'uups' });
    assert(await deployed.HashtagProtocol.name() === "Hashtag Protocol");
    assert(await deployed.HashtagProtocol.symbol() ==="HASHTAG");
    assert(await deployed.HashtagProtocol.version() === "1");

    deployed.HashtagProtocol = await upgrades.upgradeProxy(deployed.HashtagProtocol.address, factories.HashtagProtocolUpgradeTest);
    assert(await deployed.HashtagProtocol.name() === "Hashtag Protocol");
    assert(await deployed.HashtagProtocol.symbol() ==="HASHTAG");
    assert(await deployed.HashtagProtocol.version() === "upgrade test");
    assert(await deployed.HashtagProtocol.upgradeTest() === true);
  });
});

describe("ERC721HashtagRegistry", function () {
  it('is upgradeable', async function () {

    deployed.ERC721HashtagRegistry = await upgrades.deployProxy(factories.ERC721HashtagRegistry, [deployed.HashtagAccessControls.address, accounts.accountHashtagPlatform.address],{ kind: 'uups' });

    deployed.ERC721HashtagRegistry = await upgrades.upgradeProxy(deployed.ERC721HashtagRegistry.address, factories.ERC721HashtagRegistryUpgradeTest);

  });
});
