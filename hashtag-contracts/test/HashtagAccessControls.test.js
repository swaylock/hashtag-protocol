/* eslint-env mocha */
const web3 = require("web3");
const { expect } = require("chai");

describe("HashtagAccessControl Tests", function () {
  let platform, platformAddress, publisher, publisherAddress;

  beforeEach(async function () {
    const accounts = await ethers.getSigners();

    platform = accounts[0];
    platformAddress = await accounts[0].getAddress();
    publisher = accounts[1];
    publisherAddress = await accounts[1].getAddress();

    const HashtagAccessControls = await ethers.getContractFactory(
      "HashtagAccessControls"
    );

    this.accessControls = await HashtagAccessControls.deploy();
  });

  describe("Validate setup", async function () {
    it("should admin as contract creator", async function () {
      expect(await this.accessControls.isAdmin(platformAddress)).to.be.equal(
        true
      );
    });
  });

  describe("Publisher", async function () {
    it("should admin as contract creator", async function () {
      await this.accessControls.grantRole(
        web3.utils.sha3("PUBLISHER"),
        publisherAddress
      );
      expect(
        await this.accessControls.isPublisher(publisherAddress)
      ).to.be.equal(true);
    });
  });
});
