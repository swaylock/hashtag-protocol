// test/MyToken.test.js

const { ethers, upgrades, network, ethernal } = require("hardhat");

async function main() {
  console.log("Network:", network.name);
  console.log("Network ID:", network.config.chainId);

  let accounts, factories;
  // See namedAccounts section of hardhat.config.js
  const namedAccounts = await ethers.getNamedSigners();

  accounts = {
    HashtagAdmin: namedAccounts["accountHashtagAdmin"],
    HashtagPublisher: namedAccounts["accountHashtagPublisher"],
    HashtagPlatform: namedAccounts["accountHashtagPlatform"],
  };

  factories = {
    HashtagAccessControls: await ethers.getContractFactory("HashtagAccessControls"),
    HashtagProtocol: await ethers.getContractFactory("HashtagProtocol"),
    ERC721HashtagRegistry: await ethers.getContractFactory("ERC721HashtagRegistry"),
  };

  // Deploy the initial proxy contracts.
  const HashtagAccessControls = await upgrades.deployProxy(factories.HashtagAccessControls, { kind: "uups" });

  await HashtagAccessControls.grantRole(
    await HashtagAccessControls.SMART_CONTRACT_ROLE(),
    accounts.HashtagAdmin.address,
    { from: accounts.HashtagAdmin.address },
  );

  // add a publisher to the protocol
  await HashtagAccessControls.grantRole(web3.utils.sha3("PUBLISHER"), accounts.HashtagPublisher.address);

  // Deploy the initial proxy contracts.
  const HashtagProtocol = await upgrades.deployProxy(
    factories.HashtagProtocol,
    [HashtagAccessControls.address, accounts.HashtagPlatform.address],
    { kind: "uups" },
  );

  const ERC721HashtagRegistry = await upgrades.deployProxy(
    factories.ERC721HashtagRegistry,
    [HashtagAccessControls.address, HashtagProtocol.address],
    { kind: "uups" },
  );

  if (network.config.chainId == 31337) {
    // Update ethernal
    // Fetch address of HashtagAccessControls.
    //const accessControls = await ethers.getContract("HashtagAccessControls", accounts.HashtagAdmin);
    //const hashtagProtocol = await ethers.getContract("HashtagProtocol", accounts.HashtagAdmin);
    //const ERC721HashtagRegistry = await ethers.getContract("ERC721HashtagRegistry", accounts.HashtagAdmin);

    await ethernal.push({
      name: "HashtagAccessControls",
      address: HashtagAccessControls.address,
    });

    await ethernal.push({
      name: "HashtagProtocol",
      address: HashtagProtocol.address,
    });

    await ethernal.push({
      name: "ERC721HashtagRegistry",
      address: ERC721HashtagRegistry.address,
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
