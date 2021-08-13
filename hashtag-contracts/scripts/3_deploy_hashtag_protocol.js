const hre = require("hardhat");
// eslint-disable-next-line no-unused-vars
const ethernal = require("hardhat-ethernal");
const prompt = require("prompt-sync")();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(
    "Deploying HashtagProtocol (NFT Token) with the account:",
    await deployer.getAddress()
  );

  const accessControlsAddress = prompt(
    "HashtagAccessControls contract address? "
  );

  // Platform address. Will become the owner of newly minted hashtag tokens.
  const platform = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"; // PLATFORM Address

  console.log(
    "\nHashtagAccessControls contract address: ",
    accessControlsAddress
  );
  console.log("Platform wallet address: ", platform);
  console.log("\n");

  prompt("If happy, hit enter to continue...");

  const HashtagProtocol = await hre.ethers.getContractFactory(
    "HashtagProtocol"
  );

  const nft = await HashtagProtocol.deploy(accessControlsAddress, platform);

  await nft.deployed();
  await hre.ethernal.push({
    name: "HashtagProtocol",
    address: nft.address,
  });

  console.log("HashtagProtocol (NFT Token) deployed at:", nft.address);
  console.log("Finished!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
