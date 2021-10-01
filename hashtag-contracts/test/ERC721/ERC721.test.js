const {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Metadata,
} = require('./ERC721.behavior');

const HashtagAccessControls = artifacts.require("HashtagAccessControls");
const HashtagProtocol = artifacts.require("HashtagProtocol");
const ERC721ReceiverMock = artifacts.require("ERC721ReceiverMock");

contract('ERC721', function (accounts) {

  const [
    accountHashtagAdmin,
    accountHashtagPublisher,
    accountHashtagPlatform
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

  });

  const name = "Hashtag Protocol";
  const symbol = "HASHTAG";

  console.log(accounts);
  shouldBehaveLikeERC721('ERC721', ...accounts);
  //shouldBehaveLikeERC721Metadata('ERC721', name, symbol, ...accounts);
});