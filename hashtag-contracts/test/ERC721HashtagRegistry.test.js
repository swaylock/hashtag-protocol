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
    contractHashtagProtocol: await ethers.getContract("HashtagProtocol"),
    contractERC721Registry: await ethers.getContract("ERC721HashtagRegistry"),
    contractERC721Mock: await ethers.getContract("ERC721BurnableMock"),
  };

  // Set permitted target NFT chain id.
  await contracts.contractERC721Registry
    .connect(accounts.accountHashtagAdmin)
    .setPermittedNftChainId(constants.One, true);

  // Mint a HASHTAG token for tagging.
  await contracts.contractHashtagProtocol
    .connect(accounts.accountTagger)
    .mint("#kittypower", accounts.accountHashtagPublisher.address, accounts.accountTagger.address, {
      value: utils.parseEther(".01"),
    });
  const hashtagId = await contracts.contractHashtagProtocol.hashtagToTokenId("#kittypower");

  // If the test type is "drawdown", pre-tag some assets user accounts will have
  // something to drawdown.
  if (type == "drawdown") {
    const nftOneId = constants.One;
    await contracts.contractERC721Registry
      .connect(accounts.accountTagger)
      .tag(
        hashtagId,
        contracts.contractERC721Mock.address,
        nftOneId,
        accounts.accountHashtagPublisher.address,
        accounts.accountTagger.address,
        { value: utils.parseEther("0.01") },
      );
  }

  // Mint two target nfts.
  await contracts.contractERC721Mock.mint(); //#1
  await contracts.contractERC721Mock.mint(); //#2

  return {
    ...contracts,
    ...accounts,
    hashtagId,
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

  describe("Only user with admin access", async function () {
    it("should set tag fee", async function () {
      const { contractERC721Registry, accountHashtagAdmin, accountRandomTwo } = await setup();
      await contractERC721Registry.connect(accountHashtagAdmin).setTagFee(utils.parseEther("1"));
      expect(await contractERC721Registry.tagFee()).to.be.equal(utils.parseEther("1"));

      await expect(contractERC721Registry.connect(accountRandomTwo).setTagFee(utils.parseEther("1"))).to.be.reverted;
    });
  });

  describe("Only addresses with Admin access", async function () {
    it("should set tag fee", async function () {
      const { contractERC721Registry, accountHashtagAdmin } = await setup();
      // Try setting tag fee as platform address.
      // Expect it to be set.
      await contractERC721Registry.connect(accountHashtagAdmin).setTagFee(utils.parseEther("1"));
      expect(await contractERC721Registry.tagFee()).to.be.equal(utils.parseEther("1"));
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
      const {
        contractERC721Registry,
        contractERC721Mock,
        accountHashtagPlatform,
        accountHashtagPublisher,
        accountTagger,
      } = await setup();
      const nftId = constants.One;
      const macbookHashtagValue = "#macbook";
      const targetNftChainId = constants.One;

      await expect(
        contractERC721Registry
          .connect(accountTagger)
          .mintAndTag(
            macbookHashtagValue,
            contractERC721Mock.address,
            nftId,
            accountHashtagPublisher.address,
            accountTagger.address,
            targetNftChainId,
            {
              value: utils.parseEther("0.01"),
            },
          ),
      )
        .to.emit(contractERC721Registry, "HashtagRegistered")
        .withArgs(
          accountTagger.address,
          contractERC721Mock.address,
          accountHashtagPublisher.address,
          constants.Two,
          nftId,
          constants.One,
          utils.parseEther("0.001"),
          targetNftChainId,
        );

      const {
        _hashtagId,
        _nftContract,
        _nftId,
        _tagger,
        _tagstamp,
        _publisher,
        _nftChainId,
      } = await contractERC721Registry.getTagInfo(nftId);

      // The newly minted HASHTAG should have id = 2
      // because HASHTAG #1 was minted in the setup script.
      expect(_hashtagId).to.be.equal(constants.Two);
      expect(_nftContract).to.be.equal(contractERC721Mock.address);
      expect(_nftId).to.be.equal(nftId);
      expect(_tagger).to.be.equal(accountTagger.address);
      expect(_tagstamp).to.exist;
      expect(Number(_tagstamp.toString())).to.be.gt(0);
      expect(_publisher).to.be.equal(accountHashtagPublisher.address);
      expect(_nftChainId).to.be.equal(targetNftChainId);

      // check accrued values
      expect(await contractERC721Registry.accrued(accountHashtagPublisher.address)).to.be.equal(
        utils.parseEther("0.003"),
      ); // 30%
      expect(await contractERC721Registry.accrued(accountHashtagPlatform.address)).to.be.equal(
        utils.parseEther("0.002"),
      ); // 20%
      expect(await contractERC721Registry.accrued(accountTagger.address)).to.be.equal(utils.parseEther("0.005")); // 50%
    });

    it("should be able to tag a cryptokittie with #kittypower (pre-auction of #kittypower)", async function () {
      const {
        contractERC721Registry,
        contractERC721Mock,
        hashtagId,
        accountHashtagPlatform,
        accountHashtagPublisher,
        accountTagger,
      } = await setup();
      const nftId = constants.One;
      const targetNftChainId = constants.One;
      const tagId = constants.One; // the id of the tagging event.

      await expect(
        contractERC721Registry
          .connect(accountTagger)
          .tag(
            hashtagId,
            contractERC721Mock.address,
            nftId,
            accountHashtagPublisher.address,
            accountTagger.address,
            targetNftChainId,
            {
              value: utils.parseEther("0.001"),
            },
          ),
      )
        .to.emit(contractERC721Registry, "HashtagRegistered")
        .withArgs(
          accountTagger.address, // accountTagger wallet address
          contractERC721Mock.address, // target NFT contract address
          accountHashtagPublisher.address, // publisher wallet address
          hashtagId, // HASHTAG token id
          nftId, // target NFT id
          constants.One, // HTP tag id
          utils.parseEther("0.001"), // tag fee
          targetNftChainId, // target chain id
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
      expect(_nftId).to.be.equal(nftId);
      expect(_tagger).to.be.equal(accountTagger.address);
      expect(_tagstamp).to.exist;
      expect(Number(_tagstamp.toString())).to.be.gt(0);
      expect(_publisher).to.be.equal(accountHashtagPublisher.address);
      expect(_nftChainId).to.be.equal(targetNftChainId);

      // check accrued values
      expect(await contractERC721Registry.accrued(accountHashtagPublisher.address)).to.be.equal(
        utils.parseEther("0.0003"),
      ); // 30%
      expect(await contractERC721Registry.accrued(accountHashtagPlatform.address)).to.be.equal(
        utils.parseEther("0.0002"),
      ); // 20%
      expect(await contractERC721Registry.accrued(accountTagger.address)).to.be.equal(utils.parseEther("0.0005")); // 50%
    });

    it("should be able to tag a Polygon NFT with #kittycat (pre-auction of #kittycat)", async function () {
      const {
        contractERC721Registry,
        hashtagId,
        accountHashtagAdmin,
        accountHashtagPublisher,
        accountTagger,
      } = await setup();

      // Attempt to tag this actual Matic NFT
      // https://opensea.io/assets/matic/0xd5a5ddd6f4e7d839db2978e8a4ee9923ac088cb3/9268
      const nftAddress = utils.getAddress("0xd5a5ddd6f4e7d839db2978e8a4ee9923ac088cb3");
      const nftId = 9368;
      const matic = 137;
      // Permit chain id 137. Obviously this is set globally for the contract
      // ahead of time.
      await contractERC721Registry.connect(accountHashtagAdmin).setPermittedNftChainId(137, true);
      expect((await contractERC721Registry.getPermittedNftChainId(137)) == true);

      await expect(
        contractERC721Registry
          .connect(accountTagger)
          .tag(hashtagId, nftAddress, nftId, accountHashtagPublisher.address, accountTagger.address, matic, {
            value: utils.parseEther("0.001"),
          }),
      )
        .to.emit(contractERC721Registry, "HashtagRegistered")
        .withArgs(
          accountTagger.address,
          nftAddress,
          accountHashtagPublisher.address,
          hashtagId,
          nftId,
          constants.One,
          utils.parseEther("0.001"),
          matic,
        );

      //const {
      //  _hashtagId,
      //  _nftContract,
      //  _nftId,
      //  _tagger,
      //  _tagstamp,
      //  _publisher,
      //  _nftChainId,
      //} = await contractERC721Registry.getTagInfo(tagId);
      //
      //expect(_publisher).to.be.equal(accountHashtagPublisher.address);
      //
      //// check accrued values
      //expect(await contractERC721Registry.accrued(accountHashtagPublisher.address)).to.be.equal(
      //  utils.parseEther("0.0003"),
      //); // 30%
      //expect(await contractERC721Registry.accrued(accountHashtagPlatform.address)).to.be.equal(
      //  utils.parseEther("0.0002"),
      //); // 20%
      //expect(await contractERC721Registry.accrued(accountTagger.address)).to.be.equal(utils.parseEther("0.0005")); // 50%
    });

    it("should be able to tag a cryptokittie on mainnet with #kittypower (pre and post auction of #kittypower)", async function () {
      const {
        contractERC721Registry,
        hashtagId,
        contractERC721Mock,
        accountHashtagPlatform,
        accountHashtagPublisher,
        accountTagger,
      } = await setup();
      const nftOneId = constants.One;
      const targetNftChainId = constants.One;

      // Tag pre auction and make sure that accrued values are correct
      await contractERC721Registry
        .connect(accountTagger)
        .tag(
          hashtagId,
          contractERC721Mock.address,
          nftOneId,
          accountHashtagPublisher.address,
          accountTagger.address,
          targetNftChainId,
          {
            value: utils.parseEther("0.001"),
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
      } = await contractERC721Registry.getTagInfo(hashtagId);

      expect(_hashtagId).to.be.equal(hashtagId);
      expect(_nftContract).to.be.equal(contractERC721Mock.address);
      expect(_nftId).to.be.equal(nftOneId);
      expect(_tagger).to.be.equal(accountTagger.address);
      expect(_tagstamp).to.exist;
      expect(Number(_tagstamp.toString())).to.be.gt(0);
      expect(_publisher).to.be.equal(accountHashtagPublisher.address);
      expect(_nftChainId).to.be.equal(targetNftChainId);

      // check accrued values
      expect(await contractERC721Registry.accrued(accountHashtagPublisher.address)).to.be.equal(
        utils.parseEther("0.0003"),
      ); // 30%
      expect(await contractERC721Registry.accrued(accountHashtagPlatform.address)).to.be.equal(
        utils.parseEther("0.0002"),
      ); // 20%
      expect(await contractERC721Registry.accrued(accountTagger.address)).to.be.equal(utils.parseEther("0.0005")); // 50%
    });

    it("should be able to tag a cryptokittie on mainnet with #kittycat (pre and post auction of #kittycat)", async function () {
      // Tag pre auction and make sure that accrued values are correct
      const {
        contractERC721Registry,
        hashtagId,
        contractERC721Mock,
        contractHashtagProtocol,
        accountHashtagPlatform,
        accountHashtagPublisher,
        accountTagger,
        accountBuyer,
      } = await setup();
      const nftOneId = constants.One;
      const targetNftChainId = constants.One;

      await contractERC721Registry
        .connect(accountTagger)
        .tag(
          hashtagId,
          contractERC721Mock.address,
          nftOneId,
          accountHashtagPublisher.address,
          accountTagger.address,
          targetNftChainId,
          {
            value: utils.parseEther("0.001"),
          },
        );

      expect(await contractERC721Registry.totalTags()).to.be.equal(1);

      // check accrued values
      expect(await contractERC721Registry.accrued(accountHashtagPublisher.address)).to.be.equal(
        utils.parseEther("0.0003"),
      ); // 430%
      expect(await contractERC721Registry.accrued(accountHashtagPlatform.address)).to.be.equal(
        utils.parseEther("0.0002"),
      ); // 20%
      expect(await contractERC721Registry.accrued(accountTagger.address)).to.be.equal(utils.parseEther("0.0005")); // 50%

      await contractHashtagProtocol
        .connect(accountHashtagPlatform)
        .transferFrom(accountHashtagPlatform.address, accountBuyer.address, hashtagId);

      const nftTwoId = constants.Two;
      await contractERC721Registry
        .connect(accountTagger)
        .tag(
          hashtagId,
          contractERC721Mock.address,
          nftTwoId,
          accountHashtagPublisher.address,
          accountTagger.address,
          targetNftChainId,
          {
            value: utils.parseEther("0.001"),
          },
        );

      expect(await contractERC721Registry.totalDue(accountHashtagPublisher.address)).to.be.equal(
        utils.parseEther("0.0006"),
      );
      expect(await contractERC721Registry.totalDue(accountHashtagPlatform.address)).to.be.equal(
        utils.parseEther("0.0004"),
      );
      expect(await contractERC721Registry.totalDue(accountTagger.address)).to.be.equal(utils.parseEther("0.0005"));
      expect(await contractERC721Registry.totalDue(accountBuyer.address)).to.be.equal(utils.parseEther("0.0005"));
    });

    it("Reverts when hashtag does not exist", async function () {
      const { contractERC721Registry, contractERC721Mock, accountHashtagPublisher, accountTagger } = await setup();
      const targetNftChainId = constants.One;

      await expect(
        contractERC721Registry
          .connect(accountHashtagPublisher)
          .tag(
            BigNumber.from("4"),
            contractERC721Mock.address,
            constants.One,
            accountHashtagPublisher.address,
            accountTagger.address,
            targetNftChainId,
            {
              value: utils.parseEther("1"),
            },
          ),
      ).to.be.revertedWith("The hashtag ID supplied is invalid - non-existent token!");
    });

    it("Reverts when hashtag nft contract address supplied for tag", async function () {
      const {
        contractERC721Registry,
        contractHashtagProtocol,
        hashtagId,
        accountHashtagPublisher,
        accountTagger,
      } = await setup();
      const targetNftChainId = constants.One;

      await expect(
        contractERC721Registry
          .connect(accountHashtagPublisher)
          .tag(
            hashtagId,
            contractHashtagProtocol.address,
            hashtagId,
            accountHashtagPublisher.address,
            accountTagger.address,
            targetNftChainId,
            { value: utils.parseEther("1") },
          ),
      ).to.be.revertedWith("Invalid tag - you are attempting to tag another hashtag");
    });

    it("Reverts when sending zero value when mint and tagging", async function () {
      const {
        contractERC721Registry,
        contractERC721Mock,
        hashtagId,
        accountHashtagPublisher,
        accountTagger,
      } = await setup();
      const targetNftChainId = constants.One;

      await expect(
        contractERC721Registry.mintAndTag(
          "#hullo",
          contractERC721Mock.address,
          hashtagId,
          accountHashtagPublisher.address,
          accountTagger.address,
          targetNftChainId,
        ),
      ).to.be.revertedWith("Mint and tag: You must send the tag fee");
    });

    it("Reverts when sending zero value when tagging", async function () {
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
          hashtagId,
          contractERC721Mock.address,
          hashtagId,
          accountHashtagPublisher.address,
          accountTagger.address,
          targetNftChainId,
        ),
      ).to.be.revertedWith("Tag: You must send the fee");
    });

    //it("Reverts when nft does not exist", async function () {
    //  await expect(
    //    contractERC721Registry.tag(
    //      hashtagId,
    //      contractERC721Mock.address,
    //      BigNumber.from("3"),
    //      accountHashtagPublisher.address,
    //      accountTagger.address,
    //      { value: utils.parseEther("1") }
    //    )
    //  ).to.be.revertedWith("ERC721: owner query for nonexistent token");
    //});

    it("Reverts when non-whitelisted publisher attempts host mint and tag", async function () {
      const { contractERC721Registry, contractERC721Mock, hashtagId, accountRandomOne, accountTagger } = await setup();
      const targetNftChainId = constants.One;

      await expect(
        contractERC721Registry.mintAndTag(
          "#hullo",
          contractERC721Mock.address,
          hashtagId,
          accountRandomOne.address, // Non publisher account.
          accountTagger.address,
          targetNftChainId,
          { value: utils.parseEther("1") },
        ),
      ).to.be.revertedWith("Mint and tag: The publisher must be whitelisted");
    });

    it("Reverts when non-whitelisted publisher attempts to host tagging", async function () {
      const { contractERC721Registry, contractERC721Mock, hashtagId, accountRandomOne, accountTagger } = await setup();
      const targetNftChainId = constants.One;

      await expect(
        contractERC721Registry.tag(
          hashtagId,
          contractERC721Mock.address,
          hashtagId,
          accountRandomOne.address,
          accountTagger.address,
          targetNftChainId,
          { value: utils.parseEther("1") },
        ),
      ).to.be.revertedWith("Tag: The publisher must be whitelisted");
    });

    it("Reverts when target chain id is not permitted when mint and tagging", async function () {
      const {
        contractERC721Registry,
        contractERC721Mock,
        accountHashtagPublisher,
        hashtagId,
        accountTagger,
      } = await setup();
      const nonPermittedNftChainId = 5;

      await expect(
        contractERC721Registry.mintAndTag(
          "#hullo",
          contractERC721Mock.address,
          hashtagId,
          accountHashtagPublisher.address,
          accountTagger.address,
          nonPermittedNftChainId,
          { value: utils.parseEther("1") },
        ),
      ).to.be.revertedWith("Mint and tag: Tagging target chain not permitted");
    });

    it("Reverts when target chain id is not permitted during tagging", async function () {
      const {
        contractERC721Registry,
        contractERC721Mock,
        accountHashtagPublisher,
        hashtagId,
        accountTagger,
      } = await setup();
      const nonPermittedNftChainId = 5;

      await expect(
        contractERC721Registry.tag(
          hashtagId,
          contractERC721Mock.address,
          hashtagId,
          accountHashtagPublisher.address,
          accountTagger.address,
          nonPermittedNftChainId,
          { value: utils.parseEther("1") },
        ),
      ).to.be.revertedWith("Tag: Tagging target chain not permitted");
    });

    it("Reverts when previously permitted target chain id is no longer permitted", async function () {
      const {
        contractERC721Registry,
        contractERC721Mock,
        accountHashtagPublisher,
        accountHashtagAdmin,
        hashtagId,
        accountTagger,
      } = await setup();
      const revertedNftChainId = 1;

      await contractERC721Registry.connect(accountHashtagAdmin).setPermittedNftChainId(revertedNftChainId, false);
      expect((await contractERC721Registry.getPermittedNftChainId(revertedNftChainId)) == false);

      await expect(
        contractERC721Registry.tag(
          hashtagId,
          contractERC721Mock.address,
          hashtagId,
          accountHashtagPublisher.address,
          accountTagger.address,
          revertedNftChainId,
          { value: utils.parseEther("1") },
        ),
      ).to.be.revertedWith("Tag: Tagging target chain not permitted");
    });
  });

  //describe("Drawing down", async function () {
  //  beforeEach(async function () {
  //    await this.hashtagProtocol
  //      .connect(accountTagger)
  //      .mint("#kittycat", accountHashtagPublisher.address, accountTagger.address, {
  //        value: utils.parseEther("1"),
  //      });
  //    hashtagId = await this.hashtagProtocol.hashtagToTokenId("#kittycat");
  //
  //    const nftOneId = constants.One;
  //    await contractERC721Registry
  //      .connect(accountTagger)
  //      .tag(
  //        hashtagId,
  //        contractERC721Mock.address,
  //        nftOneId,
  //        accountHashtagPublisher.address,
  //        accountTagger.address,
  //        nftChainId,
  //        { value: utils.parseEther("0.01") }
  //      );
  //  });
  //
  //  it("Can draw down on behalf of the platform", async function () {
  //    const platformBalanceBefore = await platform.getBalance();
  //    await contractERC721Registry.connect(accountTagger).drawDown(accountHashtagPlatform.address);
  //    const platformBalanceAfter = await platform.getBalance();
  //
  //    expect(platformBalanceAfter.sub(platformBalanceBefore)).to.be.equal(
  //      utils.parseEther("0.002")
  //    );
  //  });
  //
  //  it("Can draw down as the platform", async function () {
  //    const platformBalanceBefore = await platform.getBalance();
  //    await contractERC721Registry.connect(platform).drawDown(accountHashtagPlatform.address);
  //    const platformBalanceAfter = await platform.getBalance();
  //
  //    expect(platformBalanceAfter.sub(platformBalanceBefore)).to.be.equal(
  //      utils.parseEther("0.002")
  //    );
  //  });
  //
  //  it("Does nothing after a double draw down", async function () {
  //    const platformBalanceBefore = await platform.getBalance();
  //    await contractERC721Registry.connect(accountTagger).drawDown(accountHashtagPlatform.address);
  //    const platformBalanceAfter = await platform.getBalance();
  //
  //    expect(platformBalanceAfter.sub(platformBalanceBefore)).to.be.equal(
  //      utils.parseEther("0.002")
  //    );
  //
  //    const balanceBeforeSecondDraw = await accountHashtagPlatform.getBalance();
  //    await contractERC721Registry
  //      .connect(accountTagger)
  //      .drawDown(accountHashtagPlatform.address);
  //    const balanceAfterSecondDraw = await accountHashtagPlatform.getBalance();
  //
  //    expect(balanceAfterSecondDraw.sub(balanceBeforeSecondDraw)).to.be.equal(
  //      "0"
  //    );
  //  });
  //});

  //describe("Updating percentages", async function () {
  //  it("Reverts if not admin", async function () {
  //    const { contractERC721Registry, accountTagger } = await setup("drawdown");
  //    await expect(
  //      contractERC721Registry.connect(accountTagger).updatePercentages(10, 10)
  //    ).to.be.revertedWith("Caller must be admin");
  //  });
  //
  //  it("Reverts if greater than 100", async function () {
  //    const { contractERC721Registry, accountHashtagAdmin } = await setup(
  //      "drawdown"
  //    );
  //    await expect(
  //      contractERC721Registry
  //        .connect(accountHashtagAdmin)
  //        .updatePercentages(90, 11)
  //    ).to.be.revertedWith(
  //      "ERC721HashtagRegistry.updatePercentages: percentages must not be over 100"
  //    );
  //  });
  //
  //  it("With correct credentials can update percentages", async function () {
  //    const { contractERC721Registry, accountHashtagAdmin } = await setup(
  //      "drawdown"
  //    );
  //    await contractERC721Registry
  //      .connect(accountHashtagAdmin)
  //      .updatePercentages(30, 20);
  //
  //    expect(await contractERC721Registry.platformPercentage()).to.be.equal(30);
  //    expect(await contractERC721Registry.publisherPercentage()).to.be.equal(
  //      20
  //    );
  //    expect(await contractERC721Registry.remainingPercentage()).to.be.equal(
  //      50
  //    );
  //  });
  //});
});
