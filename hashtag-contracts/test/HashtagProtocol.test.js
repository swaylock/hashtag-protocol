const { ethers, deployments } = require("hardhat");
const { expect } = require("chai");

const { BigNumber, constants } = ethers;

// we create a setup function that can be called by every test and setup variable for easy to read tests
async function setup(type) {
  // it first ensure the deployment is executed and reset (use of evm_snapshot for fast test)
  await deployments.fixture(["HashtagProtocol", "HashtagAccessControls"]);

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
    accountCreator: unnamedAccounts[3],
  };

  // Get an instantiated contracts in the form of a ethers.js Contract instances:
  const contracts = {
    contractAccessControls: await ethers.getContract("HashtagAccessControls"),
    contractHashtagProtocol: await ethers.getContract("HashtagProtocol"),
  };

  // Create a few pre-loaded Hashtags for renew/reset tests,
  // but only when we need them.
  let lastTransferTime;
  if (type == "renew") {
    const tokenId = constants.One;
    await contracts.contractHashtagProtocol
      .connect(accounts.accountRandomTwo)
      .mint(
        "#BlockRocket",
        accounts.accountHashtagPublisher.address,
        accounts.accountCreator.address
      );

    // This sets the last transfer time for all tests to now
    // accountHashtagPlatform is owner of new hashtags.
    await contracts.contractHashtagProtocol
      .connect(accounts.accountHashtagPlatform)
      .renewHashtag(tokenId);
    lastTransferTime = await contracts.contractHashtagProtocol.tokenIdToLastTransferTime(
      tokenId
    );
  }

  return {
    ...contracts,
    ...accounts,
    lastTransferTime,
  };
}

describe("HashtagProtocol Tests", function () {
  describe("Validate setup", async function () {
    it("should have name and symbol", async function () {
      const { contractHashtagProtocol, accountHashtagPlatform } = await setup();
      expect(await contractHashtagProtocol.name()).to.be.equal(
        "Hashtag Protocol"
      );
      expect(await contractHashtagProtocol.symbol()).to.be.equal("HASHTAG");
      expect(await contractHashtagProtocol.platform()).to.be.equal(
        accountHashtagPlatform.address
      );
    });
    it("should have default configs", async function () {
      const { contractHashtagProtocol } = await setup();
      expect(await contractHashtagProtocol.ownershipTermLength()).to.be.equal(
        "63072000"
      );
    });
  });

  describe("Minting hashtags", async function () {
    describe("Validation", function () {
      const accountRandomTwoHashtag = "asupersupersupersupersuperlonghashtag";

      it("should revert if exists (case-insensitive)", async function () {
        const {
          contractHashtagProtocol,
          accountHashtagPublisher,
          accountCreator,
        } = await setup();
        await contractHashtagProtocol
          .connect(accountHashtagPublisher)
          .mint(
            "#blockrocket",
            accountHashtagPublisher.address,
            accountCreator.address
          );

        await expect(
          contractHashtagProtocol
            .connect(accountHashtagPublisher)
            .mint(
              "#BlockRocket",
              accountHashtagPublisher.address,
              accountCreator.address
            )
        ).to.be.revertedWith("Hashtag validation: Hashtag already owned.");
      });

      it("should revert if hashtag does not meet min length requirements", async function () {
        const {
          contractHashtagProtocol,
          accountHashtagPublisher,
          accountCreator,
        } = await setup();
        const hashtagMinStringLength = await contractHashtagProtocol.hashtagMinStringLength();

        const shortHashtag =
          "#" +
          accountRandomTwoHashtag.substring(0, hashtagMinStringLength - 2);
        await expect(
          contractHashtagProtocol
            .connect(accountHashtagPublisher)
            .mint(
              shortHashtag,
              accountHashtagPublisher.address,
              accountCreator.address
            )
        ).to.be.revertedWith(
          `Invalid format: Hashtag must not exceed length requirements`
        );
      });

      it("should revert if hashtag does not meet max length requirements", async function () {
        const {
          contractHashtagProtocol,
          accountHashtagPublisher,
          accountCreator,
        } = await setup();
        const hashtagMaxStringLength = await contractHashtagProtocol.hashtagMaxStringLength();
        const longHashtag =
          "#" + accountRandomTwoHashtag.substring(0, hashtagMaxStringLength);
        await expect(
          contractHashtagProtocol
            .connect(accountHashtagPublisher)
            .mint(
              longHashtag,
              accountHashtagPublisher.address,
              accountCreator.address
            )
        ).to.be.revertedWith(
          `Invalid format: Hashtag must not exceed length requirements`
        );
      });

      it("should revert if hashtag has an invalid character", async function () {
        const {
          contractHashtagProtocol,
          accountHashtagPublisher,
          accountCreator,
        } = await setup();
        const invalidHashtag = "#x_art";
        await expect(
          contractHashtagProtocol
            .connect(accountHashtagPublisher)
            .mint(
              invalidHashtag,
              accountHashtagPublisher.address,
              accountCreator.address
            )
        ).to.be.revertedWith(
          "Invalid character found: Hashtag may only contain characters A-Z, a-z, 0-9 and #"
        );
      });

      it("should revert if does not start with #", async function () {
        const {
          contractHashtagProtocol,
          accountHashtagPublisher,
          accountCreator,
        } = await setup();
        const invalidHashtag = "ART";
        await expect(
          contractHashtagProtocol
            .connect(accountHashtagPublisher)
            .mint(
              invalidHashtag,
              accountHashtagPublisher.address,
              accountCreator.address
            )
        ).to.be.revertedWith("Must start with #");
      });

      it("should revert if hashtag after first char", async function () {
        const {
          contractHashtagProtocol,
          accountHashtagPublisher,
          accountCreator,
        } = await setup();
        const invalidHashtag = "#Hash#";
        await expect(
          contractHashtagProtocol
            .connect(accountHashtagPublisher)
            .mint(
              invalidHashtag,
              accountHashtagPublisher.address,
              accountCreator.address
            )
        ).to.be.revertedWith(
          "Invalid character found: Hashtag may only contain characters A-Z, a-z, 0-9 and #"
        );
      });

      it("should revert if the hashtag does not have a single alpha char", async function () {
        const {
          contractHashtagProtocol,
          accountHashtagPublisher,
          accountCreator,
        } = await setup();
        const invalidHashtag = "#420";
        await expect(
          contractHashtagProtocol
            .connect(accountHashtagPublisher)
            .mint(
              invalidHashtag,
              accountHashtagPublisher.address,
              accountCreator.address
            )
        ).to.be.revertedWith(
          "Invalid format: Hashtag must contain at least 1 alphabetic character."
        );
      });

      it("should allow a mix of upper and lowercase characters", async function () {
        const {
          contractHashtagProtocol,
          accountHashtagPublisher,
          accountCreator,
        } = await setup();
        await contractHashtagProtocol
          .connect(accountHashtagPublisher)
          .mint(
            "#Awesome123",
            accountHashtagPublisher.address,
            accountCreator.address
          );
      });
    });

    it("should mint", async function () {
      const {
        contractHashtagProtocol,
        accountHashtagPublisher,
        accountRandomTwo,
        accountCreator,
      } = await setup();

      expect(await contractHashtagProtocol.tokenPointer()).to.be.equal("0");

      const hashtag = "#BlockRocket";
      const lowerHashtag = "#blockrocket";

      await contractHashtagProtocol
        .connect(accountRandomTwo)
        .mint(hashtag, accountHashtagPublisher.address, accountCreator.address);

      expect(await contractHashtagProtocol.tokenPointer()).to.be.equal("1");
      expect(
        await contractHashtagProtocol.hashtagToTokenId(lowerHashtag)
      ).to.be.equal("1");
      expect(await contractHashtagProtocol.exists(BigNumber.from("1"))).to.be
        .true;

      const hashtagData = await contractHashtagProtocol.tokenIdToHashtag("1");
      expect(hashtagData.displayVersion.toLowerCase()).to.be.equal(
        lowerHashtag
      );
      expect(hashtagData.displayVersion).to.be.equal(hashtag);
      expect(hashtagData.originalPublisher).to.be.equal(
        accountHashtagPublisher.address
      );
      expect(hashtagData.creator).to.be.equal(accountCreator.address);
    });

    it("should mint from owner without fee", async function () {
      const {
        contractHashtagProtocol,
        accountHashtagPlatform,
        accountHashtagPublisher,
        accountCreator,
      } = await setup();
      await contractHashtagProtocol.connect(accountHashtagPlatform);

      expect(await contractHashtagProtocol.tokenPointer()).to.be.equal("0");

      await contractHashtagProtocol.mint(
        "#blockrocket",
        accountHashtagPublisher.address,
        accountCreator.address
      );

      expect(await contractHashtagProtocol.tokenPointer()).to.be.equal("1");
      expect(
        await contractHashtagProtocol.hashtagToTokenId("#blockrocket")
      ).to.be.equal("1");
      const hashtagData = await contractHashtagProtocol.tokenIdToHashtag("1");

      expect(hashtagData.displayVersion.toLowerCase()).to.be.equal(
        "#blockrocket"
      );
      expect(hashtagData.originalPublisher).to.be.equal(
        accountHashtagPublisher.address
      );
    });

    it("should revert if the publisher is not whitelisted", async function () {
      const {
        contractHashtagProtocol,
        accountHashtagPlatform,
        accountRandomTwo,
        accountCreator,
      } = await setup();
      await expect(
        contractHashtagProtocol
          .connect(accountHashtagPlatform)
          .mint(
            "#blockrocket",
            accountRandomTwo.address,
            accountCreator.address
          )
      ).to.be.revertedWith("Mint: The publisher must be whitelisted");
    });
  });

  describe("Platform", async function () {
    it("should be able to set platform as owner", async function () {
      const {
        contractHashtagProtocol,
        accountHashtagPlatform,
        accountHashtagAdmin,
        accountRandomOne,
      } = await setup();
      expect(await contractHashtagProtocol.platform()).to.be.equal(
        accountHashtagPlatform.address
      );

      await contractHashtagProtocol
        .connect(accountHashtagAdmin)
        .setPlatform(accountRandomOne.address);

      expect(await contractHashtagProtocol.platform()).to.be.equal(
        accountRandomOne.address
      );
    });

    it("should revert if not owner", async function () {
      const {
        contractHashtagProtocol,
        accountBuyer,
        accountRandomOne,
      } = await setup();
      await expect(
        contractHashtagProtocol
          .connect(accountBuyer)
          .setPlatform(accountRandomOne.address)
      ).to.be.revertedWith("Caller must be admin");
    });

    it("should update access controls", async function () {
      const {
        contractHashtagProtocol,
        accountHashtagAdmin,
        accountRandomTwo,
      } = await setup();
      await contractHashtagProtocol
        .connect(accountHashtagAdmin)
        .updateAccessControls(accountRandomTwo.address);
      expect(await contractHashtagProtocol.accessControls()).to.be.equal(
        accountRandomTwo.address
      );

      await expect(
        contractHashtagProtocol
          .connect(accountRandomTwo)
          .updateAccessControls(accountRandomTwo.address)
      ).to.be.reverted;
    });

    it("should revert when updating access controls to zero address", async function () {
      const { contractHashtagProtocol, accountHashtagAdmin } = await setup();
      await expect(
        contractHashtagProtocol
          .connect(accountHashtagAdmin)
          .updateAccessControls(constants.AddressZero)
      ).to.be.revertedWith(
        "HashtagProtocol.updateAccessControls: Cannot be zero"
      );
    });
  });

  describe("Metadata", async function () {
    it("should return tokenUri", async function () {
      const {
        contractHashtagProtocol,
        accountHashtagPublisher,
        accountHashtagAdmin,
        accountRandomTwo,
        accountCreator,
      } = await setup();
      const tokenId = constants.One;
      await contractHashtagProtocol
        .connect(accountRandomTwo)
        .mint(
          "#BlockRocket",
          accountHashtagPublisher.address,
          accountCreator.address
        );

      expect(await contractHashtagProtocol.tokenURI(tokenId)).to.be.equal(
        "https://api.hashtag-protocol.io/1"
      );

      await contractHashtagProtocol
        .connect(accountHashtagAdmin)
        .setBaseURI("hashtag.io/");

      expect(await contractHashtagProtocol.tokenURI(tokenId)).to.be.equal(
        `hashtag.io/${tokenId}`
      );
    });
  });

  describe("renewing a hashtag", async function () {
    const tokenId = constants.One;

    it("will fail if not the owner", async function () {
      const { contractHashtagProtocol, accountRandomTwo } = await setup(
        "renew"
      );

      await expect(
        contractHashtagProtocol.connect(accountRandomTwo).renewHashtag(tokenId)
      ).to.be.revertedWith("renewHashtag: Invalid sender");
    });

    it("will fail if token does not exist", async function () {
      const { contractHashtagProtocol, accountRandomTwo } = await setup(
        "renew"
      );
      await expect(
        contractHashtagProtocol
          .connect(accountRandomTwo)
          .renewHashtag(constants.Two)
      ).to.be.revertedWith("ERC721_ZERO_OWNER");
    });

    it("can be reset before renewal period has passed", async function () {
      const {
        contractHashtagProtocol,
        accountHashtagPlatform,
        lastTransferTime,
      } = await setup("renew");
      const lastRenewTime = Number(lastTransferTime.toString());

      let blockNum = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNum);
      let timestamp = block.timestamp;

      // Verify current block timestamp and last renewTime are equal.
      expect(timestamp).to.be.equal(lastRenewTime);

      // Advance current time by 30 days less than ownershipTermLength (2 years).
      const thirtyDays = 30 * 24 * 60 * 60;
      let advanceTime = lastTransferTime.add(
        (await contractHashtagProtocol.ownershipTermLength()) - thirtyDays
      );

      advanceTime = Number(advanceTime.toString());

      await ethers.provider.send("evm_increaseTime", [advanceTime]);
      await ethers.provider.send("evm_mine");

      // Renew the hashtag again.
      await expect(
        contractHashtagProtocol
          .connect(accountHashtagPlatform)
          .renewHashtag(tokenId)
      )
        .to.emit(contractHashtagProtocol, "HashtagRenewed")
        .withArgs(tokenId, accountHashtagPlatform.address);

      // check timestamp has increased
      blockNum = await ethers.provider.getBlockNumber();
      block = await ethers.provider.getBlock(blockNum);
      timestamp = block.timestamp;

      let newRenewTime = await contractHashtagProtocol.tokenIdToLastTransferTime(
        tokenId
      );

      newRenewTime = Number(newRenewTime.toString());
      expect(newRenewTime).to.be.equal(timestamp);
      // Check that newRenewTime is equal to lastRenewTime + 1year + 1microsecond.
      expect(newRenewTime).to.be.equal(lastRenewTime + advanceTime + 1);
    });

    it("once reset, last transfer time reset", async function () {
      const {
        contractHashtagProtocol,
        accountHashtagPlatform,
        lastTransferTime,
      } = await setup("renew");
      // increase by 2 years and 30 days
      const thirtyDays = 30 * 24 * 60 * 60;
      let advanceTime = lastTransferTime.add(
        (await contractHashtagProtocol.ownershipTermLength()) + thirtyDays
      );
      advanceTime = Number(advanceTime.toString());
      // Advance current block time by ownership length (2 years) + 1 day.
      await ethers.provider.send("evm_increaseTime", [advanceTime]);
      await ethers.provider.send("evm_mine");
      await expect(
        contractHashtagProtocol
          .connect(accountHashtagPlatform)
          .renewHashtag(tokenId)
      )
        .to.emit(contractHashtagProtocol, "HashtagRenewed")
        .withArgs(tokenId, accountHashtagPlatform.address);
      let newRenewTime = await contractHashtagProtocol.tokenIdToLastTransferTime(
        tokenId
      );
      newRenewTime = Number(newRenewTime.toString());
      const lastRenewTime = Number(lastTransferTime.toString());
      expect(newRenewTime).to.be.equal(lastRenewTime + advanceTime + 1);
    });
  });

  describe("Admin functions", async function () {
    it("should be able to set hashtag length as admin", async function () {
      const {
        contractHashtagProtocol,
        contractAccessControls,
        accountHashtagAdmin,
      } = await setup();
      expect(
        await contractAccessControls.isAdmin(accountHashtagAdmin.address)
      ).to.be.equal(true);

      const currentMaxLength = await contractHashtagProtocol.hashtagMaxStringLength();
      expect(currentMaxLength).to.be.equal(32);

      await contractHashtagProtocol
        .connect(accountHashtagAdmin)
        .setHashtagMaxStringLength(64);

      const newMaxLength = await contractHashtagProtocol.hashtagMaxStringLength();
      expect(newMaxLength).to.be.equal(64);
    });

    it("should revert if setting hashtag length if not admin", async function () {
      const { contractHashtagProtocol, accountBuyer } = await setup();
      await expect(
        contractHashtagProtocol
          .connect(accountBuyer)
          .setHashtagMaxStringLength(55)
      ).to.be.revertedWith("Caller must be admin");
    });
  });

  describe("Recycling a hashtag", async function () {
    const tokenId = constants.One;

    it("will fail if token does not exist", async function () {
      const { contractHashtagProtocol, accountRandomTwo } = await setup(
        "renew"
      );
      await expect(
        contractHashtagProtocol
          .connect(accountRandomTwo)
          .recycleHashtag(constants.Two)
      ).to.be.revertedWith("recycleHashtag: Invalid token ID");
    });

    it("will fail if already owned by the platform", async function () {
      const { contractHashtagProtocol, accountHashtagPlatform } = await setup(
        "renew"
      );
      await expect(
        contractHashtagProtocol
          .connect(accountHashtagPlatform)
          .recycleHashtag(tokenId)
      ).to.be.revertedWith("recycleHashtag: Already owned by the platform");
    });

    it("will fail if token not not eligible yet", async function () {
      const {
        contractHashtagProtocol,
        accountHashtagPlatform,
        accountRandomTwo,
      } = await setup("renew");
      // Transfer the token to a accountRandomTwo owner.
      await contractHashtagProtocol
        .connect(accountHashtagPlatform)
        .transferFrom(
          accountHashtagPlatform.address,
          accountRandomTwo.address,
          tokenId
        );

      // Advance current blocktime by 30 days less than ownershipTermLength (2 years).
      const thirtyDays = 30 * 24 * 60 * 60;
      let advanceTime =
        (await contractHashtagProtocol.ownershipTermLength()) - thirtyDays;
      await ethers.provider.send("evm_increaseTime", [advanceTime]);
      await ethers.provider.send("evm_mine");

      // Attempt to recycle by accountRandomTwo address, should fail.
      await expect(
        contractHashtagProtocol
          .connect(accountRandomTwo)
          .recycleHashtag(tokenId)
      ).to.be.revertedWith(
        "recycleHashtag: Token not eligible for recycling yet"
      );
    });

    it("will succeed once renewal period has passed", async function () {
      const {
        contractHashtagProtocol,
        accountHashtagPlatform,
        accountRandomTwo,
        accountRandomOne,
        lastTransferTime,
      } = await setup("renew");

      // Transfer HASHTAG to accountRandomTwo address, simulating ownership.
      await contractHashtagProtocol
        .connect(accountHashtagPlatform)
        .transferFrom(
          accountHashtagPlatform.address,
          accountRandomTwo.address,
          tokenId
        );

      // Advance current time by 30 days more than ownershipTermLength (2 years).
      const thirtyDays = 30 * 24 * 60 * 60;
      let advanceTime = lastTransferTime.add(
        (await contractHashtagProtocol.ownershipTermLength()) + thirtyDays
      );
      advanceTime = Number(advanceTime.toString());
      await ethers.provider.send("evm_increaseTime", [advanceTime]);
      await ethers.provider.send("evm_mine");

      // Now attempt to recycle hashtag as accountRandomOne accountRandomTwo address.
      // This is to simulate owner missing their window to recycle
      // and accountRandomOne perspective owner wanting to recycle the token.
      await expect(
        contractHashtagProtocol
          .connect(accountRandomOne)
          .recycleHashtag(tokenId)
      )
        .to.emit(contractHashtagProtocol, "HashtagReset")
        .withArgs(tokenId, accountRandomOne.address);

      // check timestamp has increased
      const newTransferTime = await contractHashtagProtocol.tokenIdToLastTransferTime(
        tokenId
      );

      expect(Number(BigNumber.from(newTransferTime))).to.be.greaterThan(
        Number(lastTransferTime.toString())
      );
      // platform now once again owns the token
      expect(await contractHashtagProtocol.ownerOf(tokenId)).to.be.equal(
        accountHashtagPlatform.address
      );
    });

    it("when being recycled by the platform, the platforms balance does not increase and the owners balance decreases", async function () {
      const {
        contractHashtagProtocol,
        accountHashtagPlatform,
        accountRandomTwo,
        lastTransferTime,
      } = await setup("renew");

      expect(
        (
          await contractHashtagProtocol.balanceOf(
            accountHashtagPlatform.address
          )
        ).toString()
      ).to.be.equal("0");

      // Transfer HASHTAG to accountRandomTwo address.
      await contractHashtagProtocol
        .connect(accountHashtagPlatform)
        .transferFrom(
          accountHashtagPlatform.address,
          accountRandomTwo.address,
          tokenId
        );

      // balances changed - platform stays at zero
      expect(
        (
          await contractHashtagProtocol.balanceOf(
            accountHashtagPlatform.address
          )
        ).toString()
      ).to.be.equal("0");

      expect(
        (
          await contractHashtagProtocol.balanceOf(accountRandomTwo.address)
        ).toString()
      ).to.be.equal("1");

      // Advance current time by 30 days more than ownershipTermLength (2 years).
      const thirtyDays = 30 * 24 * 60 * 60;
      let advanceTime = lastTransferTime.add(
        (await contractHashtagProtocol.ownershipTermLength()) + thirtyDays
      );
      advanceTime = Number(advanceTime.toString());
      await ethers.provider.send("evm_increaseTime", [advanceTime]);
      await ethers.provider.send("evm_mine");

      // Recycle the hashtag as current owner.
      await expect(
        contractHashtagProtocol
          .connect(accountRandomTwo)
          .recycleHashtag(tokenId)
      )
        .to.emit(contractHashtagProtocol, "HashtagReset")
        .withArgs(tokenId, accountRandomTwo.address);

      // Check that transfer time has increased
      const newTransferTime = await contractHashtagProtocol.tokenIdToLastTransferTime(
        tokenId
      );
      expect(Number(BigNumber.from(newTransferTime))).to.be.greaterThan(
        Number(lastTransferTime.toString())
      );

      // both balances back to zero
      expect(
        (
          await contractHashtagProtocol.balanceOf(
            accountHashtagPlatform.address
          )
        ).toString()
      ).to.be.equal("0");
      expect(
        (
          await contractHashtagProtocol.balanceOf(accountRandomTwo.address)
        ).toString()
      ).to.be.equal("0");
    });
  });
});
