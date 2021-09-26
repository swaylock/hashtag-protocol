const HashtagAccessControls = artifacts.require("HashtagAccessControls");
const HashtagProtocol = artifacts.require("HashtagProtocol");
const ERC721ReceiverMock = artifacts.require("ERC721ReceiverMock");

module.exports = async function(deployer) {
  
  const accessControls = await HashtagAccessControls.new();
  HashtagAccessControls.setAsDeployed(accessControls);

  const hashtagProtocol = await HashtagProtocol.new();
  hashtagProtocol.setAsDeployed(hashtagProtocol);

}