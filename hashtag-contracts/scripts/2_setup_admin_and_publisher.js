const prompt = require('prompt-sync')();
const web3 = require('web3');
const AccessControlsABI = require('../artifacts/@openzeppelin/contracts/access/AccessControl.sol/AccessControl.json').abi

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    "Setting up access controls with the account:",
    await deployer.getAddress()
  );

  const accessControlsAddress = prompt('Access Controls Address? ')

  console.log('\nAccess Controls Address: ', accessControlsAddress)
  console.log('\n')

  prompt('If happy, hit enter to continue...')

  const accessControls = new ethers.Contract(
    accessControlsAddress,
    AccessControlsABI,
    deployer //provider
  );

  const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000'
  await accessControls.grantRole(DEFAULT_ADMIN_ROLE, '0x82D08d80ccAC6263018Df22e8E3B6B3c7e925491');
  await accessControls.grantRole(web3.utils.sha3('PUBLISHER'), '0xF6423a8769292BBeef9335C5A26254C759E3BFBe');

  console.log('Finished!');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
