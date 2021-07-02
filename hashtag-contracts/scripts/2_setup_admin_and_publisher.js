const hre = require("hardhat");
const prompt = require("prompt-sync")();
const web3 = require("web3");
const AccessControlsABI = require("../artifacts/@openzeppelin/contracts/access/AccessControl.sol/AccessControl.json")
  .abi;

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(
    "Setting up nHashtagAccessControls with the account:",
    await deployer.getAddress()
  );

  const accessControlsAddress = prompt(
    "HashtagAccessControls contract address? "
  );

  console.log(
    "\nHashtagAccessControls contract address: ",
    accessControlsAddress
  );
  console.log("\n");

  prompt("If happy, hit enter to continue...");

  const accessControls = new hre.ethers.Contract(
    accessControlsAddress,
    AccessControlsABI,
    deployer //provider
  );

  const DEFAULT_ADMIN_ROLE =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  await accessControls.grantRole(
    DEFAULT_ADMIN_ROLE,
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  );
  await accessControls.grantRole(
    web3.utils.sha3("PUBLISHER"),
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
  );

  console.log("Finished!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
