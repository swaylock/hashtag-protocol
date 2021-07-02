const hre = require("hardhat");
// eslint-disable-next-line no-unused-vars
const ethernal = require("hardhat-ethernal");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying access controls with the account:",
    await deployer.getAddress()
  );

  const HashtagAccessControls = await hre.ethers.getContractFactory(
    "contracts/HashtagAccessControls.sol:HashtagAccessControls"
  );

  const accessControls = await HashtagAccessControls.deploy();

  await accessControls.deployed();
  await hre.ethernal.push({
    name: "HashtagAccessControls",
    address: accessControls.address,
  });

  console.log(`Access controls deployed at: `, accessControls.address);
  console.log("Finished!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
