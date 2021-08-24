const hre = require("hardhat");
// eslint-disable-next-line no-unused-vars
const ethernal = require("hardhat-ethernal");
const prompt = require("prompt-sync")();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(
    "Deploying ERC721HashtagRegistry with the account:",
    await deployer.getAddress()
  );

  const accessControlsAddress = prompt(
    "HashtagAccessControls contract address? "
  );
  const protocolAddress = prompt(
    "HashtagProtocol (NFT Token) contract address? "
  );

  console.log(
    "\nHashtagAccessControls contract address: ",
    accessControlsAddress
  );
  console.log(
    "HashtagProtocol (NFT Token) contract address: ",
    protocolAddress
  );
  console.log("\n");

  prompt("If happy, hit enter to continue...");

  const ERC721HashtagRegistry = await hre.ethers.getContractFactory(
    "ERC721HashtagRegistry"
  );

  const registry = await ERC721HashtagRegistry.deploy(
    accessControlsAddress,
    protocolAddress
  );

  await registry.deployed();

  await hre.ethernal.push({
    name: "ERC721HashtagRegistry",
    address: registry.address,
  });

  console.log("ERC721HashtagRegistry deployed at: ", registry.address);
  console.log("Finished!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
