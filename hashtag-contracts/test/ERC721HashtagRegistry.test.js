const { expectEvent } = require('@openzeppelin/test-helpers');
const { ethers, deployments } = require("hardhat");
const { expect } = require("chai");
const { utils, BigNumber, constants } = ethers;

// we create a setup function that can be called by every test and setup variable for easy to read tests
async function setup(type) {
  // it first ensure the deployment is executed and reset (use of evm_snapshot for fast test)
  await deployments.fixture([
    "HashtagProtocol",
    "HashtagAccessControls",
    "ERC721HashtagRegistry",
    "ERC721BurnableMock",
  ]);

  ERC721HashtagRegistry = artifacts.require("ERC721HashtagRegistry");

  // See namedAccounts section of hardhat.config.js
  const namedAccounts = await ethers.getNamedSigners();
  const unnamedAccounts = await ethers.getUnnamedSigners();
  const accounts = {
    accountHashtagAdmin: namedAccounts["accountHashtagAdmin"],
    accountHashtagPublisher: namedAccounts["accountHashtagPublisher"],
    accountHashtagPlatform: namedAccounts["accountHashtagPlatform"],
    accountBuyer: unnamedAccounts[0],
    accountRandomOne: unnamedAccounts[1],
    accountRandomTwo: unnamedAccounts[2],
    accountTagger: unnamedAccounts[3],
  };

  // Get an instantiated contracts in the form of a ethers.js Contract instances:
  const contracts = {
    contractAccessControls: await ethers.getContract("HashtagAccessControls"),
    contractHashtagProtocol: await ethers.getContract("HashtagProtocol"),
    contractERC721Registry: await ethers.getContract("ERC721HashtagRegistry"),
    contractERC721Mock: await ethers.getContract("ERC721BurnableMock"),
  };

  // Fetch tags fee
  let taggingFee = await contracts.contractERC721Registry.tagFee();
  taggingFee = taggingFee.toString();

  let platformPercentage = await contracts.contractERC721Registry.platformPercentage();
  platformPercentage = platformPercentage.toString();

  let publisherPercentage = await contracts.contractERC721Registry.publisherPercentage();
  publisherPercentage = publisherPercentage.toString();

  let taggerPercentage = await contracts.contractERC721Registry.remainingPercentage();
  taggerPercentage = taggerPercentage.toString();


  // Set permitted target NFT chain id (1).
  await contracts.contractERC721Registry.setPermittedNftChainId(constants.One, true);

  
  // Pre-mint a HASHTAG token for tagging.
  await contracts.contractHashtagProtocol
    .connect(accounts.accountTagger)
    .mint("#kittypower", accounts.accountHashtagPublisher.address, accounts.accountTagger.address);
  const hashtagId = await contracts.contractHashtagProtocol.hashtagToTokenId("#kittypower");

  // Mint two mock target nfts.
  await contracts.contractERC721Mock.mint(accounts.accountRandomOne.address, constants.One); //#1
  await contracts.contractERC721Mock.mint(accounts.accountRandomOne.address, constants.Two); //#2

  // If the test type is "drawdown", pre-tag some assets user accounts will have
  // something to drawdown.
  if (type == "drawdown") {
    await contracts.contractERC721Registry
      .connect(accounts.accountTagger)
      .tag(
        "#macbook",
        contracts.contractERC721Mock.address, // Target nft contract
        constants.One, // Target nft id
        accounts.accountHashtagPublisher.address,
        accounts.accountTagger.address,
        constants.One, // Target chain id.
        { value: taggingFee },
      );
  }

  return {
    ...contracts,
    ...accounts,
    hashtagId,
    taggingFee,
    platformPercentage,
    publisherPercentage,
    taggerPercentage,
  };
}

describe("ERC721HashtagRegistry Tests", function () {
  describe("Validate setup", async function () {
    it("should have total tags of zero", async function () {
      const { contractERC721Registry } = await setup();
      expect(await contractERC721Registry.totalTags()).to.be.equal(0);
    });

    it("should have Eth mainnet (chain id 1) permitted", async function () {
      const { contractERC721Registry } = await setup();
      expect((await contractERC721Registry.getPermittedNftChainId(1)) == true);
    });

    it("should have Polygon mainnet (chain id 137) not permitted", async function () {
      const { contractERC721Registry } = await setup();
      expect((await contractERC721Registry.getPermittedNftChainId(137)) == false);
    });
  });

  describe("Only addresses with Admin access", async function () {
    it("can set tag fee", async function () {
      const { contractERC721Registry, accountHashtagAdmin, accountRandomTwo, taggingFee } = await setup();
      expect(await contractERC721Registry.tagFee()).to.be.equal(taggingFee);
      await contractERC721Registry.connect(accountHashtagAdmin).setTagFee(utils.parseEther("1"));
      expect(await contractERC721Registry.tagFee()).to.be.equal(utils.parseEther("1"));

      await expect(contractERC721Registry.connect(accountRandomTwo).setTagFee(utils.parseEther("1"))).to.be.reverted;
    });

    it("should update access controls", async function () {
      const { contractERC721Registry, accountHashtagAdmin, accountRandomTwo } = await setup();
      await contractERC721Registry.connect(accountHashtagAdmin).updateAccessControls(accountRandomTwo.address);
      expect(await contractERC721Registry.accessControls()).to.be.equal(accountRandomTwo.address);

      await expect(contractERC721Registry.connect(accountRandomTwo).updateAccessControls(accountRandomTwo.address)).to
        .be.reverted;
    });

    it("should revert when updating access controls to zero address", async function () {
      const { contractERC721Registry, accountHashtagAdmin } = await setup();
      await expect(
        contractERC721Registry.connect(accountHashtagAdmin).updateAccessControls(constants.AddressZero),
      ).to.be.revertedWith("ERC721HashtagRegistry.updateAccessControls: Cannot be zero");
    });
  });

  describe("Tag", async function () {
    it("should be able to mint and tag", async function () {
      const targetNftId = constants.One;
      const targetNftChainId = constants.One;
      const {
        contractERC721Registry,
        contractERC721Mock,
        accountHashtagPlatform,
        accountHashtagPublisher,
        accountTagger,
        taggingFee,
        platformPercentage,
        publisherPercentage,
        taggerPercentage,
      } = await setup();

      // Try tagging with a new hashtag.
      const receipt = await
        contractERC721Registry
          .connect(accountTagger)
          .tag(
            "#macbook",
            contractERC721Mock.address,
            targetNftId,
            accountHashtagPublisher.address,
            accountTagger.address,
            targetNftChainId,
            { value: taggingFee },
          );

      await expectEvent.inTransaction(
        receipt.hash,
        ERC721HashtagRegistry,
        'HashtagRegistered',
        {
          tagger: accountTagger.address,
          nftContract: contractERC721Mock.address,
          publisher: accountHashtagPublisher.address,
          hashtagId: constants.Two,
          nftId: targetNftId,
          tagId: constants.One,
          tagFee: taggingFee,
          nftChainId: targetNftChainId,
        },
      );

      expect(await contractERC721Registry.totalTags()).to.be.equal(1);

      const {
        _hashtagId,
        _nftContract,
        _nftId,
        _tagger,
        _tagstamp,
        _publisher,
        _nftChainId,
      } = await contractERC721Registry.getTagInfo(constants.One);

      // The newly minted HASHTAG should have id = 2
      // because HASHTAG #1 was minted in the setup script.
      expect(_hashtagId).to.be.equal(constants.Two);
      expect(_nftContract).to.be.equal(contractERC721Mock.address);
      expect(_nftId).to.be.equal(targetNftId);
      expect(_tagger).to.be.equal(accountTagger.address);
      expect(_tagstamp).to.exist;
      expect(Number(_tagstamp.toString())).to.be.gt(0);
      expect(_publisher).to.be.equal(accountHashtagPublisher.address);
      expect(_nftChainId).to.be.equal(targetNftChainId);

      // Check accrued values
      // Only one tag event happened, so it's tagging fee/participant %
      expect(await contractERC721Registry.accrued(accountHashtagPublisher.address)).to.be.equal(taggingFee*(publisherPercentage/100));
      expect(await contractERC721Registry.accrued(accountHashtagPlatform.address)).to.be.equal(taggingFee*(platformPercentage/100));
      expect(await contractERC721Registry.accrued(accountTagger.address)).to.be.equal(taggingFee*(taggerPercentage/100));
    });

    it("should be able to tag a cryptokittie with #kittypower (pre-auction of #kittypower)", async function () {
      const targetNftId = constants.One;
      const targetNftChainId = constants.One;
      const tagId = constants.One; // the id of the tagging event.
      const {
        contractERC721Registry,
        contractERC721Mock,
        accountHashtagPlatform,
        accountHashtagPublisher,
        accountTagger,
        hashtagId,
        taggingFee,
        platformPercentage,
        publisherPercentage,
        taggerPercentage,
      } = await setup();

      receipt = await contractERC721Registry
        .connect(accountTagger)
          .tag(
            "#kittypower",
            contractERC721Mock.address,
            targetNftId,
            accountHashtagPublisher.address,
            accountTagger.address,
            targetNftChainId,
            { value: taggingFee },
          );

      await expectEvent.inTransaction(
        receipt.hash,
        ERC721HashtagRegistry,
        'HashtagRegistered',
        {
          tagger: accountTagger.address,
          nftContract: contractERC721Mock.address,
          publisher: accountHashtagPublisher.address,
          hashtagId: hashtagId,
          nftId: targetNftId,
          tagId: constants.One,
          tagFee: taggingFee,
          nftChainId: targetNftChainId,
        },
      );

      expect(await contractERC721Registry.totalTags()).to.be.equal(1);

      const {
        _hashtagId,
        _nftContract,
        _nftId,
        _tagger,
        _tagstamp,
        _publisher,
        _nftChainId,
      } = await contractERC721Registry.getTagInfo(tagId);

      expect(_hashtagId).to.be.equal(hashtagId);
      expect(_nftContract).to.be.equal(contractERC721Mock.address);
      expect(_nftId).to.be.equal(targetNftId);
      expect(_tagger).to.be.equal(accountTagger.address);
      expect(_tagstamp).to.exist;
      expect(Number(_tagstamp.toString())).to.be.gt(0);
      expect(_publisher).to.be.equal(accountHashtagPublisher.address);
      expect(_nftChainId).to.be.equal(targetNftChainId);

      // check accrued values
      expect(await contractERC721Registry.accrued(accountHashtagPublisher.address)).to.be.equal(taggingFee*(publisherPercentage/100));
      expect(await contractERC721Registry.accrued(accountHashtagPlatform.address)).to.be.equal(taggingFee*(platformPercentage/100));
      expect(await contractERC721Registry.accrued(accountTagger.address)).to.be.equal(taggingFee*(taggerPercentage/100));
    });

    it("should be able to tag a Polygon NFT with #kittycat (pre-auction of #kittycat)", async function () {
      // Attempt to tag this actual Matic NFT
      // https://opensea.io/assets/matic/0xd5a5ddd6f4e7d839db2978e8a4ee9923ac088cb3/9268
      const targetNftAddress = utils.getAddress("0xd5a5ddd6f4e7d839db2978e8a4ee9923ac088cb3");
      const targetNftId = '9368';
      const matic = '137';
      const {
        contractERC721Registry,
        hashtagId,
        accountHashtagAdmin,
        accountHashtagPublisher,
        accountTagger,
        taggingFee,
      } = await setup();

      // Permit tagging of assets on chain id 137.
      await contractERC721Registry.connect(accountHashtagAdmin).setPermittedNftChainId(matic, true);
      expect((await contractERC721Registry.getPermittedNftChainId(matic)) == true);

      const receipt = await contractERC721Registry
        .connect(accountTagger)
          .tag(
            "#kittypower",
            targetNftAddress,
            targetNftId,
            accountHashtagPublisher.address,
            accountTagger.address,
            matic, 
            { value: taggingFee }
          );

      await expectEvent.inTransaction(
        receipt.hash,
        ERC721HashtagRegistry,
        'HashtagRegistered',
        {
          tagger: accountTagger.address,
          nftContract: targetNftAddress,
          publisher: accountHashtagPublisher.address,
          hashtagId: hashtagId,
          nftId: targetNftId,
          tagId: constants.One,
          tagFee: taggingFee,
          nftChainId: matic,
        },
      );
    });

    it("should be able to tag a cryptokittie on mainnet with #kittypower (pre and post auction of #kittypower)", async function () {
      const targetNftChainId = constants.One;
      const targetNftId = constants.One;
      const {
        contractERC721Registry,
        hashtagId,
        contractERC721Mock,
        accountHashtagPlatform,
        accountHashtagPublisher,
        accountTagger,
        taggingFee,
        platformPercentage,
        publisherPercentage,
        taggerPercentage,
      } = await setup();

      // Tag pre auction and make sure that accrued values are correct
      await contractERC721Registry
        .connect(accountTagger)
        .tag(
          "#kittypower",
          contractERC721Mock.address,
          targetNftId,
          accountHashtagPublisher.address,
          accountTagger.address,
          targetNftChainId,
          { value: taggingFee },
        );

      expect(await contractERC721Registry.totalTags()).to.be.equal(1);

      const {
        _hashtagId,
        _nftContract,
        _nftId,
        _tagger,
        _tagstamp,
        _publisher,
        _nftChainId,
      } = await contractERC721Registry.getTagInfo(hashtagId);

      expect(_hashtagId).to.be.equal(hashtagId);
      expect(_nftContract).to.be.equal(contractERC721Mock.address);
      expect(_nftId).to.be.equal(targetNftId);
      expect(_tagger).to.be.equal(accountTagger.address);
      expect(_tagstamp).to.exist;
      expect(Number(_tagstamp.toString())).to.be.gt(0);
      expect(_publisher).to.be.equal(accountHashtagPublisher.address);
      expect(_nftChainId).to.be.equal(targetNftChainId);

      // check accrued values
      expect(await contractERC721Registry.accrued(accountHashtagPublisher.address)).to.be.equal(taggingFee*(publisherPercentage/100));
      expect(await contractERC721Registry.accrued(accountHashtagPlatform.address)).to.be.equal(taggingFee*(platformPercentage/100));
      expect(await contractERC721Registry.accrued(accountTagger.address)).to.be.equal(taggingFee*(taggerPercentage/100));
    });

    it("should be able to tag a cryptokittie on mainnet with #kittycat (pre and post auction of #kittycat)", async function () {
      // Tag pre auction and make sure that accrued values are correct
      const targetNftId = constants.One;
      const targetNftChainId = constants.One;
      const {
        contractERC721Registry,
        hashtagId,
        contractERC721Mock,
        contractHashtagProtocol,
        accountHashtagPlatform,
        accountHashtagPublisher,
        accountTagger,
        accountBuyer,
        taggingFee,
        platformPercentage,
        publisherPercentage,
        taggerPercentage
      } = await setup();

      // Tag targetNft #1.
      await contractERC721Registry
        .connect(accountTagger)
        .tag(
          "#kittypower",
          contractERC721Mock.address,
          targetNftId,
          accountHashtagPublisher.address,
          accountTagger.address,
          targetNftChainId,
          { value: taggingFee },
        );

      expect(await contractERC721Registry.totalTags()).to.be.equal(1);

      // check accrued values
      expect(await contractERC721Registry.accrued(accountHashtagPublisher.address)).to.be.equal(taggingFee*(publisherPercentage/100));
      expect(await contractERC721Registry.accrued(accountHashtagPlatform.address)).to.be.equal(taggingFee*(platformPercentage/100));
      expect(await contractERC721Registry.accrued(accountTagger.address)).to.be.equal(taggingFee*(taggerPercentage/100));

      // Transfer #kittypower to accountBuyer. Simulates purchase.
      await contractHashtagProtocol
        .connect(accountHashtagPlatform)
        .transferFrom(accountHashtagPlatform.address, accountBuyer.address, hashtagId);

      // Tag targetNFT #2 with #kittypower.
      const targetNftTwo = constants.Two;
      await contractERC721Registry
        .connect(accountTagger)
        .tag(
          "#kittypower",
          contractERC721Mock.address,
          targetNftTwo,
          accountHashtagPublisher.address,
          accountTagger.address,
          targetNftChainId,
          { value: taggingFee },
        );

      expect(await contractERC721Registry.totalTags()).to.be.equal(2);

      // Now check accrued for all players. Publisher 2x tags, Platform 2x tags,
      // accountTagger and accountBuyer 1x tag each.
      expect(await contractERC721Registry.totalDue(accountHashtagPublisher.address)).to.be.equal(
        2*(taggingFee*(publisherPercentage/100))
      );
      expect(await contractERC721Registry.totalDue(accountHashtagPlatform.address)).to.be.equal(
        2*(taggingFee*(platformPercentage/100))
      );
      expect(await contractERC721Registry.totalDue(accountTagger.address)).to.be.equal(
        taggingFee*(taggerPercentage/100)
      );
      expect(await contractERC721Registry.totalDue(accountBuyer.address)).to.be.equal(
        taggingFee*(taggerPercentage/100)
      );
    });

    it("mints new HASHTAG when it does not exist", async function () {
      const targetNftChainId = constants.One;
      const targetNftId = constants.One;
      const { contractERC721Registry, contractERC721Mock, accountHashtagPublisher, accountTagger, taggingFee } = await setup();

      const receipt = await contractERC721Registry
        .connect(accountHashtagPublisher)
          .tag(
            "#unknowntag", // Non-existent HASHTAG
            contractERC721Mock.address,
            constants.One,
            accountHashtagPublisher.address,
            accountTagger.address,
            targetNftChainId,
            { value: taggingFee },
          );

      await expectEvent.inTransaction(
        receipt.hash,
        ERC721HashtagRegistry,
        'HashtagRegistered',
        {
          tagger: accountTagger.address,
          nftContract: contractERC721Mock.address,
          publisher: accountHashtagPublisher.address,
          hashtagId: "2",
          nftId: targetNftId,
          tagId: constants.One,
          tagFee: taggingFee,
          nftChainId: targetNftChainId,
        },
      );
    });

    it("Reverts when new hashtag is invalid.", async function () {
      const {
        contractERC721Registry,
        contractHashtagProtocol,
        hashtagId,
        accountHashtagPublisher,
        accountTagger,
        taggingFee
      } = await setup();
      const targetNftChainId = constants.One;

      await expect(
        contractERC721Registry.tag(
            "#bad hashtag",
            contractHashtagProtocol.address,
            constants.One,
            accountHashtagPublisher.address,
            accountTagger.address,
            targetNftChainId,
            { value: taggingFee },
          ),
      ).to.be.revertedWith("Invalid character found: Hashtag may only contain characters A-Z, a-z, 0-9 and #");
    });

    it("Reverts when target NFT is HASHTAG token.", async function () {
      const {
        contractERC721Registry,
        contractHashtagProtocol,
        hashtagId,
        accountHashtagPublisher,
        accountTagger,
        taggingFee
      } = await setup();
      const targetNftChainId = constants.One;

      await expect(
        contractERC721Registry.tag(
            "#kittypower",
            contractHashtagProtocol.address,
            constants.One,
            accountHashtagPublisher.address,
            accountTagger.address,
            targetNftChainId,
            { value: taggingFee },
          ),
      ).to.be.revertedWith("Invalid tag - you are attempting to tag another hashtag");
    });

    it("Reverts when missing tagging fee during mint and tag.", async function () {
      const targetNftChainId = constants.One;
      const {
        contractERC721Registry,
        contractERC721Mock,
        hashtagId,
        accountHashtagPublisher,
        accountTagger,
      } = await setup();

      await expect(
        contractERC721Registry.mintAndTag(
          "#hello",
          contractERC721Mock.address,
          hashtagId,
          accountHashtagPublisher.address,
          accountTagger.address,
          targetNftChainId,
        ),
      ).to.be.revertedWith("Mint and tag: You must send the tag fee");
    });

    it("Reverts when missing tagging fee during tagging", async function () {
      const {
        contractERC721Registry,
        contractERC721Mock,
        hashtagId,
        accountHashtagPublisher,
        accountTagger,
      } = await setup();
      const targetNftChainId = constants.One;

      await expect(
        contractERC721Registry.tag(
          "#kittypower",
          contractERC721Mock.address,
          constants.One,
          accountHashtagPublisher.address,
          accountTagger.address,
          targetNftChainId,
        ),
      ).to.be.revertedWith("Tag: You must send the fee");
    });

    it("Reverts when non-whitelisted publisher attempts mint and tag", async function () {
      const targetNftChainId = constants.One;
      const { contractERC721Registry, contractERC721Mock, hashtagId, accountRandomOne, accountTagger, taggingFee } = await setup();

      await expect(
        contractERC721Registry.mintAndTag(
          "#hullo",
          contractERC721Mock.address,
          hashtagId,
          accountRandomOne.address, // Non publisher account.
          accountTagger.address,
          targetNftChainId,
          { value: taggingFee },
        ),
      ).to.be.revertedWith("Mint and tag: The publisher must be whitelisted");
    });

    it("Reverts when non-whitelisted publisher attempts tagging", async function () {
      const targetNftChainId = constants.One;
      const { contractERC721Registry, contractERC721Mock, hashtagId, accountRandomOne, accountTagger, taggingFee } = await setup();

      await expect(
        contractERC721Registry.tag(
          "#kittypower",
          contractERC721Mock.address,
          constants.One,
          accountRandomOne.address,
          accountTagger.address,
          targetNftChainId,
          { value: taggingFee },
        ),
      ).to.be.revertedWith("Tag: The publisher must be whitelisted");
    });

    it("Reverts when target chain id is not permitted when mint and tagging", async function () {
      const nonPermittedNftChainId = 5;
      const {
        contractERC721Registry,
        contractERC721Mock,
        accountHashtagPublisher,
        hashtagId,
        accountTagger,
        taggingFee
      } = await setup();

      await expect(
        contractERC721Registry.mintAndTag(
          "#hullo",
          contractERC721Mock.address,
          hashtagId,
          accountHashtagPublisher.address,
          accountTagger.address,
          nonPermittedNftChainId,
          { value: taggingFee },
        ),
      ).to.be.revertedWith("Mint and tag: Tagging target chain not permitted");
    });

    it("Reverts when target chain id is not permitted during tagging", async function () {
      const nonPermittedNftChainId = 5;
      const {
        contractERC721Registry,
        contractERC721Mock,
        accountHashtagPublisher,
        hashtagId,
        accountTagger,
        taggingFee
      } = await setup();

      await expect(
        contractERC721Registry.tag(
          "#kittypower",
          contractERC721Mock.address,
          constants.One,
          accountHashtagPublisher.address,
          accountTagger.address,
          nonPermittedNftChainId,
          { value: taggingFee },
        ),
      ).to.be.revertedWith("Tag: Tagging target chain not permitted");
    });

    it("Reverts when previously permitted target chain id is no longer permitted", async function () {
      const revertedNftChainId = 1;
      const {
        contractERC721Registry,
        contractERC721Mock,
        accountHashtagPublisher,
        accountHashtagAdmin,
        hashtagId,
        accountTagger,
        taggingFee
      } = await setup();

      await contractERC721Registry.connect(accountHashtagAdmin).setPermittedNftChainId(revertedNftChainId, false);
      expect((await contractERC721Registry.getPermittedNftChainId(revertedNftChainId)) == false);

      await expect(
        contractERC721Registry.tag(
          "#kittypower",
          contractERC721Mock.address,
          constants.One,
          accountHashtagPublisher.address,
          accountTagger.address,
          revertedNftChainId,
          { value: taggingFee },
        ),
      ).to.be.revertedWith("Tag: Tagging target chain not permitted");
    });
  });

  describe("Drawing down", async function () {
    it("Can draw down on behalf of the platform", async function () {
      // Account A can draw down accumulated funds of 
      // Account B to wallet of Account B.
      const {
        contractERC721Registry,
        accountHashtagPlatform,
        accountRandomOne,
        taggingFee,
        platformPercentage
      } = await setup("drawdown");

      const platformBalanceBefore = await accountHashtagPlatform.getBalance();

      // accountRandomOne is triggering the drawdown of ETH accrued in
      // accountHashtagPlatform.
      await contractERC721Registry.connect(accountRandomOne).drawDown(accountHashtagPlatform.address);
      const platformBalanceAfter = await accountHashtagPlatform.getBalance();

      // In this case we are expecting the value drawn down to be the
      // platform percentage cut of one tagging event.
      expect(platformBalanceAfter.sub(platformBalanceBefore)).to.be.equal(
        taggingFee*(platformPercentage/100)
      );
    });
  
    it("Can draw down as the platform", async function () {
      const {
        contractERC721Registry,
        accountHashtagPlatform,
        accountRandomOne,
        taggingFee,
        platformPercentage
      } = await setup("drawdown");

      const platformBalanceBefore = await accountHashtagPlatform.getBalance();

      const txn = await contractERC721Registry.connect(accountRandomOne).drawDown(accountHashtagPlatform.address);
      const receipt = await txn.wait();
      const platformBalanceAfter = await accountHashtagPlatform.getBalance();

      expect(platformBalanceAfter.sub(platformBalanceBefore)).to.be.equal(
        (taggingFee*(platformPercentage/100))
      );
    });

    it("Does nothing after a double draw down", async function () {
      const {
        contractERC721Registry,
        accountHashtagPlatform,
        accountRandomOne,
        taggingFee,
        platformPercentage
      } = await setup("drawdown");

      const platformBalanceBefore = await accountHashtagPlatform.getBalance();
      await contractERC721Registry.connect(accountRandomOne).drawDown(accountHashtagPlatform.address);
      const platformBalanceAfter = await accountHashtagPlatform.getBalance();
  
      expect(platformBalanceAfter.sub(platformBalanceBefore)).to.be.equal(
        taggingFee*(platformPercentage/100)
      );
  
      const balanceBeforeSecondDraw = await accountHashtagPlatform.getBalance();
      await contractERC721Registry.connect(accountRandomOne).drawDown(accountHashtagPlatform.address);
      const balanceAfterSecondDraw = await accountHashtagPlatform.getBalance();
  
      expect(balanceAfterSecondDraw.sub(balanceBeforeSecondDraw)).to.be.equal(
        "0"
      );
    });
  });

  describe("Updating percentages", async function () {
    it("Reverts if not admin", async function () {
      const { contractERC721Registry, accountTagger } = await setup();
      await expect(
        contractERC721Registry.connect(accountTagger).updatePercentages(10, 10)
      ).to.be.revertedWith("Caller must be admin");
    });
  
    it("Reverts if greater than 100", async function () {
      const { contractERC721Registry, accountHashtagAdmin } = await setup();
      await expect(
        contractERC721Registry.connect(accountHashtagAdmin).updatePercentages(90, 11)
      ).to.be.revertedWith(
        "ERC721HashtagRegistry.updatePercentages: percentages must not be over 100"
      );
    });
  
    it("With correct credentials can update percentages", async function () {
      const { contractERC721Registry, accountHashtagAdmin } = await setup();
      await contractERC721Registry.connect(accountHashtagAdmin).updatePercentages(30, 20);
  
      expect(await contractERC721Registry.platformPercentage()).to.be.equal(30);
      expect(await contractERC721Registry.publisherPercentage()).to.be.equal(20);
      expect(await contractERC721Registry.remainingPercentage()).to.be.equal(50);
    });
  });
});
