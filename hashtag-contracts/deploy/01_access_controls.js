const { ethers } = require("hardhat");
const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;
  const accountHashtagAdmin = await ethers.getNamedSigner("accountHashtagAdmin");
  const accountHashtagPublisher = await ethers.getNamedSigner("accountHashtagPublisher");

  await deploy("HashtagAccessControls", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: accountHashtagAdmin.address,
    proxy: {
      proxyContract: "UUPSProxy",
      execute: {
        methodName: "initialize",
      },
    },
    log: true,
  });

  // Fetch address of HashtagAccessControls.
  const hashtagAccessControls = await ethers.getContract("HashtagAccessControls", accountHashtagAdmin);

  // Note Default admin role is set when contract is deployed.
  // See deploy/01_access_controls.js
  await hashtagAccessControls.grantRole(
    ethers.utils.id("PUBLISHER"),
    accountHashtagPublisher.address, // PUBLISHER Address
  );
  //console.log("PUBLISHER role assigned to ", accountHashtagPublisher.address);
};
module.exports.tags = ["HashtagAccessControls", "dev"];
