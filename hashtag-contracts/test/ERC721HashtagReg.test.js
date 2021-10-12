
const { expectEvent } = require('@openzeppelin/test-helpers');
const { ethers, deployments } = require("hardhat");
const { expect } = require("chai");
const { utils, BigNumber, constants } = ethers;

const HashtagAccessControls = artifacts.require("HashtagAccessControls");
const HashtagProtocol = artifacts.require("HashtagProtocol");
const ERC721HashtagRegistry = artifacts.require("ERC721HashtagRegistry");
const ERC721Mock = artifacts.require("ERC721BurnableMock");

contract('ERC721HashtagRegistry', function (accounts) {

  const [
    accountHashtagAdmin,
    accountHashtagPublisher,
    accountHashtagPlatform,
    accountBuyer,
    accountRandomOne,
    accountRandomTwo,
    accountTagger,
  ] = accounts;

  beforeEach(async function () {

    this.accessControls = await HashtagAccessControls.new({ from: accountHashtagAdmin });
    await this.accessControls.initialize();
    await this.accessControls.grantRole(
      await this.accessControls.SMART_CONTRACT_ROLE(),
      accountHashtagAdmin,
      { from: accountHashtagAdmin }
    );

    // add a publisher to the protocol
    await this.accessControls.grantRole(
      web3.utils.sha3("PUBLISHER"),
      accountHashtagPublisher
    );

    this.token = await HashtagProtocol.new();
    await this.token.initialize(this.accessControls.address, accountHashtagAdmin);

    this.ERC721Mock = await ERC721Mock.new("NFT","NFT",{ from: accountHashtagAdmin });

    this.ERC721HashtagRegistry = await ERC721HashtagRegistry.new();
    await this.ERC721HashtagRegistry.initialize(this.accessControls.address, this.token.address);

  });

  context('Validate setup', function () {
    beforeEach(async function () {
      // Set permitted target NFT chain id.
      await this.ERC721HashtagRegistry.setPermittedNftChainId(constants.One, true);

      // Mint a HASHTAG token for tagging.
      await this.token.mint("#kittypower", accountHashtagPublisher, accountTagger);
      const hashtagId = await this.token.hashtagToTokenId("#kittypower");

      // Mint two target nfts.
      //const nftOneId = constants.One;
      //const nftTwoId = constants.Two;
//
      //await contracts.contractERC721Mock.mint(accounts.accountRandomOne.address, nftOneId); //#1
      //await contracts.contractERC721Mock.mint(accounts.accountRandomOne.address, nftTwoId); //#2
    });

    describe("Initial state", async function () {
      it("should have total tags of zero", async function () {
        expect(await this.ERC721HashtagRegistry.totalTags()).to.be.bignumber.equal('0');
      });
    });
  });
});