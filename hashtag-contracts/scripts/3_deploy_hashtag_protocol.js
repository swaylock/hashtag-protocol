const prompt = require('prompt-sync')();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying nft with the account:",
    await deployer.getAddress()
  );

  const accessControlsAddress = prompt('Access Controls Address? ');
  const platform = '0xE9FBC1a1925F6f117211C59b89A55b576182e1e9';

  console.log('\nAccess Controls Address: ', accessControlsAddress)
  console.log('Platform Address: ', platform)
  console.log('\n')

  prompt('If happy, hit enter to continue...')

  const HashtagProtocol = await ethers.getContractFactory("HashtagProtocol");

  const nft = await HashtagProtocol.deploy(
    accessControlsAddress,
    platform
  );

  await nft.deployed();

  console.log(`NFT deployed at: `, nft.address);

  console.log('Finished!');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
