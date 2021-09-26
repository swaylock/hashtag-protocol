const {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Metadata,
} = require('./ERC721.behavior');

contract('ERC721', function (accounts) {

  const [
    accountHashtagAdmin,
    accountHashtagPublisher
  ] = accounts;

  //beforeEach(async function () {
//
  //  this.accessControls = await HashtagAccessControls.new({ from: accountHashtagAdmin });
  //  await this.accessControls.grantRole(
  //    await this.accessControls.SMART_CONTRACT_ROLE(),
  //    accountHashtagAdmin,
  //    { from: accountHashtagAdmin }
  //  );
//
  //  // add a publisher to the protocol
  //  await this.accessControls.grantRole(
  //    web3.utils.sha3("PUBLISHER"),
  //    accountHashtagPublisher
  //  );
//
  //  this.token = await HashtagProtocol.new(this.accessControls.address, accountHashtagAdmin);
//
  //});

  const name = "Hashtag Protocol";
  const symbol = "HASHTAG";

  //shouldBehaveLikeERC721('ERC721', ...accounts);
  shouldBehaveLikeERC721Metadata('ERC721', name, symbol, ...accounts);
});