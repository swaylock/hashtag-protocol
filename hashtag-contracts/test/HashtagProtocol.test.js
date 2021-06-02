/* eslint-env mocha */
const { time, expectEvent } = require("@openzeppelin/test-helpers");
const web3 = require("web3");
const { expect } = require("chai");

const { utils, BigNumber, constants } = ethers;

describe("HashtagProtocol Tests", function () {
  let platform, platformAddress, publisher, publisherAddress;
  let buyer,
    buyerAddress,
    anotherAddress,
    another,
    random,
    randomAddress,
    creator,
    creatorAddress;

  beforeEach(async function () {
    const accounts = await ethers.getSigners();

    platform = accounts[0];
    platformAddress = await accounts[0].getAddress();
    publisher = accounts[1];
    publisherAddress = await accounts[1].getAddress();
    buyer = accounts[4];
    buyerAddress = await accounts[4].getAddress();
    another = accounts[5];
    anotherAddress = await accounts[5].getAddress();
    random = accounts[6];
    randomAddress = await accounts[6].getAddress();
    creator = accounts[7];
    creatorAddress = await accounts[7].getAddress();

    const HashtagAccessControls = await ethers.getContractFactory(
      "HashtagAccessControls"
    );
    const HashtagProtocol = await ethers.getContractFactory("HashtagProtocol");

    this.accessControls = await HashtagAccessControls.deploy();
    this.hashtagProtocol = await HashtagProtocol.deploy(
      this.accessControls.address,
      platformAddress
    );

    // add a publisher to the protocol
    await this.accessControls.grantRole(
      web3.utils.sha3("PUBLISHER"),
      publisherAddress
    );
  });

  describe("Validate setup", async function () {
    it("should have name and symbol", async function () {
      expect(await this.hashtagProtocol.name()).to.be.equal("Hashtag Protocol");
      expect(await this.hashtagProtocol.symbol()).to.be.equal("HASHTAG");
      expect(await this.hashtagProtocol.platform()).to.be.equal(
        platformAddress
      );
    });
    it("should have default configs", async function () {
      expect(await this.hashtagProtocol.ownershipTermLength()).to.be.equal(
        "63072000"
      );
    });
  });

  describe("Minting hashtags", async function () {
    describe("Validation", function () {
      const randomHashtag = "asupersupersupersupersuperlonghashtag";

      it("should revert if exists (case-insensitive)", async function () {
        await this.hashtagProtocol
          .connect(publisher)
          .mint("#blockrocket", publisherAddress, creatorAddress);

        await expect(
          this.hashtagProtocol
            .connect(publisher)
            .mint("#BlockRocket", publisherAddress, creatorAddress)
        ).to.be.revertedWith("Hashtag validation: Hashtag already owned.");
      });

      it("should revert if hashtag does not meet min length requirements", async function () {
        const hashtagMinStringLength = await this.hashtagProtocol.hashtagMinStringLength();

        const shortHashtag =
          "#" + randomHashtag.substring(0, hashtagMinStringLength - 2);
        await expect(
          this.hashtagProtocol
            .connect(publisher)
            .mint(shortHashtag, publisherAddress, creatorAddress)
        ).to.be.revertedWith(
          `Invalid format: Hashtag must not exceed length requirements`
        );
      });

      it("should revert if hashtag does not meet max length requirements", async function () {
        const hashtagMaxStringLength = await this.hashtagProtocol.hashtagMaxStringLength();

        const longHashtag =
          "#" + randomHashtag.substring(0, hashtagMaxStringLength);
        await expect(
          this.hashtagProtocol
            .connect(publisher)
            .mint(longHashtag, publisherAddress, creatorAddress)
        ).to.be.revertedWith(
          `Invalid format: Hashtag must not exceed length requirements`
        );
      });

      it("should revert if hashtag has an invalid character", async function () {
        const invalidHashtag = "#x_art";
        await expect(
          this.hashtagProtocol
            .connect(publisher)
            .mint(invalidHashtag, publisherAddress, creatorAddress)
        ).to.be.revertedWith(
          "Invalid character found: Hashtag may only contain characters A-Z, a-z, 0-9 and #"
        );
      });

      it("should revert if does not start with #", async function () {
        const invalidHashtag = "ART";
        await expect(
          this.hashtagProtocol
            .connect(publisher)
            .mint(invalidHashtag, publisherAddress, creatorAddress)
        ).to.be.revertedWith("Must start with #");
      });

      it("should revert if hashtag after first char", async function () {
        const invalidHashtag = "#Hash#";
        await expect(
          this.hashtagProtocol
            .connect(publisher)
            .mint(invalidHashtag, publisherAddress, creatorAddress)
        ).to.be.revertedWith(
          "Invalid character found: Hashtag may only contain characters A-Z, a-z, 0-9 and #"
        );
      });

      it("should revert if the hashtag does not have a single alpha char", async function () {
        const invalidHashtag = "#420";
        await expect(
          this.hashtagProtocol
            .connect(publisher)
            .mint(invalidHashtag, publisherAddress, creatorAddress)
        ).to.be.revertedWith(
          "Invalid format: Hashtag must contain at least 1 alphabetic character."
        );
      });

      it("should allow a mix of upper and lowercase characters", async function () {
        await this.hashtagProtocol
          .connect(publisher)
          .mint("#Awesome123", publisherAddress, creatorAddress);
      });
    });

    it("should mint", async function () {
      expect(await this.hashtagProtocol.tokenPointer()).to.be.equal("0");

      const hashtag = "#BlockRocket";
      const lowerHashtag = "#blockrocket";

      await this.hashtagProtocol
        .connect(random)
        .mint(hashtag, publisherAddress, creatorAddress);

      expect(await this.hashtagProtocol.tokenPointer()).to.be.equal("1");
      expect(
        await this.hashtagProtocol.hashtagToTokenId(lowerHashtag)
      ).to.be.equal("1");
      expect(await this.hashtagProtocol.exists(BigNumber.from("1"))).to.be.true;

      const hashtagData = await this.hashtagProtocol.tokenIdToHashtag("1");
      expect(hashtagData.displayVersion.toLowerCase()).to.be.equal(
        lowerHashtag
      );
      expect(hashtagData.displayVersion).to.be.equal(hashtag);
      expect(hashtagData.originalPublisher).to.be.equal(publisherAddress);
      expect(hashtagData.creator).to.be.equal(creatorAddress);
    });

    it("should mint from owner without fee", async function () {
      await this.hashtagProtocol.connect(platform);

      expect(await this.hashtagProtocol.tokenPointer()).to.be.equal("0");

      await this.hashtagProtocol.mint(
        "#blockrocket",
        publisherAddress,
        creatorAddress
      );

      expect(await this.hashtagProtocol.tokenPointer()).to.be.equal("1");
      expect(
        await this.hashtagProtocol.hashtagToTokenId("#blockrocket")
      ).to.be.equal("1");
      const hashtagData = await this.hashtagProtocol.tokenIdToHashtag("1");

      expect(hashtagData.displayVersion.toLowerCase()).to.be.equal(
        "#blockrocket"
      );
      expect(hashtagData.originalPublisher).to.be.equal(publisherAddress);
    });

    it("should revert if the publisher is not whitelisted", async function () {
      await expect(
        this.hashtagProtocol
          .connect(platform)
          .mint("#blockrocket", randomAddress, creatorAddress)
      ).to.be.revertedWith("Mint: The publisher must be whitelisted");
    });
  });

  describe("Platform", async function () {
    it("should be able to set platform as owner", async function () {
      expect(await this.hashtagProtocol.platform()).to.be.equal(
        platformAddress
      );

      await this.hashtagProtocol.connect(platform).setPlatform(anotherAddress);

      expect(await this.hashtagProtocol.platform()).to.be.equal(anotherAddress);
    });

    it("should revert if not owner", async function () {
      await expect(
        this.hashtagProtocol.connect(buyer).setPlatform(anotherAddress)
      ).to.be.revertedWith("Caller must be admin");
    });

    it("should update access controls", async function () {
      await this.hashtagProtocol
        .connect(platform)
        .updateAccessControls(randomAddress);
      expect(await this.hashtagProtocol.accessControls()).to.be.equal(
        randomAddress
      );

      await expect(
        this.hashtagProtocol.connect(random).updateAccessControls(randomAddress)
      ).to.be.reverted;
    });

    it("should revert when updating access controls to zero address", async function () {
      await expect(
        this.hashtagProtocol
          .connect(platform)
          .updateAccessControls(constants.AddressZero)
      ).to.be.revertedWith(
        "HashtagProtocol.updateAccessControls: Cannot be zero"
      );
    });
  });

  describe("Metadata", async function () {
    it("should return tokenUri", async function () {
      const tokenId = constants.One;
      await this.hashtagProtocol
        .connect(random)
        .mint("#BlockRocket", publisherAddress, creatorAddress);

      expect(await this.hashtagProtocol.tokenURI(tokenId)).to.be.equal(
        "https://api.hashtag-protocol.io/1"
      );

      await this.hashtagProtocol.connect(platform).setBaseURI("hashtag.io/");

      expect(await this.hashtagProtocol.tokenURI(tokenId)).to.be.equal(
        `hashtag.io/${tokenId}`
      );
    });
  });

  describe("renewing a hashtag", async function () {
    const tokenId = constants.One;

    beforeEach(async function () {
      await this.hashtagProtocol
        .connect(random)
        .mint("#BlockRocket", publisherAddress, creatorAddress);

      // platform owns minted before auction
      expect(await this.hashtagProtocol.ownerOf(tokenId)).to.be.equal(
        platformAddress
      );

      // check token one is minted
      const hashtagData = await this.hashtagProtocol.tokenIdToHashtag(tokenId);
      expect(hashtagData.displayVersion.toLowerCase()).to.be.equal(
        "#blockrocket"
      );

      // this sets the last transfer time to now
      await this.hashtagProtocol.connect(platform).renewHashtag(tokenId);
      this.lastTransferTime = await this.hashtagProtocol.tokenIdToLastTransferTime(
        tokenId
      );
    });

    it("will fail if not the owner", async function () {
      await expect(
        this.hashtagProtocol.connect(random).renewHashtag(tokenId)
      ).to.be.revertedWith("renewHashtag: Invalid sender");
    });

    it("will fail if token does not exist", async function () {
      await expect(
        this.hashtagProtocol.connect(random).renewHashtag(constants.Two)
      ).to.be.revertedWith("ERC721_ZERO_OWNER");
    });

    it("can be reset before renewal period has passed", async function () {
      // increase by 1 year
      const target = this.lastTransferTime.add(
        BigNumber.from(time.duration.years(1).toString())
      );
      await time.increaseTo(target.toString());

      await expect(this.hashtagProtocol.connect(platform).renewHashtag(tokenId))
        .to.emit(this.hashtagProtocol, "HashtagRenewed")
        .withArgs(tokenId, platformAddress);

      // check timestamp has increased
      const lastTransferTime = await this.hashtagProtocol.tokenIdToLastTransferTime(
        tokenId
      );
      expect(Number(BigNumber.from(lastTransferTime))).to.be.greaterThan(
        Number(this.lastTransferTime.toString())
      );
    });

    it("once reset, last transfer time reset", async function () {
      // increase by 2 years and 1 days
      const target = this.lastTransferTime
        .add(await this.hashtagProtocol.ownershipTermLength())
        .add(BigNumber.from(time.duration.days(1).toString()));
      await time.increaseTo(target.toString());

      await expect(this.hashtagProtocol.connect(platform).renewHashtag(tokenId))
        .to.emit(this.hashtagProtocol, "HashtagRenewed")
        .withArgs(tokenId, platformAddress);

      // check timestamp has increased
      const lastTransferTime = await this.hashtagProtocol.tokenIdToLastTransferTime(
        tokenId
      );
      expect(Number(BigNumber.from(lastTransferTime))).to.be.greaterThan(
        Number(this.lastTransferTime.toString())
      );
    });
  });

  describe("Admin functions", async function () {
    it("should be able to set hashtag length as admin", async function () {
      expect(await this.accessControls.isAdmin(platformAddress)).to.be.equal(
        true
      );

      const currentMaxLength = await this.hashtagProtocol.hashtagMaxStringLength();
      expect(currentMaxLength).to.be.equal(32);

      await this.hashtagProtocol
        .connect(platform)
        .setHashtagMaxStringLength(64);

      const newMaxLength = await this.hashtagProtocol.hashtagMaxStringLength();
      expect(newMaxLength).to.be.equal(64);
    });

    it("should revert if setting hashtag length if not admin", async function () {
      await expect(
        this.hashtagProtocol.connect(buyer).setHashtagMaxStringLength(55)
      ).to.be.revertedWith("Caller must be admin");
    });
  });

  describe("resetting a hashtag", async function () {
    const tokenId = constants.One;

    beforeEach(async function () {
      await this.hashtagProtocol
        .connect(random)
        .mint("#BlockRocket", publisherAddress, creatorAddress);

      // platform owns minted before auction
      expect(await this.hashtagProtocol.ownerOf(tokenId)).to.be.equal(
        platformAddress
      );

      // check token one is minted
      const hashtagData = await this.hashtagProtocol.tokenIdToHashtag(tokenId);
      expect(hashtagData.displayVersion.toLowerCase()).to.be.equal(
        "#blockrocket"
      );

      await this.hashtagProtocol.connect(platform).renewHashtag(tokenId);
      this.lastTransferTime = await this.hashtagProtocol.tokenIdToLastTransferTime(
        tokenId
      );

      expect(Number(BigNumber.from(this.lastTransferTime))).to.be.greaterThan(
        0
      );
    });

    it("will fail if token does not exist", async function () {
      await expect(
        this.hashtagProtocol.connect(random).recycleHashtag(constants.Two)
      ).to.be.revertedWith("recycleHashtag: Invalid token ID");
    });

    it("will fail if already owned by the platform", async function () {
      await expect(
        this.hashtagProtocol.connect(platform).recycleHashtag(tokenId)
      ).to.be.revertedWith("recycleHashtag: Already owned by the platform");
    });

    it("will fail if token not not eligible yet", async function () {
      // Move it to random
      await this.hashtagProtocol
        .connect(platform)
        .transferFrom(platformAddress, randomAddress, tokenId);

      // move on a bit
      const target = this.lastTransferTime.add(
        BigNumber.from(time.duration.years(1).toString())
      );
      await time.increaseTo(target.toString());

      await expect(
        this.hashtagProtocol.connect(random).recycleHashtag(tokenId)
      ).to.be.revertedWith(
        "recycleHashtag: Token not eligible for recycling yet"
      );
    });

    it("will succeed once renewal period has passed", async function () {
      // Move it to random
      await this.hashtagProtocol
        .connect(platform)
        .transferFrom(platformAddress, randomAddress, tokenId);

      // increase by 2 years and 31 days
      const target = this.lastTransferTime
        .add(await this.hashtagProtocol.ownershipTermLength())
        .add(BigNumber.from(time.duration.days(31).toString()));
      await time.increaseTo(target.toString());

      await expect(this.hashtagProtocol.connect(random).recycleHashtag(tokenId))
        .to.emit(this.hashtagProtocol, "HashtagReset")
        .withArgs(tokenId, randomAddress);

      // check timestamp has increased
      const lastTransferTime = await this.hashtagProtocol.tokenIdToLastTransferTime(
        tokenId
      );
      expect(Number(BigNumber.from(lastTransferTime))).to.be.greaterThan(
        Number(this.lastTransferTime.toString())
      );

      // platform now once again owns the token
      expect(await this.hashtagProtocol.ownerOf(tokenId)).to.be.equal(
        platformAddress
      );
    });

    it("when being reset by the platform, the platforms balance does not increase and the owners balance decreases", async function () {
      // zero before
      expect(
        (await this.hashtagProtocol.balanceOf(platformAddress)).toString()
      ).to.be.equal("0");

      // Move it to random
      await this.hashtagProtocol
        .connect(platform)
        .transferFrom(platformAddress, randomAddress, tokenId);

      // balances changed - platform stays at zero
      expect(
        (await this.hashtagProtocol.balanceOf(platformAddress)).toString()
      ).to.be.equal("0");
      expect(
        (await this.hashtagProtocol.balanceOf(randomAddress)).toString()
      ).to.be.equal("1");

      // increase by 2 years and 31 days
      const target = this.lastTransferTime
        .add(await this.hashtagProtocol.ownershipTermLength())
        .add(BigNumber.from(time.duration.days(31).toString()));
      await time.increaseTo(target.toString());

      await expect(this.hashtagProtocol.connect(random).recycleHashtag(tokenId))
        .to.emit(this.hashtagProtocol, "HashtagReset")
        .withArgs(tokenId, randomAddress);

      // check timestamp has increased
      const lastTransferTime = await this.hashtagProtocol.tokenIdToLastTransferTime(
        tokenId
      );
      expect(Number(BigNumber.from(lastTransferTime))).to.be.greaterThan(
        Number(this.lastTransferTime.toString())
      );

      // both balances back to zero
      expect(
        (await this.hashtagProtocol.balanceOf(platformAddress)).toString()
      ).to.be.equal("0");
      expect(
        (await this.hashtagProtocol.balanceOf(randomAddress)).toString()
      ).to.be.equal("0");
    });
  });
});
