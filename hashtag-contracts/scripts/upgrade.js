// test/MyToken.test.js

const { ethers, upgrades, network, ethernal } = require("hardhat");

async function main() {
  console.log("Network:", network.name);
  console.log("Network ID:", network.config.chainId);

  let factories;
  // See namedAccounts section of hardhat.config.js
  //const namedAccounts = await ethers.getNamedSigners();

  const deployedHashtagAccessControls = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

  //accounts = {
  //  HashtagAdmin: namedAccounts["accountHashtagAdmin"],
  //  HashtagPublisher: namedAccounts["accountHashtagPublisher"],
  //  HashtagPlatform: namedAccounts["accountHashtagPlatform"],
  //};

  factories = {
    HashtagAccessControlsV2: await ethers.getContractFactory("HashtagAccessControlsV2"),
  };

  // Upgrade the proxy.
  const HashtagAccessControlsV2 = await upgrades.upgradeProxy(
    deployedHashtagAccessControls,
    factories.HashtagAccessControlsV2,
  );

  if (network.config.chainId == 31337) {
    // Update ethernal
    await ethernal.push({
      name: "HashtagAccessControlsV2",
      address: HashtagAccessControlsV2.address,
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
