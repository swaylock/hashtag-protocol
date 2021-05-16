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
  await accessControls.grantRole(DEFAULT_ADMIN_ROLE, '0x60F2760f0D99330A555c5fc350099b634971C6Eb');
  await accessControls.grantRole(web3.utils.sha3('PUBLISHER'), '0xcF38E38DA8C9921f39DC8E9327Bc03bA514D4C37');

  console.log('Finished!');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
