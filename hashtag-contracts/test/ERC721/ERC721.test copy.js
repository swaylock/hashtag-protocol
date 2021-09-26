const { ethers, deployments } = require("hardhat");

const {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Metadata,
} = require('./ERC721.behavior');


// we create a setup function that can be called by every test and setup variable for easy to read tests
async function setup() {
  // it first ensure the deployment is executed and reset (use of evm_snapshot for fast test)
  await deployments.fixture(["HashtagProtocol", "HashtagAccessControls"]);

  // See namedAccounts section of hardhat.config.js
  const namedAccounts = await ethers.getNamedSigners();
  const unnamedAccounts = await ethers.getUnnamedSigners();

  // Arguments for shouldBehaveLikeERC721()
  // owner, newOwner, approved, anotherApproved, operator, other, publisher, creator

  const accounts = [
    namedAccounts["accountHashtagAdmin"].address,       // owner
    unnamedAccounts[0].address,                         // newOwner
    unnamedAccounts[1].address,                         // approved
    unnamedAccounts[2].address,                         // anotherApproved
    namedAccounts["accountHashtagPlatform"].address,    // operator
    unnamedAccounts[3].address,                         // other
    namedAccounts["accountHashtagPublisher"].address,   // publisher
    unnamedAccounts[4].address                          // creator
  ];

  // Get instantiated contracts in the form of a ethers.js Contract instances:
  const contracts = {
    HashtagAccessControls: artifacts.require("HashtagAccessControls"),
    HashtagProtocol: artifacts.require("HashtagProtocol"),
    //HashtagAccessControls: await ethers.getContract("HashtagAccessControls"),
    //HashtagProtocol: await ethers.getContract("HashtagProtocol"),
  };

  return {
    ...contracts,
    accounts,
  };
}

// Vanilla Mocha test. Increased compatibility with tools that integrate Mocha.
contract("ERC721", function (accounts) {
  //const [
  //  owner,
  //  approved,
  //  anotherApproved,
  //  operator,
  //  other,
  //  publisher,
  //  creator,
  //] = accounts;

  beforeEach(async function () {

    const { HashtagAccessControls, HashtagProtocol, accounts } = await setup();

    //console.log("inside beforeEach", accounts);
    const [ accountHashtagAdmin ] = accounts;
    // Not sure if we even need this...
    await HashtagAccessControls.grantRole(
      await HashtagAccessControls.SMART_CONTRACT_ROLE(),
      accountHashtagAdmin,
      { from: accountHashtagAdmin }
    );

    this.token = HashtagProtocol;
  });

  // shouldBehaveLikeERC721('ERC721', this.accounts);
  const name = "Hashtag Protocol";
  const symbol = "HASHTAG";
  
  // Arguments for shouldBehaveLikeERC721()
  // owner, newOwner, approved, anotherApproved, operator, other, publisher, creator
  shouldBehaveLikeERC721Metadata('ERC721', name, symbol, ...accounts);
});
